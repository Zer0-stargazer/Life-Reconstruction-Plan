import { NextRequest } from "next/server";
import { streamChatAuto } from "@/lib/ai-stream";
import { resolveAiSource, type AiSourceConfig } from "@/lib/ai-providers";

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

export async function POST(request: NextRequest) {
  try {
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

    const modulePrompt = MODULE_PROMPTS[module] || MODULE_PROMPTS.window;

    const messages: { role: string; content: string }[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add history if provided
    if (history && history.length > 0) {
      for (const msg of history) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    // Build user message
    if (history && history.length > 0 && question) {
      // Follow-up question
      messages.push({
        role: "user",
        content: question,
      });
    } else {
      // Initial analysis request
      let userContent = `模块：${module}\n\n当前选项：${item}`;
      if (question) {
        userContent += `\n\n用户问题：${question}`;
      }
      userContent += `\n\n请按照分析框架给出具体分析`;

      messages.push({
        role: "user",
        content: `${modulePrompt}\n\n${userContent}`,
      });
    }

    // Create SSE stream (uses user-provided AI source when available)
    const encoder = new TextEncoder();
    const stream = streamChatAuto(messages, aiSource, { temperature: 0.7 });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.error) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ error: chunk.error })}\n\n`)
              );
              controller.close();
              return;
            }
            if (chunk.content) {
              const sseMessage = `data: ${JSON.stringify({ content: chunk.content })}\n\n`;
              controller.enqueue(encoder.encode(sseMessage));
            }
          }
          // Send done signal
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Stream error";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          );
          controller.close();
        }
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
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}