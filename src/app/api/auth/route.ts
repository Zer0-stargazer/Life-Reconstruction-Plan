import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "crypto";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { signSession, sessionFromRequestVerified } from "@/lib/session";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { issueCode, verifyCode, normalizeEmail, isValidEmail, normalizePhone, isValidPhone } from "@/lib/verification";
import { verifyTurnstile } from "@/lib/turnstile";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;
const isUniqueViolation = (error: { code?: string } | null) => error?.code === "23505";

/** 掩码展示联系方式：ab***@qq.com / 138****5678（P0-1 配套） */
function maskContact(target: string, isEmail: boolean): string {
  if (isEmail) {
    const at = target.indexOf("@");
    const head = target.slice(0, at).slice(0, 2);
    return `${head}***${target.slice(at)}`;
  }
  return `${target.slice(0, 3)}****${target.slice(-4)}`;
}

// POST /api/auth - register or login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, nickname, password, email, phone, contact } = body;

    // 这些 action 字段结构不同，不走「昵称+密码」入口校验（各自内部校验）。
    // 验证码四件套当前封存休眠（无域名无法真发信），等接入 Resend 后解封 UI 入口即可。
    const LOOSE_ACTIONS = ["send_email_code", "login_email", "reset_password_email", "bind_email", "reset_password_info", "update_contact", "update_avatar"];
    if (!LOOSE_ACTIONS.includes(action)) {
      if (typeof nickname !== "string" || typeof password !== "string" || !nickname || !password) {
        return NextResponse.json({ error: "请输入昵称和密码" }, { status: 400 });
      }

      if (nickname.length > 50) {
        return NextResponse.json({ error: "昵称不能超过50个字符" }, { status: 400 });
      }

      if (password.length < 8) {
        return NextResponse.json({ error: "密码至少8位" }, { status: 400 });
      }
    }

    // 注册联系方式的「存在性 + 格式」校验是纯本地逻辑（不查库），放在限流之前：
    // 输入格式错误不该消耗限流额度，否则一次手滑就要等满整个窗口。
    let normEmail: string | null = null;
    let normPhone: string | null = null;
    if (action === "register") {
      const rawEmail = typeof email === "string" ? email.trim() : "";
      const rawPhone = typeof phone === "string" ? phone.replace(/[\s-]/g, "") : "";
      const hasEmail = rawEmail.length > 0;
      const hasPhone = rawPhone.length > 0;
      if (!hasEmail && !hasPhone) {
        return NextResponse.json({ error: "请至少填写邮箱或手机号其一，用于日后找回密码" }, { status: 400 });
      }
      if (hasEmail) {
        if (!isValidEmail(rawEmail)) {
          return NextResponse.json({ error: "邮箱格式不正确，请检查后重试" }, { status: 400 });
        }
        normEmail = normalizeEmail(rawEmail);
      }
      if (hasPhone) {
        if (!isValidPhone(rawPhone)) {
          return NextResponse.json({ error: "手机号格式不正确，请检查后重试" }, { status: 400 });
        }
        normPhone = normalizePhone(rawPhone);
      }
    }

    // 防爆破：不限流就能被在线暴力破解。
    // 按 IP 限流，登录和注册共用同一个桶；只有通过格式校验的真实尝试才计数。
    // 本地开发没有 cf-connecting-ip，所有请求共用 'local' 桶，10 次很快打满——
    // 仅在非生产环境放宽；生产环境（真实 IP）保持 10 次 / 5 分钟。
    const ip = getClientIp(request);
    const authLimit = ip === "local" && process.env.NODE_ENV !== "production" ? 200 : 10;
    const rl = await rateLimit(`auth:${ip}`, authLimit, 5 * 60_000);
    if (!rl.ok) {
      const waitText = rl.retryAfter >= 60 ? `约 ${Math.ceil(rl.retryAfter / 60)} 分钟` : `${rl.retryAfter} 秒`;
      return NextResponse.json(
        { error: `尝试过于频繁，请等待${waitText}后再试` },
        { status: 429 }
      );
    }

    // 按「登录标识」限流（防分布式撞库：攻击者换 IP 也打不过同一账号的计数）。
    // 无论账号是否存在都计数，响应与 IP 限流一致，不泄露账号是否存在。
    if (action === "login") {
      const identKey = String(nickname).trim().toLowerCase().slice(0, 100);
      const rlIdent = await rateLimit(`auth-ident:${identKey}`, 10, 15 * 60_000);
      if (!rlIdent.ok) {
        const waitText = rlIdent.retryAfter >= 60 ? `约 ${Math.ceil(rlIdent.retryAfter / 60)} 分钟` : `${rlIdent.retryAfter} 秒`;
        return NextResponse.json(
          { error: `尝试过于频繁，请等待${waitText}后再试` },
          { status: 429 }
        );
      }
    }

    const client = getSupabaseClient();

    if (action === "register") {
      if (process.env.NEXT_PUBLIC_REGISTRATION_OPEN === "false") {
        return NextResponse.json({ error: "当前暂停新用户注册，已有账号可直接登录" }, { status: 403 });
      }

      // 人机验证（Turnstile）：格式校验之后、任何计数/建号之前。
      const ts = await verifyTurnstile(body.turnstileToken, ip);
      if (!ts.ok) {
        if (ts.reason === "misconfigured") {
          return NextResponse.json({ error: "服务器内部错误，请稍后重试" }, { status: 500 });
        }
        if (ts.reason === "timeout" || ts.reason === "network_error") {
          return NextResponse.json({ error: "人机验证服务暂不可用，请稍后重试" }, { status: 503 });
        }
        return NextResponse.json({ error: "人机验证未通过，请重试" }, { status: 400 });
      }

      // 联系方式的存在性 + 格式已在限流前校验，这里只查占用。
      // 均不做真实验证——验证码链路封存中，等接入 Resend 后启用。
      if (normEmail) {
        const { data: emailTaken } = await client.from("app_users").select("id").eq("email", normEmail).maybeSingle();
        if (emailTaken) {
          return NextResponse.json({ error: "该邮箱已被其他账号使用" }, { status: 409 });
        }
      }
      if (normPhone) {
        const { data: phoneTaken } = await client.from("app_users").select("id").eq("phone", normPhone).maybeSingle();
        if (phoneTaken) {
          return NextResponse.json({ error: "该手机号已被其他账号使用" }, { status: 409 });
        }
      }

      // Check if nickname taken
      const { data: existing, error: checkError } = await client
        .from("app_users")
        .select("id")
        .eq("nickname", nickname)
        .maybeSingle();

      if (checkError) throw new Error(`查询失败: ${checkError.message}`);
      if (existing) {
        return NextResponse.json({ error: "该昵称已被注册" }, { status: 409 });
      }

      // 同一 IP 每 24 小时最多注册 3 个账号。放在重名/占用检查之后、建号之前，
      // 无效输入与重名不消耗名额；本地/非 CF（ip = local）跳过。
      if (ip !== "local") {
        const rlReg = await rateLimit(`register-ip:${ip}`, 3, 24 * 3600_000);
        if (!rlReg.ok) {
          return NextResponse.json({ error: "该网络今日注册数量已达上限，请明天再试" }, { status: 429 });
        }
      }

      // Hash password with bcrypt
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const { data, error } = await client
        .from("app_users")
        .insert({
          nickname,
          password_hash: passwordHash,
          avatar: "👤",
          role: "normal",
          email: normEmail,
          phone: normPhone,
          email_verified: false,
          phone_verified: false,
        })
            .select("id, nickname, avatar, role, created_at, email, phone")
            .single();

      if (error) throw new Error(`注册失败: ${error.message}`);

      // 注册赠送：50 次 AI 分析额度 + premium 使用权
      // 用户注册即自动获得，无需手动兑换邀请码
      const REGISTER_BONUS_CREDITS = 50;
      const { error: bonusError } = await client
        .from("app_users")
        .update({
          role: "premium",
          ai_credits: REGISTER_BONUS_CREDITS,
          ai_credits_total: REGISTER_BONUS_CREDITS,
        })
        .eq("id", data.id);
      if (bonusError) {
        console.error("注册赠送额度写入失败:", bonusError.message);
        // 不阻断注册——用户已创建，额度可后续补发
      } else {
        await client.from("ai_credit_logs").insert({
          user_id: data.id,
          delta: REGISTER_BONUS_CREDITS,
          reason: "register_bonus",
          balance: REGISTER_BONUS_CREDITS,
        });
        data.role = "premium";
      }

      // Log access
      await client.from("access_logs").insert({
        user_id: data.id,
        action: "register",
        detail: `用户 ${nickname} 注册${bonusError ? "" : "（赠送 50 次 AI 额度）"}`,
      });

      // 签发服务端会话令牌（敏感接口用它识别身份，不再信任请求体自报的 userId）
      const token = signSession({
        userId: data.id,
        nickname: data.nickname,
        role: data.role,
        ver: 0, // 新注册用户 token_version 从 0 起
      });

      return NextResponse.json({ success: true, user: data, token, grantedCredits: bonusError ? 0 : REGISTER_BONUS_CREDITS });

    } else if (action === "login") {
      // 昵称或邮箱均可登录：先按昵称查，查不到且输入像邮箱再按邮箱查
      const ident = String(nickname).trim();
      const sel = "id, nickname, avatar, role, password_hash, is_active, created_at, email, phone, token_version, locked_until, login_failed_count";
      const { data: userData, error } = await client
        .from("app_users")
        .select(sel)
        .eq("nickname", ident)
        .maybeSingle();
      if (error) throw new Error(`查询失败: ${error.message}`);
      let user = userData;
      if (!user && ident.includes("@")) {
        const { data: byEmail, error: emailErr } = await client
          .from("app_users")
          .select(sel)
          .eq("email", normalizeEmail(ident))
          .maybeSingle();
        if (emailErr) throw new Error(`查询失败: ${emailErr.message}`);
        user = byEmail;
      }
      // 昵称不存在 / 密码错误 / 账号禁用统一返回同一提示，避免枚举账号
      const LOGIN_FAILED = "昵称或密码错误";
      if (!user) {
        return NextResponse.json({ error: LOGIN_FAILED }, { status: 401 });
      }

      // P1-3 修复：连续失败锁定——达到 10 次锁 30 分钟，防在线爆破
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        return NextResponse.json(
          { error: "失败次数过多，账号已临时锁定，请约 30 分钟后再试" },
          { status: 423 }
        );
      }

      // Verify password with bcrypt
      const passwordValid = await bcrypt.compare(password, user.password_hash);
      if (!passwordValid || !user.is_active) {
        // 失败计数 +1，达到阈值即锁定（成功登录或改密时清零）
        const failed = (user.login_failed_count ?? 0) + 1;
        const shouldLock = failed >= 10;
        await client
          .from("app_users")
          .update({
            login_failed_count: failed,
            locked_until: shouldLock
              ? new Date(Date.now() + 30 * 60_000).toISOString()
              : (user.locked_until ?? null),
          })
          .eq("id", user.id);
        return NextResponse.json({ error: LOGIN_FAILED }, { status: 401 });
      }

      // 登录成功：清零失败计数与锁定
      if ((user.login_failed_count ?? 0) > 0 || user.locked_until) {
        await client
          .from("app_users")
          .update({ login_failed_count: 0, locked_until: null })
          .eq("id", user.id);
      }

      // P2-8 修复：透明重哈希——历史 10 轮哈希在成功登录时静默升级到 12 轮
      if (bcrypt.getRounds(user.password_hash) < SALT_ROUNDS) {
        await client
          .from("app_users")
          .update({ password_hash: await bcrypt.hash(password, SALT_ROUNDS) })
          .eq("id", user.id);
      }

      // Update last login
      await client
        .from("app_users")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", user.id);

      // Log access
      await client.from("access_logs").insert({
        user_id: user.id,
        action: "login",
        detail: `用户 ${user.nickname} 登录`,
      });

      // 解构丢弃敏感字段后再返回前端（password_hash / is_active 是有意不使用的）
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, is_active, locked_until, login_failed_count, token_version, ...safeUser } = user;

      // 签发服务端会话令牌（敏感接口用它识别身份，不再信任请求体自报的 userId）
      const token = signSession({
        userId: safeUser.id,
        nickname: safeUser.nickname,
        role: safeUser.role,
        ver: token_version ?? 0, // P1-4：会话版本号，改密后旧令牌失效
      });

      return NextResponse.json({ success: true, user: safeUser, token });

    // ================= 邮箱验证码（账号体系 v2） =================

    } else if (action === "send_email_code") {
      const { email, purpose } = body;
      if (!isValidEmail(String(email ?? ""))) {
        return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
      }
      const purposes = ["register", "login", "reset", "bind"];
      if (!purposes.includes(String(purpose))) {
        return NextResponse.json({ error: "无效用途" }, { status: 400 });
      }
      const target = normalizeEmail(String(email));

      // 绑定邮箱需要登录态；其余用途按"邮箱是否已注册"提前拦截，
      // 注册发码时就能告诉用户"已注册过"，别等输完码才发现。
      let binderUserId: number | null = null;
      if (purpose === "bind") {
        const session = await sessionFromRequestVerified(request);
        if (!session) {
          return NextResponse.json({ error: "请先登录后再绑定邮箱" }, { status: 401 });
        }
        binderUserId = session.userId;
      }
      const { data: emailUser } = await client
        .from("app_users")
        .select("id")
        .eq("email", target)
        .maybeSingle();
      if (purpose === "register" && emailUser) {
        return NextResponse.json({ error: "该邮箱已注册，请直接使用验证码登录" }, { status: 409 });
      }
      if (purpose === "login" && !emailUser) {
        return NextResponse.json({ error: "该邮箱未注册，请先注册" }, { status: 404 });
      }
      if (purpose === "reset" && !emailUser) {
        // 找回密码不透露"邮箱是否存在"，统一话术
        return NextResponse.json({ error: "若该邮箱已注册，验证码将发送至邮箱（请注意查收）" }, { status: 200 });
      }
      if (purpose === "bind" && emailUser && emailUser.id !== binderUserId) {
        return NextResponse.json({ error: "该邮箱已被其他账号绑定" }, { status: 409 });
      }

      const sent = await issueCode({ channel: "email", target, purpose: purpose as "register" | "login" | "reset" | "bind", ip: getClientIp(request), userId: binderUserId });
      if (!sent.ok) {
        return NextResponse.json({ error: sent.error ?? "验证码发送失败" }, { status: 429 });
      }
      // console 模式下回传调试验证码，方便本地自测；真实邮件通道下不回传
      return NextResponse.json({ success: true, debugCode: sent.debugCode });

    } else if (action === "login_email") {
      const { email, code, purpose } = body;
      if (!isValidEmail(String(email ?? ""))) {
        return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
      }
      if (purpose !== "login" && purpose !== "register") {
        return NextResponse.json({ error: "无效用途" }, { status: 400 });
      }
      const target = normalizeEmail(String(email));
      const verified = await verifyCode({ channel: "email", target, purpose, code: String(code ?? "") });
      if (!verified.ok) {
        return NextResponse.json({ error: verified.error ?? "验证码错误" }, { status: 401 });
      }

      const { data: existing } = await client
        .from("app_users")
        .select("id, nickname, avatar, role, is_active, created_at, email, phone, token_version")
        .eq("email", target)
        .maybeSingle();

      if (purpose === "register") {
        if (existing) {
          return NextResponse.json({ error: "该邮箱已注册，请直接登录" }, { status: 409 });
        }
        // 自动生成唯一昵称（用户之后可在资料里改，30 天限改一次的规则照常适用）
        let created: Record<string, unknown> | null = null;
        let lastError: { message: string } | null = null;
        for (let attempt = 0; attempt < 3 && !created; attempt++) {
          const nickname = `行者${String(randomInt(100000, 1000000))}`;
          const res = await client
            .from("app_users")
            .insert({
              nickname,
              // 纯邮箱注册没有密码：塞一个不可用的随机哈希，防止空串撞 bcrypt
              password_hash: await bcrypt.hash(randomInt(1e12, 1e13).toString(36) + randomInt(1e12, 1e13).toString(36), SALT_ROUNDS),
              avatar: "👤",
              role: "normal",
              email: target,
              email_verified: true,
            })
            .select("id, nickname, avatar, role, created_at, email, phone")
            .maybeSingle();
          if (res.error) {
            if (isUniqueViolation(res.error)) { lastError = res.error; continue; } // 昵称撞了，换一个重试
            throw new Error(`注册失败: ${res.error.message}`);
          }
          created = res.data;
        }
        if (!created) throw new Error(`注册失败: ${lastError?.message ?? "昵称生成冲突"}`);

        await client.from("access_logs").insert({
          user_id: (created as { id: number }).id,
          action: "register",
          detail: `邮箱验证码注册（${target}）`,
        });
        const token = signSession({
          userId: (created as { id: number }).id,
          nickname: String((created as { nickname: string }).nickname),
          role: "normal",
          ver: 0,
        });
        return NextResponse.json({ success: true, user: created, token });
      }

      if (!existing) {
        return NextResponse.json({ error: "该邮箱未注册" }, { status: 401 });
      }
      if (!existing.is_active) {
        return NextResponse.json({ error: "该账号已被禁用" }, { status: 403 });
      }

      await client
        .from("app_users")
        .update({ last_login_at: new Date().toISOString(), last_login_ip: getClientIp(request) })
        .eq("id", existing.id);
      await client.from("access_logs").insert({
        user_id: existing.id,
        action: "login",
        detail: `邮箱验证码登录（${target}）`,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { is_active, token_version, ...safeUser } = existing;
      const token = signSession({
        userId: safeUser.id,
        nickname: safeUser.nickname,
        role: safeUser.role,
        ver: token_version ?? 0,
      });
      return NextResponse.json({ success: true, user: safeUser, token });

    } else if (action === "reset_password_email") {
      const { email, code, newPassword, nickname } = body;
      if (typeof newPassword !== "string" || newPassword.length < 8 || newPassword.length > 100) {
        return NextResponse.json({ error: "新密码至少 8 位" }, { status: 400 });
      }
      // 忘记密码流程用昵称定位注册邮箱（明文邮箱不经过前端）；
      // 直接提供 email 的路径保留给后续独立入口
      let target: string | null = null;
      if (typeof email === "string" && email.trim()) {
        if (!isValidEmail(email)) {
          return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
        }
        target = normalizeEmail(email);
      } else if (typeof nickname === "string" && nickname.trim()) {
        const { data: u, error: uErr } = await client
          .from("app_users")
          .select("email, is_active")
          .eq("nickname", nickname.trim())
          .maybeSingle();
        if (uErr) throw new Error(`查询失败: ${uErr.message}`);
        if (!u?.email || !u.is_active) {
          return NextResponse.json({ error: "该账号无法通过邮箱重置密码" }, { status: 404 });
        }
        target = u.email as string;
      } else {
        return NextResponse.json({ error: "缺少邮箱或昵称" }, { status: 400 });
      }
      const verified = await verifyCode({ channel: "email", target, purpose: "reset", code: String(code ?? "") });
      if (!verified.ok) {
        return NextResponse.json({ error: verified.error ?? "验证码错误" }, { status: 401 });
      }

      const { data: user, error: userErr } = await client
        .from("app_users")
        .select("id, nickname, token_version")
        .eq("email", target)
        .maybeSingle();
      if (userErr) throw new Error(`查询失败: ${userErr.message}`);
      if (!user) {
        return NextResponse.json({ error: "该邮箱未注册" }, { status: 404 });
      }

      const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await client
        .from("app_users")
        .update({
          password_hash: passwordHash,
          token_version: ((user.token_version as number | null) ?? 0) + 1, // 踢掉所有旧会话（会话校验接入版本号后生效）
          login_failed_count: 0,
          locked_until: null,
        })
        .eq("id", user.id);
      await client.from("access_logs").insert({
        user_id: user.id,
        action: "reset_password",
        detail: `通过邮箱验证码重置密码（${target}）`,
      });
      return NextResponse.json({ success: true });

    } else if (action === "bind_email") {
      const session = await sessionFromRequestVerified(request);
      if (!session) {
        return NextResponse.json({ error: "请先登录" }, { status: 401 });
      }
      const { email, code } = body;
      if (!isValidEmail(String(email ?? ""))) {
        return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
      }
      const target = normalizeEmail(String(email));
      const { data: occupied } = await client
        .from("app_users")
        .select("id")
        .eq("email", target)
        .neq("id", session.userId)
        .maybeSingle();
      if (occupied) {
        return NextResponse.json({ error: "该邮箱已被其他账号绑定" }, { status: 409 });
      }

      const verified = await verifyCode({ channel: "email", target, purpose: "bind", code: String(code ?? "") });
      if (!verified.ok) {
        return NextResponse.json({ error: verified.error ?? "验证码错误" }, { status: 401 });
      }

      await client
        .from("app_users")
        .update({ email: target, email_verified: true })
        .eq("id", session.userId);
      await client.from("access_logs").insert({
        user_id: session.userId,
        action: "bind_email",
        detail: `绑定邮箱（${target}）`,
      });
      return NextResponse.json({ success: true, email: target });

    } else if (action === "reset_password_info") {
      // P0-1 修复：原实现「昵称 + 注册时填写的邮箱/手机任一匹配即可直接改密」，
      // 等于允许任何知道昵称和邮箱的人接管账号（联系方式常在群聊/简历中公开）。
      // 现改为：仅校验匹配并返回掩码提示，真正改密必须走邮箱验证码链路
      // （reset_password_email），无验证码通道的过渡期到此结束。
      const rlReset = await rateLimit(`reset-info:${ip}`, 5, 3600_000);
      if (!rlReset.ok) {
        return NextResponse.json({ error: `尝试过于频繁，请 ${rlReset.retryAfter} 秒后再试` }, { status: 429 });
      }
      const ident = String(nickname ?? "").trim();
      const contactStr = String(contact ?? "").trim();
      if (!ident || !contactStr) {
        return NextResponse.json({ error: "请输入昵称和注册时填写的邮箱或手机号" }, { status: 400 });
      }

      const { data: user, error: userErr } = await client
        .from("app_users")
        .select("id, nickname, email, phone, is_active")
        .eq("nickname", ident)
        .maybeSingle();
      if (userErr) throw new Error(`查询失败: ${userErr.message}`);

      // 昵称不存在 / 联系方式不匹配 / 账号禁用 统一同一句话，防止枚举
      const RESET_FAILED = "账号信息不匹配，无法重置密码";
      if (!user || !user.is_active) {
        return NextResponse.json({ error: RESET_FAILED }, { status: 401 });
      }
      const emailMatch = !!user.email && isValidEmail(contactStr) && normalizeEmail(contactStr) === user.email;
      const phoneMatch = !!user.phone && isValidPhone(contactStr) && normalizePhone(contactStr) === user.phone;
      if (!emailMatch && !phoneMatch) {
        await client.from("access_logs").insert({
          user_id: user.id,
          action: "reset_password_failed",
          detail: `信息匹配校验失败（${ident}）`,
        });
        return NextResponse.json({ error: RESET_FAILED }, { status: 401 });
      }

      // 匹配成功：
      // - 邮箱账号：服务端直接向注册邮箱发验证码（明文邮箱不出服务端），前端引导输码
      // - 仅手机号账号：SMS 链路未接入，引导联系管理员
      const masked = maskContact(
        emailMatch ? (user.email as string) : (user.phone as string),
        emailMatch
      );
      if (!emailMatch) {
        await client.from("access_logs").insert({
          user_id: user.id,
          action: "reset_password_matched",
          detail: `信息匹配校验通过（仅手机号，引导联系管理员）（${ident}）`,
        });
        return NextResponse.json({
          success: true,
          step: "contact_admin",
          masked,
          contactType: "phone",
        });
      }
      const sent = await issueCode({ channel: "email", target: user.email as string, purpose: "reset", ip });
      if (!sent.ok) {
        return NextResponse.json({ error: sent.error ?? "验证码发送失败" }, { status: 429 });
      }
      await client.from("access_logs").insert({
        user_id: user.id,
        action: "reset_password_matched",
        detail: `信息匹配校验通过，已向注册邮箱发送重置验证码（${ident}）`,
      });
      return NextResponse.json({
        success: true,
        step: "code_sent",
        masked,
        contactType: "email",
      });

    } else if (action === "update_contact") {
      // 登录态下修改自己的邮箱/手机：需验证当前密码，防止会话被盗后联系方式被偷改
      const session = await sessionFromRequestVerified(request);
      if (!session) {
        return NextResponse.json({ error: "请先登录" }, { status: 401 });
      }
      const { currentPassword, email: newEmail, phone: newPhone } = body;
      const { data: me, error: meErr } = await client
        .from("app_users")
        .select("id, password_hash, email, phone")
        .eq("id", session.userId)
        .maybeSingle();
      if (meErr) throw new Error(`查询失败: ${meErr.message}`);
      if (!me) {
        return NextResponse.json({ error: "账号不存在" }, { status: 404 });
      }
      if (typeof currentPassword !== "string" || !(await bcrypt.compare(currentPassword, me.password_hash))) {
        return NextResponse.json({ error: "当前密码不正确" }, { status: 401 });
      }

      const updates: Record<string, unknown> = {};
      const rawEmail = typeof newEmail === "string" ? newEmail.trim() : "";
      const rawPhone = typeof newPhone === "string" ? newPhone.replace(/[\s-]/g, "") : "";
      if (rawEmail) {
        if (!isValidEmail(rawEmail)) {
          return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
        }
        const target = normalizeEmail(rawEmail);
        if (target !== me.email) {
          const { data: taken } = await client.from("app_users").select("id").eq("email", target).neq("id", me.id).maybeSingle();
          if (taken) {
            return NextResponse.json({ error: "该邮箱已被其他账号使用" }, { status: 409 });
          }
          updates.email = target;
          updates.email_verified = false; // 变更后需重新验证（验证码链路启用后生效）
        }
      }
      if (rawPhone) {
        if (!isValidPhone(rawPhone)) {
          return NextResponse.json({ error: "手机号格式不正确" }, { status: 400 });
        }
        const target = normalizePhone(rawPhone);
        if (target !== me.phone) {
          const { data: taken } = await client.from("app_users").select("id").eq("phone", target).neq("id", me.id).maybeSingle();
          if (taken) {
            return NextResponse.json({ error: "该手机号已被其他账号使用" }, { status: 409 });
          }
          updates.phone = target;
          updates.phone_verified = false;
        }
      }
      if (!rawEmail && !rawPhone) {
        return NextResponse.json({ error: "请填写要更新的邮箱或手机号" }, { status: 400 });
      }
      if (Object.keys(updates).length > 0) {
        await client.from("app_users").update(updates).eq("id", me.id);
        await client.from("access_logs").insert({
          user_id: me.id,
          action: "update_contact",
          detail: `更新联系方式（${updates.email ? "邮箱 " + String(updates.email) + " " : ""}${updates.phone ? "手机 " + String(updates.phone) : ""}）`,
        });
      }
      return NextResponse.json({
        success: true,
        email: (updates.email as string | undefined) ?? me.email ?? null,
        phone: (updates.phone as string | undefined) ?? me.phone ?? null,
      });

    } else if (action === "update_avatar") {
      // 登录态下更换头像（装饰性字段；仍走会话校验防伪造请求，长度兜底防滥用）
      const session = await sessionFromRequestVerified(request);
      if (!session) {
        return NextResponse.json({ error: "请先登录" }, { status: 401 });
      }
      const avatar = typeof body.avatar === "string" ? body.avatar.trim() : "";
      if (!avatar || avatar.length > 16) {
        return NextResponse.json({ error: "头像无效" }, { status: 400 });
      }
      await client.from("app_users").update({ avatar }).eq("id", session.userId);
      return NextResponse.json({ success: true, avatar });

    } else {
      return NextResponse.json({ error: "无效操作" }, { status: 400 });
    }

  } catch (err) {
    console.error("auth 异常:", err);
    return NextResponse.json({ error: "服务器内部错误，请稍后重试" }, { status: 500 });
  }
}