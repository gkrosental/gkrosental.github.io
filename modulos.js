// modulos.js - Módulos e perguntas da trilha educacional

// Array global de módulos de educação financeira
// Cada módulo contém um título, descrição e uma lista de perguntas
// Cada pergunta tem enunciado, explicação, opções e índice da resposta correta
window.modulos = [
  {
    titulo: 'Conceitos Básicos de Finanças', // Nome do módulo
    descricao: 'Aprenda os fundamentos essenciais para sua educação financeira.', // Descrição do módulo
    perguntas: [ // Lista de perguntas do módulo
      {
        enunciado: 'Para que serve o dinheiro?', // Pergunta apresentada ao usuário
        explicacao: 'O dinheiro é usado para adquirir bens e serviços, facilitando trocas na economia.', // Explicação exibida após resposta
        opcoes: [ // Opções de resposta
          'Apenas para guardar',
          'Para trocar por bens e serviços',
          'Para colecionar',
          'Para decorar a casa'
        ],
        resposta: 1 // Índice da resposta correta
      },
      {
        enunciado: 'O salário é:',
        explicacao: 'Salário é o pagamento pelo trabalho realizado, não um presente ou empréstimo.',
        opcoes: [
          'Um presente',
          'Um pagamento pelo trabalho',
          'Um empréstimo',
          'Um imposto'
        ],
        resposta: 1
      },
      {
        enunciado: 'Comprar comida é:',
        explicacao: 'Comprar comida é um gasto, logo, uma despesa.',
        opcoes: [
          'Uma despesa',
          'Um investimento',
          'Um empréstimo',
          'Um presente'
        ],
        resposta: 0
      },
      {
        enunciado: 'Receber um pagamento é:',
        explicacao: 'Receber um pagamento é uma receita, pois aumenta o dinheiro disponível.',
        opcoes: [
          'Uma despesa',
          'Uma receita',
          'Um empréstimo',
          'Um gasto'
        ],
        resposta: 1
      },
      {
        enunciado: 'Orçamento serve para:',
        explicacao: 'O orçamento serve para planejar receitas e despesas, ajudando no controle financeiro.',
        opcoes: [
          'Planejar receitas e despesas',
          'Gastar sem controle',
          'Pedir dinheiro emprestado',
          'Evitar trabalhar'
        ],
        resposta: 0
      },
      {
        enunciado: 'Guardar dinheiro todo mês é:',
        explicacao: 'Guardar dinheiro regularmente caracteriza uma poupança.',
        opcoes: [
          'Poupança',
          'Despesa',
          'Receita',
          'Empréstimo'
        ],
        resposta: 0
      },
      {
        enunciado: 'Quando você pega dinheiro emprestado, você tem:',
        explicacao: 'Ao pegar dinheiro emprestado, você assume uma dívida a ser paga.',
        opcoes: [
          'Receita',
          'Dívida',
          'Poupança',
          'Investimento'
        ],
        resposta: 1
      }
    ]
  },
  {
    titulo: 'Conceitos Intermediários',
    descricao: 'Aprofunde seu conhecimento em finanças pessoais.',
    perguntas: [
      {
        enunciado: 'Exemplo de meta financeira:',
        explicacao: 'Metas financeiras são objetivos como comprar um carro ou casa.',
        opcoes: [
          'Comprar um carro',
          'Pagar contas atrasadas',
          'Gastar todo o salário',
          'Pedir empréstimo'
        ],
        resposta: 0
      },
      {
        enunciado: 'Controlar gastos ajuda a:',
        explicacao: 'Controlar gastos ajuda a economizar e evitar dívidas.',
        opcoes: [
          'Gastar mais',
          'Economizar',
          'Ficar endividado',
          'Pagar mais impostos'
        ],
        resposta: 1
      },
      {
        enunciado: 'Reserva de emergência serve para:',
        explicacao: 'Reserva de emergência é para imprevistos, como problemas de saúde.',
        opcoes: [
          'Viajar',
          'Comprar roupas',
          'Cobrir despesas inesperadas',
          'Pagar presentes'
        ],
        resposta: 2
      },
      {
        enunciado: 'O cartão de crédito é:',
        explicacao: 'Cartão de crédito é um empréstimo temporário, não dinheiro guardado.',
        opcoes: [
          'Dinheiro guardado',
          'Empréstimo temporário',
          'Receita extra',
          'Investimento'
        ],
        resposta: 1
      },
      {
        enunciado: 'Quem não paga a dívida está:',
        explicacao: 'Inadimplente é quem não paga uma dívida no prazo.',
        opcoes: [
          'Poupando',
          'Inadimplente',
          'Investindo',
          'Recebendo juros'
        ],
        resposta: 1
      },
      {
        enunciado: 'Juros é:',
        explicacao: 'Juros é o valor extra pago ao tomar dinheiro emprestado.',
        opcoes: [
          'Desconto',
          'Valor extra pago em empréstimos',
          'Receita',
          'Despesa fixa'
        ],
        resposta: 1
      },
      {
        enunciado: 'Investir é:',
        explicacao: 'Investir é aplicar dinheiro para obter retorno futuro.',
        opcoes: [
          'Gastar tudo',
          'Aplicar dinheiro para crescer',
          'Pedir empréstimo',
          'Evitar poupar'
        ],
        resposta: 1
      }
    ]
  },
  {
    titulo: 'Finanças Pessoais Avançadas',
    descricao: 'Domine tópicos avançados para investir melhor e proteger seu patrimônio.',
    perguntas: [
      {
        enunciado: 'O que é inflação?',
        explicacao: 'Inflação é o aumento geral dos preços, reduzindo o poder de compra.',
        opcoes: [
          'Queda dos preços',
          'Aumento dos preços',
          'Aumento dos salários',
          'Redução de impostos'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é renda variável?',
        explicacao: 'Renda variável são investimentos cujo retorno não é previsível, como ações.',
        opcoes: [
          'Poupança',
          'CDB',
          'Ações',
          'Tesouro Direto'
        ],
        resposta: 2
      },
      {
        enunciado: 'O que é liquidez?',
        explicacao: 'Liquidez é a facilidade de transformar um investimento em dinheiro.',
        opcoes: [
          'Dificuldade de vender',
          'Facilidade de transformar em dinheiro',
          'Rentabilidade',
          'Prazo de vencimento'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é perfil de investidor?',
        explicacao: 'É a análise do quanto você tolera riscos e busca retorno.',
        opcoes: [
          'Tipo de banco',
          'Tolerância a risco e retorno',
          'Tipo de ação',
          'Prazo de investimento'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é FGC?',
        explicacao: 'O FGC (Fundo Garantidor de Créditos) protege parte do dinheiro investido em alguns produtos bancários.',
        opcoes: [
          'Fundo de Garantia do Consumidor',
          'Fundo Garantidor de Créditos',
          'Fundo de Garantia de Crédito',
          'Fundo de Garantia de Capital'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é CDB?',
        explicacao: 'CDB (Certificado de Depósito Bancário) é um título de renda fixa emitido por bancos para captar recursos.',
        opcoes: [
          'Certificado de Depósito Bancário',
          'Certificado de Depósito de Bens',
          'Certificado de Dívida Bancária',
          'Certificado de Depósito de Bolsa'
        ],
        resposta: 0
      },
      {
        enunciado: 'O que é um fundo imobiliário (FII)?',
        explicacao: 'FII é um investimento coletivo em imóveis, negociado na bolsa.',
        opcoes: [
          'Investimento em imóveis para morar',
          'Investimento coletivo em imóveis',
          'Compra de terrenos',
          'Compra de casas'
        ],
        resposta: 1
      }
    ]
  },
  {
    titulo: 'Investimentos e Estratégias Avançadas',
    descricao: 'Aprofunde-se em estratégias, produtos e riscos do mercado financeiro.',
    perguntas: [
      {
        enunciado: 'O que é análise fundamentalista?',
        explicacao: 'É a análise dos fundamentos de uma empresa para investir em suas ações.',
        opcoes: [
          'Análise de gráficos',
          'Análise dos fundamentos da empresa',
          'Análise de notícias',
          'Análise de moedas'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é análise técnica?',
        explicacao: 'É a análise de gráficos e padrões de preço para prever movimentos do mercado.',
        opcoes: [
          'Análise de fundamentos',
          'Análise de gráficos e padrões',
          'Análise de balanço',
          'Análise de crédito'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é home broker?',
        explicacao: 'Home broker é uma plataforma online para negociar ativos na bolsa.',
        opcoes: [
          'Corretor presencial',
          'Plataforma online de negociação',
          'Banco digital',
          'Gestor de fundos'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é stop loss?',
        explicacao: 'Stop loss é uma ordem para limitar perdas em uma operação.',
        opcoes: [
          'Ordem para aumentar ganhos',
          'Ordem para limitar perdas',
          'Ordem para comprar ações',
          'Ordem para vender imóveis'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é volatilidade?',
        explicacao: 'Volatilidade é a variação dos preços de um ativo em determinado período.',
        opcoes: [
          'Estabilidade dos preços',
          'Variação dos preços',
          'Rentabilidade',
          'Liquidez'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é IPO?',
        explicacao: 'IPO (Initial Public Offering) é a oferta pública inicial de ações de uma empresa na bolsa.',
        opcoes: [
          'Oferta pública inicial de ações',
          'Oferta de imóveis',
          'Oferta de títulos públicos',
          'Oferta de moedas estrangeiras'
        ],
        resposta: 0
      },
      {
        enunciado: 'O que é hedge?',
        explicacao: 'Hedge é uma estratégia para proteger investimentos contra oscilações de mercado.',
        opcoes: [
          'Aumentar risco',
          'Proteger contra oscilações',
          'Comprar ações',
          'Vender imóveis'
        ],
        resposta: 1
      }
    ]
  },
  {
    titulo: 'Planejamento de Aposentadoria',
    descricao: 'Entenda como planejar sua aposentadoria e garantir o futuro.',
    perguntas: [
      {
        enunciado: 'O que é previdência privada?',
        explicacao: 'Previdência privada é um investimento de longo prazo para complementar a aposentadoria.',
        opcoes: [
          'Seguro de vida',
          'Investimento de longo prazo',
          'Conta corrente',
          'Cartão de crédito'
        ],
        resposta: 1
      },
      {
        enunciado: 'Por que começar cedo o planejamento?',
        explicacao: 'Quanto antes começar, maior o tempo para acumular recursos e aproveitar os juros compostos.',
        opcoes: [
          'Para pagar menos impostos',
          'Para acumular mais recursos',
          'Para gastar mais',
          'Para evitar trabalhar'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é INSS?',
        explicacao: 'INSS (Instituto Nacional do Seguro Social) é o órgão responsável pela aposentadoria pública no Brasil.',
        opcoes: [
          'Banco',
          'Seguro privado',
          'Instituto de aposentadoria pública',
          'Cartão de crédito'
        ],
        resposta: 2
      },
      {
        enunciado: 'O que são aportes regulares?',
        explicacao: 'Aportes regulares são contribuições feitas periodicamente para um investimento.',
        opcoes: [
          'Gastos mensais',
          'Contribuições periódicas',
          'Despesas fixas',
          'Receitas extras'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é renda vitalícia?',
        explicacao: 'Renda vitalícia é um benefício pago mensalmente até o fim da vida.',
        opcoes: [
          'Pagamento único',
          'Renda mensal até o fim da vida',
          'Empréstimo',
          'Desconto'
        ],
        resposta: 1
      },
      {
        enunciado: 'Qual a vantagem do PGBL?',
        explicacao: 'O PGBL (Plano Gerador de Benefício Livre) permite deduzir as contribuições da base de cálculo do IR até um limite.',
        opcoes: [
          'Não paga imposto',
          'Dedução no IR',
          'Rendimento garantido',
          'Liquidez imediata'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é portabilidade de previdência?',
        explicacao: 'Portabilidade permite transferir seu plano de previdência para outra instituição sem perder benefícios.',
        opcoes: [
          'Troca de banco',
          'Transferência de plano',
          'Resgate imediato',
          'Aporte extra'
        ],
        resposta: 1
      }
    ]
  },
  {
    titulo: 'Impostos e Tributação',
    descricao: 'Aprenda como funcionam os impostos sobre investimentos e renda.',
    perguntas: [
      {
        enunciado: 'O que é IR?',
        explicacao: 'IR (Imposto de Renda) é um tributo cobrado sobre ganhos e rendimentos.',
        opcoes: [
          'Taxa bancária',
          'Tributo sobre ganhos',
          'Desconto do cartão',
          'Tarifa de energia'
        ],
        resposta: 1
      },
      {
        enunciado: 'Qual investimento é isento de IR?',
        explicacao: 'A poupança é isenta de imposto de renda para pessoas físicas.',
        opcoes: [
          'Ações',
          'CDB',
          'Poupança',
          'Tesouro Direto'
        ],
        resposta: 2
      },
      {
        enunciado: 'O que é alíquota?',
        explicacao: 'Alíquota é o percentual aplicado sobre a base de cálculo de um imposto.',
        opcoes: [
          'Valor fixo',
          'Percentual do imposto',
          'Desconto',
          'Multa'
        ],
        resposta: 1
      },
      {
        enunciado: 'Como funciona o come-cotas (antecipação do IR)?',
        explicacao: 'Come-cotas é a antecipação do IR (Imposto de Renda) em fundos de investimento.',
        opcoes: [
          'Taxa de administração',
          'Antecipação do IR',
          'Desconto do banco',
          'Tarifa de cartão'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é declaração de IR?',
        explicacao: 'É o envio das informações de rendimentos e bens à Receita Federal.',
        opcoes: [
          'Pagamento de imposto',
          'Envio de informações à Receita',
          'Recebimento de salário',
          'Compra de ações'
        ],
        resposta: 1
      },
      {
        enunciado: 'Qual o prazo para declarar IR?',
        explicacao: 'O prazo normalmente vai de março a abril do ano seguinte ao recebimento dos rendimentos.',
        opcoes: [
          'Janeiro',
          'Março a abril',
          'Julho',
          'Dezembro'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é isenção de IR?',
        explicacao: 'Isenção é quando determinado rendimento não sofre cobrança de imposto.',
        opcoes: [
          'Pagamento obrigatório',
          'Dispensa de imposto',
          'Multa',
          'Taxa bancária'
        ],
        resposta: 1
      }
    ]
  },
  {
    titulo: 'Economia Comportamental',
    descricao: 'Descubra como o comportamento influencia decisões financeiras.',
    perguntas: [
      {
        enunciado: 'O que é viés comportamental?',
        explicacao: 'Viés comportamental é uma tendência irracional que afeta decisões financeiras.',
        opcoes: [
          'Tendência racional',
          'Tendência irracional',
          'Planejamento',
          'Investimento'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é efeito manada?',
        explicacao: 'Efeito manada é quando pessoas seguem decisões da maioria sem análise própria.',
        opcoes: [
          'Análise individual',
          'Seguir a maioria',
          'Investir sozinho',
          'Planejar'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é aversão à perda?',
        explicacao: 'Aversão à perda é o medo de perder que faz evitar riscos, mesmo com boas oportunidades.',
        opcoes: [
          'Buscar risco',
          'Medo de perder',
          'Gastar mais',
          'Investir tudo'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é ancoragem?',
        explicacao: 'Ancoragem é quando uma informação inicial influencia decisões futuras.',
        opcoes: [
          'Decisão aleatória',
          'Influência de informação inicial',
          'Planejamento',
          'Diversificação'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é excesso de confiança?',
        explicacao: 'Excesso de confiança é superestimar a própria capacidade de prever o mercado.',
        opcoes: [
          'Humildade',
          'Superestimar capacidade',
          'Diversificação',
          'Planejamento'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é mental accounting?',
        explicacao: 'Mental accounting é separar dinheiro em “caixinhas” mentais, influenciando decisões.',
        opcoes: [
          'Juntar tudo',
          'Separar em caixinhas',
          'Investir tudo',
          'Gastar tudo'
        ],
        resposta: 1
      },
      {
        enunciado: 'Como evitar armadilhas comportamentais?',
        explicacao: 'Educação financeira e autoconhecimento ajudam a evitar armadilhas comportamentais.',
        opcoes: [
          'Ignorar emoções',
          'Educação financeira',
          'Seguir a maioria',
          'Investir sem estudar'
        ],
        resposta: 1
      }
    ]
  },
  {
    titulo: 'Finanças para Empreendedores',
    descricao: 'Aprenda conceitos essenciais para gerir um negócio de sucesso.',
    perguntas: [
      {
        enunciado: 'O que é fluxo de caixa?',
        explicacao: 'Fluxo de caixa é o controle das entradas e saídas de dinheiro do negócio.',
        opcoes: [
          'Controle de estoque',
          'Controle de dinheiro',
          'Controle de vendas',
          'Controle de funcionários'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é capital de giro?',
        explicacao: 'Capital de giro é o dinheiro necessário para manter as operações do dia a dia.',
        opcoes: [
          'Investimento inicial',
          'Dinheiro para operações diárias',
          'Lucro',
          'Receita'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é ponto de equilíbrio?',
        explicacao: 'Ponto de equilíbrio é quando as receitas igualam as despesas.',
        opcoes: [
          'Lucro máximo',
          'Receita igual a despesa',
          'Prejuízo',
          'Investimento'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é margem de lucro?',
        explicacao: 'Margem de lucro é o percentual de ganho sobre as vendas.',
        opcoes: [
          'Percentual de ganho',
          'Percentual de perda',
          'Receita total',
          'Despesa total'
        ],
        resposta: 0
      },
      {
        enunciado: 'O que é pró-labore?',
        explicacao: 'Pró-labore é a remuneração dos sócios pelo trabalho na empresa.',
        opcoes: [
          'Lucro',
          'Remuneração dos sócios',
          'Investimento',
          'Receita'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é DRE?',
        explicacao: 'DRE (Demonstrativo de Resultados do Exercício) mostra o resultado financeiro da empresa.',
        opcoes: [
          'Demonstrativo de Resultados',
          'Documento de Receita',
          'Despesas Recorrentes',
          'Dívida Registrada'
        ],
        resposta: 0
      },
      {
        enunciado: 'O que é custo fixo?',
        explicacao: 'Custo fixo é aquele que não varia com a produção, como aluguel.',
        opcoes: [
          'Varia com produção',
          'Não varia com produção',
          'Lucro',
          'Receita'
        ],
        resposta: 1
      }
    ]
  },
  {
    titulo: 'Riscos e Proteção Financeira',
    descricao: 'Saiba como identificar riscos e proteger seu patrimônio.',
    perguntas: [
      {
        enunciado: 'O que é seguro de vida?',
        explicacao: 'Seguro de vida protege financeiramente a família em caso de falecimento do titular.',
        opcoes: [
          'Investimento',
          'Proteção financeira',
          'Empréstimo',
          'Poupança'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é diversificação de risco?',
        explicacao: 'Diversificar é investir em diferentes ativos para reduzir riscos.',
        opcoes: [
          'Investir em um só ativo',
          'Investir em vários ativos',
          'Gastar tudo',
          'Pedir empréstimo'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é reserva de emergência?',
        explicacao: 'Reserva de emergência é um valor guardado para imprevistos.',
        opcoes: [
          'Investimento de risco',
          'Valor para imprevistos',
          'Gasto supérfluo',
          'Receita extra'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é risco de crédito?',
        explicacao: 'Risco de crédito é a chance de não receber o valor emprestado.',
        opcoes: [
          'Chance de ganhar',
          'Chance de não receber',
          'Chance de investir',
          'Chance de poupar'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é apólice?',
        explicacao: 'Apólice é o contrato do seguro, detalhando coberturas e condições.',
        opcoes: [
          'Contrato de seguro',
          'Contrato de aluguel',
          'Contrato de trabalho',
          'Contrato de empréstimo'
        ],
        resposta: 0
      },
      {
        enunciado: 'O que é franquia em seguros?',
        explicacao: 'Franquia é o valor que o segurado paga em caso de sinistro.',
        opcoes: [
          'Valor pago pelo seguro',
          'Valor pago em sinistro',
          'Valor do prêmio',
          'Valor do investimento'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é risco sistêmico?',
        explicacao: 'Risco sistêmico é o risco que afeta todo o mercado, não só um ativo.',
        opcoes: [
          'Risco individual',
          'Risco de todo o mercado',
          'Risco de crédito',
          'Risco de liquidez'
        ],
        resposta: 1
      }
    ]
  },
  {
    titulo: 'Estratégias de Crescimento Patrimonial',
    descricao: 'Explore estratégias para aumentar e proteger seu patrimônio ao longo do tempo.',
    perguntas: [
      {
        enunciado: 'O que é reinvestimento?',
        explicacao: 'Reinvestir é aplicar novamente os rendimentos para potencializar o crescimento.',
        opcoes: [
          'Gastar os rendimentos',
          'Aplicar novamente os rendimentos',
          'Guardar em casa',
          'Pagar dívidas'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é juros compostos?',
        explicacao: 'Juros compostos são juros sobre juros, acelerando o crescimento do capital.',
        opcoes: [
          'Juros simples',
          'Juros sobre juros',
          'Desconto',
          'Taxa fixa'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é rebalanceamento de carteira?',
        explicacao: 'Rebalancear é ajustar os investimentos periodicamente para manter a estratégia.',
        opcoes: [
          'Vender tudo',
          'Ajustar investimentos periodicamente',
          'Comprar só ações',
          'Deixar parado'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é independência financeira?',
        explicacao: 'Independência financeira é ter renda suficiente para cobrir despesas sem depender de trabalho ativo.',
        opcoes: [
          'Depender de salário',
          'Renda cobre despesas',
          'Viver de empréstimo',
          'Gastar tudo'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é renda passiva?',
        explicacao: 'Renda passiva é o dinheiro recebido sem trabalho direto, como aluguéis e dividendos.',
        opcoes: [
          'Salário',
          'Renda sem trabalho direto',
          'Empréstimo',
          'Venda de bens'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é efeito dos aportes regulares?',
        explicacao: 'Aportes regulares aumentam o patrimônio de forma consistente ao longo do tempo.',
        opcoes: [
          'Não faz diferença',
          'Aumenta patrimônio',
          'Diminui patrimônio',
          'Gera dívidas'
        ],
        resposta: 1
      },
      {
        enunciado: 'O que é planejamento sucessório?',
        explicacao: 'Planejamento sucessório organiza a transferência de bens para herdeiros, evitando conflitos e custos.',
        opcoes: [
          'Compra de imóveis',
          'Organização da herança',
          'Venda de ações',
          'Investimento em renda fixa'
        ],
        resposta: 1
      }
    ]
  }
];
