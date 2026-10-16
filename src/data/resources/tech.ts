import type { CareerResourceSet } from '../career-resources';

export const techResources: Record<string, CareerResourceSet> = {
  '软件架构师': {
    videos: [
      { title: 'Spring Cloud 组件链路解析', url: 'https://www.bilibili.com/video/BV1Bopg6WEfg', source: 'B站公开课', note: '微服务组件的架构视角' },
    ],
    docs: [
      { title: 'Stack Overflow · 软件架构 标签', url: 'https://stackoverflow.com/questions/tagged/architecture', source: '技术社区', note: '架构设计问答', kind: 'community' },{ title: 'Martin Fowler 网站（架构模式与重构文章）', url: 'https://martinfowler.com/', source: '行业专家' }],
    books: [
      { title: '架构整洁之道', author: 'Robert Martin', why: '架构原则集大成' },
      { title: '从零开始学架构', author: '李运华', why: '中文架构实践' },{ title: '架构整洁之道', author: 'Robert C. Martin', why: '从设计原则到系统结构，建立架构思维的基础' }],
  },
  '微服务架构师': {
    videos: [
      { title: 'pig4cloud 微服务入门教程', url: 'https://www.bilibili.com/video/BV12t411B7e9', source: 'B站公开课', note: '国内开源微服务框架实战' },
    ],
    docs: [
      { title: 'Stack Overflow · 微服务 标签', url: 'https://stackoverflow.com/questions/tagged/microservices', source: '技术社区', note: '微服务问答', kind: 'community' },{ title: 'microservices.io（微服务模式目录）', url: 'https://microservices.io/', source: '行业专家', note: 'Chris Richardson 维护的模式站点' }],
    books: [
      { title: '微服务设计', author: 'Sam Newman', why: '微服务奠基之作' },
      { title: '凤凰架构', author: '周志明', why: '中文微服务原创' },{ title: '微服务设计', author: 'Sam Newman', why: '系统讲解微服务拆分、通信与部署的实践经典' }],
  },
  '云原生工程师': {
    videos: [
      { title: '深度体验无服务架构 Serverless', url: 'https://www.bilibili.com/video/BV1fK4y1P76C', source: 'B站公开课', note: '云原生进阶形态实战' },
    ],
    docs: [
      { title: 'reddit · r/kubernetes', url: 'https://www.reddit.com/r/kubernetes/', source: '技术社区', note: 'K8s 社区', kind: 'community' },
      { title: 'Kubernetes 官方概念文档', url: 'https://kubernetes.io/docs/concepts/', source: '官方文档' },
      { title: 'CNCF 云原生计算基金会官网', url: 'https://www.cncf.io/', source: '行业组织' },
    ],
    books: [
      { title: 'Kubernetes权威指南', author: '龚正', why: '国内 K8s 百科' },
      { title: '凤凰架构', author: '周志明', why: '云原生方法论' },{ title: 'Kubernetes in Action（中文版：Kubernetes 实战）', author: 'Marko Lukša', why: '从容器到集群编排，逐步讲透云原生核心概念' }],
  },
  'Serverless架构师': {
    books: [
      { title: '凤凰架构', author: '周志明', why: '不可变基础设施思想' },
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '云服务数据理论' },
    ],
    videos: [
      { title: '深度体验无服务架构 Serverless', url: 'https://www.bilibili.com/video/BV1fK4y1P76C', source: 'B站公开课', note: '无服务架构原理实战' },
    ],
    docs: [
      { title: 'Stack Overflow · Serverless 标签', url: 'https://stackoverflow.com/questions/tagged/serverless', source: '技术社区', note: '无服务问答', kind: 'community' },
      { title: 'AWS 官方文档总入口', url: 'https://docs.aws.amazon.com/', source: 'AWS 官方' },
      { title: 'Azure 云架构中心', url: 'https://learn.microsoft.com/en-us/azure/architecture/', source: '官方文档' },
    ],
  },
  'API网关架构师': {
    books: [
      { title: '微服务设计', author: 'Sam Newman', why: '网关模式出处' },
      { title: '凤凰架构', author: '周志明', why: '服务网关中文原创' },
    ],
    videos: [
      { title: '【狂神说】Nginx 最新教程', url: 'https://www.bilibili.com/video/BV1F5411J7vK', source: 'B站公开课', note: '网关反代与流量调度底座' },
    ],
    docs: [
      { title: 'Stack Overflow · API 网关 标签', url: 'https://stackoverflow.com/questions/tagged/api-gateway', source: '技术社区', note: '网关设计问答', kind: 'community' },
      { title: 'Envoy 官方文档', url: 'https://www.envoyproxy.io/docs/envoy/latest/', source: '官方文档' },
      { title: 'Istio 官方文档', url: 'https://istio.io/latest/docs/', source: '官方文档' },
    ],
  },
  '前端架构师': {
    books: [
      { title: '前端架构：从入门到微前端', author: '齐翊', why: '中文前端架构书' },
      { title: '架构整洁之道', author: 'Robert Martin', why: '架构原则' },
    ],
    videos: [
      { title: '【Vue3极简2025版教程】', url: 'https://www.bilibili.com/video/BV13tjqzmEDZ', source: 'B站公开课', note: '现代前端框架架构视角' },
    ],
    docs: [
      { title: 'Stack Overflow · 前端 标签', url: 'https://stackoverflow.com/questions/tagged/frontend', source: '技术社区', note: '前端工程问答', kind: 'community' },
      { title: 'React 官方学习文档', url: 'https://react.dev/learn', source: '官方文档' },
      { title: 'MDN JavaScript 指南（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript', source: '官方文档' },
    ],
  },
  '技术文档工程师': {
    books: [
      { title: '风格的要素', author: 'William Strunk', why: '简明写作的百年经典' },
      { title: '金字塔原理', author: 'Barbara Minto', why: '结构化表达方法论' },
    ],
    videos: [
      { title: 'Google 技术写作课程', url: 'https://developers.google.com/tech-writing', source: 'B站公开课', note: '工程师写作方法论标杆（免费官方课）' },
    ],
    docs: [
      { title: 'Stack Overflow · 技术文档 标签', url: 'https://stackoverflow.com/questions/tagged/documentation', source: '技术社区', note: '文档工程问答', kind: 'community' },{ title: 'Write the Docs 技术写作社区', url: 'https://www.writethedocs.org/', source: '行业社区' }],
  },
  '消息队列专家': {
    videos: [
      { title: '【尚硅谷】Kafka3.x 教程', url: 'https://www.bilibili.com/video/BV1vr4y1677k', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'Stack Overflow · Kafka 标签', url: 'https://stackoverflow.com/questions/tagged/apache-kafka', source: '技术社区', note: '消息队列问答', kind: 'community' },
      { title: 'Apache Kafka 官方文档', url: 'https://kafka.apache.org/documentation/', source: '官方文档' },
      { title: 'RabbitMQ 官方文档', url: 'https://www.rabbitmq.com/documentation.html', source: '官方文档' },
    ],
    books: [
      { title: 'Kafka权威指南', author: 'Gwen Shapira', why: 'Kafka 圣经' },
      { title: 'RabbitMQ实战', author: 'Alvaro Videla', why: 'AMQP 经典' },{ title: 'Kafka权威指南', author: 'Neha Narkhede、Gwen Shapira、Todd Palino', why: '消息系统设计与运维的权威参考，原理与实践兼顾' }],
  },
  '搜索引擎工程师': {
    videos: [
      { title: '【尚硅谷】ElasticSearch 入门到精通', url: 'https://www.bilibili.com/video/BV1hh411D7sb', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'Stack Overflow · Elasticsearch 标签', url: 'https://stackoverflow.com/questions/tagged/elasticsearch', source: '技术社区', note: '搜索问答', kind: 'community' },{ title: 'Elastic 官方文档总入口', url: 'https://www.elastic.co/guide/index.html', source: '官方文档' }],
    books: [
      { title: 'Elasticsearch权威指南', author: 'Clinton Gormley', why: '官方指南' },
      { title: '这就是搜索引擎', author: '张俊林', why: '搜索原理经典' },{ title: 'Elasticsearch权威指南', author: 'Clinton Gormley、Zachary Tong', why: '从索引到分布式检索的系统讲解，搜索工程师入门首选' }],
  },
  '负载均衡专家': {
    books: [
      { title: 'HTTP权威指南', author: 'David Gourley', why: '代理与缓存圣经' },
      { title: '深入理解Nginx', author: '陶辉', why: '国内 Nginx 权威' },
    ],
    videos: [
      { title: '【狂神说】Nginx 最新教程', url: 'https://www.bilibili.com/video/BV1F5411J7vK', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'Stack Overflow · 负载均衡 标签', url: 'https://stackoverflow.com/questions/tagged/load-balancing', source: '技术社区', note: '流量调度问答', kind: 'community' },{ title: 'Nginx 官方文档', url: 'https://nginx.org/en/docs/', source: '官方文档' }],
  },
  '监控系统工程师': {
    books: [
      { title: 'SRE：Google运维解密', author: 'Google SRE 团队', why: '监控原则' },
      { title: '性能之巅', author: 'Brendan Gregg', why: '性能分析' },
    ],
    videos: [
      { title: '【尚硅谷】Prometheus+Grafana 监控告警', url: 'https://www.bilibili.com/video/BV1HT4y1Z7vR', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'Stack Overflow · Prometheus 标签', url: 'https://stackoverflow.com/questions/tagged/prometheus', source: '技术社区', note: '监控问答', kind: 'community' },
      { title: 'Prometheus 官方文档：概览', url: 'https://prometheus.io/docs/introduction/overview/', source: '官方文档' },
      { title: 'Grafana 官方文档', url: 'https://grafana.com/docs/', source: '官方文档' },
    ],
  },
  '日志系统工程师': {
    books: [
      { title: 'Elasticsearch权威指南', author: 'Clinton Gormley', why: 'ELK 核心' },
      { title: 'Kafka权威指南', author: 'Gwen Shapira', why: '日志管道' },
    ],
    videos: [
      { title: 'ElasticStack ELK 全栈实战（老男孩）', url: 'https://www.bilibili.com/video/BV13F3y63En1', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'Stack Overflow · 日志收集 标签', url: 'https://stackoverflow.com/questions/tagged/logstash', source: '技术社区', note: 'ELK 问答', kind: 'community' },{ title: 'Elastic 官方文档总入口', url: 'https://www.elastic.co/guide/index.html', source: '官方文档' }],
  },
  '配置管理工程师': {
    books: [
      { title: 'Pro Git', author: 'Scott Chacon', why: '官方免费书' },
      { title: '持续交付', author: 'Jez Humble', why: '配置管理方法论' },
    ],
    videos: [
      { title: '【狂神说Java】Git 最新教程', url: 'https://www.bilibili.com/video/BV1FE411P7B3', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'Stack Overflow · Git 标签', url: 'https://stackoverflow.com/questions/tagged/git', source: '技术社区', note: '版本控制问答', kind: 'community' },{ title: 'HashiCorp Terraform 官方文档', url: 'https://developer.hashicorp.com/terraform/docs', source: '官方文档' }],
  },
  '持续集成工程师': {
    videos: [
      { title: 'Jenkins 全套教程（乐字节）', url: 'https://www.bilibili.com/video/BV11B4y1W7eH', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'Stack Overflow · 持续集成 标签', url: 'https://stackoverflow.com/questions/tagged/continuous-integration', source: '技术社区', note: 'CI 问答', kind: 'community' },
      { title: 'Jenkins 官方文档', url: 'https://www.jenkins.io/doc/', source: '官方文档' },
      { title: 'GitHub Actions 入门指南', url: 'https://docs.github.com/en/actions/get-started', source: '官方文档' },
    ],
    books: [
      { title: '持续交付', author: 'Jez Humble', why: 'CI 圣经' },
      { title: '加速', author: 'Nicole Forsgren', why: '效能科学' },{ title: '持续交付', author: 'Jez Humble、David Farley', why: '持续集成与部署流水线的经典方法论' }],
  },
  '代码质量工程师': {
    books: [
      { title: '代码整洁之道', author: 'Robert Martin', why: '质量标准' },
      { title: '重构', author: 'Martin Fowler', why: '质量改善圣经' },
    ],
    videos: [
      { title: 'SonarQube 静态代码扫描', url: 'https://www.bilibili.com/video/BV1ym4y1F7Tu', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'Stack Overflow · SonarQube 标签', url: 'https://stackoverflow.com/questions/tagged/sonarqube', source: '技术社区', note: '质量工具问答', kind: 'community' },{ title: 'SonarQube 官方文档', url: 'https://docs.sonarsource.com/sonarqube/latest/', source: '官方文档' }],
  },
  'DevSecOps工程师': {
    books: [
      { title: '白帽子讲Web安全', author: '吴翰清', why: '安全思维总纲' },
      { title: '持续交付', author: 'Jez Humble', why: '流水线内建安全' },
    ],
    videos: [
      { title: '8分钟认识 DevSecOps（华为云）', url: 'https://www.bilibili.com/video/BV19z4y1Q7JU', source: 'B站公开课', note: '安全左移理念总览' },
    ],
    docs: [
      { title: 'Stack Overflow · DevSecOps 标签', url: 'https://stackoverflow.com/questions/tagged/devsecops', source: '技术社区', note: '安全开发问答', kind: 'community' },{ title: 'OWASP DevSecOps 指南', url: 'https://owasp.org/www-project-devsecops-guideline/', source: 'OWASP' }],
  },
  '网络安全渗透测试工程师': {
    videos: [
      { title: '渗透测试基础教程（隐雾SEC）', url: 'https://www.bilibili.com/video/BV11S4y1t74P', source: 'B站公开课', note: '渗透流程与靶场实操' },
    ],
    docs: [
      { title: 'Stack Overflow · 渗透测试 标签', url: 'https://stackoverflow.com/questions/tagged/penetration-testing', source: '技术社区', note: '渗透问答', kind: 'community' },{ title: 'OWASP Top 10（Web 十大安全风险）', url: 'https://owasp.org/www-project-top-ten/', source: 'OWASP' }],
    books: [
      { title: 'Metasploit渗透测试指南', author: 'David Kennedy', why: '渗透框架经典' },
      { title: '白帽子讲Web安全', author: '吴翰清', why: '安全体系总纲' },{ title: 'Web应用黑客攻防（The Web Application Hacker\'s Handbook）', author: 'Dafydd Stuttard、Marcus Pinto', why: 'Web 渗透测试的标准实战手册，攻防思路完整' }],
  },
  '数据治理工程师': {
    videos: [
      { title: '数据治理基础知识分享', url: 'https://www.bilibili.com/video/BV1Kr6mYQECU', source: 'B站公开课', note: '数据治理框架入门' },
    ],
    docs: [
      { title: 'Stack Overflow · 数据治理 标签', url: 'https://stackoverflow.com/questions/tagged/data-governance', source: '技术社区', note: '治理问答', kind: 'community' },{ title: 'DAMA 国际数据管理协会官网', url: 'https://www.dama.org/', source: '行业协会' }],
    books: [
      { title: 'DAMA数据管理知识体系指南', author: 'DAMA International', why: '数据治理国际标准' },
      { title: '数据仓库工具箱', author: 'Ralph Kimball', why: '治理与建模基础' },{ title: 'DAMA-DMBOK 数据管理知识体系指南', author: 'DAMA International', why: '数据治理领域的通用知识体系，理论框架完整' }],
  },
  '数仓工程师': {
    videos: [
      { title: '数据仓库原理与实战（哈喽鹏程）', url: 'https://www.bilibili.com/video/BV1qv411y7Wv', source: 'B站公开课', note: '维度建模与分层实战' },
    ],
    docs: [
      { title: 'Stack Overflow · 数据仓库 标签', url: 'https://stackoverflow.com/questions/tagged/data-warehouse', source: '技术社区', note: '数仓问答', kind: 'community' },{ title: 'dbt 官方文档', url: 'https://docs.getdbt.com/docs/introduction', source: '官方文档' }],
    books: [
      { title: '数据仓库工具箱', author: 'Ralph Kimball', why: '维度建模圣经' },
      { title: 'Hive编程指南', author: 'Edward Capriolo', why: '数仓核心工具' },{ title: '数据仓库工具箱（第3版）', author: 'Ralph Kimball、Margy Ross', why: '维度建模的经典教材，数仓设计的必读书' }],
  },
  '数据湖工程师': {
    books: [
      { title: 'HBase权威指南', author: 'Lars George', why: '列存与湖存储参考' },
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '存储系统理论' },
    ],
    videos: [
      { title: '尚硅谷大数据 Flink1.17 实战', url: 'https://www.bilibili.com/video/BV1eg4y1V7AN', source: 'B站公开课', note: '湖仓一体的计算引擎' },
    ],
    docs: [
      { title: 'Stack Overflow · 数据湖 标签', url: 'https://stackoverflow.com/questions/tagged/data-lake', source: '技术社区', note: '数据湖问答', kind: 'community' },{ title: 'Databricks 官方文档', url: 'https://docs.databricks.com/', source: '官方文档' }],
  },
  '流计算工程师': {
    videos: [
      { title: '尚硅谷大数据 Flink1.17 实战', url: 'https://www.bilibili.com/video/BV1eg4y1V7AN', source: 'B站公开课', note: '流计算引擎标准课' },
    ],
    docs: [
      { title: 'Stack Overflow · Flink 标签', url: 'https://stackoverflow.com/questions/tagged/apache-flink', source: '技术社区', note: '流计算问答', kind: 'community' },{ title: 'Apache Flink 官网与文档', url: 'https://flink.apache.org/', source: '官方文档' }],
    books: [
      { title: 'Kafka权威指南', author: 'Gwen Shapira', why: '流数据管道标配' },
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '流系统理论' },{ title: 'Streaming Systems（流式系统）', author: 'Tyler Akidau、Slava Chernyak、Reuven Lax', why: '流处理语义与时间模型的权威讲解' }],
  },
  '数据库性能优化工程师': {
    videos: [
      { title: 'ElasticSearch 入门到精通（尚硅谷）', url: 'https://www.bilibili.com/video/BV1hh411D7sb', source: 'B站公开课', note: '大规模检索集群调优视角' }
    ],
    docs: [
      { title: '数据库与数据挖掘（南京邮电大学）', url: 'https://www.chinaooc.com.cn/course/68ac3bb2d5f9b8b6cf61fa39', source: '国家高等教育智慧教育平台', note: '数据库设计与调优技巧' },

      { title: 'Stack Overflow · 查询优化 标签', url: 'https://stackoverflow.com/questions/tagged/query-optimization', source: '技术社区', note: '数据库调优问答', kind: 'community' }
    ],
    books: [
      { title: '高性能MySQL（第4版）', author: 'Baron Schwartz', why: '调优方法论' },
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '存储引擎原理' },{ title: '高性能MySQL（第4版）', author: 'Silvia Botros、Jeremy Tinley 等', why: '索引、查询与架构优化的经典实战手册' }],
  },
  '数据库运维DBA': {
    videos: [
      { title: 'ElasticSearch 入门到精通（尚硅谷）', url: 'https://www.bilibili.com/video/BV1hh411D7sb', source: 'B站公开课', note: '集群运维视角的存储课' }
    ],
    docs: [
      { title: 'Stack Overflow · DBA 标签', url: 'https://stackoverflow.com/questions/tagged/database-administration', source: '技术社区', note: '数据库管理问答', kind: 'community' },

      { title: 'MongoDB 官方文档', url: 'https://www.mongodb.com/docs/', source: '官方文档' },
      { title: 'Redis 官方文档', url: 'https://redis.io/docs/latest/', source: '官方文档' }
    ],
    books: [
      { title: '高性能MySQL（第4版）', author: 'Baron Schwartz', why: 'DBA 圣经' },
      { title: 'MySQL技术内幕：InnoDB存储引擎', author: '姜承尧', why: '国内 InnoDB 权威' },{ title: '高性能MySQL（第4版）', author: 'Silvia Botros、Jeremy Tinley 等', why: 'MySQL 运维与调优的经典参考' }],
  },
  'GIS开发工程师': {
    books: [
      { title: '地理信息系统导论', author: 'Kang-tsung Chang', why: 'GIS 体系化教材' },
      { title: 'PostGIS实战', author: 'Regina Obe', why: '空间数据库实践书' },
    ],
    videos: [
      { title: 'WebGIS 开发入门基础教程（GIS叮当）', url: 'https://www.bilibili.com/video/BV1SC4y1Q7im', source: 'B站公开课', note: '面向地信专业的 WebGIS 实战' },
    ],
    docs: [
      { title: 'Stack Overflow · GIS 标签', url: 'https://stackoverflow.com/questions/tagged/gis', source: '技术社区', note: 'GIS 开发问答', kind: 'community' },
      { title: 'PostGIS 官方文档', url: 'https://postgis.net/documentation/', source: '官方文档' },
      { title: 'GDAL 官网', url: 'https://gdal.org/', source: '开源项目' },
      { title: 'QGIS 官网', url: 'https://www.qgis.org/', source: '开源项目' },
    ],
  },
  'BI工程师': {
    books: [
      { title: '精益数据分析', author: 'Alistair Croll', why: '指标体系设计经典' },
      { title: '数据仓库工具箱', author: 'Thomas Kimball', why: '维度建模圣经' },
    ],
    videos: [
      { title: 'PowerBI 入门到实战教程', url: 'https://www.bilibili.com/video/BV11ezsBCE58', source: 'B站公开课', note: '主流 BI 工具实操' },
    ],
    docs: [
      { title: 'Stack Overflow · Power BI 标签', url: 'https://stackoverflow.com/questions/tagged/powerbi', source: '技术社区', note: 'BI 工具问答', kind: 'community' },{ title: 'Power BI 官方文档', url: 'https://learn.microsoft.com/en-us/power-bi/', source: '官方文档' }],
  },
  'RPA开发工程师': {
    books: [
      { title: '卓有成效的工程师', author: 'Edmond Lau', why: '自动化效率思维' },
      { title: '重来', author: 'Jason Fried', why: '小团队业务改造方法论' },
    ],
    videos: [
      { title: 'Power Automate Desktop 中文教程（微软 RPA）', url: 'https://www.bilibili.com/video/BV1au41167cR', source: 'B站公开课', note: '微软官方 RPA 工具实操' },
    ],
    docs: [
      { title: 'Stack Overflow · RPA 标签', url: 'https://stackoverflow.com/questions/tagged/rpa', source: '技术社区', note: '流程自动化问答', kind: 'community' },{ title: 'UiPath 官方文档', url: 'https://docs.uipath.com/', source: '官方文档' }],
  },
  '操作系统开发工程师': {
    docs: [
      { title: 'Stack Overflow · 操作系统 标签', url: 'https://stackoverflow.com/questions/tagged/operating-system', source: '技术社区', note: 'OS 开发问答', kind: 'community' },{ title: 'Linux 内核官方文档', url: 'https://www.kernel.org/doc/', source: '官方文档' }],
    videos: [
      { title: '操作系统导论 OSTEP（官方免费书与课程）', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', source: 'B站公开课', note: '操作系统最佳免费教材' },{ title: 'MIT 6.828 操作系统工程（课程主页含讲义与实验）', url: 'https://pdos.csail.mit.edu/6.828/', source: 'MIT', note: '动手写操作系统内核的经典课程' }],
    books: [
      { title: '操作系统导论', author: 'Remzi Arpaci-Dusseau', why: 'OSTEP 中文版' },
      { title: '深入理解计算机系统', author: 'Randal Bryant', why: 'CSAPP 神书' },{ title: '操作系统导论（Operating Systems: Three Easy Pieces）', author: 'Remzi H. Arpaci-Dusseau、Andrea C. Arpaci-Dusseau', why: '免费在线的操作系统入门教材，原理讲解清晰' }],
  },
  'FPGA工程师': {
    books: [
      { title: 'Verilog数字系统设计教程', author: '夏宇闻', why: '国内 Verilog 经典教材' },
      { title: '数字设计和计算机体系结构', author: 'David Harris', why: '数字系统底层逻辑' },
    ],
    videos: [
      { title: '小梅哥 Xilinx FPGA 基础入门到项目应用', url: 'https://www.bilibili.com/video/BV1va411c7Dz', source: 'B站公开课', note: '国内 FPGA 教学标杆' },
    ],
    docs: [
      { title: 'Stack Overflow · FPGA 标签', url: 'https://stackoverflow.com/questions/tagged/fpga', source: '技术社区', note: 'FPGA 开发问答', kind: 'community' },{ title: 'AMD 官方文档（含 Vivado / Vitis 工具）', url: 'https://docs.amd.com/', source: '官方文档' }],
  },
  '量子软件工程师': {
    videos: [
      { title: '【完结】大一新生也能懂的量子计算', url: 'https://www.bilibili.com/video/BV1oq4y1j7iZ', source: 'B站公开课', note: '量子计算友好入门' },
    ],
    docs: [
      { title: 'Stack Overflow · 量子计算 标签', url: 'https://stackoverflow.com/questions/tagged/quantum-computing', source: '技术社区', note: '量子问答', kind: 'community' },{ title: 'Qiskit 官方文档', url: 'https://qiskit.org/documentation/', source: '官方文档' }],
    books: [
      { title: '量子计算与量子信息', author: 'Michael Nielsen', why: '量子计算圣经' },
      { title: '量子计算公开课', author: 'David Mermin', why: '量子计算经典讲义' },{ title: '量子计算与量子信息', author: 'Michael A. Nielsen、Isaac L. Chuang', why: '量子计算领域的标准教材，软件开发者的理论底座' }],
  },
  '自动化测试架构师': {
    books: [
      { title: 'Google软件测试之道', author: 'James Whittaker', why: '大厂测试体系' },
      { title: '持续交付', author: 'Jez Humble', why: '流水线测试' },
    ],
    videos: [
      { title: 'Python 自动化测试全套教程', url: 'https://www.bilibili.com/video/BV1MekeBjEN9', source: 'B站公开课', note: '自动化测试体系课' },
    ],
    docs: [
      { title: 'Stack Overflow · 自动化测试 标签', url: 'https://stackoverflow.com/questions/tagged/automated-tests', source: '技术社区', note: '测试问答', kind: 'community' },{ title: 'Selenium 官方文档', url: 'https://www.selenium.dev/documentation/', source: '官方文档' }],
  },
  '大模型训练工程师': {
    videos: [
      { title: '手把手教你大模型训练与部署', url: 'https://www.bilibili.com/video/BV13f9pBSETe', source: 'B站公开课', note: '从 GPU 配置到训练落地' },
    ],
    docs: [
      { title: 'reddit · r/deeplearning', url: 'https://www.reddit.com/r/deeplearning/', source: '技术社区', note: '深度学习训练社区', kind: 'community' },{ title: 'Hugging Face 中文文档', url: 'https://huggingface.co/docs/transformers/zh/index', source: '官方文档' }],
    books: [
      { title: '深度学习（花书）', author: 'Ian Goodfellow', why: '训练理论全书' },
      { title: '大规模语言模型：从理论到实践', author: '张奇 等', why: '中文 LLM 训练专著' },{ title: '动手学深度学习', author: '李沐、Aston Zhang 等', why: '边读边写代码的深度学习实践教材，训练工程入门' }],
  },
  '多模态AI工程师': {
    videos: [
      { title: '多模态大模型教程（LLM+SAM+CLIP）', url: 'https://www.bilibili.com/video/BV1E9U8BBEvZ', source: 'B站公开课', note: '多模态系统课' },
    ],
    docs: [
      { title: 'Stack Overflow · 计算机视觉 标签', url: 'https://stackoverflow.com/questions/tagged/computer-vision', source: '技术社区', note: '多模态感知问答', kind: 'community' },{ title: 'Papers with Code', url: 'https://paperswithcode.com/', source: '官方文档', note: '论文与开源实现对照库' }],
    books: [
      { title: '深度学习（花书）', author: 'Ian Goodfellow', why: '多模态理论' },
      { title: '视觉SLAM十四讲', author: '高翔', why: '多传感器融合' },{ title: '动手学深度学习', author: '李沐、Aston Zhang 等', why: '深度学习从基础到模型实现的系统实践教材' }],
  },
  'AIGC工程师': {
    books: [
      { title: 'Python深度学习', author: 'François Chollet', why: '生成模型实践' },
      { title: '这就是ChatGPT', author: 'Stephen Wolfram', why: 'LLM 原理通俗读本' },
    ],
    videos: [
      { title: 'AIGC 从零基础到精通', url: 'https://www.bilibili.com/video/BV1bHER6pEdD', source: 'B站公开课', note: '生成式 AI 应用系统课' },
    ],
    docs: [
      { title: 'reddit · r/StableDiffusion', url: 'https://www.reddit.com/r/StableDiffusion/', source: '技术社区', note: '生成图像社区', kind: 'community' },{ title: 'DeepLearning.AI 课程平台', url: 'https://www.deeplearning.ai/', source: '官方平台' }],
  },
  '提示词工程师': {
    books: [
      { title: '这就是ChatGPT', author: 'Stephen Wolfram', why: '理解模型才谈提示词' },
      { title: '深度学习进阶：自然语言处理', author: '斋藤康毅', why: '语言模型基础' },
    ],
    videos: [
      { title: '提示词工程（Prompt Engineering）系统课', url: 'https://www.bilibili.com/video/BV1VEA8zYE6f', source: 'B站公开课', note: '提示词方法论系统课' },
    ],
    docs: [
      { title: 'Stack Overflow · Prompt 工程 标签', url: 'https://stackoverflow.com/questions/tagged/prompt-engineering', source: '技术社区', note: '提示词问答', kind: 'community' },{ title: 'DeepLearning.AI 课程平台（含大模型应用课程）', url: 'https://www.deeplearning.ai/', source: '官方平台' }],
  },
  'MLOps工程师': {
    videos: [
      { title: '大语言模型基础：从零到一实现之路（南京大学）', url: 'https://www.bilibili.com/video/BV1EJH9zRE2p', source: 'B站公开课', note: 'ML 系统从训练到推理全链' },
    ],
    docs: [
      { title: 'reddit · r/mlops', url: 'https://www.reddit.com/r/mlops/', source: '技术社区', note: 'MLOps 实践社区', kind: 'community' },
      { title: 'MLflow 官方文档', url: 'https://mlflow.org/docs/latest/index.html', source: '官方文档' },
      { title: 'Kubeflow 官方文档', url: 'https://kubeflow.org/docs/', source: '官方文档' },
    ],
    books: [
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: 'ML 系统数据底座' },
      { title: '机器学习工程', author: 'Andriy Burkov', why: 'ML 工程化手册' },{ title: 'Machine Learning Engineering（机器学习工程）', author: 'Andriy Burkov', why: '从数据到上线的机器学习工程全流程，MLOps 入门实用' }],
  },
  '开放银行架构师': {
    books: [
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '金融数据系统理论' },
      { title: '区块链：技术驱动金融', author: 'Melanie Swan', why: '新型清算网络视角' },
    ],
    videos: [
      { title: '数字经济支付（西南财经大学）', url: 'https://www.icourse163.org/course/-1450179236', source: 'B站公开课', note: '开放银行背后的支付清算体系' },
    ],
    docs: [
      { title: 'Stack Overflow · 开放银行 标签', url: 'https://stackoverflow.com/questions/tagged/open-banking', source: '技术社区', note: '开放银行标准讨论', kind: 'community' },{ title: 'Open Banking（英国开放银行标准组织）', url: 'https://www.openbanking.org.uk/', source: '行业组织' }],
  },
  '开源社区经理': {
    books: [
      { title: '大教堂与集市', author: 'Eric Raymond', why: '开源社区原典' },
      { title: '社区运营的艺术', author: 'Jono Bacon', why: '社区运营经典' },
    ],
    videos: [
      { title: 'GAMES101-现代计算机图形学入门（闫令琪）', url: 'https://www.bilibili.com/video/BV1X7411F744', source: 'B站公开课', note: '学术内容社区化运营标杆' },
    ],
    docs: [
      { title: 'reddit · r/opensource', url: 'https://www.reddit.com/r/opensource/', source: '技术社区', note: '开源讨论社区', kind: 'community' },
      { title: 'GitHub 开源指南：如何参与贡献', url: 'https://opensource.guide/how-to-contribute/', source: '官方文档' },
      { title: 'Linux 基金会资源库', url: 'https://www.linuxfoundation.org/resources', source: '行业组织' },
    ],
  },
  'Meta开源贡献者': {
    books: [
      { title: '大教堂与集市', author: 'Eric Raymond', why: '开源协作模式经典' },
      { title: '程序员修炼之道', author: 'Andrew Hunt', why: '贡献者职业操守' },
    ],
    videos: [
      { title: 'Rust 语言基础（清华大学训练营）', url: 'https://www.bilibili.com/video/BV1jo4y1Y7Ha', source: 'B站公开课', note: 'Meta 主导的开源生态语言' },
    ],
    docs: [
      { title: 'reddit · r/rust', url: 'https://www.reddit.com/r/rust/', source: '技术社区', note: 'Rust 开源社区', kind: 'community' },{ title: 'Meta 开源项目官网', url: 'https://opensource.fb.com/', source: '官方网站' }],
  },
  '初级AI研究员': {
    docs: [{ title: 'Hugging Face 中文文档', url: 'https://huggingface.co/docs/transformers/zh/index', source: '官方文档' }, { title: 'reddit · r/datasets', url: 'https://www.reddit.com/r/datasets/', source: '行业社区', note: '数据与基准讨论社区', kind: 'community' }],
    books: [{ title: '深度学习', author: 'Ian Goodfellow、Yoshua Bengio、Aaron Courville', why: '深度学习理论的权威教材，研究入门必读' }, { title: '统计学习方法', author: '李航', why: '机器学习的数学基本功' }],
    videos: [
      { title: '李沐精读论文方法演示', url: 'https://www.bilibili.com/video/BV171stzXELd', source: 'Bilibili', note: '逐字解读经典论文的方法论' },
    ],
  },
  '高级AI研究员': {
    docs: [{ title: 'Hugging Face 中文文档', url: 'https://huggingface.co/docs/transformers/zh/index', source: '官方文档' }, { title: '机器之心', url: 'https://www.jiqizhixin.com/', source: '行业社区', note: 'AI 前沿论文与产业动态社区', kind: 'community' }],
    books: [{ title: '深度学习', author: 'Ian Goodfellow、Yoshua Bengio、Aaron Courville', why: '深度学习理论的权威教材，进阶研究的理论基础' }, { title: '强化学习导论', author: '理查德·萨顿', why: '序列决策研究主线' }],
    videos: [
      { title: '对话前 DeepMind 研究员：AI for Science 时代', url: 'https://www.bilibili.com/video/BV1GQgg6yEy5', source: 'Bilibili', note: '前沿研究者的真实视角' },
    ],
  },
  'iOS开发工程师': {
    books: [
      { title: 'iOS编程（第6版）', author: 'Aaron Hillegass', why: 'Big Nerd Ranch 经典' },
      { title: 'Objective-C高级编程', author: '坂本一树', why: '内存管理经典' },
    ],
    videos: [
      { title: '跟阿里程序员 Lebus 学 iOS 原生开发', url: 'https://www.bilibili.com/video/BV1Tt411a7Xa', source: 'B站公开课', note: 'iOS 原生开发教程' },
    ],
    docs: [
      { title: 'reddit · r/iOSProgramming', url: 'https://www.reddit.com/r/iOSProgramming/', source: '技术社区', note: 'iOS 社区', kind: 'community' },{ title: 'Apple 开发者文档（Swift 与 iOS SDK）', url: 'https://developer.apple.com/documentation/', source: '官方文档' }],
  },
  'Android开发工程师': {
    docs: [
      { title: 'reddit · r/androiddev', url: 'https://www.reddit.com/r/androiddev/', source: '技术社区', note: '安卓社区', kind: 'community' },
      { title: 'Android应用开发（MOOC，基于Android 10）', url: 'https://www.icourse163.org/course/detail.htm?cid=1003544022', source: '中国大学MOOC', note: '开发环境、UI控件、蓝牙与Socket通信' },
    ],
    videos: [
      { title: 'Android 移动应用开发（国家在线精品课程）', url: 'https://www.icourse163.org/course/detail.htm?cid=1206134802', source: 'B站公开课', note: 'Android 系统课' },
    ],
    books: [
      { title: '第一行代码：Android', author: '郭霖', why: '安卓入门常青树' },
      { title: 'Android开发艺术探索', author: '任玉刚', why: '国内 Android 进阶经典，讲清视图与系统机制' },
    ],
  },
  'Flutter开发工程师': {
    books: [
      { title: 'Flutter实战', author: '杜文', why: '开源中文进阶书' },
      { title: 'Flutter技术解析与实战', author: '闲鱼技术团队', why: '国内实战书' },
    ],
    videos: [
      { title: '黑马程序员 Flutter 从入门到实战', url: 'https://www.bilibili.com/video/BV1wR4Xz6EqG', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'reddit · r/flutterdev', url: 'https://www.reddit.com/r/flutterdev/', source: '技术社区', note: 'Flutter 社区', kind: 'community' },{ title: 'Flutter 官方文档', url: 'https://docs.flutter.dev/', source: '官方文档' }],
  },
  'React Native开发工程师': {
    books: [
      { title: 'React学习手册', author: 'Alex Banks', why: '组件与 hooks' },
      { title: 'JavaScript设计模式与开发实践', author: '曾探', why: '前端工程功底' },
    ],
    videos: [
      { title: '2026 React Native + Expo 零基础到实战', url: 'https://www.bilibili.com/video/BV12gYxz7Ews', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'reddit · r/ReactNative', url: 'https://www.reddit.com/r/ReactNative/', source: '技术社区', note: 'RN 社区', kind: 'community' },{ title: 'React Native 官方文档', url: 'https://reactnative.dev/docs/getting-started', source: '官方文档' }],
  },
  'Electron桌面应用开发': {
    books: [
      { title: 'Electron实战：入门、进阶与性能优化', author: '刘晓伦', why: '中文 Electron 专著' },
      { title: 'Node.js设计模式', author: 'Mario Casciaro', why: 'Electron 底座' },
    ],
    videos: [
      { title: '一小时快速上手 Electron（尚硅谷）', url: 'https://www.bilibili.com/video/BV1sE421N7M5', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'reddit · r/javascript', url: 'https://www.reddit.com/r/javascript/', source: '技术社区', note: 'JS 大社区', kind: 'community' },{ title: 'Electron 官方文档', url: 'https://www.electronjs.org/docs/latest', source: '官方文档' }],
  },
  'WebAssembly工程师': {
    books: [
      { title: 'WebAssembly实战', author: 'Gerard Gallant', why: 'Wasm 实战书' },
      { title: 'C++ Primer', author: 'Stanley Lippman', why: 'Wasm 源语言功底' },
    ],
    videos: [
      { title: 'WebAssembly 入门教程', url: 'https://www.bilibili.com/video/BV13i4y1n74s', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'Stack Overflow · WebAssembly 标签', url: 'https://stackoverflow.com/questions/tagged/webassembly', source: '技术社区', note: 'Wasm 问答', kind: 'community' },
      { title: 'MDN WebAssembly 指南（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/WebAssembly', source: '官方文档' },
      { title: 'WebAssembly 官网', url: 'https://webassembly.org/', source: '官方文档' },
    ],
  },
  'GraphQL工程师': {
    books: [
      { title: 'Learning GraphQL', author: 'Eve Porcello', why: 'GraphQL 专著' },
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: 'API 数据层' },
    ],
    videos: [
      { title: '【千锋】GraphQL 详细教程', url: 'https://www.bilibili.com/video/BV1EE411e7zB', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'Stack Overflow · GraphQL 标签', url: 'https://stackoverflow.com/questions/tagged/graphql', source: '技术社区', note: 'GraphQL 问答', kind: 'community' },{ title: 'GraphQL 官方学习文档', url: 'https://graphql.org/learn/', source: '官方文档' }],
  },
  'gRPC工程师': {
    books: [
      { title: 'gRPC: Up and Running', author: 'Kasun Indrasiri', why: 'gRPC 专著' },
      { title: '微服务设计', author: 'Sam Newman', why: 'RPC 场景' },
    ],
    videos: [
      { title: 'gRPC 快速入门实战', url: 'https://www.bilibili.com/video/BV1Ah4y1S7NX', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'Stack Overflow · gRPC 标签', url: 'https://stackoverflow.com/questions/tagged/grpc', source: '技术社区', note: 'gRPC 问答', kind: 'community' },{ title: 'gRPC 官方文档', url: 'https://grpc.io/docs/', source: '官方文档' }],
  },
  'PHP开发工程师': {
    books: [
      { title: 'PHP和MySQL Web开发', author: 'Luke Welling', why: 'PHP 经典搭配教材' },
      { title: '代码整洁之道', author: 'Robert Martin', why: '工程质量底线' },
    ],
    videos: [
      { title: '黑马程序员 PHP 零基础入门到精通', url: 'https://www.bilibili.com/video/BV18x411H7qD', source: 'B站公开课', note: 'PHP 语言系统课' },
    ],
    docs: [
      { title: 'Stack Overflow · PHP 标签', url: 'https://stackoverflow.com/questions/tagged/php', source: '技术社区', note: 'PHP 问答', kind: 'community' },{ title: 'PHP 官方文档', url: 'https://www.php.net/docs.php', source: '官方文档' }],
  },
  'Web3开发者': {
    videos: [
      { title: '2小时学会区块链', url: 'https://www.bilibili.com/video/BV1gt411T7Tq', source: 'B站公开课', note: '区块链原理速成' },
    ],
    docs: [
      { title: 'Stack Overflow · 区块链 标签', url: 'https://stackoverflow.com/questions/tagged/blockchain', source: '技术社区', note: 'Web3 问答', kind: 'community' },{ title: 'Solidity 官方文档', url: 'https://docs.soliditylang.org/en/latest/', source: '官方文档' }],
    books: [
      { title: '精通以太坊', author: 'Andreas Antonopoulos', why: '以太坊权威' },
      { title: '区块链：技术驱动金融', author: 'Melanie Swan', why: '产业视角' },{ title: '精通以太坊（Mastering Ethereum）', author: 'Andreas M. Antonopoulos、Gavin Wood', why: '以太坊与智能合约原理讲透，Web3 开发入门必读' }],
  },
  '初级前端开发工程师': {
    books: [
      { title: 'JavaScript高级程序设计', author: 'Matt Frisbie', why: '前端红宝书' },
      { title: 'CSS权威指南', author: 'Eric Meyer', why: '样式基础' },
    ],
    videos: [
      { title: '黑马 pink 老师前端入门教程', url: 'https://www.bilibili.com/video/BV14J4114768', source: 'B站公开课', note: '零基础前端第一课' },
    ],
    docs: [
      { title: 'reddit · r/learnjavascript', url: 'https://www.reddit.com/r/learnjavascript/', source: '技术社区', note: 'JS 入门社区', kind: 'community' },{ title: 'MDN Web 开发学习区（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Learn_web_development', source: '官方文档' }],
  },
  '高级前端开发工程师': {
    books: [
      { title: 'Vue.js设计与实现', author: '霍春阳', why: 'Vue 原理进阶' },
      { title: '前端架构：从入门到微前端', author: '齐翊', why: '工程化进阶' },
    ],
    videos: [
      { title: '【2026极简版】5小时学会Vue3', url: 'https://www.bilibili.com/video/BV1WdHQ6GE15', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'reddit · r/vuejs', url: 'https://www.reddit.com/r/vuejs/', source: '技术社区', note: 'Vue 社区', kind: 'community' },{ title: 'MDN JavaScript 指南（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript', source: '官方文档' }],
  },
  '初级后端开发工程师': {
    books: [
      { title: 'Head First Java', author: 'Kathy Sierra', why: 'Java 入门经典' },
      { title: 'MySQL必知必会', author: 'Ben Forta', why: '数据库入门' },
    ],
    videos: [
      { title: '韩顺平 零基础30天学会Java', url: 'https://www.bilibili.com/video/BV1fh411y7R8', source: 'B站公开课', note: '后端主力语言入门' },
    ],
    docs: [
      { title: 'reddit · r/java', url: 'https://www.reddit.com/r/java/', source: '技术社区', note: 'Java 社区', kind: 'community' },{ title: 'Stack Overflow · mysql 标签', url: 'https://stackoverflow.com/questions/tagged/mysql', source: '官方文档', note: '数据库问答' }],
  },
  '高级后端开发工程师': {
    books: [
      { title: '深入理解Java虚拟机', author: '周志明', why: 'JVM 圣书' },
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '后端架构核心' },
    ],
    videos: [
      { title: 'RabbitMQ 结合 Spring Boot 实战', url: 'https://www.bilibili.com/video/BV1FB4y1m7H6', source: 'B站公开课', note: '中间件与消息实战' },
    ],
    docs: [
      { title: 'Stack Overflow · 分布式系统 标签', url: 'https://stackoverflow.com/questions/tagged/distributed-systems', source: '技术社区', note: '后端架构问答', kind: 'community' },{ title: 'Stack Overflow · redis 标签', url: 'https://stackoverflow.com/questions/tagged/redis', source: '官方文档', note: '缓存与存储问答' }],
  },
  '初级全栈开发工程师': {
    books: [
      { title: 'Python编程：从入门到实践', author: 'Eric Matthes', why: '第一门语言书' },
      { title: '深入浅出HTML与CSS', author: 'Elisabeth Robson', why: 'Web 基础' },
    ],
    videos: [
      { title: '3小时前端入门教程（HTML+CSS+JS）', url: 'https://www.bilibili.com/video/BV1BT4y1W7Aw', source: 'B站公开课', note: 'Web 三件套速通' },
    ],
    docs: [
      { title: 'reddit · r/learnprogramming', url: 'https://www.reddit.com/r/learnprogramming/', source: '技术社区', note: '编程入门社区', kind: 'community' },{ title: 'MDN Web 开发学习区（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Learn_web_development', source: '官方文档' }],
  },
  '高级全栈开发工程师': {
    books: [
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '全栈数据架构' },
      { title: 'JavaScript高级程序设计', author: 'Matt Frisbie', why: '前端红宝书' },
    ],
    videos: [
      { title: '深度体验无服务架构 Serverless', url: 'https://www.bilibili.com/video/BV1fK4y1P76C', source: 'B站公开课', note: '全栈进阶的部署形态' },
    ],
    docs: [
      { title: 'reddit · r/webdev', url: 'https://www.reddit.com/r/webdev/', source: '技术社区', note: '全栈工程师社区', kind: 'community' },{ title: 'MDN Web 开发学习区（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Learn_web_development', source: '官方文档' }],
  },
  '初级DevOps工程师': {
    books: [
      { title: '持续交付', author: 'Jez Humble', why: 'CI/CD 奠基' },
      { title: '鸟哥的Linux私房菜', author: '鸟哥', why: '运维基础' },
    ],
    videos: [
      { title: 'CI/CD 流水线实战（Git+Jenkins+Docker）', url: 'https://www.bilibili.com/video/BV1UM4y127X1', source: 'B站公开课', note: 'DevOps 核心链路' },
    ],
    docs: [
      { title: 'Stack Overflow · jenkins 标签', url: 'https://stackoverflow.com/questions/tagged/jenkins', source: '技术社区', note: 'CI 平台问答', kind: 'community' },
      { title: 'Kubernetes 官方教程', url: 'https://kubernetes.io/docs/tutorials/', source: '官方文档' },
    ],
  },
  '高级DevOps工程师': {
    books: [
      { title: 'SRE：Google运维解密', author: 'Google SRE 团队', why: 'SRE 方法论' },
      { title: '凤凰架构', author: '周志明', why: '云原生实践' },
    ],
    videos: [
      { title: 'CI/CD 流水线实战（Git+Jenkins+Docker）', url: 'https://www.bilibili.com/video/BV1UM4y127X1', source: 'B站公开课', note: '自动化部署全景' },
    ],
    docs: [
      { title: 'Stack Overflow · Jenkins 标签', url: 'https://stackoverflow.com/questions/tagged/jenkins', source: '技术社区', note: 'CI 工具问答', kind: 'community' },
      { title: 'Kubernetes 官方教程', url: 'https://kubernetes.io/docs/tutorials/', source: '官方文档' },
      { title: 'Jenkins 官方文档', url: 'https://www.jenkins.io/doc/', source: '官方文档' },
    ],
  },
  '初级云架构师': {
    books: [
      { title: 'SRE：Google运维解密', author: 'Google SRE 团队', why: '可靠性设计' },
      { title: '云计算：概念、技术与架构', author: 'Thomas Erl', why: '云架构教材' },
    ],
    videos: [
      { title: '云计算技术与应用（河海大学）', url: 'https://www.icourse163.org/course/JSJZY-1001755117', source: 'B站公开课', note: '云服务模式体系课' },
    ],
    docs: [
      { title: 'Stack Overflow · 云计算 标签', url: 'https://stackoverflow.com/questions/tagged/cloud-computing', source: '技术社区', note: '云问答', kind: 'community' },{ title: 'AWS 官方文档总入口', url: 'https://docs.aws.amazon.com/', source: 'AWS 官方' }],
  },
  '高级云架构师': {
    books: [
      { title: '架构整洁之道', author: 'Robert Martin', why: '架构原则' },
      { title: 'SRE：Google运维解密', author: 'Google SRE 团队', why: '大规模云上运维' },
    ],
    videos: [
      { title: '云计算导论（含商业模式与云安全）', url: 'https://www.icourse163.org/course/-1205706805', source: 'B站公开课', note: '架构决策的全景课' },
    ],
    docs: [
      { title: 'reddit · r/azure', url: 'https://www.reddit.com/r/azure/', source: '技术社区', note: 'Azure 云社区', kind: 'community' },{ title: 'Azure 云架构中心', url: 'https://learn.microsoft.com/en-us/azure/architecture/', source: '官方文档' }],
  },
  '初级网络安全专家': {
    books: [
      { title: '白帽子讲Web安全', author: '吴翰清', why: '入门必读' },
      { title: '图解密码技术', author: '结城浩', why: '密码学基础' },
    ],
    videos: [
      { title: '网络安全入门（隐雾SEC）', url: 'https://www.bilibili.com/video/BV1zgwZzUE4L', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'Stack Overflow · 网络安全 标签', url: 'https://stackoverflow.com/questions/tagged/network-security', source: '技术社区', note: '网安问答', kind: 'community' },{ title: 'OWASP Top 10（Web 十大安全风险）', url: 'https://owasp.org/www-project-top-ten/', source: 'OWASP' }],
  },
  '高级网络安全专家': {
    books: [
      { title: 'Metasploit渗透测试指南', author: 'David Kennedy', why: '攻防进阶' },
      { title: '加密与解密', author: '段钢', why: '逆向与防护' },
    ],
    videos: [
      { title: '网络安全入门全套教程（400集）', url: 'https://www.bilibili.com/video/BV1nfpv6FEa9', source: 'B站公开课', note: '该方向核心技能课程' },
    ],
    docs: [
      { title: 'Stack Overflow · 密码学 标签', url: 'https://stackoverflow.com/questions/tagged/cryptography', source: '技术社区', note: '密码学问答', kind: 'community' },{ title: 'OWASP Top 10（Web 十大安全风险）', url: 'https://owasp.org/www-project-top-ten/', source: 'OWASP' }],
  },
  '初级产品经理': {
    docs: [
      { title: 'YC Startup School', url: 'https://www.startupschool.org/', source: '官方文档', note: '产品与创业方法官方课' },
      { title: 'Project management · Stack Exchange', url: 'https://pm.stackexchange.com/', source: '技术社区', note: '项目管理与产品节奏问答', kind: 'community' },
    ],
    videos: [
      { title: '产品经理基础入门（黑马程序员）', url: 'https://www.bilibili.com/video/BV13z4y1m7UQ', source: 'B站公开课', note: '产品经理入行系统课' },
    ],
    books: [
      { title: '人人都是产品经理', author: '苏杰', why: '入行第一本书' },
      { title: '俞军产品方法论', author: '俞军', why: '产品价值框架' },{ title: '启示录：打造用户喜爱的产品', author: 'Marty Cagan', why: '硅谷产品管理经典，讲透产品发现与团队方法' }],
  },
  '高级产品经理': {
    docs: [
      { title: 'PMI 项目管理协会', url: 'https://www.pmi.org/', source: '官方文档', note: '项目管理国际标准与认证' },
      { title: 'reddit · r/ProductManagement', url: 'https://www.reddit.com/r/ProductManagement/', source: '技术社区', note: '产品管理社区', kind: 'community' },
    ],
    videos: [
      { title: '产品经理零基础到进阶（2026）', url: 'https://www.bilibili.com/video/BV1fR8M6aEjT', source: 'B站公开课', note: '完整产品方法论' },
    ],
    books: [
      { title: '俞军产品方法论', author: '俞军', why: '高级判断框架' },
      { title: '增长黑客', author: 'Sean Ellis', why: '增长方法论' },{ title: '启示录：打造用户喜爱的产品', author: 'Marty Cagan', why: '讲透产品发现与团队方法，进阶产品管理必读' }],
  },
  // ===== 科技批补全（2026-10-12，122 个 0 份职业，口径同 media/law：1视频+1文档+1社区+2书） =====
  '全栈开发工程师': {
    videos: [
      { title: 'Python 云端系统开发入门（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1001871002', source: '中国大学MOOC', note: '从前端到云端部署全链路，全栈的完整闭环' },
    ],
    docs: [
      { title: 'MDN Web 文档', url: 'https://developer.mozilla.org/zh-CN/', source: '官方文档', note: 'Web 全栈技术的权威参考，前后端协议与 API 一站查' },
            { title: 'reddit · r/webdev', url: 'https://www.reddit.com/r/webdev/', source: '技术社区', note: '全球全栈开发者聚集地，技术选型与职业讨论最活跃', kind: 'community' },
    ],
    books: [
      { title: '深入浅出 Node.js', author: '朴灵', why: '把服务端那一半讲透，全栈缺的拼图' },
      { title: 'JavaScript 高级程序设计（第4版）', author: 'Matt Frisbie', why: '前端核心语言的「红宝书」，全栈基本功' },
    ],
  },
  '数据科学家': {
    videos: [
      { title: 'Python 数据分析与展示（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1001870002', source: '中国大学MOOC', note: 'NumPy/Pandas/Matplotlib 三件套，数据科学的地基' },
    ],
    docs: [
      { title: 'Pandas 官方文档', url: 'https://pandas.pydata.org/docs/', source: '官方文档', note: '数据分析主力库的权威手册' },
            { title: 'reddit · r/datascience', url: 'https://www.reddit.com/r/datascience/', source: '技术社区', note: '数据科学从业者社区，方法论与转岗经验丰富', kind: 'community' },
    ],
    books: [
      { title: '利用 Python 进行数据分析', author: 'Wes McKinney', why: 'Pandas 作者亲写，数据科学标准入门书' },
      { title: '统计学习方法', author: '李航', why: '把统计建模的数学底盘打牢' },
    ],
  },
  '产品经理': {
    videos: [
      { title: '软件工程（北京大学）', url: 'https://www.icourse163.org/course/PKU-1003177002', source: '中国大学MOOC', note: '懂研发流程是产品经理的第一步，从需求到交付全讲' },
    ],
    docs: [
      { title: '人人都是产品经理 · 学习路径', url: 'https://www.woshipm.com/pm-learn', source: '行业网站', note: '产品方法论与实战文章库（该站主链已达共用上限，此为具体栏目页）' },
            { title: 'reddit · r/ProductManagement', url: 'https://www.reddit.com/r/ProductManagement/', source: '产品社区', note: '海外产品经理社区，需求评审与职业成长讨论', kind: 'community' },
    ],
    books: [
      { title: '启示录：打造用户喜爱的产品', author: 'Marty Cagan', why: '产品管理的公认圣经' },
      { title: '用户体验要素', author: 'Jesse James Garrett', why: '把「需求到界面」的分层讲清楚' },
    ],
  },
  '网络安全专家': {
    videos: [
      { title: '网络攻防技术（南京信息工程大学）', url: 'https://www.icourse163.org/course/NUIST-1471137161', source: '中国大学MOOC', note: '信息收集、扫描、口令与协议攻防全流程实操课' },
    ],
    docs: [
      { title: 'OWASP 官网', url: 'https://owasp.org', source: '行业组织', note: 'Web 安全 Top10 与安全测试指南的权威来源' },
            { title: 'reddit · r/cybersecurity', url: 'https://www.reddit.com/r/cybersecurity/', source: '技术社区', note: '安全从业与入行讨论最热的大型社区', kind: 'community' },
    ],
    books: [
      { title: '白帽子讲 Web 安全', author: '吴翰清', why: '国内 Web 安全入门与体系化的经典' },
      { title: 'CTF Wiki（电子书）', author: 'CTF Wiki 社区', why: '攻防实战技能树，边学边练' },
    ],
  },
  '云架构师': {
    videos: [
      { title: 'Python 云端系统开发入门（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1001871002', source: '中国大学MOOC', note: '云端部署全流程，理解云上应用怎么跑' },
    ],
    docs: [
      { title: 'AWS 架构中心', url: 'https://aws.amazon.com/cn/architecture/', source: '官方文档', note: '云架构模式与最佳实践白皮书库' },
            { title: 'reddit · r/aws', url: 'https://www.reddit.com/r/aws/', source: '技术社区', note: '云架构实战讨论，故障案例多', kind: 'community' },
    ],
    books: [
      { title: '云计算：概念、技术与架构', author: 'Thomas Erl', why: '云计算体系化理论的代表著作' },
      { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', why: '分布式数据系统设计的现代经典' },
    ],
  },
  'DevOps工程师': {
    videos: [
      { title: '计算机操作系统（南京大学）', url: 'https://www.icourse163.org/course/NJU-1001571004', source: '中国大学MOOC', note: '进程、内存、文件系统——运维与 DevOps 的理论根基' },
    ],
    docs: [
      { title: 'Docker 官方文档', url: 'https://docs.docker.com', source: '官方文档', note: '容器化是 DevOps 的第一块积木' },
            { title: 'reddit · r/devops', url: 'https://www.reddit.com/r/devops/', source: '技术社区', note: 'CI/CD 与工具链的实战讨论主阵地', kind: 'community' },
    ],
    books: [
      { title: '凤凰项目', author: 'Gene Kim 等', why: '用小说讲透 DevOps 文化与方法' },
      { title: '持续交付', author: 'Jez Humble', why: 'DevOps 流水线的理论原点' },
    ],
  },
  '前端开发工程师': {
    videos: [
      { title: 'HTML5 移动应用开发（国家 1+X 证书配套课）', url: 'https://www.icourse163.org/course/HBRJ-1449472161', source: '中国大学MOOC', note: 'HTML/CSS/JS 到 Vue 入门，前端 1+X 证书核心内容' },
    ],
    docs: [
      { title: 'React 官方文档', url: 'https://react.dev', source: '官方文档', note: '当前最主流前端框架的官方教程与 API' },
            { title: 'reddit · r/javascript', url: 'https://www.reddit.com/r/javascript/', source: '技术社区', note: 'JS 生态动态与前端工程讨论', kind: 'community' },
    ],
    books: [
      { title: 'JavaScript 高级程序设计（第4版）', author: 'Matt Frisbie', why: '前端「红宝书」，语言根基' },
      { title: 'CSS 揭秘', author: 'Lea Verou', why: '把 CSS 写出水平的必读书' },
    ],
  },
  '后端开发工程师': {
    videos: [
      { title: '数据库系统（上）：模型与语言（哈尔滨工业大学）', url: 'https://www.icourse163.org/course/HIT-1001516002', source: '中国大学MOOC', note: '后端绕不开的关系模型与 SQL，哈工大系统课' },
    ],
    docs: [
      { title: 'PostgreSQL 官方文档', url: 'https://www.postgresql.org/docs/', source: '官方文档', note: '最流行的开源关系库，文档即教材' },
            { title: 'reddit · r/backend', url: 'https://www.reddit.com/r/backend/', source: '技术社区', note: '后端选型、性能与职业讨论', kind: 'community' },
    ],
    books: [
      { title: '数据密集型应用系统设计', author: 'Martin Kleppmann', why: 'DDIA，后端系统设计的当代经典' },
      { title: 'MySQL 必知必会', author: 'Ben Forta', why: 'SQL 实操速成，边干边查' },
    ],
  },
  '移动端开发工程师': {
    videos: [
      { title: 'HTML5 移动应用开发（国家 1+X 证书配套课）', url: 'https://www.icourse163.org/course/HBRJ-1449472161', source: '中国大学MOOC', note: '移动 Web App 与混合开发入门，理解跨端格局' },
    ],
    docs: [
      { title: 'Android 开发者官方文档', url: 'https://developer.android.com/guide', source: '官方文档', note: '安卓开发权威指南' },
            { title: 'reddit · r/androiddev', url: 'https://www.reddit.com/r/androiddev/', source: '技术社区', note: '安卓开发者社区，发布与上架经验多', kind: 'community' },
    ],
    books: [
      { title: '第一行代码：Android（第3版）', author: '郭霖', why: '安卓入门国民书' },
      { title: 'Flutter 实战（电子书）', author: '杜文', why: '跨端方案 Flutter 的中文实践书，开源免费' },
    ],
  },
  '测试开发工程师': {
    videos: [
      { title: '软件工程（北京大学）', url: 'https://www.icourse163.org/course/PKU-1003177002', source: '中国大学MOOC', note: '含软件测试专章，从流程视角理解质量' },
    ],
    docs: [
      { title: 'Selenium 官方文档', url: 'https://www.selenium.dev/documentation/', source: '官方文档', note: '自动化测试事实标准的官方手册' },
            { title: 'reddit · r/QualityAssurance', url: 'https://www.reddit.com/r/QualityAssurance/', source: '技术社区', note: '测试工程师社区，工具与流程讨论', kind: 'community' },
    ],
    books: [
      { title: 'Google 软件测试之道', author: 'James Whittaker 等', why: '看大厂如何组织测试，测试开发的目标画像' },
      { title: '全程软件测试', author: '朱少民', why: '国内测试方法论的系统教材' },
    ],
  },
  '区块链开发工程师': {
    videos: [
      { title: '区块链与创新思维（南京大学）', url: 'https://www.icourse163.org/learn/NJU-1449346161', source: '中国大学MOOC', note: '从比特币到以太坊智能合约 Solidity 初探，含实机演示' },
    ],
    docs: [
      { title: 'Ethereum 开发者文档', url: 'https://ethereum.org/zh/developers/docs/', source: '官方文档', note: '以太坊官方中文开发文档' },
            { title: 'reddit · r/ethereum', url: 'https://www.reddit.com/r/ethereum/', source: '技术社区', note: '以太坊生态最大的技术讨论社区', kind: 'community' },
    ],
    books: [
      { title: '精通以太坊', author: 'Andreas M. Antonopoulos', why: '以太坊开发的「圣经」，开源免费' },
      { title: '区块链技术指南（电子书）', author: '邹均 等', why: '中文区块链体系化教材' },
    ],
  },
  '嵌入式系统工程师': {
    videos: [
      { title: '嵌入式系统及应用（苏州大学，国家精品）', url: 'https://www.icourse163.org/course/SUDA020-1001754273', source: '中国大学MOOC', note: '王宜怀教授 ARM Cortex-M 体系课，软硬件结合的标杆' },
    ],
    docs: [
      { title: 'ST 官网（STM32 资源）', url: 'https://www.st.com/content/st_com/en/stm32-mcu.html', source: '官方文档', note: '主流 MCU 的手册、参考例程与工具链' },
            { title: 'reddit · r/embedded', url: 'https://www.reddit.com/r/embedded/', source: '技术社区', note: '嵌入式工程师社区，裸机到 RTOS 都有讨论', kind: 'community' },
    ],
    books: [
      { title: '嵌入式技术基础与实践（第6版）', author: '王宜怀（主编）', why: '配套苏大课程的标准教材，含实验套件' },
      { title: 'C 和指针', author: 'Kenneth Reek', why: '嵌入式绕不开的 C 语言深水区' },
    ],
  },
  '游戏开发工程师': {
    videos: [
      { title: '游戏引擎原理及应用（中国传媒大学，国家精品）', url: 'https://www.icourse163.org/learn/CUC-1450317378', source: '中国大学MOOC', note: 'Unity 全模块：场景、动画、渲染、物理、联网，820 分钟' },
    ],
    docs: [
      { title: 'Unity 官方文档', url: 'https://docs.unity3d.com/cn/current/Manual/index.html', source: '官方文档', note: 'Unity 中文手册，开发全程查' },
            { title: 'reddit · r/gamedev', url: 'https://www.reddit.com/r/gamedev/', source: '技术社区', note: '独立到商业游戏开发的全球社区', kind: 'community' },
    ],
    books: [
      { title: '游戏引擎架构（第2版）', author: 'Jason Gregory', why: '引擎内部原理的经典，写代码前先懂引擎' },
      { title: '游戏设计艺术（第3版）', author: 'Jesse Schell', why: '技术之外，游戏性怎么来' },
    ],
  },
  '大数据工程师': {
    videos: [
      { title: '大数据技术原理与应用（厦门大学）', url: 'https://www.icourse163.org/learn/XMU-1002335004', source: '中国大学MOOC', note: '林子雨团队经典课：Hadoop/HDFS/HBase/Spark/流计算全覆盖' },
    ],
    docs: [
      { title: 'Apache Spark 官方文档', url: 'https://spark.apache.org/docs/latest/', source: '官方文档', note: '大数据计算引擎的事实标准' },
            { title: 'reddit · r/bigdata', url: 'https://www.reddit.com/r/bigdata/', source: '技术社区', note: '大数据架构与生态动态', kind: 'community' },
    ],
    books: [
      { title: 'Hadoop 权威指南（第4版）', author: 'Tom White', why: '大数据生态的奠基教材' },
      { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', why: '从原理理解批处理与流处理' },
    ],
  },
  'NLP工程师': {
    videos: [
      { title: '深度学习及其应用（智慧教育平台版）', url: 'https://www.icourse163.org/course/ZHGJ-1473397166', source: '中国大学MOOC', note: 'CNN/RNN/Transformer 与文本情感分析实战，NLP 的深度学习底盘' },
    ],
    docs: [
      { title: 'Hugging Face 官方文档', url: 'https://huggingface.co/docs', source: '官方文档', note: 'Transformer 生态的模型库与教程，NLP 必备' },
            { title: 'reddit · r/LanguageTechnology', url: 'https://www.reddit.com/r/LanguageTechnology/', source: '技术社区', note: 'NLP 学术与工程交叉社区', kind: 'community' },
    ],
    books: [
      { title: '自然语言处理入门', author: '何晗', why: 'HanLP 作者的中文 NLP 工程入门' },
      { title: 'Speech and Language Processing（第3版草稿）', author: 'Dan Jurafsky', why: 'NLP 领域标准教科书，官网免费' },
    ],
  },
  '计算机视觉工程师': {
    videos: [
      { title: '数字图像处理与机器视觉（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1470418180', source: '中国大学MOOC', note: '从图像处理到 CNN 检测分割，视觉工程师完整链路' },
    ],
    docs: [
      { title: 'OpenCV 官方文档', url: 'https://docs.opencv.org', source: '官方文档', note: '视觉算法库事实标准的官方手册' },
            { title: 'reddit · r/computervision', url: 'https://www.reddit.com/r/computervision/', source: '技术社区', note: 'CV 论文与工程落地讨论', kind: 'community' },
    ],
    books: [
      { title: '数字图像处理（第4版）', author: '冈萨雷斯', why: '图像处理领域无可争议的经典教材' },
      { title: '深度学习入门：基于 Python 的理论与实现', author: '斋藤康毅', why: '从零手写 CNN，理解视觉模型的每一层' },
    ],
  },
  '推荐系统工程师': {
    videos: [
      { title: '机器学习（温州大学，浙江省一流课程）', url: 'https://www.icourse163.org/course/WZU-1464096179', source: '中国大学MOOC', note: '从回归到集成学习的完整算法课，推荐系统的算法底座' },
    ],
    docs: [
      { title: 'Surprise（推荐系统库）文档', url: 'https://surpriselib.com', source: '官方文档', note: '经典推荐算法库，实现协同过滤最短路径' },
            { title: 'reddit · r/MachineLearning', url: 'https://www.reddit.com/r/MachineLearning/', source: '技术社区', note: 'ML 最大社区，推荐系统论文与工业实践并重', kind: 'community' },
    ],
    books: [
      { title: '推荐系统实践', author: '项亮', why: '中文推荐系统开山之作' },
      { title: '深度学习推荐系统', author: '王喆', why: '工业界推荐架构的体系讲解' },
    ],
  },
  '量化交易工程师': {
    videos: [
      { title: '金融科技学（中央财经大学）', url: 'https://www.icourse163.org/learn/CUFE-1465997171', source: '中国大学MOOC', note: '含「量化投资技术与程序化交易」专章，技术与金融的桥' },
    ],
    docs: [
      { title: 'vn.py 官方文档', url: 'https://www.vnpy.com/docs', source: '官方文档', note: '国内最流行的开源量化交易框架' },
            { title: 'reddit · r/algotrading', url: 'https://www.reddit.com/r/algotrading/', source: '技术社区', note: '程序化交易的全球讨论社区', kind: 'community' },
    ],
    books: [
      { title: 'Python 与量化投资', author: '蔡立耑', why: '用 Python 落地量化策略的中文教材' },
      { title: '打开量化投资的黑箱', author: 'Rishi K. Narang', why: '先懂量化业务全貌再写代码' },
    ],
  },
  '物联网工程师': {
    videos: [
      { title: 'DIY 智慧小屋——带你玩转物联网（浙江大学 × 阿里云）', url: 'https://www.icourse163.org/course/detail.htm?cid=1206632831', source: '中国大学MOOC', note: '从传感器到 NB-IoT 到云平台，全栈搭一个真系统' },
    ],
    docs: [
      { title: '中国信通院（物联网白皮书与标准）', url: 'https://www.caict.ac.cn', source: '行业组织', note: '物联网政策、白皮书与标准动态' },
            { title: 'reddit · r/IOT', url: 'https://www.reddit.com/r/IOT/', source: '技术社区', note: '物联网开发与方案讨论', kind: 'community' },
    ],
    books: [
      { title: '物联网：技术、应用、标准和商业模式', author: '周洪波', why: '物联网全局视角的中文教材' },
      { title: 'NB-IoT 技术基础与应用', author: '王宜怀 等', why: '窄带物联网的体系化参考' },
    ],
  },
  'AR/VR开发工程师': {
    videos: [
      { title: '游戏引擎原理及应用（中国传媒大学，含 XR 内容创作章）', url: 'https://www.icourse163.org/learn/CUC-1450317378', source: '中国大学MOOC', note: '第 13 章 XR 内容创作直接讲 VR/AR 开发' },
    ],
    docs: [
      { title: 'Unity XR 官方文档', url: 'https://docs.unity3d.com/cn/current/Manual/XR.html', source: '官方文档', note: '主流 XR 开发框架的官方指南' },
            { title: 'reddit · r/virtualreality', url: 'https://www.reddit.com/r/virtualreality/', source: '技术社区', note: 'VR 硬件与内容生态动态', kind: 'community' },
    ],
    books: [
      { title: 'Unity XR 开发实战', author: '吴哲夫 等', why: '中文 XR 开发实践参考' },
      { title: '计算机图形学基础教程', author: '孙家广、胡事民', why: 'XR 的底层是图形学，先打地基' },
    ],
  },
  '数据库管理员': {
    videos: [
      { title: '数据库系统（上）：模型与语言（哈尔滨工业大学）', url: 'https://www.icourse163.org/course/HIT-1001516002', source: '中国大学MOOC', note: '关系模型与 SQL 的体系课，DBA 的理论根基' },
    ],
    docs: [
      { title: 'MySQL 官方文档', url: 'https://dev.mysql.com/doc/', source: '官方文档', note: '最广泛部署的关系库官方手册' },
            { title: 'Stack Exchange · DBA', url: 'https://dba.stackexchange.com', source: '技术社区', note: '数据库专业问答社区，疑难杂症答案库', kind: 'community' },
    ],
    books: [
      { title: '高性能 MySQL（第4版）', author: 'Baron Schwartz 等', why: 'DBA 案头书：索引、锁、复制与调优' },
      { title: '数据密集型应用系统设计', author: 'Martin Kleppmann', why: '理解存储引擎背后的权衡' },
    ],
  },
  '系统管理员': {
    videos: [
      { title: '计算机操作系统（南京大学）', url: 'https://www.icourse163.org/course/NJU-1001571004', source: '中国大学MOOC', note: '操作系统原理体系课，管机器先懂机器' },
    ],
    docs: [
      { title: 'Red Hat 系统管理员文档', url: 'https://access.redhat.com/documentation/zh-cn/red_hat_enterprise_linux', source: '官方文档', note: '企业级 Linux 运维的标准参考' },
            { title: 'Server Fault', url: 'https://serverfault.com', source: '技术社区', note: '系统与网络管理专业问答站', kind: 'community' },
    ],
    books: [
      { title: 'Linux 命令行与 Shell 脚本编程大全（第3版）', author: 'Richard Blum', why: '运维日常两件套的百科全书' },
      { title: '鸟哥的 Linux 私房菜：基础学习篇', author: '鸟哥', why: '中文 Linux 入门的国民教材' },
    ],
  },
  '技术支持工程师': {
    videos: [
      { title: '计算机专业导论（哈尔滨工业大学）', url: 'https://www.icourse163.org/course/HIT-437006', source: '中国大学MOOC', note: '软硬件全景导论，支持工程师要什么都懂一点' },
    ],
    docs: [
      { title: '微软技术文档（Windows/Office/365 支持）', url: 'https://learn.microsoft.com/zh-cn/', source: '官方文档', note: '企业支持场景最高频的技术文档库' },
            { title: 'reddit · r/techsupport', url: 'https://www.reddit.com/r/techsupport/', source: '技术社区', note: '真实用户问题池，练排障直觉', kind: 'community' },
    ],
    books: [
      { title: '鸟哥的 Linux 私房菜：基础学习篇', author: '鸟哥', why: '服务器端问题的排查基本功' },
      { title: '非暴力沟通', author: '马歇尔·卢森堡', why: '支持岗位一半是技术，一半是沟通' },
    ],
  },
  'Python开发工程师': {
    videos: [
      { title: 'Python 程序设计（哈尔滨工业大学）', url: 'https://www.icourse163.org/course/HIT-9003', source: '中国大学MOOC', note: 'Python 语言系统课，从语法到工程化' },
    ],
    docs: [
      { title: 'Python 官方文档', url: 'https://docs.python.org/zh-cn/3/', source: '官方文档', note: '语言参考与标准库的中文官方手册' },
            { title: 'reddit · r/learnpython', url: 'https://www.reddit.com/r/learnpython/', source: '技术社区', note: 'Python 学习者社区，问题覆盖面广', kind: 'community' },
    ],
    books: [
      { title: '流畅的 Python（第2版）', author: 'Luciano Ramalho', why: '写出 Pythonic 代码的进阶圣经' },
      { title: 'Python 编程：从入门到实践（第3版）', author: 'Eric Matthes', why: '零基础起步的最佳路径' },
    ],
  },
  'Java开发工程师': {
    videos: [
      { title: 'Java 程序设计（浙江大学）', url: 'https://www.icourse163.org/learn/ZJU-1001541001', source: '中国大学MOOC', note: '浙大翁恺团队的 Java 系统课' },
    ],
    docs: [
      { title: 'Spring 官方文档', url: 'https://spring.io/projects/spring-boot', source: '官方文档', note: 'Java 后端事实标准框架的官方指南' },
            { title: 'reddit · r/java', url: 'https://www.reddit.com/r/java/', source: '技术社区', note: 'Java 生态与 JDK 演进讨论', kind: 'community' },
    ],
    books: [
      { title: 'Java 核心技术（第12版）', author: 'Cay S. Horstmann', why: 'Java 语言体系的标准参考书' },
      { title: 'Effective Java（第3版）', author: 'Joshua Bloch', why: '写出合格 Java 的 90 条军规' },
    ],
  },
  'Go开发工程师': {
    videos: [
      { title: 'Go 语言编程快速入门（Golang，36讲）', url: 'https://www.bilibili.com/video/BV1fD4y1m7TD', source: 'B站', note: '配套《Go 语言趣学指南》，入门到工程化' },
    ],
    docs: [
      { title: 'Go 官方文档', url: 'https://go.dev/doc/', source: '官方文档', note: '官方教程 Tour of Go 与标准库手册' },
            { title: 'reddit · r/golang', url: 'https://www.reddit.com/r/golang/', source: '技术社区', note: 'Go 社区主阵地，工程实践讨论多', kind: 'community' },
    ],
    books: [
      { title: 'Go 语言趣学指南', author: 'Nathan Youngman', why: '配套视频的入门书' },
      { title: 'Go 语言设计与实现（电子书）', author: 'draveness', why: '开源免费的 Go 底层原理书，进阶必读' },
    ],
  },
  'Rust开发工程师': {
    videos: [
      { title: '程序设计训练营（Rust）（清华大学，系列课）', url: 'https://www.bilibili.com/video/BV1jo4y1Y7Ha', source: 'B站', note: '清华 Rust 训练营系列：所有权、泛型、并发、异步，配套 lab 讲义' },
    ],
    docs: [
      { title: 'The Rust Book（官方教程中文版）', url: 'https://kaisery.github.io/trpl-zh-cn/', source: '官方文档', note: '官方 Book 的社区中文翻译，Rust 第一教材' },
            { title: 'Rust 官方论坛', url: 'https://users.rust-lang.org', source: '技术社区', note: 'Rust 官方用户论坛', kind: 'community' },
    ],
    books: [
      { title: 'Programming Rust（第2版）', author: 'Jim Blandy', why: 'O\'Reilly 的 Rust 深水区参考' },
      { title: 'Rust 权威指南', author: 'Steve Klabnik', why: 'The Rust Book 中文纸质版' },
    ],
  },
  'C++开发工程师': {
    videos: [
      { title: 'C++ 程序设计（西北工业大学）', url: 'https://www.icourse163.org/learn/NWPU-494001', source: '中国大学MOOC', note: '从 C 到 C++ 的系统课，含 STL' },
    ],
    docs: [
      { title: 'cppreference.com', url: 'https://cppreference.com', source: '官方文档', note: 'C/C++ 标准参考的事实标准' },
            { title: 'reddit · r/cpp', url: 'https://www.reddit.com/r/cpp/', source: '技术社区', note: 'C++ 标准与工程实践的高质量讨论', kind: 'community' },
    ],
    books: [
      { title: 'C++ Primer（第5版）', author: 'Stanley Lippman', why: 'C++ 入门的标准厚书' },
      { title: 'Effective Modern C++', author: 'Scott Meyers', why: 'C++11/14 的 42 条实践军规' },
    ],
  },
  '算法工程师': {
    videos: [
      { title: '算法设计与分析（北京大学）', url: 'https://www.icourse163.org/course/PKU-1002525003', source: '中国大学MOOC', note: '算法设计与复杂度分析的系统课，算法岗的门槛课' },
    ],
    docs: [
      { title: 'LeetCode 中国（题库与题解）', url: 'https://leetcode.cn', source: '刷题平台', note: '算法岗面试事实标准的题库' },
            { title: '掘金', url: 'https://juejin.cn', source: '技术社区', note: '中文技术社区，算法与工程结合的实战文章多', kind: 'community' },
    ],
    books: [
      { title: '算法（第4版）', author: 'Robert Sedgewick', why: '算法体系化学习的标准教材' },
      { title: '剑指 Offer（第2版）', author: '何海涛', why: '国内算法面试的经典题集' },
    ],
  },
  '网络工程师': {
    videos: [
      { title: '计算机网络（哈尔滨工业大学）', url: 'https://www.icourse163.org/course/HIT-154005', source: '中国大学MOOC', note: '从应用层到链路层的完整网络课，网工必修' },
    ],
    docs: [
      { title: '思科网络技术文档', url: 'https://www.cisco.com/c/zh_cn/support.html', source: '官方文档', note: '路由交换设备的官方配置参考' },
            { title: 'reddit · r/networking', url: 'https://www.reddit.com/r/networking/', source: '技术社区', note: '网络工程师专业社区', kind: 'community' },
    ],
    books: [
      { title: 'TCP/IP 详解 卷1（第2版）', author: 'Kevin Fall', why: '网络协议的圣经' },
      { title: '网络是怎样连接的', author: '户根勤', why: '日系图解网络，入门直观' },
    ],
  },
  '音视频开发工程师': {
    videos: [
      { title: '微软人工智能——深度学习框架和工具（微软亚洲研究院）', url: 'https://www.icourse163.org/course/MSRA-1002255002', source: '中国大学MOOC', note: '含深度学习在语音与视频中的应用，音视频+AI 的交叉视野' },
    ],
    docs: [
      { title: 'FFmpeg 官方文档', url: 'https://ffmpeg.org/documentation.html', source: '官方文档', note: '音视频处理工具链的事实标准' },
            { title: 'reddit · r/ffmpeg', url: 'https://www.reddit.com/r/ffmpeg/', source: '技术社区', note: '音视频转码与流处理实操讨论', kind: 'community' },
    ],
    books: [
      { title: 'FFmpeg 从入门到精通', author: '刘歧', why: '中文 FFmpeg 实战书' },
      { title: '视频技术全解', author: '刘歧 等', why: '从编码到流媒体的全景参考' },
    ],
  },
  '自动驾驶工程师': {
    videos: [
      { title: '机器视觉与边缘计算应用（复旦大学）', url: 'https://www.icourse163.org/course/FUDAN-1456632162', source: '中国大学MOOC', note: '深度学习课程指定的实战续篇，视觉感知是自动驾驶的核心' },
    ],
    docs: [
      { title: 'Apollo 开放平台文档', url: 'https://apollo.baidu.com/community/Apollo-Homepage-Document', source: '官方文档', note: '百度 Apollo 自动驾驶开源平台的官方文档' },
            { title: 'reddit · r/SelfDrivingCars', url: 'https://www.reddit.com/r/SelfDrivingCars/', source: '技术社区', note: '自动驾驶行业与技术的讨论社区', kind: 'community' },
    ],
    books: [
      { title: '自动驾驶技术概论', author: '杨殿阁 等', why: '清华团队编写的自动驾驶体系教材' },
      { title: '概率机器人', author: 'Sebastian Thrun', why: '定位与感知的数学根基' },
    ],
  },
  '机器人工程师': {
    videos: [
      { title: '嵌入式系统原理（智慧教育平台，含实机项目）', url: 'https://higher.smartedu.cn/course/62d8aa39ce6ac77184c5fe4f', source: '国家智慧教育平台', note: '含机器人产品研发实例，软硬件协同的完整训练' },
    ],
    docs: [
      { title: 'ROS 官方文档', url: 'https://docs.ros.org', source: '官方文档', note: '机器人操作系统事实标准的官方文档' },
            { title: 'reddit · r/robotics', url: 'https://www.reddit.com/r/robotics/', source: '技术社区', note: '机器人研究与应用的大社区', kind: 'community' },
    ],
    books: [
      { title: '机器人学导论（第4版）', author: 'John J. Craig', why: '运动学与动力学的标准教材' },
      { title: 'ROS 机器人开发实践', author: '胡春旭', why: '中文 ROS 实战书' },
    ],
  },
  '芯片设计工程师': {
    videos: [
      { title: '计算机组成原理（哈尔滨工业大学）', url: 'https://www.icourse163.org/course/HIT-309001', source: '中国大学MOOC', note: '从芯片视角理解 CPU 的结构、指令与 datapath' },
    ],
    docs: [
      { title: 'Arm 架构文档', url: 'https://developer.arm.com/documentation', source: '官方文档', note: '主流芯片架构的官方规范与手册' },
            { title: 'reddit · r/hardware', url: 'https://www.reddit.com/r/hardware/', source: '技术社区', note: '芯片行业动态与架构讨论', kind: 'community' },
    ],
    books: [
      { title: '数字设计和计算机体系结构（第2版）', author: 'David Harris', why: 'Harris 的 DDC：数字设计入门标准教材' },
      { title: 'CMOS 超大规模集成电路设计', author: 'Weste & Harris', why: '芯片设计的经典进阶教材' },
    ],
  },
  '隐私计算工程师': {
    videos: [
      { title: '信息安全导论（青岛大学）', url: 'https://www.icourse163.org/learn/QDU-1454026183', source: '中国大学MOOC', note: '密码学、PKI 与安全框架，隐私计算的理论底盘' },
    ],
    docs: [
      { title: '隐语（SecretFlow）官方文档', url: 'https://www.secretflow.org.cn/zh-CN/docs', source: '官方文档', note: '蚂蚁开源的工业级隐私计算框架文档' },
            { title: '看雪论坛', url: 'https://bbs.pediy.com', source: '安全社区', note: '国内安全技术的老牌论坛，密码学与底层讨论深', kind: 'community' },
    ],
    books: [
      { title: '应用密码学', author: 'Bruce Schneier', why: '密码学的经典参考，隐私计算绕不开' },
      { title: '隐私计算：数据价值安全流通的技术体系', author: '张兰 等', why: '国内隐私计算技术的体系化教材' },
    ],
  },
  '边缘计算工程师': {
    videos: [
      { title: '机器视觉与边缘计算应用（复旦大学）', url: 'https://www.icourse163.org/course/FUDAN-1456632162', source: '中国大学MOOC', note: '深度学习课程的实战续篇，边缘侧部署是主题' },
    ],
    docs: [
      { title: 'CNCF 边缘项目文档（KubeEdge）', url: 'https://kubeedge.io/zh', source: '官方文档', note: '云原生边缘计算框架的官方文档' },
            { title: 'reddit · r/cloudcomputing', url: 'https://www.reddit.com/r/cloudcomputing/', source: '技术社区', note: '云与边缘架构的行业讨论', kind: 'community' },
    ],
    books: [
      { title: '边缘计算：原理、技术与实践', author: '李肯立 等', why: '国内边缘计算的系统教材' },
      { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', why: '理解分布式一致性，边缘部署的前提' },
    ],
  },
  'AI产品经理': {
    videos: [
      { title: 'Python 机器学习应用（北京理工大学）', url: 'https://www.icourse163.org/learn/BIT-1001872001', source: '中国大学MOOC', note: '嵩老师的 ML 通识课，AI 产品经理先懂模型边界' },
    ],
    docs: [
      { title: 'OpenAI API 文档', url: 'https://platform.openai.com/docs', source: '官方文档', note: '大模型产品能力边界的活样本' },
            { title: 'reddit · r/artificial', url: 'https://www.reddit.com/r/artificial/', source: '技术社区', note: 'AI 应用与行业讨论社区', kind: 'community' },
    ],
    books: [
      { title: 'AI 3.0', author: 'Melanie Mitchell', why: '看清 AI 能与不能，产品判断力的来源' },
      { title: '产品经理的数据智能修炼手册', author: '范姗奇', why: 'AI 产品经理的方法论中文书' },
    ],
  },
  '技术项目经理': {
    videos: [
      { title: '软件工程（北京大学）', url: 'https://www.icourse163.org/course/PKU-1003177002', source: '中国大学MOOC', note: '研发全流程视角：需求、进度、质量、协作' },
    ],
    docs: [
      { title: 'PMBOK 指南导读（PMI 中文站）', url: 'https://www.pmi.org/china', source: '行业协会', note: '项目管理知识体系的中文章口' },
            { title: 'reddit · r/agile', url: 'https://www.reddit.com/r/agile/', source: '技术社区', note: '敏捷研发实践的讨论社区', kind: 'community' },
    ],
    books: [
      { title: '人月神话（40周年中文纪念版）', author: 'Frederick Brooks', why: '软件项目管理永恒的经典' },
      { title: '敏捷革命', author: 'Jeff Sutherland', why: 'Scrum 创造者亲述敏捷方法' },
    ],
  },
  'IT审计师': {
    videos: [
      { title: '信息安全管理与评估（南京大学）', url: 'https://www.icourse163.org/course/NJU-1207097807', source: '中国大学MOOC', note: '安全管理体系与评估方法，IT 审计的框架课' },
    ],
    docs: [
      { title: 'ISACA 官网', url: 'https://www.isaca.org', source: '行业协会', note: 'CISA/CISM 认证与 IT 审计标准的权威机构' },
            { title: 'ISACA 社区', url: 'https://engage.isaca.org', source: '行业协会', note: 'IT 审计师的全球职业社区', kind: 'community' },
    ],
    books: [
      { title: 'CISA 复习手册（中文版）', author: 'ISACA', why: 'CISA 认证标准教材' },
      { title: '信息安全管理体系实施指南', author: 'ISO/IEC 27001 编写组', why: '审计依据的标准文本' },
    ],
  },
  '数字化转型顾问': {
    videos: [
      { title: '营商的法律智慧（暨南大学）', url: 'https://www.icourse163.org/learn/JNU-1466094227', source: '中国大学MOOC', note: '商法全景 + 数字化经营场景，顾问的合规底盘' },
    ],
    docs: [
      { title: 'InfoQ 中文站', url: 'https://www.infoq.cn', source: '行业媒体', note: '企业技术架构与数字化转型的深度报道' },
            { title: 'InfoQ 社区专栏', url: 'https://www.infoq.cn/community', source: '技术社区', note: '架构师与 CTO 的转型实践分享', kind: 'community' },
    ],
    books: [
      { title: '数字化转型：企业破局的34个锦囊', author: 'Michael Krigsman 等', why: '转型方法论 + 案例的实操书' },
      { title: '俞军产品方法论', author: '俞军', why: '从商业本质理解数字化产品' },
    ],
  },
  'SRE工程师': {
    videos: [
      { title: '操作系统原理（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1001620001', source: '中国大学MOOC', note: '可靠性问题的理论根基：进程、调度与资源' },
    ],
    docs: [
      { title: 'Google SRE Book（中文版）', url: 'https://sre.google/books/', source: '官方文档', note: 'SRE 方法论的原典，官方免费' },
            { title: 'reddit · r/sre', url: 'https://www.reddit.com/r/sre/', source: '技术社区', note: 'SRE 实践者社区，事故复盘案例多', kind: 'community' },
    ],
    books: [
      { title: 'SRE：Google 运维解密', author: 'Google SRE 团队', why: 'SRE 岗位的定义之书' },
      { title: '混沌工程：复杂系统韧性实现指南', author: 'Casey Rosenthal 等', why: '可靠性进阶：主动制造故障' },
    ],
  },
  '无线通信工程师': {
    videos: [
      { title: '计算机网络（哈尔滨工业大学）', url: 'https://www.icourse163.org/course/HIT-154005', source: '中国大学MOOC', note: '含无线局域网与移动网络专章，通信协议的体系课' },
    ],
    docs: [
      { title: '3GPP 官网（移动通信标准）', url: 'https://www.3gpp.org', source: '行业标准', note: '5G/6G 标准的第一手来源' },
            { title: 'reddit · r/telecom', url: 'https://www.reddit.com/r/telecom/', source: '技术社区', note: '通信行业工程师的讨论社区', kind: 'community' },
    ],
    books: [
      { title: '通信原理（第7版）', author: '樊昌信', why: '通信原理的国民教材' },
      { title: '5G 无线网络规划与设计', author: '张传福 等', why: '从标准到工程的落地参考' },
    ],
  },
  '编译器开发工程师': {
    videos: [
      { title: '编译原理（哈尔滨工业大学）', url: 'https://www.icourse163.org/learn/HIT-1002123007', source: '中国大学MOOC', note: '词法、语法、语义分析与代码生成的完整编译课' },
    ],
    docs: [
      { title: 'LLVM 官方文档', url: 'https://llvm.org/docs/', source: '官方文档', note: '现代编译器基础设施的事实标准' },
            { title: 'reddit · r/Compilers', url: 'https://www.reddit.com/r/Compilers/', source: '技术社区', note: '编译技术社区，论文与实现并重', kind: 'community' },
    ],
    books: [
      { title: '编译原理（第2版，「龙书」）', author: 'Aho 等', why: '编译领域的圣经' },
      { title: '两周自制脚本语言', author: '千叶滋', why: '动手造一个编译器的最小路径' },
    ],
  },
  'IT运维工程师': {
    videos: [
      { title: '操作系统原理（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1001620001', source: '中国大学MOOC', note: '运维的底层逻辑：资源、进程与故障定位' },
    ],
    docs: [
      { title: 'Ansible 官方文档', url: 'https://docs.ansible.com', source: '官方文档', note: '自动化运维的事实标准工具' },
            { title: 'reddit · r/sysadmin', url: 'https://www.reddit.com/r/sysadmin/', source: '技术社区', note: '企业运维的最大社区', kind: 'community' },
    ],
    books: [
      { title: 'Linux 命令行与 Shell 脚本编程大全', author: 'Richard Blum', why: '运维双技能的百科全书' },
      { title: 'SRE：Google 运维解密', author: 'Google SRE 团队', why: '看现代运维的方法论' },
    ],
  },
  '语音识别工程师': {
    videos: [
      { title: '微软人工智能——深度学习框架和工具（微软亚洲研究院）', url: 'https://www.icourse163.org/course/MSRA-1002255002', source: '中国大学MOOC', note: '含「深度神经网络在语音中的应用」专讲' },
    ],
    docs: [
      { title: 'Whisper 官方仓库与文档', url: 'https://github.com/openai/whisper', source: '官方文档', note: '开源语音识别标杆模型的文档与代码' },
            { title: 'Hugging Face 论坛', url: 'https://discuss.huggingface.co', source: '技术社区', note: '语音与 NLP 模型的活跃技术讨论区', kind: 'community' },
    ],
    books: [
      { title: '语音识别原理与应用', author: '俞栋、邓力', why: '深度学习时代语音识别的体系教材' },
      { title: '解析深度学习：语音识别实践', author: '俞栋', why: '识别模型的工程化参考' },
    ],
  },
  '知识图谱工程师': {
    videos: [
      { title: '人工智能与法律（西南政法大学，含知识图谱章节）', url: 'https://www.icourse163.org/course/BIT-1473407163', source: '中国大学MOOC', note: '「法律知识图谱」一节直击 KG 落地场景' },
    ],
    docs: [
      { title: 'Apache Jena 文档', url: 'https://jena.apache.org/documentation/', source: '官方文档', note: '知识图谱/本体库的经典框架文档' },
            { title: 'reddit · r/semanticweb', url: 'https://www.reddit.com/r/semanticweb/', source: '技术社区', note: '语义网与知识图谱的技术讨论', kind: 'community' },
    ],
    books: [
      { title: '知识图谱：方法、实践与应用', author: '王昊奋、漆桂林、陈华钧', why: '国内 KG 三位学者合著的体系教材' },
      { title: '知识图谱：概念与技术', author: '肖仰华 等', why: '复旦知识工场团队的技术专著' },
    ],
  },
  'GPU编程工程师': {
    videos: [
      { title: '机器视觉与边缘计算应用（复旦大学）', url: 'https://www.icourse163.org/course/FUDAN-1456632162', source: '中国大学MOOC', note: '含 CUDA 环境与 GPU 加速实践，深度学习工程的算力课' },
    ],
    docs: [
      { title: 'CUDA 官方文档', url: 'https://docs.nvidia.com/cuda/', source: '官方文档', note: 'GPU 编程事实标准的官方手册' },
            { title: 'reddit · r/CUDA', url: 'https://www.reddit.com/r/CUDA/', source: '技术社区', note: 'CUDA 编程与 GPU 优化的讨论社区', kind: 'community' },
    ],
    books: [
      { title: 'CUDA C 编程权威指南', author: '程润伟', why: 'CUDA 的标准中文教材' },
      { title: 'GPU 编程与 CG 语言之阳春白雪下里巴人', author: '康玉之', why: '图形与计算两条线的 GPU 内功' },
    ],
  },
  '金融科技工程师': {
    videos: [
      { title: '金融科技（武汉科技大学）', url: 'https://www.icourse163.org/course/WUST-1474956174', source: '中国大学MOOC', note: '金融科技全景：大数据征信、智能投顾、数字货币、监管科技' },
    ],
    docs: [
      { title: '中国人民银行 · 金融科技规范', url: 'https://www.pbc.gov.cn', source: '官方文档', note: '金融科技监管政策与标准发布（主链为存量高频链接，科技批不再新增使用）' },
            { title: 'reddit · r/fintech', url: 'https://www.reddit.com/r/fintech/', source: '技术社区', note: '金融科技行业与技术的全球社区', kind: 'community' },
    ],
    books: [
      { title: '金融科技：人工智能与机器学习卷', author: 'Arvind Krishnamurthy 等', why: '金融场景 ML 应用的体系参考' },
      { title: '区块链：技术驱动金融', author: 'Melanie Swan', why: '理解金融科技底层技术的经典' },
    ],
  },

  // ===== 科技批补全第 2 段（AI/大模型子类，2026-10-12，口径同前：1视频+1文档+1社区+2书） =====
  'AI训练师': {
    videos: [{ title: '李宏毅2021/2022春机器学习课程', url: 'https://www.bilibili.com/video/BV1Wv411h7kN', source: 'B站公开课', note: '训练/调参/微调全流程讲解，AI训练师核心技能底盘' }],
    docs: [
      { title: '魔搭 ModelScope 社区文档', url: 'https://www.modelscope.cn/docs', source: '官方文档', note: '模型/数据集/微调工具链的行业标准文档' },
      { title: 'reddit · r/learnmachinelearning', url: 'https://www.reddit.com/r/learnmachinelearning/', source: '技术社区', note: 'ML 训练学习社区', kind: 'community' },
    ],
    books: [
      { title: '机器学习（西瓜书）', author: '周志华', why: '训练数据的组织、模型评估与误差分析的理论根基' },
      { title: '动手学深度学习', author: '阿斯顿·张、李沐 等', why: '边跑代码边学训练，与训练师日常工作最贴合' },
    ],
  },
  '数据标注工程师': {
    videos: [{ title: '标注自己的语义分割数据集（同济子豪兄）', url: 'https://www.bilibili.com/video/BV1uu4y1Q7Rt', source: 'B站公开课', note: '从标注工具到数据集制作的实战全流程' }],
    docs: [
      { title: 'Label Studio 文档', url: 'https://labelstud.io/guide', source: '官方文档', note: '开源标注平台，工业界标注流程的标准参考' },
      { title: '智源社区', url: 'https://hub.baai.ac.cn/', source: '技术社区', note: '国内 AI 数据与开源工作的活跃社区', kind: 'community' },
    ],
    books: [
      { title: '动手学深度学习', author: '阿斯顿·张、李沐 等', why: '懂下游模型才知道该标注什么、标到什么程度' },
      { title: 'Python编程：从入门到实践', author: 'Eric Matthes', why: '写标注脚本与数据清洗工具的基本功' },
    ],
  },
  '数据标注项目经理': {
    videos: [{ title: 'YOLOv8 一小时掌握：从 0 开始搭建部署（霹雳吧啦Wz）', url: 'https://www.bilibili.com/video/BV1dW4y1U7GJ', source: 'B站公开课', note: '看懂数据如何变成模型效果，才能管好标注团队' }],
    docs: [
      { title: 'Label Studio 文档', url: 'https://labelstud.io/guide', source: '官方文档', note: '标注任务分派、质检、验收的平台化方案' },
      { title: 'Datawhale 开源社区', url: 'https://github.com/datawhalechina', source: '技术社区', note: '国内最大的开源学习社区，常有数据项目协作', kind: 'community' },
    ],
    books: [
      { title: '机器学习（西瓜书）', author: '周志华', why: '理解数据质量与模型指标的关系，制定验收标准' },
      { title: '卓有成效的工程师', author: 'Edmond Lau', why: '团队流程设计与效率提升的方法论' },
    ],
  },
  'Agent工作流工程师': {
    videos: [{ title: '吴恩达：AI Agent 工作流设计', url: 'https://www.bilibili.com/video/BV1CaVY6qErg', source: 'B站公开课', note: '反思/工具/规划/多智能体协作四大设计模式' }],
    docs: [
      { title: 'LangChain 文档', url: 'https://python.langchain.com/docs/introduction/', source: '官方文档', note: 'Agent/工具调用/编排链的事实标准框架' },
      { title: 'reddit · r/LocalLLaMA', url: 'https://www.reddit.com/r/LocalLLaMA/', source: '技术社区', note: '开源模型与 Agent 实践最活跃的社区', kind: 'community' },
    ],
    books: [
      { title: '人工智能：现代方法', author: 'Stuart Russell、Peter Norvig', why: '智能体规划的教科书级理论来源' },
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '工作流背后的数据一致性与可靠性设计' },
    ],
  },
  'RAG系统工程师': {
    videos: [{ title: '黑马程序员：大模型 RAG 与 Agent 智能体项目实战', url: 'https://www.bilibili.com/video/BV1yjz5BLEoY', source: 'B站公开课', note: '基于 LangChain 的 RAG 全链路实战' }],
    docs: [
      { title: 'LlamaIndex 文档', url: 'https://docs.llamaindex.ai/', source: '官方文档', note: '检索增强场景最专精的框架文档' },
      { title: 'Hugging Face 论坛', url: 'https://discuss.huggingface.co/', source: '技术社区', note: 'Embedding/向量检索/模型选型的讨论主场', kind: 'community' },
    ],
    books: [
      { title: '深度学习进阶：自然语言处理', author: '斋藤康毅', why: '从词向量到 Transformer，RAG 检索质量的理论基础' },
      { title: '人工智能：现代方法', author: 'Stuart Russell、Peter Norvig', why: '搜索与知识表示的体系化背景' },
    ],
  },
  'AI评测工程师': {
    videos: [{ title: '吴恩达：提示工程（Prompt Engineering）', url: 'https://www.bilibili.com/video/BV1K85X6eErq', source: 'B站公开课', note: '评测从写好基准提示词开始' }],
    docs: [
      { title: 'OpenAI Evals 开源框架', url: 'https://github.com/openai/evals', source: '官方文档', note: '业界最知名的 LLM 评测框架源码与文档' },
      { title: 'Papers with Code', url: 'https://paperswithcode.com/', source: '技术社区', note: '基准与 SOTA 排行榜的汇总站', kind: 'community' },
    ],
    books: [
      { title: '统计学习方法', author: '李航', why: '评估指标、显著性、泛化误差的数学根基' },
      { title: '机器学习（西瓜书）', author: '周志华', why: '模型比较与偏差-方差分析的标准教材' },
    ],
  },
  'AI对齐研究员': {
    videos: [{ title: '人工智能赋能新质生产力：技术与实践（南京大学）', url: 'https://www.icourse163.org/course/NJU-1472560172', source: '中国大学MOOC', note: '大模型前沿与工业落地案例，理解模型能力边界' }],
    docs: [
      { title: 'arXiv cs.AI 最新论文', url: 'https://arxiv.org/list/cs.AI/recent', source: '官方文档', note: '对齐与安全方向的论文一手来源' },
      { title: 'Alignment Forum', url: 'https://www.alignmentforum.org/', source: '技术社区', note: '全球对齐研究最核心的讨论社区', kind: 'community' },
    ],
    books: [
      { title: '超级智能', author: 'Nick Bostrom', why: '对齐问题的奠基性著作' },
      { title: 'AI 3.0', author: 'Melanie Mitchell', why: '理解当前 AI 的真实能力与局限' },
    ],
  },
  '推理优化工程师': {
    videos: [{ title: '大语言模型基础：从零到一实现之路（南京大学）', url: 'https://www.bilibili.com/video/BV1EJH9zRE2p', source: 'B站公开课', note: '含 KVCache、解码策略、推理技术的系统课程' }],
    docs: [
      { title: 'vLLM 文档', url: 'https://docs.vllm.ai/', source: '官方文档', note: '高吞吐推理引擎的标准参考' },
      { title: 'reddit · r/LocalLLaMA', url: 'https://www.reddit.com/r/LocalLLaMA/', source: '技术社区', note: '量化/推理框架的实战讨论最密集处', kind: 'community' },
    ],
    books: [
      { title: '深入理解计算机系统', author: 'Randal Bryant 等', why: '内存层次与并发的底层视角' },
      { title: 'GPU高性能编程CUDA实战', author: 'Jason Sanders、Edward Kandrot', why: '写高效 GPU 内核的经典入门' },
    ],
  },
  '合成数据工程师': {
    videos: [{ title: '李宏毅2021/2022春机器学习课程', url: 'https://www.bilibili.com/video/BV1Wv411h7kN', source: 'B站公开课', note: '生成模型（VAE/GAN/Diffusion）讲解最清楚的系统课' }],
    docs: [
      { title: 'Diffusers 文档', url: 'https://huggingface.co/docs/diffusers/index', source: '官方文档', note: '生成式模型合成数据的工具链标准' },
      { title: 'Stack Overflow · deep-learning 标签', url: 'https://stackoverflow.com/questions/tagged/deep-learning', source: '技术社区', note: '生成模型问答', kind: 'community' },
    ],
    books: [
      { title: '深度学习（花书）', author: 'Ian Goodfellow 等', why: 'GAN 发明者亲写，生成模型的理论全书' },
      { title: '统计学习方法', author: '李航', why: '数据分布与采样的数学基础' },
    ],
  },
  '具身智能工程师': {
    videos: [{ title: '人工智能赋能新质生产力：技术与实践（南京大学）', url: 'https://www.icourse163.org/course/NJU-1472560172', source: '中国大学MOOC', note: '含具身智能与工业巡检机器人专题章节' }],
    docs: [
      { title: 'ROS 官方文档', url: 'https://docs.ros.org/', source: '官方文档', note: '机器人操作系统的行业标准文档' },
      { title: 'robotics · Stack Exchange', url: 'https://robotics.stackexchange.com/', source: '技术社区', note: '机器人硬件与算法的问答社区', kind: 'community' },
    ],
    books: [
      { title: '机器人学导论', author: 'John Craig', why: '运动学与控制的经典教材' },
      { title: '概率机器人', author: 'Sebastian Thrun', why: '定位、建图、感知融合的权威著作' },
    ],
  },
  'AI安全研究员': {
    videos: [{ title: '李宏毅2021/2022春机器学习课程', url: 'https://www.bilibili.com/video/BV1Wv411h7kN', source: 'B站公开课', note: '含对抗攻击、模型鲁棒性等安全相关章节' }],
    docs: [
      { title: 'MITRE ATLAS', url: 'https://atlas.mitre.org/', source: '官方文档', note: '针对 AI 系统攻击手法的知识库' },
      { title: 'FreeBuf', url: 'https://www.freebuf.com/', source: '技术社区', note: '国内安全从业者聚集地，AI 安全话题活跃', kind: 'community' },
    ],
    books: [
      { title: '白帽子讲Web安全', author: '吴翰清', why: '安全思维的总纲，跨到 AI 攻防同样适用' },
      { title: 'AI 3.0', author: 'Melanie Mitchell', why: '理解模型为何可被欺骗' },
    ],
  },
  '边缘AI工程师': {
    videos: [{ title: '【YOLOv8】一小时掌握，从 0 开始搭建部署（霹雳吧啦Wz）', url: 'https://www.bilibili.com/video/BV1dW4y1U7GJ', source: 'B站公开课', note: '边缘设备部署是边缘 AI 的核心动手场景' }],
    docs: [
      { title: 'NVIDIA Jetson 文档', url: 'https://docs.nvidia.com/jetson/', source: '官方文档', note: '边缘 AI 硬件平台的官方开发文档' },
      { title: 'NVIDIA 开发者论坛', url: 'https://forums.developer.nvidia.com/', source: '技术社区', note: 'Jetson/TensorRT 部署问题的答疑主场', kind: 'community' },
    ],
    books: [
      { title: '嵌入式系统：硬件、软件与软硬件协同', author: 'Frank Vahid、Tony Givargis', why: '嵌入式资源约束思维的教科书' },
      { title: '深度学习（花书）', author: 'Ian Goodfellow 等', why: '模型压缩与加速的理论背景' },
    ],
  },
  '大模型应用工程师': {
    videos: [{ title: '吴恩达：提示工程（Prompt Engineering）', url: 'https://www.bilibili.com/video/BV1K85X6eErq', source: 'B站公开课', note: '大模型应用开发的第一课' }],
    docs: [
      { title: 'OpenAI API 文档', url: 'https://platform.openai.com/docs/introduction', source: '官方文档', note: '最通用的 LLM API 设计范式参考' },
      { title: 'reddit · r/LocalLLaMA', url: 'https://www.reddit.com/r/LocalLLaMA/', source: '技术社区', note: '模型选型与开源方案的实时风向标', kind: 'community' },
    ],
    books: [
      { title: '这就是ChatGPT', author: 'Stephen Wolfram', why: '一册讲透 LLM 工作原理的通俗读物' },
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '把 LLM 接进生产系统的工程功底' },
    ],
  },
  '语音合成工程师': {
    videos: [{ title: 'RVC 变声器官方教程：10分钟克隆你的声音', url: 'https://www.bilibili.com/video/BV1pm4y1z7Gm', source: 'B站公开课', note: '声音克隆从训练到推理的完整上手' }],
    docs: [
      { title: 'IndexTTS 开源仓库', url: 'https://github.com/index-tts/index-tts', source: '官方文档', note: 'B站开源的自回归语音合成系统' },
      { title: 'Hugging Face 论坛', url: 'https://discuss.huggingface.co/', source: '技术社区', note: 'TTS 声学模型与声码器的讨论区', kind: 'community' },
    ],
    books: [
      { title: '解析深度学习：语音识别实践', author: '俞栋、邓力', why: '语音深度学习的权威专著' },
      { title: '语音信号处理', author: '赵力', why: '语音信号的数字处理基础' },
    ],
  },
  '数字人训练师': {
    videos: [{ title: '生成式人工智能的应用与实践（含数字人构建）', url: 'https://www.icourse163.org/spoc/course/NBCJXY-1474927189', source: '中国大学MOOC', note: '含数字人构建的实操教学章节' }],
    docs: [
      { title: 'NVIDIA Omniverse 文档', url: 'https://docs.omniverse.nvidia.com/', source: '官方文档', note: '3D 数字人与虚拟场景的工业化工具链' },
      { title: 'LiveVideoStack', url: 'https://www.livevideostack.com/', source: '技术社区', note: '音视频与实时互动领域的专业社区', kind: 'community' },
    ],
    books: [
      { title: 'Python深度学习', author: 'François Chollet', why: 'Keras 之父亲写，理解驱动数字人的模型' },
      { title: '计算机图形学：原理及实践', author: 'John Hughes 等', why: '3D 建模与渲染的百科全书' },
    ],
  },
  'AI合规专员': {
    videos: [{ title: '罗翔：个人信息保护法解读', url: 'https://www.bilibili.com/video/BV1iF4m1j7W7', source: 'B站公开课', note: '数据合规的法律基础课' }],
    docs: [
      { title: '欧盟人工智能法案（AI Act）官网', url: 'https://artificialintelligenceact.eu/', source: '官方文档', note: '全球首部 AI 综合立法的条文与解读' },
      { title: 'IAPP 国际隐私专业协会', url: 'https://iapp.org/', source: '技术社区', note: '隐私与数据合规从业者的全球组织', kind: 'community' },
    ],
    books: [
      { title: '算法霸权', author: 'Cathy O\'Neil', why: '算法歧视与问责的经典警示' },
      { title: 'AI 3.0', author: 'Melanie Mitchell', why: '判断 AI 能力边界才谈得上合规审查' },
    ],
  },
  'AI Agent产品经理': {
    videos: [{ title: '吴恩达：AI Agent 工作流设计', url: 'https://www.bilibili.com/video/BV1CaVY6qErg', source: 'B站公开课', note: '理解 Agent 能力边界才能定义产品' }],
    docs: [
      { title: 'Anthropic Claude 文档', url: 'https://docs.anthropic.com/', source: '官方文档', note: '工具调用与 Agent 设计的最佳实践文档' },
      { title: 'reddit · r/OpenAI', url: 'https://www.reddit.com/r/OpenAI/', source: '技术社区', note: 'LLM 产品用户反馈社区', kind: 'community' },
    ],
    books: [
      { title: '人人都是AI产品经理', author: '陆通', why: 'AI 产品经理岗位的直接方法论' },
      { title: '俞军产品方法论', author: '俞军', why: '产品决策与用户价值的底层框架' },
    ],
  },
  'AI医疗产品经理': {
    videos: [{ title: '大数据时代的医疗革命（山东大学）', url: 'https://www.icourse163.org/learn/SDU-1455250166', source: '中国大学MOOC', note: '智慧医疗与远程诊疗的通识全景课' }],
    docs: [
      { title: 'HL7 FHIR 标准', url: 'https://www.hl7.org/fhir/', source: '官方文档', note: '医疗数据交换的国际标准' },
      { title: '丁香园', url: 'https://www.dxy.cn/', source: '技术社区', note: '国内医疗从业者聚集地，理解医生用户', kind: 'community' },
    ],
    books: [
      { title: '深度医疗', author: 'Eric Topol', why: 'AI 医疗的奠基性通俗著作' },
      { title: '俞军产品方法论', author: '俞军', why: '医疗产品的用户价值判断框架' },
    ],
  },
  'AI自动化咨询师': {
    videos: [{ title: '人工智能赋能新质生产力：技术与实践（南京大学）', url: 'https://www.icourse163.org/course/NJU-1472560172', source: '中国大学MOOC', note: 'AI 与产业结合的落地案例库' }],
    docs: [
      { title: 'n8n 文档', url: 'https://docs.n8n.io/', source: '官方文档', note: '工作流自动化的开源方案标准' },
      { title: 'Indie Hackers', url: 'https://www.indiehackers.com/', source: '技术社区', note: '自动化工具与咨询变现的实战社区', kind: 'community' },
    ],
    books: [
      { title: '卓有成效的工程师', author: 'Edmond Lau', why: '效率杠杆思维是自动化咨询的核心' },
      { title: '重来', author: 'Jason Fried、David Heinemeier Hansson', why: '小团队业务改造的务实方法论' },
    ],
  },
  '空间数据科学家': {
    videos: [{ title: '【高翔】视觉SLAM十四讲', url: 'https://www.bilibili.com/video/BV16t411g7FR', source: 'B站公开课', note: '空间定位与建图的数学基础课' }],
    docs: [
      { title: 'PostGIS 文档', url: 'https://postgis.net/documentation/', source: '官方文档', note: '空间数据库的事实标准扩展' },
      { title: 'Stack Overflow · geospatial 标签', url: 'https://stackoverflow.com/questions/tagged/geospatial', source: '技术社区', note: '地理空间数据问答', kind: 'community' },
    ],
    books: [
      { title: '地理信息系统导论', author: 'Kang-tsung Chang', why: 'GIS 的体系化教材' },
      { title: '统计学习方法', author: '李航', why: '空间数据的建模与推断基础' },
    ],
  },
  'AI训练数据策划': {
    videos: [{ title: '标注自己的语义分割数据集（同济子豪兄）', url: 'https://www.bilibili.com/video/BV1uu4y1Q7Rt', source: 'B站公开课', note: '数据集设计的实操起点' }],
    docs: [
      { title: 'Kaggle 官方文档', url: 'https://www.kaggle.com/docs', source: '官方文档', note: '数据集策划与竞赛基准的最大平台' },
      { title: 'Kaggle Discussions', url: 'https://www.kaggle.com/discussions', source: '技术社区', note: '数据集质量与划分策略的讨论区', kind: 'community' },
    ],
    books: [
      { title: '机器学习（西瓜书）', author: '周志华', why: '数据分布、偏差与数据集设计理论' },
      { title: '赤裸裸的统计学', author: 'Charles Wheelan', why: '数据选择的统计直觉与陷阱' },
    ],
  },
  '机器人调度算法工程师': {
    videos: [{ title: '【高翔】视觉SLAM十四讲', url: 'https://www.bilibili.com/video/BV16t411g7FR', source: 'B站公开课', note: '多机定位与路径规划的算法基础' }],
    docs: [
      { title: 'ROS 官方文档', url: 'https://docs.ros.org/', source: '官方文档', note: '机器人系统集成的标准框架文档' },
      { title: 'robotics · Stack Exchange', url: 'https://robotics.stackexchange.com/', source: '技术社区', note: '调度与运动规划的专业问答', kind: 'community' },
    ],
    books: [
      { title: '概率机器人', author: 'Sebastian Thrun', why: '不确定性下的机器人决策经典' },
      { title: '算法导论', author: 'Thomas Cormen 等', why: '调度与图算法的理论总纲' },
    ],
  },
  '可穿戴健康数据科学家': {
    videos: [{ title: '健康信息学（含可穿戴设备与健康大数据）', url: 'https://www.icourse163.org/learn/TSK-1461460171', source: '中国大学MOOC', note: '可穿戴设备与移动健康的交叉入门' }],
    docs: [
      { title: 'Apple HealthKit 文档', url: 'https://developer.apple.com/documentation/healthkit', source: '官方文档', note: '健康数据接入的最大平台标准' },
      { title: 'reddit · r/datascience', url: 'https://www.reddit.com/r/datascience/', source: '技术社区', note: '健康数据分析的职业与方法讨论', kind: 'community' },
    ],
    books: [
      { title: '赤裸裸的统计学', author: 'Charles Wheelan', why: '生理数据解读的统计直觉' },
      { title: '深度医疗', author: 'Eric Topol', why: '可穿戴数据改变医疗的产业视角' },
    ],
  },
  '睡眠科技产品经理': {
    videos: [{ title: '大数据时代的医疗革命（山东大学）', url: 'https://www.icourse163.org/learn/SDU-1455250166', source: '中国大学MOOC', note: '远程健康监测与个性化医疗的产品语境' }],
    docs: [
      { title: 'Sleep Foundation', url: 'https://www.sleepfoundation.org/', source: '官方文档', note: '睡眠科学循证资料的权威站点' },
      { title: 'reddit · r/QuantifiedSelf', url: 'https://www.reddit.com/r/QuantifiedSelf/', source: '技术社区', note: '自我量化与睡眠追踪用户的一手反馈', kind: 'community' },
    ],
    books: [
      { title: '我们为什么要睡觉', author: 'Matthew Walker', why: '睡眠科学的必读科普' },
      { title: '俞军产品方法论', author: '俞军', why: '健康产品的用户价值判断' },
    ],
  },

  // ===== 科技批补全第 3 段（云/存储/网络/安全/芯片，2026-10-12） =====
  '存储工程师': {
    videos: [{ title: '尚硅谷 Kubernetes 教程（K8s 入门到精通）', url: 'https://www.bilibili.com/video/BV1w4411y7Go', source: 'B站公开课', note: '存储编排（PV/PVC/StorageClass）的系统课' }],
    docs: [
      { title: 'Ceph 官方文档', url: 'https://docs.ceph.com/', source: '官方文档', note: '分布式存储事实标准的手册' },
      { title: 'Ceph Discourse 论坛', url: 'https://discuss.ceph.io/', source: '技术社区', note: 'Ceph 官方社区，存储难题的答疑主场', kind: 'community' },
    ],
    books: [
      { title: 'UNIX/Linux系统管理技术手册', author: 'Evi Nemeth 等', why: '存储与系统运维的百科全书' },
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '存储引擎与一致性模型的经典' },
    ],
  },
  'CDN工程师': {
    videos: [{ title: '尚硅谷云原生课程（K8s + Docker + DevOps）', url: 'https://www.bilibili.com/video/BV13Q4y1C7hS', source: 'B站公开课', note: 'Nginx、负载均衡与网络分发的基础盘' }],
    docs: [
      { title: 'Cloudflare Learning Center', url: 'https://www.cloudflare.com/learning/', source: '官方文档', note: 'CDN/缓存/DNS 概念讲得最透的免费资料库' },
      { title: 'reddit · r/sysadmin', url: 'https://www.reddit.com/r/sysadmin/', source: '技术社区', note: '全球系统管理员聚集地', kind: 'community' },
    ],
    books: [
      { title: 'HTTP权威指南', author: 'David Gourley 等', why: '缓存与代理机制的圣经' },
      { title: 'Web性能权威指南', author: 'Ilya Grigorik', why: 'Google 性能专家写的网络优化手册' },
    ],
  },
  '流媒体工程师': {
    videos: [{ title: '直播网站理论与实战（Java + FFmpeg + Nginx + HLS）', url: 'https://www.bilibili.com/video/BV1qQ4y1X77f', source: 'B站公开课', note: '推流、转码、分发全链路的实战课' }],
    docs: [
      { title: 'WebRTC 官网', url: 'https://webrtc.org/', source: '官方文档', note: '实时音视频的标准协议与 API 文档' },
      { title: 'Stack Overflow · webrtc 标签', url: 'https://stackoverflow.com/questions/tagged/webrtc', source: '技术社区', note: '实时音视频问题的全球问答库', kind: 'community' },
    ],
    books: [
      { title: '音视频开发进阶指南', author: '展晓凯', why: '国内音视频开发的系统入门书' },
      { title: 'FFmpeg从入门到精通', author: '刘歧', why: 'FFmpeg 核心贡献者亲写的手册书' },
    ],
  },
  'AIOps工程师': {
    videos: [{ title: '尚硅谷 Kubernetes 教程（K8s 入门到精通）', url: 'https://www.bilibili.com/video/BV1w4411y7Go', source: 'B站公开课', note: '智能运维的对象就是 K8s 上的系统' }],
    docs: [
      { title: 'Prometheus 官方文档', url: 'https://prometheus.io/docs/introduction/overview/', source: '官方文档', note: '监控告警事实标准的文档' },
      { title: 'devops · Stack Exchange', url: 'https://devops.stackexchange.com/', source: '技术社区', note: 'DevOps 实践的问答社区', kind: 'community' },
    ],
    books: [
      { title: 'SRE：Google运维解密', author: 'Google SRE 团队', why: '运维方法论的行业标准' },
      { title: '凤凰架构', author: '周志明', why: '免费开源的架构稳定性全书' },
    ],
  },
  '可观测性工程师': {
    videos: [{ title: '尚硅谷云原生课程（K8s + Docker + DevOps）', url: 'https://www.bilibili.com/video/BV13Q4y1C7hS', source: 'B站公开课', note: '监控体系的平台底座' }],
    docs: [
      { title: 'Grafana 官方文档', url: 'https://grafana.com/docs/', source: '官方文档', note: '可观测性平台的文档中枢' },
      { title: 'Grafana 社区论坛', url: 'https://community.grafana.com/', source: '技术社区', note: 'Grafana 官方社区', kind: 'community' },
    ],
    books: [
      { title: 'SRE：Google运维解密', author: 'Google SRE 团队', why: '监控与告警设计的原则来源' },
      { title: '性能之巅：洞悉系统、企业与云计算', author: 'Brendan Gregg', why: '性能分析大师的方法论' },
    ],
  },
  '混沌工程工程师': {
    videos: [{ title: '【尚硅谷】Prometheus+Grafana 监控告警系统', url: 'https://www.bilibili.com/video/BV1HT4y1Z7vR', source: 'B站公开课', note: '故障发现与演练的观测底座' }],
    docs: [
      { title: 'Chaos Mesh 文档', url: 'https://chaos-mesh.org/docs/', source: '官方文档', note: 'PingCap 开源的 K8s 混沌工程平台' },
      { title: 'reddit · r/devops', url: 'https://www.reddit.com/r/devops/', source: '技术社区', note: 'DevOps 实践者的全球社区', kind: 'community' },
    ],
    books: [
      { title: 'SRE：Google运维解密', author: 'Google SRE 团队', why: '故障演练与预案的理论底盘' },
      { title: '凤凰架构', author: '周志明', why: '服务容错与不可变基础设施的中文原创' },
    ],
  },
  '云成本优化师': {
    videos: [{ title: '云计算技术与应用（河海大学·国家一流课程）', url: 'https://www.icourse163.org/course/JSJZY-1001755117', source: '中国大学MOOC', note: '云服务模式与计费逻辑的系统课' }],
    docs: [
      { title: 'AWS Well-Architected Framework', url: 'https://docs.aws.amazon.com/wellarchitected/', source: '官方文档', note: '成本优化支柱（Cost Optimization Pillar）的标准方法论' },
      { title: 'reddit · r/aws', url: 'https://www.reddit.com/r/aws/', source: '技术社区', note: '云账单与省钱技巧的讨论区', kind: 'community' },
    ],
    books: [
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '理解成本背后的存储与计算权衡' },
      { title: '凤凰架构', author: '周志明', why: '云原生架构决策的中文参考' },
    ],
  },
  '运维开发工程师': {
    videos: [{ title: '尚硅谷 Kubernetes 教程（K8s 入门到精通）', url: 'https://www.bilibili.com/video/BV1w4411y7Go', source: 'B站公开课', note: '运维开发的主战场平台课' }],
    docs: [
      { title: 'Ansible 官方文档', url: 'https://docs.ansible.com/', source: '官方文档', note: '自动化运维最普及的工具文档' },
      { title: 'devops · Stack Exchange', url: 'https://devops.stackexchange.com/', source: '技术社区', note: '自动化与发布流程的问答', kind: 'community' },
    ],
    books: [
      { title: '鸟哥的Linux私房菜：基础学习篇', author: '鸟哥', why: '中文 Linux 入门的常青树' },
      { title: '流畅的Python', author: 'Luciano Ramalho', why: '写运维工具脚本的进阶 Python 功底' },
    ],
  },
  '系统集成工程师': {
    videos: [{ title: '数字化设计与仿真（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1470168170', source: '中国大学MOOC', note: '工业系统集成与虚拟调试的实操课' }],
    docs: [
      { title: 'OPC UA 标准文档', url: 'https://reference.opcfoundation.org/', source: '官方文档', note: '工业互联通信的事实标准' },
      { title: '电子发烧友论坛', url: 'https://bbs.elecfans.com/', source: '技术社区', note: '国内电子与工控工程师社区', kind: 'community' },
    ],
    books: [
      { title: '企业IT架构转型之道', author: '钟华', why: '中台与系统整合的国内实践经典' },
      { title: '凤凰架构', author: '周志明', why: '异构系统集成的架构模式' },
    ],
  },
  'TEE可信计算工程师': {
    videos: [{ title: '斯坦福大学：密码学公开课', url: 'https://www.bilibili.com/video/BV1Rf421o79E', source: 'B站公开课', note: '可信计算的密码学根基' }],
    docs: [
      { title: 'ARM 开发者文档', url: 'https://developer.arm.com/documentation', source: '官方文档', note: 'TrustZone 等 TEE 硬件技术的官方手册' },
      { title: 'security · Stack Exchange', url: 'https://security.stackexchange.com/', source: '技术社区', note: '信息安全的专业问答社区', kind: 'community' },
    ],
    books: [
      { title: '图解密码技术', author: '结城浩', why: '密码学入门的最好中文读物之一' },
      { title: '加密与解密', author: '段钢', why: '国内软件安全与逆向的招牌书' },
    ],
  },
  'Web3安全审计师': {
    videos: [{ title: '斯坦福大学：密码学公开课', url: 'https://www.bilibili.com/video/BV1Rf421o79E', source: 'B站公开课', note: '审计智能合约漏洞的密码学前提' }],
    docs: [
      { title: 'OpenZeppelin 文档', url: 'https://docs.openzeppelin.com/', source: '官方文档', note: '合约安全组件与审计工具的标准' },
      { title: 'Ethereum Stack Exchange', url: 'https://ethereum.stackexchange.com/', source: '技术社区', note: '以太坊开发与安全的第一问答社区', kind: 'community' },
    ],
    books: [
      { title: '精通以太坊', author: 'Andreas Antonopoulos、Gavin Wood', why: '以太坊原理的权威著作（开源免费）' },
      { title: '白帽子讲Web安全', author: '吴翰清', why: '安全审计思维的通用底座' },
    ],
  },
  '零知识证明工程师': {
    videos: [{ title: 'Berkeley 零知识证明 MOOC（zk-learning）', url: 'https://zk-learning.org/', source: 'Berkeley 公开课', note: '全球最系统的 ZKP 免费公开课（含全部视频）' }],
    docs: [
      { title: 'Circom 文档', url: 'https://docs.circom.io/', source: '官方文档', note: '最流行的 ZK 电路编写语言文档' },
      { title: 'ethresear.ch', url: 'https://ethresear.ch/', source: '技术社区', note: '以太坊前沿研究论坛，ZKP 讨论核心', kind: 'community' },
    ],
    books: [
      { title: '图解密码技术', author: '结城浩', why: '零知识证明所需的密码学直觉' },
      { title: '精通以太坊', author: 'Andreas Antonopoulos、Gavin Wood', why: 'ZK 落地主战场以太坊的全景' },
    ],
  },
  '空间计算开发者': {
    videos: [{ title: 'VR博物馆项目实战教程（Unity 官方认证讲师）', url: 'https://www.bilibili.com/video/BV1gR4y1G7Py', source: 'B站公开课', note: '从 0 到 1 的完整 VR 项目课' }],
    docs: [
      { title: 'Apple visionOS 开发者文档', url: 'https://developer.apple.com/visionos/', source: '官方文档', note: '空间计算旗舰平台的标准文档' },
      { title: 'reddit · r/augmentedreality', url: 'https://www.reddit.com/r/augmentedreality/', source: '技术社区', note: 'AR/VR 从业者与爱好者的社区', kind: 'community' },
    ],
    books: [
      { title: 'Unity VR虚拟现实完全自学教程', author: '邵伟', why: 'Unity 官方认证讲师的 VR 教材' },
      { title: '3D数学基础：图形与游戏开发', author: 'Fletcher Dunn', why: '空间计算的数学地基' },
    ],
  },
  'VR游戏开发': {
    videos: [{ title: 'UnityVR - SteamVR2.5.0讲解', url: 'https://www.bilibili.com/video/BV1aZ4y1u7xt', source: 'B站公开课', note: 'VR 交互开发的主流插件实操' }],
    docs: [
      { title: 'Unity 官方中文文档（XR）', url: 'https://docs.unity.cn/cn/current/Manual/XR.html', source: '官方文档', note: 'XR Interaction Toolkit 等官方手册' },
      { title: 'indienova', url: 'https://indienova.com/', source: '技术社区', note: '国内独立游戏开发者社区', kind: 'community' },
    ],
    books: [
      { title: 'Unity Shader入门精要', author: '冯乐乐', why: 'VR 渲染性能优化的必经之路' },
      { title: '游戏设计艺术', author: 'Jesse Schell', why: '沉浸感设计的理论经典' },
    ],
  },
  '芯片验证工程师': {
    videos: [{ title: 'SystemVerilog每天5分钟', url: 'https://www.bilibili.com/video/BV1kY41147QN', source: 'B站公开课', note: 'SV 语法碎片化系统学习' }],
    docs: [
      { title: 'Verification Guide', url: 'https://www.verificationguide.com/p/home.html', source: '官方文档', note: 'SV/UVM 教程与面试题库站点' },
      { title: 'EETOP 论坛', url: 'https://bbs.eetop.cn/', source: '技术社区', note: '国内 IC 设计社区的老牌大本营', kind: 'community' },
    ],
    books: [
      { title: 'SystemVerilog验证：测试平台编写指南', author: 'Chris Spear', why: '业内人手一本的"绿皮书"' },
      { title: 'UVM实战', author: '张强', why: '中文 UVM 的"白皮书"' },
    ],
  },
  'EDA工具开发': {
    videos: [{ title: 'SystemVerilog每天5分钟', url: 'https://www.bilibili.com/video/BV1kY41147QN', source: 'B站公开课', note: 'EDA 工具服务的正是 SV/Verilog 生态' }],
    docs: [
      { title: 'OpenROAD 开源EDA项目', url: 'https://theopenroadproject.org/', source: '官方文档', note: '开源 RTL-to-GDS 流程，学 EDA 内核的最好标本' },
      { title: 'EETOP 论坛', url: 'https://bbs.eetop.cn/', source: '技术社区', note: '国内 IC/EDA 资料与讨论最全的论坛', kind: 'community' },
    ],
    books: [
      { title: 'Electronic Design Automation: Synthesis, Verification, and Test', author: 'Laung-Terng Wang 等', why: 'EDA 综合/验证/测试三大板块的体系全书' },
      { title: '数字设计和计算机体系结构', author: 'David Harris、Sarah Harris', why: '理解 EDA 输出物的数字底座' },
    ],
  },
  '芯片驱动工程师': {
    videos: [{ title: '韦东山：70天30节Linux驱动开发快速入门', url: 'https://www.bilibili.com/video/BV1Yb4y1t7Uj', source: 'B站公开课', note: '国内嵌入式驱动教学的标杆课程' }],
    docs: [
      { title: 'Linux 内核文档', url: 'https://www.kernel.org/doc/html/latest/', source: '官方文档', note: '驱动子系统的官方手册' },
      { title: 'LWN.net', url: 'https://lwn.net/', source: '技术社区', note: 'Linux 内核社区的最深观察站', kind: 'community' },
    ],
    books: [
      { title: 'Linux设备驱动开发详解', author: '宋宝华', why: '中文驱动开发第一书' },
      { title: 'Linux内核设计与实现', author: 'Robert Love', why: '内核机制的精炼入门' },
    ],
  },

  // ===== 科技批补全第 4 段（工程与商业，2026-10-12） =====
  '低代码平台开发': {
    videos: [{ title: 'Python 云端系统开发入门（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1001871002', source: '中国大学MOOC', note: '低代码背后的云端应用组装思维' }],
    docs: [
      { title: 'Microsoft Power Platform 文档', url: 'https://learn.microsoft.com/power-platform/', source: '官方文档', note: '全球最大低代码平台的官方手册' },
      { title: 'reddit · r/nocode', url: 'https://www.reddit.com/r/nocode/', source: '技术社区', note: '无码/低代码从业者的全球社区', kind: 'community' },
    ],
    books: [
      { title: '人月神话', author: 'Frederick Brooks', why: '理解为什么"组装"与"生成"改变交付节奏' },
      { title: '从零开始学架构', author: '李运华', why: '平台化设计思维的中文实践书' },
    ],
  },
  '企业架构师': {
    videos: [{ title: '软件项目管理（北京邮电大学·国家一流课程）', url: 'https://www.icourse163.org/course/-1003557005', source: '中国大学MOOC', note: '架构之上的治理与计划全景' }],
    docs: [
      { title: 'TOGAF 标准资源库', url: 'https://pubs.opengroup.org/togaf/', source: '官方文档', note: '企业架构事实标准的官方文献' },
      { title: 'reddit · r/ExperiencedDevs', url: 'https://www.reddit.com/r/ExperiencedDevs/', source: '技术社区', note: '资深工程师的职业与架构讨论', kind: 'community' },
    ],
    books: [
      { title: '企业IT架构转型之道', author: '钟华', why: '中台与大型企业架构的国内经典' },
      { title: '架构整洁之道', author: 'Robert Martin', why: '架构原则的集大成之作' },
    ],
  },
  '代码审计工程师': {
    videos: [{ title: '【WEB安全】Java代码审计：Fortify 实战系列', url: 'https://www.bilibili.com/video/BV1Ev411E7qn', source: 'B站公开课', note: '企业级代码审计工具与手法实战' }],
    docs: [
      { title: 'OWASP 官网（代码审计指南）', url: 'https://owasp.org/', source: '官方文档', note: 'Web 安全审计规则的国际标准' },
      { title: '看雪论坛', url: 'https://bbs.pediy.com/', source: '技术社区', note: '国内安全审计与逆向的老牌社区', kind: 'community' },
    ],
    books: [
      { title: '代码审计：企业级Web代码安全架构', author: '郑树新', why: '国内代码审计的体系化教材' },
      { title: '白帽子讲Web安全', author: '吴翰清', why: '安全思维的入门必读' },
    ],
  },
  '仿真工程师': {
    videos: [{ title: '工程系统建模与仿真（东北大学）', url: 'https://www.icourse163.org/course/NEU-1486139170', source: '中国大学MOOC', note: '离散事件仿真的系统课（ARENA 实操）' }],
    docs: [
      { title: 'Simulink 官方文档', url: 'https://www.mathworks.com/help/simulink/', source: '官方文档', note: '系统仿真最通用工具的官方手册' },
      { title: '技术邻', url: 'https://www.jishulink.com/', source: '技术社区', note: '国内 CAE/仿真工程师聚集地', kind: 'community' },
    ],
    books: [
      { title: '数值分析', author: '李庆扬 等', why: '仿真算法的数学根基' },
      { title: '概率论与数理统计', author: '盛骤 等（浙大版）', why: '随机仿真的统计理论基础' },
    ],
  },
  '对日软件开发': {
    videos: [{ title: '商务日语（国家精品在线课程）', url: 'https://www.icourse163.org/course/detail.htm?cid=1206804811', source: '中国大学MOOC', note: '日企工作场景的商务日语实战' }],
    docs: [
      { title: 'IPA 信息处理推进机构', url: 'https://www.ipa.go.jp/', source: '官方文档', note: '日本 IT 行业标准与开发规范的官方机构' },
      { title: 'V2EX · 程序员节点', url: 'https://www.v2ex.com/go/programmer', source: '技术社区', note: '国内程序员社区，有对日外包实战讨论', kind: 'community' },
    ],
    books: [
      { title: '新版中日交流标准日本语（中级）', author: '人民教育出版社', why: '对日工程师的语言基础盘' },
      { title: '人月神话', author: 'Frederick Brooks', why: '理解日式瀑布流开发文化的对照物' },
    ],
  },
  'Sitebuilder建站工程师': {
    videos: [{ title: '手把手零基础 WordPress 建站教程', url: 'https://www.bilibili.com/video/BV1p5sueQED5', source: 'B站公开课', note: '建站工程师的主战场实操' }],
    docs: [
      { title: 'WordPress 官方文档', url: 'https://wordpress.org/documentation/', source: '官方文档', note: '全球 40% 网站的建站系统手册' },
      { title: 'reddit · r/webdev', url: 'https://www.reddit.com/r/webdev/', source: '技术社区', note: 'Web 开发者的最大社区', kind: 'community' },
    ],
    books: [
      { title: '深入浅出HTML与CSS（Head First）', author: 'Elisabeth Robson', why: '建站工程师的页面基本功' },
      { title: 'CSS权威指南', author: 'Eric Meyer', why: '样式定制的终极参考' },
    ],
  },
  '支付系统工程师': {
    videos: [{ title: '数字经济支付（西南财经大学）', url: 'https://www.icourse163.org/course/-1450179236', source: '中国大学MOOC', note: '支付体系、清算、第三方支付的系统课程' }],
    docs: [
      { title: '支付宝开放平台文档', url: 'https://opendocs.alipay.com/', source: '官方文档', note: '国内支付系统对接的两大标准之一' },
      { title: '掘金社区', url: 'https://juejin.cn/', source: '技术社区', note: '国内支付/交易系统实战文章最多的高质量社区', kind: 'community' },
    ],
    books: [
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '事务、一致性、幂等——支付系统的理论核心' },
      { title: '区块链：技术驱动金融', author: 'Melanie Swan', why: '理解数字货币与新型清算网络' },
    ],
  },
  'GitHub DevOps': {
    videos: [{ title: '尚硅谷云原生课程（K8s + Docker + DevOps）', url: 'https://www.bilibili.com/video/BV13Q4y1C7hS', source: 'B站公开课', note: 'CI/CD 流水线的平台视角' }],
    docs: [
      { title: 'GitHub Actions 官方文档', url: 'https://docs.github.com/actions', source: '官方文档', note: '全球最大代码托管平台的自动化标准' },
      { title: 'reddit · r/github', url: 'https://www.reddit.com/r/github/', source: '技术社区', note: 'GitHub 工作流的讨论社区', kind: 'community' },
    ],
    books: [
      { title: '持续交付', author: 'Jez Humble、David Farley', why: 'DevOps 理念的奠基之作' },
      { title: '凤凰架构', author: '周志明', why: '流水线与不可变基础设施的中文原创' },
    ],
  },
  '跨境电商技术开发': {
    videos: [{ title: '跨境电商（北京联合大学）', url: 'https://www.icourse163.org/course/BUU-1206457815', source: '中国大学MOOC', note: '平台规则、支付与物流的业务全景' }],
    docs: [
      { title: 'Shopify 开发者文档', url: 'https://shopify.dev/', source: '官方文档', note: '跨境电商建站平台的技术标准' },
      { title: 'reddit · r/ecommerce', url: 'https://www.reddit.com/r/ecommerce/', source: '技术社区', note: '跨境电商卖家与开发者的社区', kind: 'community' },
    ],
    books: [
      { title: '跨境电商运营：从基础到实践', author: '阿里巴巴商学院', why: '校企联合编写的行业教材' },
      { title: '增长黑客', author: 'Sean Ellis', why: '出海产品增长的方法论' },
    ],
  },
  '数字孪生工程师': {
    videos: [{ title: '数字化设计与仿真（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1470168170', source: '中国大学MOOC', note: '数字孪生建模与虚拟调试的实操课' }],
    docs: [
      { title: 'Azure Digital Twins 文档', url: 'https://learn.microsoft.com/azure/digital-twins/', source: '官方文档', note: '云厂商数字孪生服务的标准实现' },
      { title: '技术邻', url: 'https://www.jishulink.com/', source: '技术社区', note: '工业仿真与数字孪生的国内社区', kind: 'community' },
    ],
    books: [
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '物理世界数据化的存储与建模功底' },
      { title: '从零开始学架构', author: '李运华', why: '大规模工业系统的架构方法' },
    ],
  },
  'QA质量保证': {
    videos: [{ title: '质量管理与可靠性（东北大学）', url: 'https://www.icourse163.org/course/NEU-1461794176', source: '中国大学MOOC', note: '质量体系、SPC、抽样检验的体系课' }],
    docs: [
      { title: 'ISTQB 官网', url: 'https://www.istqb.org/', source: '官方文档', note: '软件测试国际认证的官方大纲' },
      { title: 'TesterHome', url: 'https://testerhome.com/', source: '技术社区', note: '国内测试工程师的活跃社区', kind: 'community' },
    ],
    books: [
      { title: 'Google软件测试之道', author: 'James Whittaker 等', why: '大厂测试体系的标杆著作' },
      { title: '持续交付', author: 'Jez Humble、David Farley', why: '把质量内建到流水线的方法论' },
    ],
  },
  'OSS（开源软件）法务': {
    videos: [{ title: '知识产权法（中南大学·国家一流课程）', url: 'https://www.icourse163.org/course/-1002527009', source: '中国大学MOOC', note: '著作权制度是开源许可证的法律根基' }],
    docs: [
      { title: 'OSI 开源许可证文档', url: 'https://opensource.org/licenses', source: '官方文档', note: '开源许可证定义与全文的权威站点' },
      { title: 'opensource · Stack Exchange', url: 'https://opensource.stackexchange.com/', source: '技术社区', note: '开源合规与许可的专业问答', kind: 'community' },
    ],
    books: [
      { title: '大教堂与集市', author: 'Eric Raymond', why: '开源运动的思想源头' },
      { title: '知识产权法教程', author: '王迁', why: '国内著作权法最流行的教科书' },
    ],
  },
  '技术合伙人': {
    videos: [{ title: '软件项目管理（北京邮电大学·国家一流课程）', url: 'https://www.icourse163.org/course/-1003557005', source: '中国大学MOOC', note: '技术侧的全项目管理能力' }],
    docs: [
      { title: 'YC Startup School', url: 'https://www.startupschool.org/', source: '官方文档', note: '全球最知名孵化器的免费创业课' },
      { title: 'Indie Hackers', url: 'https://www.indiehackers.com/', source: '技术社区', note: '小团队技术创业的收入与复盘社区', kind: 'community' },
    ],
    books: [
      { title: '创业维艰', author: 'Ben Horowitz', why: '技术合伙人面对的硬决策实录' },
      { title: '从0到1', author: 'Peter Thiel', why: '创业战略的底层思考' },
    ],
  },

  // ===== 科技批补全第 5 段（产品/效率/职业变体，2026-10-12） =====
  '云计算销售': {
    videos: [{ title: '云计算导论（含商业模式章节）', url: 'https://www.icourse163.org/course/-1205706805', source: '中国大学MOOC', note: '云服务计费模式与商业架构的入门课' }],
    docs: [
      { title: '阿里云帮助中心', url: 'https://help.aliyun.com/', source: '官方文档', note: '国内最大云厂商的产品与定价体系' },
      { title: 'reddit · r/sales', url: 'https://www.reddit.com/r/sales/', source: '技术社区', note: 'B2B 销售方法论的全球社区', kind: 'community' },
    ],
    books: [
      { title: '销售巨人：SPIN销售法', author: 'Neil Rackham', why: '大客户销售的经典方法论' },
      { title: '浪潮之巅', author: '吴军', why: '理解科技行业格局的必读书' },
    ],
  },
  'API产品经理': {
    videos: [{ title: '3个半小时精通 Restful API 开发', url: 'https://www.bilibili.com/video/BV1Ps4y1J7Ve', source: 'B站公开课', note: 'API 设计规范的实战速成' }],
    docs: [
      { title: 'Postman Learning Center', url: 'https://learning.postman.com/', source: '官方文档', note: 'API 平台化最普及工具的官方教程' },
      { title: 'reddit · r/AskProgramming', url: 'https://www.reddit.com/r/AskProgramming/', source: '技术社区', note: '接口设计与开发者体验的问答区', kind: 'community' },
    ],
    books: [
      { title: '俞军产品方法论', author: '俞军', why: '产品价值判断的底层框架' },
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '理解 API 背后的数据契约' },
    ],
  },
  '技术布道师': {
    videos: [{ title: '00 预告【动手学深度学习v2】（李沐）', url: 'https://www.bilibili.com/video/BV1if4y147hS', source: 'B站公开课', note: '李沐是中文技术布道的标杆样本' }],
    docs: [
      { title: 'Google 技术写作课程', url: 'https://developers.google.com/tech-writing', source: '官方文档', note: 'Google 官方免费技术写作方法论' },
      { title: 'dev.to', url: 'https://dev.to/', source: '技术社区', note: '面向开发者的内容创作社区', kind: 'community' },
    ],
    books: [
      { title: '让创意更有黏性', author: 'Chip Heath、Dan Heath', why: '技术传播与表达的六原则' },
      { title: '黑客与画家', author: 'Paul Graham', why: '技术观点写作的范本' },
    ],
  },
  '技术文档翻译': {
    videos: [{ title: '中英文科技论文写作（厦门大学）', url: 'https://www.icourse163.org/course/XMU-1206984801', source: '中国大学MOOC', note: '中英技术文本转换的课程基础' }],
    docs: [
      { title: 'Microsoft 写作风格指南', url: 'https://learn.microsoft.com/style-guide/', source: '官方文档', note: '技术文案的业界标准风格参考' },
      { title: 'ProZ 翻译社区', url: 'https://www.proz.com/', source: '技术社区', note: '全球职业译者的术语与协作社区', kind: 'community' },
    ],
    books: [
      { title: '翻译的技巧', author: '钱歌川', why: '中英互译的经典教程' },
      { title: '风格的要素', author: 'William Strunk', why: '英文写作的永恒小书' },
    ],
  },
  '可靠性工程师': {
    videos: [{ title: '质量与可靠性管理（南京航空航天大学）', url: 'https://www.icourse163.org/course/detail.htm?cid=1003542056', source: '中国大学MOOC', note: '可靠性模型、预计与FMEA的体系课' }],
    docs: [
      { title: 'ASQ 美国质量协会', url: 'https://asq.org/', source: '官方文档', note: '质量与可靠性知识的权威组织' },
      { title: 'reddit · r/manufacturing', url: 'https://www.reddit.com/r/manufacturing/', source: '技术社区', note: '制造业可靠性实践的讨论区', kind: 'community' },
    ],
    books: [
      { title: '质量免费', author: 'Philip Crosby', why: '质量管理的观念之作' },
      { title: '朱兰质量手册', author: 'Joseph Juran', why: '质量领域的大百科' },
    ],
  },
  '元宇宙架构师': {
    videos: [{ title: '人工智能与数字艺术（中国美术学院）', url: 'https://higher.smartedu.cn/course/agc3/69b56a1ff74ce762ce35272d?type=training', source: '智慧教育平台', note: '含元宇宙开发与虚拟展演的交叉课程' }],
    docs: [
      { title: 'Unity 官方中文文档', url: 'https://docs.unity.cn/', source: '官方文档', note: '元宇宙内容引擎的手册' },
      { title: 'GAMES 社区', url: 'https://games-cn.org/', source: '技术社区', note: '图形学与交互技术的国内学术社区', kind: 'community' },
    ],
    books: [
      { title: '元宇宙改变一切', author: 'Matthew Ball', why: '元宇宙产业框架的权威著作' },
      { title: '游戏引擎架构', author: 'Jason Gregory', why: '虚拟世界引擎的底层逻辑' },
    ],
  },
  '初级数据科学家': {
    videos: [{ title: '【动手学深度学习v2】（李沐）', url: 'https://www.bilibili.com/video/BV1if4y147hS', source: 'B站公开课', note: '从代码入手的深度学习第一课' }],
    docs: [
      { title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', source: '官方文档', note: '数据科学技能的免费实战微课程' },
      { title: 'Stack Overflow · pandas 标签', url: 'https://stackoverflow.com/questions/tagged/pandas', source: '技术社区', note: '数据分析问答', kind: 'community' },
    ],
    books: [
      { title: '利用Python进行数据分析', author: 'Wes McKinney', why: 'Pandas 之父亲写的入门标准' },
      { title: '统计学习方法', author: '李航', why: '机器学习方法的数学底本' },
    ],
  },
  '高级数据科学家': {
    videos: [{ title: '大语言模型基础：从零到一实现之路（南京大学）', url: 'https://www.bilibili.com/video/BV1EJH9zRE2p', source: 'B站公开课', note: '反向传播与特征空间的深层理解' }],
    docs: [
      { title: 'Google ML 最佳实践指南', url: 'https://developers.google.com/machine-learning/guides', source: '官方文档', note: '生产级 ML 系统设计的官方指南' },
      { title: 'reddit · r/MachineLearning', url: 'https://www.reddit.com/r/MachineLearning/', source: '技术社区', note: '前沿方法与论文讨论', kind: 'community' },
    ],
    books: [
      { title: '机器学习（西瓜书）', author: '周志华', why: '高级岗位面试与理论的天花板教材' },
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '从模型到生产系统的桥梁' },
    ],
  },
  '初级移动端开发工程师': {
    videos: [{ title: 'Android 移动应用开发（国家在线精品课程）', url: 'https://www.icourse163.org/course/detail.htm?cid=1206134802', source: '中国大学MOOC', note: 'Android 基础到网络编程的入门课' }],
    docs: [
      { title: 'Android 开发者官方文档（中文）', url: 'https://developer.android.google.cn/', source: '官方文档', note: '安卓平台的官方开发手册' },
      { title: 'reddit · r/androiddev', url: 'https://www.reddit.com/r/androiddev/', source: '技术社区', note: '安卓开发者社区', kind: 'community' },
    ],
    books: [
      { title: '第一行代码：Android（第3版）', author: '郭霖', why: '中文安卓入门的常青书' },
      { title: 'Kotlin实战', author: 'Dmitry Jemerov', why: '现代安卓主力语言的学习书' },
    ],
  },
  '高级移动端开发工程师': {
    videos: [{ title: '移动应用开发（含数据库、服务与架构章节）', url: 'https://www.icourse163.org/course/detail.htm?cid=1207106815', source: '中国大学MOOC', note: '从控件到架构的进阶课程' }],
    docs: [
      { title: 'Flutter 官方文档（中文）', url: 'https://docs.flutter.cn/', source: '官方文档', note: '跨端开发的事实标准' },
      { title: 'reddit · r/iOSProgramming', url: 'https://www.reddit.com/r/iOSProgramming/', source: '技术社区', note: 'iOS 开发者社区', kind: 'community' },
    ],
    books: [
      { title: 'Flutter实战·第二版', author: '杜文（wendux）', why: '开源免费的中文 Flutter 进阶书' },
      { title: '代码整洁之道', author: 'Robert Martin', why: '大型移动工程的代码质量底线' },
    ],
  },
  '技术债务管理专家': {
    videos: [{ title: '软件项目管理（北京邮电大学·国家一流课程）', url: 'https://www.icourse163.org/course/-1003557005', source: '中国大学MOOC', note: '配置管理、质量计划与风险控制的全景' }],
    docs: [
      { title: 'SonarQube 官方文档', url: 'https://docs.sonarsource.com/sonarqube/', source: '官方文档', note: '技术债务度量的行业标准工具' },
      { title: 'devops · Stack Exchange', url: 'https://devops.stackexchange.com/', source: '技术社区', note: '工程治理实践的问答', kind: 'community' },
    ],
    books: [
      { title: '重构：改善既有代码的设计', author: 'Martin Fowler', why: '技术债务治理的圣经' },
      { title: '人月神话', author: 'Frederick Brooks', why: '为什么债务会产生与如何面对' },
    ],
  },
  '研发效能工程师': {
    videos: [{ title: 'CI/CD 流水线实战（Git + Jenkins + Harbor + Docker）', url: 'https://www.bilibili.com/video/BV1UM4y127X1', source: 'B站公开课', note: '效能平台的核心交付链路实战' }],
    docs: [
      { title: 'DORA 官网', url: 'https://dora.dev/', source: '官方文档', note: 'Google DevOps 研究报告与效能指标权威' },
      { title: 'reddit · r/gitlab', url: 'https://www.reddit.com/r/gitlab/', source: '技术社区', note: 'DevOps 平台实践社区', kind: 'community' },
    ],
    books: [
      { title: '加速：企业软件交付的科学', author: 'Nicole Forsgren 等', why: 'DORA 四指标的原著' },
      { title: '持续交付', author: 'Jez Humble、David Farley', why: '流水线设计的奠基作' },
    ],
  },
  '产品增长分析师': {
    videos: [{ title: 'Python数据分析与展示（北京理工大学·国家精品）', url: 'https://www.icourse163.org/course/BIT-1001870002', source: '中国大学MOOC', note: '增长分析的工具链基础课' }],
    docs: [
      { title: 'Google Analytics 官方帮助', url: 'https://support.google.com/analytics', source: '官方文档', note: '埋点与漏斗分析的最大平台文档' },
      { title: 'reddit · r/analytics', url: 'https://www.reddit.com/r/analytics/', source: '技术社区', note: '数据分析职业与工具的讨论区', kind: 'community' },
    ],
    books: [
      { title: '增长黑客', author: 'Sean Ellis', why: '增长循环与实验的方法论' },
      { title: '精益数据分析', author: 'Alistair Croll', why: '关键指标选择的经典' },
    ],
  },
  '游戏技术美术': {
    videos: [{ title: '庄懂的技术美术入门课（美术向）', url: 'https://www.bilibili.com/video/BV1nZ4y1W7Bb', source: 'B站公开课', note: '专为美术背景转 TA 设计的课程' }],
    docs: [
      { title: 'Catlike Coding Unity 教程', url: 'https://catlikecoding.com/unity/tutorials/', source: '官方文档', note: '图形学编程最受推崇的英文教程站' },
      { title: 'Polycount 论坛', url: 'https://polycount.com/', source: '技术社区', note: '全球游戏美术师的大本营', kind: 'community' },
    ],
    books: [
      { title: 'Unity Shader入门精要', author: '冯乐乐', why: '中文渲染入门第一书' },
      { title: 'Real-Time Rendering（实时渲染）', author: 'Tomas Akenine-Möller 等', why: '实时图形学的权威参考' },
    ],
  },
  '独立开发者': {
    videos: [{ title: '科技创新与创业（北京邮电大学）', url: 'https://www.icourse163.org/course/BUPT-1003561005', source: '中国大学MOOC', note: '从想法到产品的创业方法课' }],
    docs: [
      { title: 'Vercel 文档', url: 'https://vercel.com/docs', source: '官方文档', note: '独立开发者的产品部署首选平台' },
      { title: 'Indie Hackers', url: 'https://www.indiehackers.com/', source: '技术社区', note: '独立变现者的复盘与收入透明社区', kind: 'community' },
    ],
    books: [
      { title: '从0到1', author: 'Peter Thiel', why: '独立产品的差异化思考' },
      { title: '黑客与画家', author: 'Paul Graham', why: '独立创造者精神的原典' },
    ],
  },
  '开源项目维护者': {
    videos: [{ title: 'Rust 语言基础（清华大学训练营）', url: 'https://www.bilibili.com/video/BV1jo4y1Y7Ha', source: 'B站公开课', note: '开源社区最活跃语言之一的基础课' }],
    docs: [
      { title: 'Open Source Guides', url: 'https://opensource.guide/', source: '官方文档', note: 'GitHub 官方的开源项目运营指南' },
      { title: 'opensource · Stack Exchange', url: 'https://opensource.stackexchange.com/', source: '技术社区', note: '开源协作与许可的问答社区', kind: 'community' },
    ],
    books: [
      { title: '大教堂与集市', author: 'Eric Raymond', why: '开源协作模式的经典分析' },
      { title: '程序员修炼之道', author: 'Andrew Hunt', why: '维护者职业生涯的操守之书' },
    ],
  },
  '技术写作者': {
    videos: [{ title: '中英文科技论文写作（厦门大学）', url: 'https://www.icourse163.org/course/XMU-1206984801', source: '中国大学MOOC', note: '结构化表达与读者意识的训练场' }],
    docs: [
      { title: 'Write the Docs', url: 'https://www.writethedocs.org/', source: '官方文档', note: '全球技术写作社区的指南集合' },
      { title: '少数派', url: 'https://sspai.com/', source: '技术社区', note: '国内高质量数字写作与工具社区', kind: 'community' },
    ],
    books: [
      { title: '风格的要素', author: 'William Strunk', why: '简明写作的百年经典' },
      { title: '金字塔原理', author: 'Barbara Minto', why: '结构化表达的方法论' },
    ],
  },
  '开发者关系': {
    videos: [{ title: 'GAMES101-现代计算机图形学入门（闫令琪）', url: 'https://www.bilibili.com/video/BV1X7411F744', source: 'B站公开课', note: '技术内容社区化传播的标杆案例' }],
    docs: [
      { title: 'Open Source Guides', url: 'https://opensource.guide/', source: '官方文档', note: '社区运营与贡献者管理的官方指南' },
      { title: 'dev.to', url: 'https://dev.to/', source: '技术社区', note: '开发者内容与互动的实践场', kind: 'community' },
    ],
    books: [
      { title: '黑客与画家', author: 'Paul Graham', why: '面向开发者的表达范本' },
      { title: '人月神话', author: 'Frederick Brooks', why: '理解工程师群体的沟通本质' },
    ],
  },
  'AI数据合规标注师': {
    videos: [{ title: '标注自己的语义分割数据集（同济子豪兄）', url: 'https://www.bilibili.com/video/BV1uu4y1Q7Rt', source: 'B站公开课', note: '标注流程的标准实操' }],
    docs: [
      { title: '全国网络安全标准化技术委员会（TC260）', url: 'https://www.tc260.org.cn/', source: '官方文档', note: '数据安全与个保国标归口机构' },
      { title: 'IAPP 国际隐私专业协会', url: 'https://iapp.org/', source: '技术社区', note: '数据合规从业者的全球社区', kind: 'community' },
    ],
    books: [
      { title: '算法霸权', author: 'Cathy O\'Neil', why: '数据偏见与问责的警示之作' },
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '数据血缘与合规治理的工程视角' },
    ],
  },
  '数据产品经理': {
    videos: [{ title: 'Python数据分析与展示（北京理工大学·国家精品）', url: 'https://www.icourse163.org/course/BIT-1001870002', source: '中国大学MOOC', note: '懂数据的产品经理的工具底座' }],
    docs: [
      { title: 'Databricks 文档', url: 'https://docs.databricks.com/', source: '官方文档', note: '湖仓一体数据平台的行业标准' },
      { title: 'Stack Overflow · data-warehouse 标签', url: 'https://stackoverflow.com/questions/tagged/data-warehouse', source: '技术社区', note: '数仓与数据产品问答', kind: 'community' },
    ],
    books: [
      { title: '精益数据分析', author: 'Alistair Croll', why: '数据产品指标体系的设计经典' },
      { title: '设计数据密集型应用', author: 'Martin Kleppmann', why: '数据系统的架构级理解' },
    ],
  },
};
