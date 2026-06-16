import { Slide, CaseStudy } from '../types';

export const SLIDES_DATA: Slide[] = [
  {
    id: 1,
    title: "META IMPULSO",
    subtitle: "Marketing, Tecnologia e Inteligência Artificial para Empresas que Querem Crescer.",
    impactPhrase: "Transformamos ideias em ativos digitais escaláveis.",
    visualType: "cover",
    speakerNotes: [
      "Dar as boas-vindas aos participantes e agradecer a presença de todos.",
      "Apresentar-se brevemente e introduzir a Meta Impulso como um híbrido inovador entre agência de marketing de alta performance e casa de engenharia de software/IA.",
      "Alinhamento de expectativas: o objetivo de hoje é mostrar como integrar tráfego, sistemas robustos e inteligência artificial para destravar escala real de faturamento."
    ]
  },
  {
    id: 2,
    title: "Quem é a Meta Impulso?",
    subtitle: "Aceleradora de Crescimento & Ecossistema de Tecnologia",
    content: [
      "Somos uma empresa especializada em marketing digital de alto desempenho, desenvolvimento estratégico de software, automação inteligente e modelagem de inteligência artificial.",
      "Nosso objetivo é construir estruturas digitais modernas capazes de gerar crescimento previsível, robusto e escalável para empresas de qualquer segmento."
    ],
    bullets: [
      { title: "Marketing de Performance", description: "Atração qualificada com foco em ROI.", icon: "TrendingUp" },
      { title: "Desenvolvimento Sob Medida", description: "Código limpo, escalável e de alto desempenho.", icon: "Code" },
      { title: "Automações Avançadas", description: "Eliminação de tarefas manuais e economia de custos.", icon: "Workflow" },
      { title: "Inteligência Artificial", description: "Processamento de linguagem natural e agentes cognitivos.", icon: "Cpu" }
    ],
    visualType: "about",
    speakerNotes: [
      "Explicar que não somos uma agência comum de rede social ou posts estáticos — focamos em ativos e engrenagens.",
      "Destacar que nosso diferencial é a união da Engenharia de Software com Marketing de Performance.",
      "Mencionar que cada pilar (Performance, Dev, Automação, IA) trabalha de forma interligada para reduzir o Custo de Aquisição de Clientes (CAC) e elevar o Life Time Value (LTV)."
    ]
  },
  {
    id: 3,
    title: "Por que muitas empresas não crescem?",
    subtitle: "O Abismo entre o Potencial e a Operação Tradicional",
    bullets: [
      { title: "Falta de Estratégia Integrada", description: "Ações isoladas de marketing que não se comunicam com o comercial." },
      { title: "Baixa Geração de Leads", description: "Flutuação constante na entrada de novas oportunidades de negócios." },
      { title: "Processos Manuais Ineficientes", description: "Equipes sobrecarregadas com digitação e atendimentos repetitivos." },
      { title: "Ausência de Automações", description: "Falta de robôs trabalhando 24/7 para nutrir e alertar oportunidades." },
      { title: "Sites que Não Convertem", description: "Plataformas lentas que agem como cemitérios de cliques." },
      { title: "Falta de Acompanhamento Comercial", description: "Oportunidades quentes perdidas pela demora no primeiro contato." },
      { title: "Pouca Presença Digital Forte", description: "Invisibilidade para o cliente ideal no momento exato de compra." }
    ],
    visualType: "problem",
    speakerNotes: [
      "Slide de forte conexão de dor. Interagir com a mesa perguntando: 'Quem aqui já sentiu que o marketing gera leads mas o comercial não consegue converter a tempo?'",
      "Bater no ponto dos silos: agências jogam a culpa no comercial, e o comercial reclama da qualidade dos leads.",
      "Frisar a lentidão de sites tradicionais (WordPress lentos, construtores amadores) que desperdiçam até 70% do orçamento de tráfego pago."
    ]
  },
  {
    id: 4,
    title: "Criamos Ecossistemas Digitais",
    subtitle: "A conexão sinérgica de cada pilar de crescimento",
    content: [
      "Uma agência convencional entrega peças isoladas. A Meta Impulso desenvolve uma engrenagem integrada onde cada etapa alimenta e otimiza a próxima de forma automática."
    ],
    bullets: [
      { title: "Marketing", description: "Atração qualificada e segmentada.", icon: "Megaphone" },
      { title: "Leads", description: "Captura, enriquecimento e filtragem.", icon: "Users" },
      { title: "CRM", description: "Organização estruturada de negócios.", icon: "Database" },
      { title: "Automação", description: "Disparos instantâneos e follow-ups.", icon: "Shuffle" },
      { title: "Vendas", description: "Conversão ágil e fechamento assistido.", icon: "DollarSign" },
      { title: "Crescimento", description: "Métricas consolidadas e escala contínua.", icon: "Activity" }
    ],
    visualType: "solution",
    speakerNotes: [
      "Apresentar o conceito de 'Engrenagem Unificada'.",
      "Mostrar graficamente ou narrativamente a jornada: o tráfego atrai, a automação filtra, o CRM organiza, a IA qualifica e o vendedor fecha.",
      "Destacar que sem essa sinergia, a empresa estará sempre gastando mais em tráfego para tentar compensar furos nos baldes comerciais."
    ]
  },
  {
    id: 5,
    title: "Atraia Clientes Todos os Dias",
    subtitle: "Tráfego Pago de Alta Performance",
    content: [
      "Injetamos combustível em seu funil com estratégias precisas de compra de mídia nas principais redes do mundo."
    ],
    bullets: [
      { title: "Google Ads", description: "Apareça na intenção de compra exata do seu cliente." },
      { title: "Meta & Instagram Ads", description: "Arregimente atenção visual e gere desejo imediato." },
      { title: "TikTok & YouTube Ads", description: "Aborde sua audiência com experiências imersivas em vídeo." },
      { title: "Remarketing Dinâmico", description: "Resgate visitantes que demonstraram interesse e feche mais negócios." }
    ],
    benefits: [
      "Visibilidade Instantânea",
      "Geração Focada de Leads",
      "Volume de Clientes Previsível",
      "Retorno Sobre Investimento (ROI) Mensurável"
    ],
    visualType: "list",
    speakerNotes: [
      "Explicar que tráfego pago não é custo, é investimento previsível.",
      "Diferenciar Google Ads (foco em fundo de funil e intenção imediata) de Meta/Instagram Ads (foco em geração de desejo e atenção visual).",
      "Enfatizar a taxa de recuperação que o Remarketing Dinâmico traz ao reimpactar leads de alta intenção."
    ]
  },
  {
    id: 6,
    title: "Sites que Vendem",
    subtitle: "Desenvolvimento Web Centrado em Conversão",
    content: [
      "Desenvolvemos plataformas web rápidas, seguras e otimizadas para transformar visitantes em clientes faturados."
    ],
    bullets: [
      { title: "Sites Institucionais de Elite", description: "Posicionamento de mercado de alto padrão e credibilidade imediata." },
      { title: "Landing Pages de Alta Conversão", description: "Páginas táticas focadas em um único e lucrativo call-to-action." },
      { title: "Sistemas Web Personalizados", description: "Soluções sob medida para automatizar as regras do seu negócio." },
      { title: "Portais Corporativos Robustos", description: "Arquitetura integrada e segura para sua empresa circular dados." }
    ],
    benefits: [
      "Velocidade Ultra-rápida (Score 90+ no Lighthouse)",
      "SEO Otimizado nativamente para o Google",
      "Experiência Mobile Impecável (Responsividade)",
      "Ux/Ui Design Refinado com foco comercial"
    ],
    visualType: "list",
    speakerNotes: [
      "Criticar construtores pesados como Elementor ou sistemas compartilhados que demoram 5+ segundos para carregar no 3G comercial.",
      "Apresentar nossos diferenciais técnicos: usamos React, Vite e Tailwind, gerando páginas estáticas e hidratação rápida.",
      "Conexão comercial: cada segundo a mais de carregamento custa de 10% a 20% de queda na taxa de conversão."
    ]
  },
  {
    id: 7,
    title: "Transforme Leads em Clientes",
    subtitle: "CRM de Elite e Automação Comercial",
    content: [
      "Estruturamos e integramos seu ecossistema comercial para que nenhuma oportunidade seja deixada para trás."
    ],
    bullets: [
      { title: "CRM Customizado", description: "Telas moldadas à sua realidade, com integração profunda e painéis visuais." },
      { title: "Automação de Fluxos", description: "Regas de passagem automática baseadas na maturidade dos contatos." },
      { title: "Integração WhatsApp", description: "Mensagens instantâneas automatizadas com enriquecimento de dados." },
      { title: "Follow-up Sistemático", description: "Lembretes e alertas automáticos instruem o vendedor no tempo ideal." }
    ],
    visualType: "crm",
    speakerNotes: [
      "Contar dado alarmante: 48% dos vendedores nunca fazem um único follow-up subsequente no lead.",
      "Mostrar que estruturar o CRM com réguas automáticas cria consistência. O lead não depende da memória ou da boa vontade da equipe.",
      "Destacar as integrações de WhatsApp: assim que o lead preenche a nota de interesse, recebe uma mensagem personalizada em menos de 10 segundos."
    ]
  },
  {
    id: 8,
    title: "O Futuro das Empresas Já Começou",
    subtitle: "Inteligência Artificial Aplicada ao Negócio",
    content: [
      "Desenvolvemos integridade inteligente que opera no coração da sua empresa, reduzindo drasticamente custos humanos e operacionais."
    ],
    bullets: [
      { title: "Agentes Autônomos de IA", description: "Tomadores de decisão inteligentes treinados para resolver problemas lógicos." },
      { title: "Atendimento 24/7 Humanizado", description: "Chatbots avançados integrados aos SEUs dados para dar respostas perfeitamente contextuais." },
      { title: "Qualificação Automática", description: "Chatbots que filtram, qualificam e agendam reuniões diretamente na sua agenda." },
      { title: "Assistentes Internos", description: "Sua equipe amparada por respostas rápidas de IA sobre manuais, preços e contratos." }
    ],
    visualType: "ia",
    speakerNotes: [
      "Slide de altíssimo valor tecnológico. Mostrar que IA não é apenas um 'ChatGPT' básico.",
      "Explicar que criamos agentes corporativos que acessam bases de dados exclusivas da empresa via RAG (Retrieval-Augmented Generation).",
      "Exemplificar o impacto: agentes de qualificação que trabalham aos sábados e domingos de madrugada, agendando reuniões qualificadas no Google Calendar."
    ]
  },
  {
    id: 9,
    title: "Como Trabalhamos",
    subtitle: "Roteiro de Implementação de Sucesso de 5 Fases",
    bullets: [
      { title: "Diagnóstico", description: "Mapeamento detalhado dos gargalos de marketing, tecnologia e CRM." },
      { title: "Planejamento", description: "Construção do plano de ataque estratégico focado em soluções prioritárias." },
      { title: "Implementação", description: "Montagem técnica ágil das páginas, anúncios, automações e setups." },
      { title: "Otimização", description: "Refinamento das métricas com base no comportamento de dados reais." },
      { title: "Escala", description: "Multiplicação do orçamento nos canais de melhor conversão e expansão comercial." }
    ],
    visualType: "process",
    speakerNotes: [
      "Demonstrar organização e rigor metodológico para passar segurança na entrega do projeto.",
      "Fase de Diagnóstico e Planejamento: ocorrem nas primeiras 2 semanas, garantindo que não faremos nada no escuro.",
      "Deixar claro que após a Implementação, a Otimização é contínua e semanal com relatórios transparentes de ROI."
    ]
  },
  {
    id: 10,
    title: "O Que Você Pode Esperar",
    subtitle: "Resultados Tangíveis para o Seu Crescimento",
    bullets: [
      { title: "Mais Leads Qualificados", description: "Atração precisa de clientes com real poder de compra." },
      { title: "Mais Vendas Realizadas", description: "Funil de vendas acelerado com follow-up imediato." },
      { title: "Mais Autoridade de Marca", description: "Posicionamento digital premium perante a concorrência." },
      { title: "Mais Automação & Eficiência", description: "Redução de desperdício em tarefas mecânicas diárias." },
      { title: "Mais Resiliência Operacional", description: "Sistemas rodando com segurança e previsibilidade." },
      { title: "Crescimento Sustentável", description: "Modelos previsíveis impulsionando o faturamento." }
    ],
    visualType: "results",
    speakerNotes: [
      "Consolidar os benefícios na mente do prospect.",
      "Discutir eficiência operacional: processos que antes demoravam horas agora rodam em segundos à fração do custo.",
      "Concluir: investimento que retorna em faturamento e organização tranquila para o dono da empresa."
    ]
  },
  {
    id: 11,
    title: "Por que escolher a Meta Impulso?",
    subtitle: "Diferenciais competitivos de quem pensa em escala",
    bullets: [
      { title: "Sinergia Plena (Marketing + TI)", description: "Não somos apenas criativos de marketing; somos engenheiros de software estruturando canais que convertem." },
      { title: "Desenvolvimento Próprio", description: "Zero dependência de templates prontos travados. Código de extrema performance adaptado para sua empresa." },
      { title: "Vanguarda de Inteligência Artificial", description: "Dominamos a integração prática das melhores ferramentas do mercado (Gemini, OpenAI, Agentes)." },
      { title: "Estratégia sob Medida", description: "Nós estudamos o seu segmento detalhadamente para arquitetar ecossistemas dedicados à sua persona." },
      { title: "Crescimento de Ponta a Ponta", description: "Do clique no anúncio até a assinatura no contrato digital, garantimos a rastreabilidade completa." }
    ],
    visualType: "reasons",
    speakerNotes: [
      "Contrapor com as agências tradicionais: 'A maioria das agências entrega apenas designs bonitos, nós entregamos infraestrutura de aquisição.'",
      "Mencionar que nossos códigos são próprios e exclusivos, gerendo independência comercial extrema.",
      "Dar ênfase na rastreabilidade fim-a-fim: mapeamos exatamente qual anúncio gerou qual contrato assinado."
    ]
  },
  {
    id: 12,
    title: "Nossos Cases de Sucesso",
    subtitle: "Histórias Reais de Transformação de Negócios",
    visualType: "cases",
    speakerNotes: [
      "Apresentar as provas sociais de forma entusiasmada e detalhada.",
      "Destacar Voogle (+250% leads em 60 dias) e o CRM integrado com WhatsApp de 3 segundos de resposta automática.",
      "Citar Neuro Seixas Kids: automação completa das triagens clínicas gerando foco na recepção."
    ]
  },
  {
    id: 13,
    title: "Pronto para acelerar seu crescimento?",
    subtitle: "A oportunidade perdida custa caro",
    impactPhrase: "Descubra como estruturar sua máquina de aquisição de clientes com quem sabe unir marketing e engenharia de software.",
    ctaText: "Agendar Meu Diagnóstico Estratégico Gratuito",
    visualType: "cta",
    speakerNotes: [
      "Momento do fechamento (Pitch Final).",
      "Reforçar o senso de oportunidade e urgência: 'A cada dia sem automação e com anúncios soltos, sua empresa está deixando dinheiro sobre a mesa.'",
      "Induzir ao clique no botão ou ao escaneamento imediato do WhatsApp para confirmar a vaga do diagnóstico."
    ]
  },
  {
    id: 14,
    title: "META IMPULSO",
    subtitle: "Construindo Sistemas Inteligentes de Vendas e Aquisição",
    impactPhrase: "Empresas comuns competem por atenção.\nEmpresas inteligentes constroem sistemas que geram crescimento.",
    visualType: "footer",
    speakerNotes: [
      "Agradecer calorosamente pelo tempo de todos.",
      "Deixar o slide de contatos aberto e disponível para dúvidas da audiência.",
      "Disponibilizar o telefone +55 61 9501-1614 e o site metaimpulso.com.br."
    ]
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "voogle",
    name: "Voogle",
    category: "Tráfego Pago & Web",
    metrics: [
      { label: "Aumento de Leads", value: "+250%", description: "Em apenas 60 dias" },
      { label: "Custo por Lead (CPL)", value: "-35%", description: "Através de otimização de SEO" },
      { label: "ROI da Operação", value: "4.8x", description: "Retorno sobre o investimento em anúncios" }
    ],
    description: "Reestruturação completa de posicionamento na web e campanhas de anúncios focadas na dor exata do mercado corporativo. Lançamento de landing page proprietária ultraveloz.",
    tags: ["Google Ads", "Landing Page", "SEO"],
    resultsText: "Atraiu mais de 15.000 cliques qualificados convertendo leads a uma fração do custo anterior do mercado."
  },
  {
    id: "crm-voogle",
    name: "CRM Voogle",
    category: "CRM & Automação",
    metrics: [
      { label: "Eficiência Operacional", value: "+40%", description: "Redução de gargalos manuais" },
      { label: "Velocidade de Resposta", value: "3s", description: "Primeiro contato automatizado" },
      { label: "Aproveitamento comercial", value: "+28%", description: "Reengajamento de leads antigos" }
    ],
    description: "Criação de um CRM personalizado e montagem de fluxos automáticos de nurturing integrando múltiplos canais. Envio automatizado de lembretes comerciais via WhatsApp.",
    tags: ["Salesforce Sync", "WhatsApp API", "Nurturing"],
    resultsText: "Estruturou o canal comercial para que 100% dos leads recém-chegados fossem respondidos e qualificados no primeiro minuto comercial."
  },
  {
    id: "fast-delivery",
    name: "Fast Family Delivery",
    category: "Desenvolvimento Web & Escala",
    metrics: [
      { label: "Pedidos / Mês", value: "50k+", description: "Volume mensal transacionado" },
      { label: "Disponibilidade Global", value: "99.9%", description: "Arquitetura cloud redundante" },
      { label: "Tempo de Carregamento", value: "0.8s", description: "Em conexões 3G móveis" }
    ],
    description: "Criação de um sistema web multi-tenant seguro e escalável de entregas rápidas com interface simplificada focada em mobile e checkout sem fricção.",
    tags: ["Next.js", "Cloud Database", "Multi-Tenant"],
    resultsText: "Permitiu a expansão segura do negócio para novos locais sem instabilidades de banco de dados."
  },
  {
    id: "neuro-kids",
    name: "Neuro Seixas Kids",
    category: "Inteligência Artificial & Web",
    metrics: [
      { label: "Taxa de Conversão", value: "+180%", description: "Em agendamentos de consultas" },
      { label: "Engajamento por Usuário", value: "4.5m", description: "Tempo médio na IA interativa" },
      { label: "Suporte Respondido", value: "100%", description: "Sem necessidade de triagem manual" }
    ],
    description: "Desenvolvimento de portal de atendimento médico infantil com assistente de IA qualificador integrado para tirar dúvidas clínicas preliminares e triar o tipo correto de terapia.",
    tags: ["Agente IA", "Vite/React", "Customer Experience"],
    resultsText: "Automatizou mais de 80% dos atendimentos frequentes do suporte, liberando a recepção da clínica para focar em casos de fechamento de pacotes premium."
  }
];
