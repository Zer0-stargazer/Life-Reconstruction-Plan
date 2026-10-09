import { NextRequest } from "next/server";
import { streamChatAuto } from "@/lib/ai-stream";
import { resolveAiSource, type AiSourceConfig } from "@/lib/ai-providers";
import { getSetting } from "@/lib/app-settings";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { sessionFromRequest, type SessionPayload } from "@/lib/session";
import { getSupabaseClient } from "@/storage/database/supabase-client";

const SYSTEM_PROMPT = `你是"人生重构计划"的AI分析顾问，专注于人生决策、职业规划、命运概率分析。你的角色是帮助用户深入理解每个模块的内涵，给出具体、可操作的建议。

回答原则：
1. 内容要具体、精确，避免泛泛而谈
2. 提供数据和概率视角，不仅仅是鸡汤
3. 给出可操作的策略建议，不是空洞的鼓励
4. 语气冷静、克制、有洞察力，保持"战争学院"的调性
5. 适当使用编号和结构格式，便于阅读
6. 不要使用emoji，不要过分乐观，保持客观冷静`;

const MODULE_PROMPTS: Record<string, string> = {
  window: `用户正在查看"人生关键窗口"模块。每个窗口代表着人生的某个关键时期，有打开和关闭的时间。请针对用户选择的具体窗口，从以下维度分析：
1. **窗口本质**：这个窗口的核心机会/风险是什么
2. **时间判断**：是否在窗口期内，剩余时间多长
3. **行动清单**：3-5条必须立即执行的建议
4. **错过后果**：如果真的错过这个窗口，后果如何
5. **补救路径**：如果已经错过了，有什么替代方案`,

  luck: `用户正在查看"人生运气地图"模块。每个运气节点代表影响人生的各种随机因素。请针对用户选择的具体运气节点，从以下维度分析：
1. **概率解读**：这件事实际的发生概率和影响程度
2. **可控性分析**：用户在多大程度上可以影响这件事
3. **杠杆策略**：如何用最小的投入最大化/最小化这件事的影响
4. **预警信号**：哪些信号能提前识别这个节点在发生
5. **应对剧本**：最好和最坏的情况下的应对策略是什么`,

  luck_breakthrough: `用户正在查看运气节点中的"破局之道"子模块。这是关于如何打破当前运气节点的核心策略。请针对当前运气节点，给出具体的：
1. **破局关键**：打破这个节点困局的最核心突破口在哪里
2. **逆向思维**：如何把劣势转化为优势，把风险转化为机会
3. **行动杠杆**：哪些小行动可以撬动最大改变
4. **时间窗口**：破局的最佳时机和截止时间
5. **失败归因**：最容易犯的错误和如何避免`,

  luck_radar: `用户正在查看运气节点中的"运气雷达"子模块。这是关于如何预知当前运气节点的信号。请针对当前运气节点，给出具体的：
1. **预警信号**：当这个运气因素接近触发时，哪些细微迹象可以觉察到
2. **信号强度**：如何判断信号是真实信号还是噪音
3. **雷达扫描频率**：应该多久检查一次这些指标
4. **信息源**：应该关注哪些渠道和资源来获取信息
5. **误报处理**：如何区分真正的预警信号和误报`,

  luck_defense: `用户正在查看运气节点中的"防御策略"子模块。这是关于如何建立防御体系应对风险或把握机会。请针对当前运气节点，给出具体的：
1. **防御层级**：应该建立几层防御，每层防御的职责
2. **止损机制**：最坏情况如何触发止损
3. **风险对冲**：用什么方式对冲这个风险
4. **弹性设计**：防御体系如何适应不同场景
5. **预案激活**：防御层被突破时的应急方案`,

  luck_action: `用户正在查看运气节点中的"具体行动"子模块。这是关于针对当前运气节点，用户应该执行的具体行动方案。请给出：
1. **行动清单**：按优先级排列的3个关键行动
2. **时间预算**：每个行动需要的投入时间
3. **执行顺序**：先做什么后做什么，为什么
4. **成功标准**：如何判断行动是否有效
5. **变化监控**：行动过程中应该关注什么变化`,

  laws_breakthrough: `用户正在查看"社会规律"模块中的"破除之道"子视图。每条规律都有强度（1-5）、挽回概率（breakthrough%）、恢复难度和代价。请针对用户选择的这条规律，给出具体的：
1. **破局点诊断**：这条规律对用户的具体制约在哪，最薄弱的环节是什么
2. **逆转成本评估**：结合挽回概率和代价，值不值得破、什么条件下值得
3. **破除路径**：3-4条可操作的破除/绕开策略，按性价比排序
4. **替代方案**：如果破不了，如何借用规律本身得利或绕行
5. **失败预警**：破除过程中最常见的错误和识别信号`,

  laws_radar: `用户正在查看"社会规律"模块中的"征兆识别"子视图。请针对用户选择的这条规律，给出具体的：
1. **早期征兆**：这条规律正在你身上起效的3-5个可观察信号
2. **量化监测**：可以用什么具体指标/数据来追踪它的影响
3. **检查节奏**：多久复盘一次，在什么人生节点必须重新评估
4. **信息渠道**：从哪里获得关于这条规律的可靠信息和案例
5. **噪音甄别**：如何区分真实征兆和过度焦虑的误判`,

  laws_action: `用户正在查看"社会规律"模块中的"行动计划"子视图。请针对用户选择的这条规律，给出具体的：
1. **行动清单**：按优先级排列的3个关键行动，每条说明为什么重要
2. **时间预算**：每个行动需要投入的时间和起效周期
3. **执行顺序**：先做什么后做什么，依赖关系是什么
4. **成功标准**：如何判断行动有效，设什么里程碑
5. **调整机制**：什么信号出现时应该改变策略`,

  career: `用户正在查看"职业探索"模块。每个职业有薪资、前景、AI替代风险等维度。请针对用户选择的具体职业，从以下维度分析：
1. **职业前景**：5-10年的发展预期，关键趋势
2. **AI影响**：哪些工作内容会被AI替代，哪些反而增强
3. **成长路径**：最有效的进阶路径和所需技能
4. **天花板与地板**：职业的收入/发展上限和下限
5. **转型方向**：如果准备离开这个职业，可以转型到哪些方向`,

  destiny: `用户正在查看"命运"模块。命运维度包括天时、地利、人和、时间、努力等多个维度。请针对用户的命运报告，从以下维度分析：
1. **维度解读**：各维度得分的深层含义和影响
2. **短板识别**：最需要加强的维度和具体方向
3. **长板放大**：如何利用优势维度带动其他维度
4. **维度协同**：维度之间的相互作用和优化方向
5. **时间规划**：不同阶段应该优先关注哪个维度`,

  simulation: `用户正在查看"人生模拟器"模块。用户可以通过调整多个维度的参数，模拟不同的人生轨迹。请针对用户的模拟结果，从以下维度分析：
1. **轨迹解读**：当前参数组合的深层含义和方向
2. **敏感度分析**：哪个维度的变动对结果影响最大
3. **优化建议**：最优的参数组合建议和原因
4. **风险场景**：最不利的参数组合和应对
5. **执行路径**：当前到最优的逐步调整策略`,
};

