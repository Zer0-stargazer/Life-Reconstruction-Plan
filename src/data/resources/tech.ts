import type { CareerResourceSet } from '../career-resources';

export const techResources: Record<string, CareerResourceSet> = {
  '软件架构师': {
    docs: [{ title: 'Martin Fowler 网站（架构模式与重构文章）', url: 'https://martinfowler.com/', source: '行业专家' }],
    books: [{ title: '架构整洁之道', author: 'Robert C. Martin', why: '从设计原则到系统结构，建立架构思维的基础' }],
  },
  '微服务架构师': {
    docs: [{ title: 'microservices.io（微服务模式目录）', url: 'https://microservices.io/', source: '行业专家', note: 'Chris Richardson 维护的模式站点' }],
    books: [{ title: '微服务设计', author: 'Sam Newman', why: '系统讲解微服务拆分、通信与部署的实践经典' }],
  },
  '云原生工程师': {
    docs: [
      { title: 'Kubernetes 官方概念文档', url: 'https://kubernetes.io/docs/concepts/', source: '官方文档' },
      { title: 'CNCF 云原生计算基金会官网', url: 'https://www.cncf.io/', source: '行业组织' },
    ],
    books: [{ title: 'Kubernetes in Action（中文版：Kubernetes 实战）', author: 'Marko Lukša', why: '从容器到集群编排，逐步讲透云原生核心概念' }],
  },
  'Serverless架构师': {
    docs: [
      { title: 'AWS 官方文档总入口', url: 'https://docs.aws.amazon.com/', source: 'AWS 官方' },
      { title: 'Azure 云架构中心', url: 'https://learn.microsoft.com/en-us/azure/architecture/', source: '官方文档' },
    ],
  },
  'API网关架构师': {
    docs: [
      { title: 'Envoy 官方文档', url: 'https://www.envoyproxy.io/docs/envoy/latest/', source: '官方文档' },
      { title: 'Istio 官方文档', url: 'https://istio.io/latest/docs/', source: '官方文档' },
    ],
  },
  '前端架构师': {
    docs: [
      { title: 'React 官方学习文档', url: 'https://react.dev/learn', source: '官方文档' },
      { title: 'MDN JavaScript 指南（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript', source: '官方文档' },
    ],
  },
  '技术文档工程师': {
    docs: [{ title: 'Write the Docs 技术写作社区', url: 'https://www.writethedocs.org/', source: '行业社区' }],
  },
  '消息队列专家': {
    docs: [
      { title: 'Apache Kafka 官方文档', url: 'https://kafka.apache.org/documentation/', source: '官方文档' },
      { title: 'RabbitMQ 官方文档', url: 'https://www.rabbitmq.com/documentation.html', source: '官方文档' },
    ],
    books: [{ title: 'Kafka权威指南', author: 'Neha Narkhede、Gwen Shapira、Todd Palino', why: '消息系统设计与运维的权威参考，原理与实践兼顾' }],
  },
  '搜索引擎工程师': {
    docs: [{ title: 'Elastic 官方文档总入口', url: 'https://www.elastic.co/guide/index.html', source: '官方文档' }],
    books: [{ title: 'Elasticsearch权威指南', author: 'Clinton Gormley、Zachary Tong', why: '从索引到分布式检索的系统讲解，搜索工程师入门首选' }],
  },
  '负载均衡专家': {
    docs: [{ title: 'Nginx 官方文档', url: 'https://nginx.org/en/docs/', source: '官方文档' }],
  },
  '监控系统工程师': {
    docs: [
      { title: 'Prometheus 官方文档：概览', url: 'https://prometheus.io/docs/introduction/overview/', source: '官方文档' },
      { title: 'Grafana 官方文档', url: 'https://grafana.com/docs/', source: '官方文档' },
    ],
  },
  '日志系统工程师': {
    docs: [{ title: 'Elastic 官方文档总入口', url: 'https://www.elastic.co/guide/index.html', source: '官方文档' }],
  },
  '配置管理工程师': {
    docs: [{ title: 'HashiCorp Terraform 官方文档', url: 'https://developer.hashicorp.com/terraform/docs', source: '官方文档' }],
  },
  '持续集成工程师': {
    docs: [
      { title: 'Jenkins 官方文档', url: 'https://www.jenkins.io/doc/', source: '官方文档' },
      { title: 'GitHub Actions 入门指南', url: 'https://docs.github.com/en/actions/get-started', source: '官方文档' },
    ],
    books: [{ title: '持续交付', author: 'Jez Humble、David Farley', why: '持续集成与部署流水线的经典方法论' }],
  },
  '代码质量工程师': {
    docs: [{ title: 'SonarQube 官方文档', url: 'https://docs.sonarsource.com/sonarqube/latest/', source: '官方文档' }],
  },
  'DevSecOps工程师': {
    docs: [{ title: 'OWASP DevSecOps 指南', url: 'https://owasp.org/www-project-devsecops-guideline/', source: 'OWASP' }],
  },
  '网络安全渗透测试工程师': {
    docs: [{ title: 'OWASP Top 10（Web 十大安全风险）', url: 'https://owasp.org/www-project-top-ten/', source: 'OWASP' }],
    books: [{ title: 'Web应用黑客攻防（The Web Application Hacker\'s Handbook）', author: 'Dafydd Stuttard、Marcus Pinto', why: 'Web 渗透测试的标准实战手册，攻防思路完整' }],
  },
  '数据治理工程师': {
    docs: [{ title: 'DAMA 国际数据管理协会官网', url: 'https://www.dama.org/', source: '行业协会' }],
    books: [{ title: 'DAMA-DMBOK 数据管理知识体系指南', author: 'DAMA International', why: '数据治理领域的通用知识体系，理论框架完整' }],
  },
  '数仓工程师': {
    docs: [{ title: 'dbt 官方文档', url: 'https://docs.getdbt.com/docs/introduction', source: '官方文档' }],
    books: [{ title: '数据仓库工具箱（第3版）', author: 'Ralph Kimball、Margy Ross', why: '维度建模的经典教材，数仓设计的必读书' }],
  },
  '数据湖工程师': {
    docs: [{ title: 'Databricks 官方文档', url: 'https://docs.databricks.com/', source: '官方文档' }],
  },
  '流计算工程师': {
    docs: [{ title: 'Apache Flink 官网与文档', url: 'https://flink.apache.org/', source: '官方文档' }],
    books: [{ title: 'Streaming Systems（流式系统）', author: 'Tyler Akidau、Slava Chernyak、Reuven Lax', why: '流处理语义与时间模型的权威讲解' }],
  },
  '数据库性能优化工程师': {
    docs: [{ title: 'PostgreSQL 官方文档', url: 'https://www.postgresql.org/docs/current/', source: '官方文档' }],
    books: [{ title: '高性能MySQL（第4版）', author: 'Silvia Botros、Jeremy Tinley 等', why: '索引、查询与架构优化的经典实战手册' }],
  },
  '数据库运维DBA': {
    docs: [
      { title: 'PostgreSQL 官方文档', url: 'https://www.postgresql.org/docs/current/', source: '官方文档' },
      { title: 'MongoDB 官方文档', url: 'https://www.mongodb.com/docs/', source: '官方文档' },
      { title: 'Redis 官方文档', url: 'https://redis.io/docs/latest/', source: '官方文档' },
    ],
    books: [{ title: '高性能MySQL（第4版）', author: 'Silvia Botros、Jeremy Tinley 等', why: 'MySQL 运维与调优的经典参考' }],
  },
  'GIS开发工程师': {
    docs: [
      { title: 'PostGIS 官方文档', url: 'https://postgis.net/documentation/', source: '官方文档' },
      { title: 'GDAL 官网', url: 'https://gdal.org/', source: '开源项目' },
      { title: 'QGIS 官网', url: 'https://www.qgis.org/', source: '开源项目' },
    ],
  },
  'BI工程师': {
    docs: [{ title: 'Power BI 官方文档', url: 'https://learn.microsoft.com/en-us/power-bi/', source: '官方文档' }],
  },
  'RPA开发工程师': {
    docs: [{ title: 'UiPath 官方文档', url: 'https://docs.uipath.com/', source: '官方文档' }],
  },
  '操作系统开发工程师': {
    docs: [{ title: 'Linux 内核官方文档', url: 'https://www.kernel.org/doc/', source: '官方文档' }],
    videos: [{ title: 'MIT 6.828 操作系统工程（课程主页含讲义与实验）', url: 'https://pdos.csail.mit.edu/6.828/', source: 'MIT', note: '动手写操作系统内核的经典课程' }],
    books: [{ title: '操作系统导论（Operating Systems: Three Easy Pieces）', author: 'Remzi H. Arpaci-Dusseau、Andrea C. Arpaci-Dusseau', why: '免费在线的操作系统入门教材，原理讲解清晰' }],
  },
  'FPGA工程师': {
    docs: [{ title: 'AMD 官方文档（含 Vivado / Vitis 工具）', url: 'https://docs.amd.com/', source: '官方文档' }],
  },
  '量子软件工程师': {
    docs: [{ title: 'Qiskit 官方文档', url: 'https://qiskit.org/documentation/', source: '官方文档' }],
    books: [{ title: '量子计算与量子信息', author: 'Michael A. Nielsen、Isaac L. Chuang', why: '量子计算领域的标准教材，软件开发者的理论底座' }],
  },
  '自动化测试架构师': {
    docs: [{ title: 'Selenium 官方文档', url: 'https://www.selenium.dev/documentation/', source: '官方文档' }],
  },
  '大模型训练工程师': {
    docs: [{ title: 'PyTorch 官方教程', url: 'https://pytorch.org/tutorials/', source: '官方文档' }],
    books: [{ title: '动手学深度学习', author: '李沐、Aston Zhang 等', why: '边读边写代码的深度学习实践教材，训练工程入门' }],
  },
  '多模态AI工程师': {
    docs: [{ title: 'PyTorch 官方教程', url: 'https://pytorch.org/tutorials/', source: '官方文档' }],
    books: [{ title: '动手学深度学习', author: '李沐、Aston Zhang 等', why: '深度学习从基础到模型实现的系统实践教材' }],
  },
  'AIGC工程师': {
    docs: [{ title: 'DeepLearning.AI 课程平台', url: 'https://www.deeplearning.ai/', source: '官方平台' }],
  },
  '提示词工程师': {
    docs: [{ title: 'DeepLearning.AI 课程平台（含大模型应用课程）', url: 'https://www.deeplearning.ai/', source: '官方平台' }],
  },
  'MLOps工程师': {
    docs: [
      { title: 'MLflow 官方文档', url: 'https://mlflow.org/docs/latest/index.html', source: '官方文档' },
      { title: 'Kubeflow 官方文档', url: 'https://kubeflow.org/docs/', source: '官方文档' },
    ],
    books: [{ title: 'Machine Learning Engineering（机器学习工程）', author: 'Andriy Burkov', why: '从数据到上线的机器学习工程全流程，MLOps 入门实用' }],
  },
  '开放银行架构师': {
    docs: [{ title: 'Open Banking（英国开放银行标准组织）', url: 'https://www.openbanking.org.uk/', source: '行业组织' }],
  },
  '开源社区经理': {
    docs: [
      { title: 'GitHub 开源指南：如何参与贡献', url: 'https://opensource.guide/how-to-contribute/', source: '官方文档' },
      { title: 'Linux 基金会资源库', url: 'https://www.linuxfoundation.org/resources', source: '行业组织' },
    ],
  },
  'Meta开源贡献者': {
    docs: [{ title: 'Meta 开源项目官网', url: 'https://opensource.fb.com/', source: '官方网站' }],
  },
  '初级AI研究员': {
    docs: [{ title: 'PyTorch 官方教程', url: 'https://pytorch.org/tutorials/', source: '官方文档' }],
    books: [{ title: '深度学习', author: 'Ian Goodfellow、Yoshua Bengio、Aaron Courville', why: '深度学习理论的权威教材，研究入门必读' }],
  },
  '高级AI研究员': {
    docs: [{ title: 'PyTorch 官方教程', url: 'https://pytorch.org/tutorials/', source: '官方文档' }],
    books: [{ title: '深度学习', author: 'Ian Goodfellow、Yoshua Bengio、Aaron Courville', why: '深度学习理论的权威教材，进阶研究的理论基础' }],
  },
  'iOS开发工程师': {
    docs: [{ title: 'Apple 开发者文档（Swift 与 iOS SDK）', url: 'https://developer.apple.com/documentation/', source: '官方文档' }],
  },
  'Android开发工程师': {
    books: [{ title: 'Android开发艺术探索', author: '任玉刚', why: '国内 Android 进阶经典，讲清视图与系统机制' }],
  },
  'Flutter开发工程师': {
    docs: [{ title: 'Flutter 官方文档', url: 'https://docs.flutter.dev/', source: '官方文档' }],
  },
  'React Native开发工程师': {
    docs: [{ title: 'React Native 官方文档', url: 'https://reactnative.dev/docs/getting-started', source: '官方文档' }],
  },
  'Electron桌面应用开发': {
    docs: [{ title: 'Electron 官方文档', url: 'https://www.electronjs.org/docs/latest', source: '官方文档' }],
  },
  'WebAssembly工程师': {
    docs: [
      { title: 'MDN WebAssembly 指南（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/WebAssembly', source: '官方文档' },
      { title: 'WebAssembly 官网', url: 'https://webassembly.org/', source: '官方文档' },
    ],
  },
  'GraphQL工程师': {
    docs: [{ title: 'GraphQL 官方学习文档', url: 'https://graphql.org/learn/', source: '官方文档' }],
  },
  'gRPC工程师': {
    docs: [{ title: 'gRPC 官方文档', url: 'https://grpc.io/docs/', source: '官方文档' }],
  },
  'PHP开发工程师': {
    docs: [{ title: 'PHP 官方文档', url: 'https://www.php.net/docs.php', source: '官方文档' }],
  },
  'Web3开发者': {
    docs: [{ title: 'Solidity 官方文档', url: 'https://docs.soliditylang.org/en/latest/', source: '官方文档' }],
    books: [{ title: '精通以太坊（Mastering Ethereum）', author: 'Andreas M. Antonopoulos、Gavin Wood', why: '以太坊与智能合约原理讲透，Web3 开发入门必读' }],
  },
  '初级前端开发工程师': {
    docs: [{ title: 'MDN Web 开发学习区（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Learn_web_development', source: '官方文档' }],
  },
  '高级前端开发工程师': {
    docs: [{ title: 'MDN JavaScript 指南（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript', source: '官方文档' }],
  },
  '初级后端开发工程师': {
    docs: [{ title: 'PostgreSQL 官方文档', url: 'https://www.postgresql.org/docs/current/', source: '官方文档' }],
  },
  '高级后端开发工程师': {
    docs: [{ title: 'PostgreSQL 官方文档', url: 'https://www.postgresql.org/docs/current/', source: '官方文档' }],
  },
  '初级全栈开发工程师': {
    docs: [{ title: 'MDN Web 开发学习区（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Learn_web_development', source: '官方文档' }],
  },
  '高级全栈开发工程师': {
    docs: [{ title: 'MDN Web 开发学习区（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Learn_web_development', source: '官方文档' }],
  },
  '初级DevOps工程师': {
    docs: [
      { title: 'Kubernetes 官方教程', url: 'https://kubernetes.io/docs/tutorials/', source: '官方文档' },
    ],
  },
  '高级DevOps工程师': {
    docs: [
      { title: 'Kubernetes 官方教程', url: 'https://kubernetes.io/docs/tutorials/', source: '官方文档' },
      { title: 'Jenkins 官方文档', url: 'https://www.jenkins.io/doc/', source: '官方文档' },
    ],
  },
  '初级云架构师': {
    docs: [{ title: 'AWS 官方文档总入口', url: 'https://docs.aws.amazon.com/', source: 'AWS 官方' }],
  },
  '高级云架构师': {
    docs: [{ title: 'Azure 云架构中心', url: 'https://learn.microsoft.com/en-us/azure/architecture/', source: '官方文档' }],
  },
  '初级网络安全专家': {
    docs: [{ title: 'OWASP Top 10（Web 十大安全风险）', url: 'https://owasp.org/www-project-top-ten/', source: 'OWASP' }],
  },
  '高级网络安全专家': {
    docs: [{ title: 'OWASP Top 10（Web 十大安全风险）', url: 'https://owasp.org/www-project-top-ten/', source: 'OWASP' }],
  },
  '初级产品经理': {
    books: [{ title: '启示录：打造用户喜爱的产品', author: 'Marty Cagan', why: '硅谷产品管理经典，讲透产品发现与团队方法' }],
  },
  '高级产品经理': {
    books: [{ title: '启示录：打造用户喜爱的产品', author: 'Marty Cagan', why: '讲透产品发现与团队方法，进阶产品管理必读' }],
  },
};
