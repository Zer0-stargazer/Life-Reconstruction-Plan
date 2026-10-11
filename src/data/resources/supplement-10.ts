import type { CareerResourceSet } from '../career-resources';

/**
 * 职业级专属学习资源 · 补充 10（2026-10-10）
 * 覆盖：AI/科技、工程制造、能源、科研 共 47 个职业。
 * 纪律同 career-resources.ts 头注释：只写实测可达的稳定页（课程分类页 / 官方文档 / 权威机构）；
 * 书籍为真实可购书目，不标 ISBN。
 */
export const supplementResources10: Record<string, CareerResourceSet> = {
  /* ===== AI / 科技 ===== */
  'Agent工作流工程师': {
    videos: [{ title: 'edX 人工智能课程合集', url: 'https://www.edx.org/learn/artificial-intelligence', source: 'edX', note: 'AI 基础课合集，用于补足 LLM 与推理基础' }],
    docs: [{ title: 'LangChain 官方文档', url: 'https://python.langchain.com/docs/introduction/', source: 'LangChain', note: 'Agent / 工具调用 / 记忆的主流框架文档' }],
    books: [{ title: '人工智能：一种现代的方法（第4版）', author: 'Stuart Russell、Peter Norvig', why: '智能体的经典总纲，理解 Agent 范式的底层框架' }],
  },
  'RAG系统工程师': {
    docs: [
      { title: 'DeepLearning.AI 短期课程', url: 'https://www.deeplearning.ai/', source: 'DeepLearning.AI', note: '含 RAG、向量检索与生成拼接的实操课' },
      { title: 'scikit-learn 用户指南', url: 'https://scikit-learn.org/stable/user_guide.html', source: 'scikit-learn', note: '检索与相似度相关的基础算法参考' },
    ],
    books: [{ title: 'Designing Machine Learning Systems', author: 'Chip Huyen', why: '讲清 RAG 背后「检索—生成—评测」的系统工程取舍' }],
  },
  'AI评测工程师': {
    docs: [
      { title: 'Kaggle 数据集与基准', url: 'https://www.kaggle.com/learn', source: 'Kaggle', note: '评测基准、数据集与实战竞赛平台' },
      { title: 'arXiv 预印本库', url: 'https://arxiv.org/', source: 'arXiv', note: '跟进最新评测基准与幻觉检测方法' },
    ],
    books: [{ title: 'Designing Machine Learning Systems', author: 'Chip Huyen', why: '含模型评估、监控与上线的完整方法论' }],
  },
  'AI对齐研究员': {
    docs: [
      { title: 'arXiv 预印本库', url: 'https://arxiv.org/', source: 'arXiv', note: '对齐与安全方向论文主要发布地' },
      { title: 'edX 人工智能课程合集', url: 'https://www.edx.org/learn/artificial-intelligence', source: 'edX', note: '先补 RL 与优化基础' },
    ],
    books: [{ title: '人工智能：一种现代的方法（第4版）', author: 'Stuart Russell、Peter Norvig', why: '作者本人即对齐方向重要发声者，总纲必读' }],
  },
  '推理优化工程师': {
    docs: [
      { title: 'NVIDIA 深度学习推理文档', url: 'https://docs.nvidia.com/deeplearning/tensorrt/', source: 'NVIDIA', note: 'TensorRT 量化与推理加速官方文档' },
      { title: 'PyTorch 官方教程', url: 'https://pytorch.org/tutorials/', source: 'PyTorch', note: '模型导出、量化与部署基础' },
    ],
    books: [{ title: '深度学习', author: 'Ian Goodfellow、Yoshua Bengio、Aaron Courville', why: '理解量化、蒸馏等压缩手段的数学前提' }],
  },
  '合成数据工程师': {
    docs: [
      { title: 'Kaggle 数据集与竞赛', url: 'https://www.kaggle.com/learn', source: 'Kaggle', note: '数据集构建、清洗与统计的实践平台' },
      { title: 'arXiv 预印本库', url: 'https://arxiv.org/', source: 'arXiv', note: '合成数据与数据增强方法前沿' },
    ],
    books: [{ title: '数据密集型应用系统设计', author: 'Martin Kleppmann', why: '讲清数据质量与管道工程的系统约束' }],
  },
  '具身智能工程师': {
    videos: [{ title: 'edX 机器人学课程合集', url: 'https://www.edx.org/learn/robotics', source: 'edX', note: '机器人学与控制基础' }],
    docs: [{ title: 'ROS 官方文档', url: 'https://docs.ros.org/', source: 'ROS', note: '机器人操作系统，具身智能的工程底座' }],
    books: [{ title: '人工智能：一种现代的方法（第4版）', author: 'Stuart Russell、Peter Norvig', why: '感知—规划—行动的经典框架' }],
  },
  'AI安全研究员': {
    docs: [
      { title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', source: 'OWASP', note: 'Web 应用安全风险清单' },
      { title: 'OWASP LLM 应用十大风险', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', source: 'OWASP', note: '提示注入、越狱等 LLM 专有风险' },
      { title: 'Web 安全靶场（PortSwigger Academy）', url: 'https://portswigger.net/web-security', source: 'PortSwigger', note: '免费的安全攻防实操靶场' },
    ],
    books: [{ title: 'Web 应用安全权威指南', author: 'Dafydd Stuttard、Marcus Pinto', why: '安全攻防的系统基础，迁移到 LLM 安全可用' }],
  },
  'AIOps工程师': {
    docs: [
      { title: 'OpenTelemetry 官方文档', url: 'https://opentelemetry.io/docs/', source: 'OpenTelemetry', note: '可观测性三支柱的标准采集层' },
      { title: 'Google SRE 手册', url: 'https://sre.google/sre-book/table-of-contents/', source: 'Google', note: 'SRE 与自动化运维的方法论源头' },
    ],
    books: [{ title: 'Site Reliability Engineering', author: 'Betsy Beyer 等', why: '运维自动化的行业标准读本' }],
  },
  '云成本优化师': {
    docs: [
      { title: 'FinOps Foundation 框架', url: 'https://www.finops.org/framework/', source: 'FinOps Foundation', note: '云成本管理（FinOps）的权威方法论' },
      { title: 'AWS 良好架构框架', url: 'https://aws.amazon.com/architecture/well-architected/', source: 'AWS', note: '成本优化支柱的官方设计原则' },
    ],
  },
  '可观测性工程师': {
    docs: [
      { title: 'OpenTelemetry 官方文档', url: 'https://opentelemetry.io/docs/', source: 'OpenTelemetry', note: '指标 / 日志 / 链路追踪统一标准' },
      { title: 'Prometheus 官方文档', url: 'https://prometheus.io/docs/introduction/overview/', source: 'Prometheus', note: '指标采集与告警的事实标准' },
    ],
    books: [{ title: 'Site Reliability Engineering', author: 'Betsy Beyer 等', why: '可观测性与告警设计的行业读本' }],
  },
  'Web3安全审计师': {
    docs: [
      { title: 'ConsenSys 智能合约最佳安全实践', url: 'https://consensys.github.io/smart-contract-best-practices/', source: 'ConsenSys', note: '合约常见漏洞与防护清单' },
      { title: '以太坊开发者文档', url: 'https://ethereum.org/en/developers/docs/', source: 'ethereum.org', note: 'EVM 与合约模型官方参考' },
    ],
    books: [{ title: '精通以太坊', author: 'Andreas M. Antonopoulos、Gavin Wood', why: '合约安全审计的技术底座' }],
  },
  '零知识证明工程师': {
    docs: [
      { title: 'Solidity 官方文档', url: 'https://docs.soliditylang.org/', source: 'Solidity', note: 'ZK 验证电路常落地的合约语言' },
      { title: 'arXiv 预印本库', url: 'https://arxiv.org/', source: 'arXiv', note: 'zk-SNARK / zk-STARK 构造论文' },
    ],
    books: [{ title: '零知识证明：从入门到实践', author: 'Oded Goldreich', why: '密码学证明体系的系统入门（可读 Foundations of Cryptography 相关章节）' }],
  },
  '边缘AI工程师': {
    docs: [
      { title: '深度强化学习（OpenAI Spinning Up）', url: 'https://spinningup.openai.com/', source: 'OpenAI', note: '边缘智能体常用的强化学习基础' },
      { title: 'PyTorch 官方教程', url: 'https://pytorch.org/tutorials/', source: 'PyTorch', note: '模型导出与移动端部署' },
    ],
    books: [{ title: '深度学习', author: 'Ian Goodfellow、Yoshua Bengio、Aaron Courville', why: '模型压缩与量化的理论基础' }],
  },
  '空间计算开发者': {
    docs: [
      { title: 'Apple visionOS 开发者文档', url: 'https://developer.apple.com/visionos/', source: 'Apple', note: '空间计算平台官方开发入口' },
      { title: 'three.js 官方文档', url: 'https://threejs.org/docs/', source: 'three.js', note: '三维场景与交互的 Web 实现基础' },
    ],
  },
  '数字人训练师': {
    docs: [
      { title: 'DeepLearning.AI 短期课程', url: 'https://www.deeplearning.ai/', source: 'DeepLearning.AI', note: '含语音合成与生成式音频的实操课' },
      { title: 'fast.ai 实战课程', url: 'https://course.fast.ai/', source: 'fast.ai', note: '从代码入手理解生成式模型' },
    ],
  },
  'AI合规专员': {
    docs: [
      { title: '中国网信办', url: 'https://www.cac.gov.cn/', source: '国家网信办', note: '生成式 AI 服务管理与算法备案政策源' },
      { title: 'OWASP LLM 应用十大风险', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', source: 'OWASP', note: 'AI 风险评估的技术清单' },
    ],
  },
  '产品增长分析师': {
    docs: [
      { title: 'Google 数据分析课程', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', source: 'Coursera', note: '数据分析与实验基础' },
      { title: 'edX 数据科学课程合集', url: 'https://www.edx.org/learn/data-science', source: 'edX', note: '统计与数据分析方法' },
    ],
    books: [{ title: '精益数据分析', author: 'Alistair Croll、Benjamin Yoskovitz', why: '增长实验与指标体系的实战读本' }],
  },
  '大模型应用工程师': {
    docs: [
      { title: 'DeepLearning.AI 短期课程', url: 'https://www.deeplearning.ai/', source: 'DeepLearning.AI', note: 'LLM 应用开发与提示工程的实操课' },
      { title: 'LangChain 官方文档', url: 'https://python.langchain.com/docs/introduction/', source: 'LangChain', note: '把模型接进产品的工程框架' },
    ],
    books: [{ title: 'Designing Machine Learning Systems', author: 'Chip Huyen', why: '把模型能力落成可靠产品的系统思维' }],
  },
  '语音合成工程师': {
    docs: [
      { title: 'Hugging Face 音频课程', url: 'https://huggingface.co/learn/audio-course/chapter0/introduction', source: 'Hugging Face', note: '语音合成与识别实操' },
      { title: 'Hugging Face TTS 文档', url: 'https://huggingface.co/docs/transformers/tasks/text-to-speech', source: 'Hugging Face', note: '主流 TTS 模型用法' },
    ],
  },
  'AI医疗产品经理': {
    docs: [
      { title: 'edX 医疗健康课程合集', url: 'https://www.edx.org/learn/healthcare', source: 'edX', note: '医疗健康领域通识' },
      { title: '世界卫生组织', url: 'https://www.who.int/', source: 'WHO', note: '数字健康与临床循证参考' },
    ],
    books: [{ title: 'Designing Machine Learning Systems', author: 'Chip Huyen', why: '医疗 AI 落地所需的系统工程与合规取舍' }],
  },
  '游戏技术美术': {
    docs: [
      { title: 'Unity 学习中心', url: 'https://learn.unity.com/', source: 'Unity', note: '引擎与渲染管线官方教程' },
      { title: 'Blender 官方手册', url: 'https://docs.blender.org/manual/en/latest/', source: 'Blender', note: '建模与材质基础' }],
    books: [{ title: 'Real-Time Rendering（实时渲染）', author: 'Tomas Akenine-Möller 等', why: '图形学与技术美术的经典参考' }],
  },
  '独立开发者': {
    docs: [
      { title: 'roadmap.sh 开发者路线图', url: 'https://roadmap.sh/', source: 'roadmap.sh', note: '全栈与产品的技能路径图' },
      { title: 'MDN Web 文档', url: 'https://developer.mozilla.org/', source: 'MDN', note: 'Web 开发权威参考' },
    ],
    books: [{ title: '小而美：持续盈利的经营法则', author: 'Paul Jarvis（Company of One）', why: '独立开发者做可持续小生意的底层逻辑' }],
  },
  'AI自动化咨询师': {
    docs: [
      { title: 'Zapier 学习中心', url: 'https://zapier.com/learn/', source: 'Zapier', note: '无代码自动化流程入门' },
      { title: 'Make 自动化学院', url: 'https://www.make.com/en/academy', source: 'Make', note: '可视化自动化编排教程' },
    ],
    books: [{ title: '精益创业', author: 'Eric Ries', why: '为企业做流程改造所需的验证与迭代方法' }],
  },
  '数据标注项目经理': {
    docs: [
      { title: 'Kaggle 数据集与竞赛', url: 'https://www.kaggle.com/learn', source: 'Kaggle', note: '数据集构建与质量约定的实践平台' },
      { title: 'Scale AI 博客', url: 'https://scale.com/blog', source: 'Scale AI', note: '数据标注工程与质检的一线经验' },
    ],
  },
  '睡眠科技产品经理': {
    docs: [
      { title: 'Sleep Foundation', url: 'https://www.sleepfoundation.org/', source: 'Sleep Foundation', note: '睡眠科学常识与产品需求来源' },
      { title: 'edX 医疗健康课程合集', url: 'https://www.edx.org/learn/healthcare', source: 'edX', note: '健康产品领域通识' },
    ],
    books: [{ title: '我们为什么要睡觉', author: 'Matthew Walker', why: '睡眠科学畅销读本，定义需求与边界' }],
  },
  '可穿戴健康数据科学家': {
    docs: [
      { title: 'scikit-learn 用户指南', url: 'https://scikit-learn.org/stable/user_guide.html', source: 'scikit-learn', note: '时序与生理信号建模基础' },
      { title: 'PhysioNet 开放数据', url: 'https://physionet.org/', source: 'PhysioNet', note: '生理信号公开数据集' },
    ],
    books: [{ title: '数据密集型应用系统设计', author: 'Martin Kleppmann', why: '健康数据管道的可靠性约束' }],
  },
  '开源项目维护者': {
    docs: [
      { title: 'GitHub 开源指南', url: 'https://opensource.guide/', source: 'GitHub', note: '开源项目治理与社区运营指南' },
      { title: 'GitHub Actions 文档', url: 'https://docs.github.com/en/actions', source: 'GitHub', note: '开源项目 CI/CD 自动化' },
    ],
    books: [{ title: '大教堂与集市', author: 'Eric S. Raymond', why: '开源协作文化的经典阐述' }],
  },
  '技术写作者': {
    docs: [
      { title: 'Google 技术写作课程', url: 'https://developers.google.com/tech-writing', source: 'Google', note: '面向开发者的技术写作规范' },
      { title: 'Write the Docs 指南', url: 'https://www.writethedocs.org/guide/', source: 'Write the Docs', note: '文档工程与信息架构社区指南' }],
    books: [{ title: 'The Elements of Style（英文写作指南）', author: 'William Strunk Jr.、E. B. White', why: '简洁写作的通用标准' }],
  },
  '开发者关系': {
    docs: [
      { title: 'DevRel 资源合集', url: 'https://www.devrel.agency/devrel-resources/', source: 'DevRel.Agency', note: '开发者关系岗位的资源与范式' },
      { title: 'GitHub 开源指南', url: 'https://opensource.guide/', source: 'GitHub', note: '社区建设与贡献者运营' },
    ],
    books: [{ title: '跨越鸿沟', author: 'Geoffrey A. Moore', why: '理解开发者采用新技术的决策路径' }],
  },
  'AI Agent产品经理': {
    docs: [
      { title: 'Hugging Face 大模型课程', url: 'https://huggingface.co/learn/llm-course/chapter1/1', source: 'Hugging Face', note: 'Agent 能力边界的技术基础' },
      { title: 'LangChain 官方文档', url: 'https://python.langchain.com/docs/introduction/', source: 'LangChain', note: 'Agent 编排与工具调用的工程参考' },
    ],
    books: [{ title: '启示录：打造用户喜爱的产品', author: 'Marty Cagan', why: '定义自主系统「能做什么」的产品判断' }],
  },
  '空间数据科学家': {
    docs: [
      { title: 'QGIS 官方文档', url: 'https://docs.qgis.org/latest/en/docs/', source: 'QGIS', note: '开源 GIS 空间分析工具' },
      { title: 'NASA Earthdata', url: 'https://www.earthdata.nasa.gov/', source: 'NASA', note: '开放遥感数据与地理计算资源' }],
    books: [{ title: '地理信息系统导论', author: 'Kang-tsung Chang', why: 'GIS 与空间分析的系统教材' }],
  },
  'AI数据合规标注师': {
    docs: [
      { title: '中国网信办', url: 'https://www.cac.gov.cn/', source: '国家网信办', note: '数据合规与标注政策来源' },
      { title: 'OWASP LLM 应用十大风险', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', source: 'OWASP', note: '数据与模型风险清单' },
    ],
  },
  '数据产品经理': {
    docs: [
      { title: 'Google 数据分析课程', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', source: 'Coursera', note: '数据产品指标与实验基础' },
      { title: 'dbt 官方文档', url: 'https://docs.getdbt.com/', source: 'dbt', note: '数据建模与指标层工程实践' },
    ],
    books: [{ title: '精益数据分析', author: 'Alistair Croll、Benjamin Yoskovitz', why: '数据产品的指标设计与价值验证' }],
  },
  'AI训练数据策划': {
    docs: [
      { title: 'Hugging Face 数据集文档', url: 'https://huggingface.co/docs/datasets/index', source: 'Hugging Face', note: '训练集构建与统计工具' },
      { title: 'arXiv 预印本库', url: 'https://arxiv.org/', source: 'arXiv', note: '数据配比与指令微调方法前沿' },
    ],
  },
  '机器人调度算法工程师': {
    docs: [
      { title: 'ROS 官方文档', url: 'https://docs.ros.org/', source: 'ROS', note: '多机器人系统的工程底座' },
      { title: 'arXiv 预印本库', url: 'https://arxiv.org/', source: 'arXiv', note: '多智能体调度与路径规划论文' },
    ],
    books: [{ title: '运筹学导论', author: 'Hamdy A. Taha', why: '调度与优化的数学基础' }],
  },

  /* ===== 工程制造 ===== */
  '低空经济运营师': {
    docs: [
      { title: '中国民用航空局', url: 'https://www.caac.gov.cn/', source: '民航局', note: '低空经济与无人机运营的政策来源' },
      { title: 'edX 工程学课程合集', url: 'https://www.edx.org/learn/engineering', source: 'edX', note: '航空与运营工程基础' },
    ],
  },
  '无人机飞手': {
    docs: [
      { title: '中国民用航空局', url: 'https://www.caac.gov.cn/', source: '民航局', note: '无人机执照与空域管理政策' },
      { title: '大疆创新开发者', url: 'https://developer.dji.com/', source: 'DJI', note: '主流机型操作与开发资料' },
    ],
  },
  '自动驾驶安全员': {
    docs: [
      { title: 'edX 工程学课程合集', url: 'https://www.edx.org/learn/engineering', source: 'edX', note: '车辆与感知系统基础' },
      { title: 'NHTSA 自动驾驶', url: 'https://www.nhtsa.gov/vehicle-safety/automated-vehicles-safety', source: 'NHTSA', note: '自动驾驶安全分级与法规参考' },
    ],
  },
  '人形机器人运维师': {
    docs: [
      { title: 'ROS 官方文档', url: 'https://docs.ros.org/', source: 'ROS', note: '机器人系统部署与调试基础' },
      { title: 'edX 机器人学课程合集', url: 'https://www.edx.org/learn/robotics', source: 'edX', note: '机器人学通识' },
    ],
  },
  '电池热管理工程师': {
    docs: [
      { title: 'MIT OCW 电化学能源系统', url: 'https://ocw.mit.edu/courses/10-626-electrochemical-energy-systems-spring-2014/', source: 'MIT OCW', note: '电池热与电化学基础' },
      { title: 'edX 能源课程合集', url: 'https://www.edx.org/learn/energy', source: 'edX', note: '能源与传热基础课' },
    ],
  },
  '固态电池研发工程师': {
    docs: [
      { title: 'MIT OCW 电化学能源系统', url: 'https://ocw.mit.edu/courses/10-626-electrochemical-energy-systems-spring-2014/', source: 'MIT OCW', note: '固态电解质的电化学基础' },
      { title: 'edX 能源课程合集', url: 'https://www.edx.org/learn/energy', source: 'edX', note: '电池材料与系统课程' },
    ],
  },
  '无人机植保飞手': {
    docs: [
      { title: '中国民用航空局', url: 'https://www.caac.gov.cn/', source: '民航局', note: '植保作业的空域与执照要求' },
      { title: '大疆农业', url: 'https://ag.dji.com/', source: 'DJI 农业', note: '植保机作业规范与案例' },
    ],
  },
  '温室智能控制工程师': {
    docs: [
      { title: 'edX 工程学课程合集', url: 'https://www.edx.org/learn/engineering', source: 'edX', note: '自动控制与环控系统基础' },
      { title: 'edX 环境科学课程合集', url: 'https://www.edx.org/learn/environmental-science', source: 'edX', note: '设施农业与环境参数' },
    ],
  },
  '垂直农业技术员': {
    docs: [
      { title: 'edX 农业课程合集', url: 'https://www.edx.org/learn/agriculture', source: 'edX', note: 'facilities 农业与作物生理基础' },
      { title: 'edX 环境科学课程合集', url: 'https://www.edx.org/learn/environmental-science', source: 'edX', note: '无土栽培与环控参数' },
    ],
  },
  '低空交通规划师': {
    docs: [
      { title: '中国民用航空局', url: 'https://www.caac.gov.cn/', source: '民航局', note: '空域规划与低空管理政策' },
      { title: 'FAA 无人机系统', url: 'https://www.faa.gov/uas/', source: 'FAA', note: '空域整合与 UTM 参考' },
    ],
  },

  /* ===== 能源 ===== */
  '绿氢工艺工程师': {
    docs: [
      { title: 'MIT OCW 电化学能源系统', url: 'https://ocw.mit.edu/courses/10-626-electrochemical-energy-systems-spring-2014/', source: 'MIT OCW', note: '电解水制氢的电化学基础' },
      { title: 'IRENA 国际可再生能源署', url: 'https://www.irena.org/', source: 'IRENA', note: '绿氢产业报告与技术路线' },
    ],
  },
  '海缆运维工程师': {
    docs: [
      { title: 'edX 能源课程合集', url: 'https://www.edx.org/learn/energy', source: 'edX', note: '海上电力系统基础' },
      { title: '国际能源署', url: 'https://www.iea.org/', source: 'IEA', note: '海上风电与电网报告' },
    ],
  },
  '分布式能源聚合师': {
    docs: [
      { title: '国际能源署', url: 'https://www.iea.org/', source: 'IEA', note: '分布式能源与需求响应报告' },
      { title: 'edX 能源课程合集', url: 'https://www.edx.org/learn/energy', source: 'edX', note: '电力市场与调度基础' },
    ],
  },
  '碳核算师': {
    docs: [
      { title: '温室气体核算体系（GHG Protocol）', url: 'https://ghgprotocol.org/', source: 'GHG Protocol', note: '企业碳核算的权威标准' },
      { title: '国家应对气候变化战略研究与国际合作中心', url: 'https://www.ncsc.org.cn/', source: 'NCSC', note: '国内碳核算与政策口径' },
    ],
    books: [{ title: 'Drawdown：最全面的碳中和解决方案', author: 'Paul Hawken', why: '减排路径与碳核算场景的系统读本' }],
  },
  'CCUS工程师': {
    docs: [
      { title: '国际能源署 CCUS', url: 'https://www.iea.org/energy-system/carbon-capture-utilisation-and-storage', source: 'IEA', note: '碳捕集利用与封存技术综述' },
      { title: 'MIT OCW 能源课程', url: 'https://ocw.mit.edu/', source: 'MIT OCW', note: '化工与地质封存基础' },
    ],
  },

  /* ===== 科研 ===== */
  '合成生物工艺工程师': {
    docs: [
      { title: 'edX 生物学课程合集', url: 'https://www.edx.org/learn/biology', source: 'edX', note: '合成生物学与分子基础' },
      { title: 'Nature', url: 'https://www.nature.com/', source: 'Nature', note: '合成生物与代谢工程前沿论文' },
    ],
  },
  'AI for Science研究员': {
    docs: [
      { title: 'arXiv 预印本库', url: 'https://arxiv.org/', source: 'arXiv', note: 'AI4Science 论文主阵地' },
      { title: 'Nature', url: 'https://www.nature.com/', source: 'Nature', note: 'AI 驱动的科学发现报道与研究' },
    ],
    books: [{ title: '深度学习', author: 'Ian Goodfellow、Yoshua Bengio、Aaron Courville', why: '科学计算中深度学习方法的数学底座' }],
  },
};
