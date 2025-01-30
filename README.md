# 📌 Backend - Correção de Financiamentos

Este projeto faz parte de um sistema desenvolvido para analisar o impacto da correção monetária em financiamentos ao longo do tempo.

## 🔍 Sobre o Projeto

O backend foi desenvolvido em **Node.js** para processar e calcular a evolução dos financiamentos com base em índices reais de correção monetária. Ele recebe informações da aplicação web sobre as condições do financiamento e retorna simulações que mostram como estaria a dívida caso o financiamento tivesse sido contratado há **5, 10 ou 15 anos** (dependendo do prazo informado).

## 🛠️ Tecnologias Utilizadas

-   **Node.js** - Ambiente de execução do backend
-   **Express** - Framework para criação de APIs
-   **Winston** - Biblioteca para logging e monitoramento de eventos
-   **PostgreSQL** - Banco de dados relacional para armazenamento de informações financeiras

## 🚀 Funcionalidades

✔️ Consulta de índices de correção monetária  
✔️ Simulação de cenários para financiamentos passados  
✔️ API REST para integração com a aplicação web  
✔️ Processamento eficiente para retornos rápidos

## 📂 Estrutura do Projeto

```bash
/correcao-de-financiamentos-backend
├── controllers    # Regras de negócio
├── routes         # Definição das rotas da API
├── mocks          # Mocks dos dados de inflação
├── repositories   # Conexão e consultas ao banco de dados
├── services       # Serviços de tratamento de dados
├── tests          # Testes automatizados com Jest
├── index.js       # Arquivo principal do servidor
├── package.json   # Dependências e scripts
├── server-api.log # Arquivo de logs gerado automaticamente na execução
└── README.md      # Documentação do projeto
```

## 📌 Como Executar o Projeto

1️⃣ Clone este repositório:

```bash
git clone https://github.com/seu-usuario/correcao-financiamentos.git
```

2️⃣ Instale as dependências:

```bash
npm install
```

3️⃣ Configure as variáveis de ambiente no arquivo **.env** com suas credenciais e configurações

4️⃣ Inicie o servidor:

```bash
npm start
```

5️⃣ A API estará disponível em: `http://localhost:3000`

## 📌 Exemplo de Requisição

A API espera um corpo de requisição no formato JSON, contendo os seguintes campos:

```json
{
    "tipoTaxaDeJuros": "mensal",
    "taxaDeJuros": 0.01,
    "sistemaFinanciamento": "price",
    "numeroPrestacoes": 180,
    "valorPrimeiraParcela": 1000,
    "indiceCorrecao": "ipca"
}
```

-   **tipoTaxaDeJuros**: Define a periodicidade da taxa de juros (`"mensal"` ou `"anual"`).
-   **taxaDeJuros**: Percentual da taxa de juros (exemplo: `0.01` para 1%).
-   **sistemaFinanciamento**: Método de cálculo das parcelas (`"price"` ou `"sac"`).
-   **numeroPrestacoes**: Quantidade total de parcelas.
-   **valorPrimeiraParcela**: Valor inicial da primeira parcela.
-   **indiceCorrecao**: Índice de correção monetária utilizado (`"ipca"`, `"igpm"`).
