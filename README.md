# Trust Assist System (TAS)

O **Trust Assist System (TAS)** é uma solução completa de *Customer Service* (Atendimento ao Cliente) desenvolvida para gerir o ciclo de vida de chamados de suporte (tickets), clientes empresariais e as suas equipas.

O sistema oferece uma arquitetura moderna separada em Backend (API RESTful) e Frontend (SPA), totalmente containerizada com Docker para facilitar o desenvolvimento e a implementação.

## 📋 Funcionalidades Principais

### 🔐 Autenticação e Segurança

- **Login e Registo:** Sistema seguro de autenticação via JWT (JSON Web Tokens).
- **Controlo de Acesso (RBAC):** Diferenciação de permissões entre perfis:
  - `ROLE_USER`: Utilizadores padrão.
  - `ROLE_MODERATOR`: Gestão de tickets.
  - `ROLE_ADMIN`: Acesso total, incluindo gestão de técnicos e configurações avançadas.

### 🎫 Gestão de Chamados (Tickets)

- **Abertura de Chamados:** Criação de tickets associados a Empresas (`Company`) ou Utilizadores de Empresas (`CompanyUser`).
- **Priorização:** Classificação de tickets por prioridade (Baixa, Média, Alta, Urgente).
- **Fluxo de Trabalho:** Ciclo de vida com estados definidos (`OPEN`, `IN_PROGRESS`, `RESOLVED`).
- **Resolução:** Encerramento de chamados com registo de notas de resolução e técnico responsável.

### 🏢 Gestão de Clientes

- **Empresas (Companies):** Registo e gestão de entidades empresariais (Nome Fantasia, Razão Social, CNPJ/Tax ID, etc.).
- **Utilizadores de Empresas:** Gestão de colaboradores associados a uma empresa específica.

### 📊 Dashboard

- **Métricas em Tempo Real:** Visualização rápida de tickets abertos e resolvidos.
- **Gráficos:** Análise visual de distribuição de tickets por **Status** e **Prioridade** (usando Chart.js).

## 🛠️ Tecnologias Utilizadas

### Backend (`customer_service_back`)

- **Linguagem:** Java 21 (LTS)
- **Framework:** Spring Boot 3.4.5
- **Base de Dados:** MySQL 8.0
- **ORM:** Spring Data JPA (Hibernate)
- **Segurança:** Spring Security + JWT (JJWT 0.12.5)
- **Build Tool:** Maven

### Frontend (`customer_service_front`)

- **Linguagem:** TypeScript
- **Framework:** React 18
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS
- **HTTP Client:** Axios
- **Estado/Cache:** React Query (@tanstack/react-query)
- **Rotas:** React Router DOM 6

### Infraestrutura

- **Docker & Docker Compose:** Orquestração completa dos serviços (App, API e BD).

## 🚀 Como Executar o Projeto

A forma mais simples e recomendada de executar o projeto é utilizando o Docker Compose.

### Pré-requisitos

- [Docker](https://www.docker.com/get-started) e Docker Compose instalados.

### Passo a Passo

1. **Clone o repositório (se ainda não o fez):**

   ```
   git clone [https://github.com/marcio-eduardo/customer_service.git](https://github.com/marcio-eduardo/customer_service.git)
   cd customer_service
   ```

2. **Inicie a aplicação:** Execute o comando abaixo na raiz do projeto (onde está o ficheiro `docker-compose.yml`):

   ```
   docker-compose up --build
   ```

   *O parâmetro `--build` garante que as imagens sejam reconstruídas com as últimas alterações do código.*

3. **Aguarde a inicialização:**

   - O MySQL será iniciado primeiro.
   - O Backend aguardará o banco de dados e iniciará na porta `8080`.
   - O Frontend iniciará na porta `5173`.

4. **Aceda ao Sistema:**

   - **Frontend:** [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)
   - **Backend (API):** [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080)

### 🛑 Parar a Aplicação

Para parar os serviços e remover os containers, pressione `Ctrl+C` no terminal ou execute:

```
docker-compose down
```

## 📂 Estrutura do Projeto

```
customer_service/
├── customer_service_back/    # Código fonte da API Java Spring Boot
│   ├── src/
│   ├── Dockerfile            # Configuração da imagem Docker do Backend
│   └── pom.xml               # Dependências Maven
│
├── customer_service_front/   # Código fonte da Interface React
│   ├── src/
│   ├── Dockerfile            # Configuração da imagem Docker do Frontend
│   └── package.json          # Dependências Node.js
│
├── docker-compose.yml        # Orquestração dos serviços (DB, Back, Front)
└── README.md                 # Documentação do Projeto
```

## ⚙️ Configurações e Variáveis de Ambiente

As configurações sensíveis são geridas através do `docker-compose.yml`.

- **Base de Dados:**
  - User: `admin`
  - Password: `admin123` (Configurado no docker-compose)
  - Database: `serviceDB`
- **API URL no Frontend:**
  - Definida em `customer_service_front/.env` ou via variável de ambiente `VITE_API_URL` no docker-compose. Atualmente configurada para `http://localhost:8080`.

## 📝 Desenvolvimento

### Backend

Para rodar o backend localmente sem Docker (necessita de uma instância MySQL local ou configuração para H2):

```
cd customer_service_back
./mvnw spring-boot:run
```

### Frontend

Para rodar o frontend localmente:

```
cd customer_service_front
npm install
npm run dev
```