/** 流式分析耗时较长，给 Serverless 平台留出足够执行时间 */
export const maxDuration = 60;

// ---- 入参上限（防御性截断）：用户自由文本直拼提示词，不限长度会被刷 token 成本 ----
const MAX_ITEM_LENGTH = 6000;
const MAX_QUESTION_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 12;
const MAX_HISTORY_MESSAGE_LENGTH = 4000;

/** 上游总耗时上限：必须早于 maxDuration，超时才能返回明确提示，而不是被平台硬切断 */
const AI_DEADLINE_MS = 50_000;
const AI_TIMEOUT_MESSAGE = "AI 响应超时（超过 50 秒），已退还本次额度，请稍后重试";

export async function POST(request: NextRequest) {
  // 已扣额度的用户 id；refundCredit 保证每次请求最多退一次
  let chargedUserId: number | null = null;
  const refundCredit = async (reason: string) => {
    if (chargedUserId === null) return;
    const userId = chargedUserId;
    chargedUserId = null;
    try {
      const { error } = await getSupabaseClient().rpc("refund_ai_credit", {
        p_user_id: userId,
        p_reason: reason,
      });
      if (error) console.error("额度退还失败:", error.message);
    } catch (err) {
      console.error("额度退还失败:", err);
    }
  };

  // 内置 AI 调用计量：仅在通过鉴权后登记，终态时写一次（重复调用为空操作）
  let usage: { userId: number; module: string } | null = null;
  const logUsage = async (success: boolean, errorKind: string | null) => {
    if (usage === null) return;
    const current = usage;
    usage = null;
    try {
      const { error } = await getSupabaseClient().from("ai_usage_logs").insert({
        user_id: current.userId,
        module: current.module,
        success,
        error_kind: errorKind,
      });
      if (error) console.error("ai_usage_logs 写入失败:", error.message);
    } catch (err) {
      console.error("ai_usage_logs 写入失败:", err);
    }
  };

  try {
    // 单 IP 限流：分析接口是流式长请求，防止被脚本刷爆额度
    const ip = getClientIp(request);
    const rl = await rateLimit(`ai-analyze:${ip}`, 15, 60_000);
    if (!rl.ok) {
      return new Response(
        JSON.stringify({ error: `请求过于频繁，请 ${rl.retryAfter} 秒后再试` }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rl.retryAfter),
          },
        }
      );
    }

    const body = await request.json();
    const { module, item, question, history, ai } = body as {
      module: string;
      item: string;
      question?: string;
      history?: { role: string; content: string }[];
      ai?: AiSourceConfig;
    };

    if (!module || !item) {
      return new Response(JSON.stringify({ error: "缺少必要参数" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 解析用户自带 AI 源：无效配置直接报错（不静默回退，避免"配了没用"的错觉）
    const aiSource = resolveAiSource(ai);
    if (aiSource.kind === "invalid") {
      return new Response(JSON.stringify({ error: aiSource.reason }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const modulePrompt = MODULE_PROMPTS[module];
    if (!modulePrompt) {
      // 未知 module 直接报错，不静默回退——避免提示词错配无声上线
      return new Response(JSON.stringify({ error: `未知的分析模块: ${module}` }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    /**
     * 额度门（2026-10-02 额度制）：
     * - 内置 AI（服务端 env Key）是付费资源 → 需要会话，按次扣额度（开发者不限）；
     * - 用户自带 Key（BYOK）永久免费 → 不要求登录、不扣额度。
     * 扣减走 Postgres 原子函数 consume_ai_credit，防并发透支；额度不足在
     * 进入流式之前返回明确错误（不是 500）。扣减后任何失败都会退还。
     * 角色与启用状态以数据库为准，不信任令牌里的 role。
     */
    const isCustomSource = aiSource.kind !== "env";
    let session: SessionPayload | null = null;

    if (!isCustomSource) {
      if (!(await getSetting("builtin_ai_enabled"))) {
        return new Response(
          JSON.stringify({ error: "内置 AI 已暂停服务，可在「我的」页填入自己的 Key 继续使用（不扣额度）" }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        );
      }

      session = sessionFromRequest(request);
      if (!session) {
        return new Response(
          JSON.stringify({ error: "使用内置 AI 需先登录并用授权码解锁（在「我的」页填入自己的 Key 可免登录使用）" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      const client = getSupabaseClient();
      const { data: userData, error: userError } = await client
        .from("app_users")
        .select("role, is_active")
        .eq("id", session.userId)
        .maybeSingle();
      if (userError) {
        console.error("用户查询失败:", userError.message);
        return new Response(JSON.stringify({ error: "额度查询失败，请稍后重试" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (!userData) {
        return new Response(JSON.stringify({ error: "登录态无效或已过期，请重新登录" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (!userData.is_active) {
        return new Response(JSON.stringify({ error: "该账号已被禁用" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      usage = { userId: session.userId, module };

      if (userData.role !== "developer") {
        const { data: balance, error: consumeError } = await client.rpc("consume_ai_credit", {
          p_user_id: session.userId,
        });
        if (consumeError) {
          console.error("额度扣减失败:", consumeError.message);
          return new Response(JSON.stringify({ error: "额度扣减失败，请稍后重试" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (typeof balance !== "number") {
          return new Response(
            JSON.stringify({ error: "AI 额度已用完，请找开发者续码（用授权码即可到账）；或在「我的」页改用自己的 Key（不扣额度）" }),
            { status: 402, headers: { "Content-Type": "application/json" } }
          );
        }
        chargedUserId = session.userId;

        // 流水（失败不影响分析主流程）
        const { error: logError } = await client.from("ai_credit_logs").insert({
          user_id: session.userId,
          delta: -1,
          reason: "analyze",
          balance,
        });
        if (logError) console.error("ai_credit_logs 写入失败:", logError.message);
      }
    }

    const messages: { role: string; content: string }[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add history if provided（只保留最近若干条，单条截断，role 白名单）
    if (history && history.length > 0) {
      for (const msg of history.slice(-MAX_HISTORY_MESSAGES)) {
        if (msg.role !== "user" && msg.role !== "assistant") continue;
        messages.push({ role: msg.role, content: String(msg.content ?? "").slice(0, MAX_HISTORY_MESSAGE_LENGTH) });
      }
    }

    // Build user message
    const safeQuestion = typeof question === "string" ? question.slice(0, MAX_QUESTION_LENGTH) : "";
    const safeItem = String(item ?? "").slice(0, MAX_ITEM_LENGTH);

    if (history && history.length > 0 && safeQuestion) {
      // Follow-up question
      messages.push({
        role: "user",
        content: safeQuestion,
      });
    } else {
      // Initial analysis request
      let userContent = `模块：${module}\n\n当前选项：${safeItem}`;
      if (safeQuestion) {
        userContent += `\n\n用户问题：${safeQuestion}`;
      }
      userContent += `\n\n请按照分析框架给出具体分析`;

      messages.push({
        role: "user",
        content: `${modulePrompt}\n\n${userContent}`,
      });
    }

    // Create SSE stream (uses user-provided AI source when available)
    const encoder = new TextEncoder();
    const upstream = new AbortController();
    const stream = streamChatAuto(messages, aiSource, { temperature: 0.7, signal: upstream.signal });

    let cancelled = false;
    const readable = new ReadableStream({
      async start(controller) {
        let gotContent = false;
        const deadline = setTimeout(() => upstream.abort(), AI_DEADLINE_MS);
        request.signal.addEventListener("abort", () => upstream.abort(), { once: true });
        try {
          for await (const chunk of stream) {
            if (chunk.error) {
              const timedOut = upstream.signal.aborted && !cancelled;
              await refundCredit("analyze_refund");
              await logUsage(false, timedOut ? "timeout" : "upstream");
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ error: timedOut ? AI_TIMEOUT_MESSAGE : chunk.error })}\n\n`)
              );
              controller.close();
              return;
            }
            if (chunk.content) {
              gotContent = true;
              const sseMessage = `data: ${JSON.stringify({ content: chunk.content })}\n\n`;
              controller.enqueue(encoder.encode(sseMessage));
            }
            // 推理模型的思维链透传给前端：让用户看见"正在思考"，
            // 否则首正文前的十几秒是纯黑等待（实测占整个请求 60% 时长）
            if (chunk.reasoning) {
              const sseMessage = `data: ${JSON.stringify({ reasoning: chunk.reasoning })}\n\n`;
              controller.enqueue(encoder.encode(sseMessage));
            }
          }
          if (!gotContent) {
            await refundCredit("analyze_refund");
            await logUsage(false, "empty");
          } else {
            await logUsage(true, null);
          }
          // Send done signal
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          // 客户端主动断开不退额度（已收到部分内容），其余流异常都退
          if (cancelled) {
            await logUsage(gotContent, "aborted");
            return;
          }
          const timedOut = upstream.signal.aborted;
          await refundCredit("analyze_refund");
          await logUsage(false, timedOut ? "timeout" : "stream");
          const errorMessage = timedOut
            ? AI_TIMEOUT_MESSAGE
            : error instanceof Error ? error.message : "Stream error";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          );
          controller.close();
        } finally {
          clearTimeout(deadline);
        }
      },
      cancel() {
        cancelled = true;
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("analyze 路由异常:", error);
    await refundCredit("analyze_refund");
    await logUsage(false, "server");
    return new Response(JSON.stringify({ error: "服务器内部错误，请稍后重试" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}