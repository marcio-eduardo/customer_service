# Trust Assist System (TAS)

O **Trust Assist System (TAS)** é uma plataforma integrada de **Customer Service** (Atendimento ao Cliente) desenvolvida para facilitar a gestão de chamados de suporte, clientes corporativos e suas equipes. O sistema adota uma arquitetura moderna, separando o Backend (API RESTful) do Frontend (SPA), e utiliza Docker para orquestração completa do ambiente.

## 🏛️ Arquitetura do Projeto

O sistema é composto por três serviços principais orquestrados via Docker Compose:

1. **Backend (`customer_service_back`)**: Uma API robusta construída em Java com Spring Boot, responsável pela lógica de negócios, segurança e persistência de dados.
2. **Frontend (`customer_service_front`)**: Uma interface de usuário moderna e responsiva construída com React e TypeScript, focada na experiência do usuário (UX).
3. **Banco de Dados**: MySQL 8.0 para armazenamento relacional persistente.

## 🚀 Tecnologias Utilizadas

### Backend (API)

- **Linguagem:** Java 21 (LTS)
- **Framework:** Spring Boot 3.4.5
- **Banco de Dados:** MySQL 8.0
- **Segurança:** Spring Security com autenticação Stateless via JWT (JSON Web Tokens).
- **Persistência:** Spring Data JPA (Hibernate).
- **Gerenciamento de Dependências:** Maven.
- **Outros:** Lombok, Jakarta Validation.

### Frontend (Interface)

- **Linguagem:** TypeScript
- **Framework:** React 18
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS (Design System personalizado "Confiança Moderna").
- **Gerenciamento de Estado/Cache:** React Query (TanStack Query).
- **Roteamento:** React Router DOM v6.
- **Cliente HTTP:** Axios.
- **Componentes:** Headless UI (via Tailwind classes), React Helmet Async.

### Infraestrutura

- **Containerização:** Docker & Docker Compose.

## 📋 Funcionalidades Implementadas

### 🔐 Autenticação e Controle de Acesso (RBAC)

O sistema implementa segurança baseada em papéis (Roles):

- **ROLE_USER:** Usuários de empresas (clientes). Podem abrir chamados e ver seus próprios tickets.
- **ROLE_MODERATOR:** Moderadores. Podem gerenciar tickets, visualizar dashboard e gerenciar cadastros básicos.
- **ROLE_ADMIN:** Administradores. Acesso total ao sistema, incluindo gestão de técnicos e configurações sensíveis.
- **Fluxo de Login/Registro:** Telas dedicadas para login e cadastro de novos usuários com validação de CPF e dados corporativos.

### 🎫 Gestão de Tickets (Chamados)

- **Abertura de Chamados:**
  - Clientes (`User`) abrem tickets para si mesmos.
  - Gestores (`Admin`/`Moderator`) podem abrir tickets em nome de qualquer usuário ou empresa cadastrada.
- **Listagem Inteligente:**
  - Visualização de chamados **Abertos** e **Resolvidos**.
  - Filtros automáticos baseados no perfil do usuário logado.
- **Ciclo de Vida:**
  - Status: `OPEN` (Aberto), `IN_PROGRESS` (Em Progresso), `RESOLVED` (Resolvido).
  - Prioridades: `LOW`, `MEDIUM`, `HIGH`, `URGENT`.
- **Encerramento:** Fluxo dedicado para encerrar chamados com inserção obrigatória de "Notas de Resolução".

### 🏢 Gestão de Clientes e Empresas

- **Empresas (`Company`):** CRUD de empresas com dados como Razão Social, CNPJ (Tax ID) e Responsável.
- **Usuários de Empresa (`CompanyUser`):** Associação de usuários a empresas.
- **Fluxo de Cadastro:** Interface para criar novas empresas e associar múltiplos usuários existentes de uma só vez.

### 📊 Dashboard

- **Visão Geral:** Cards com contagem em tempo real de tickets Abertos e Resolvidos.
- **Gráficos:**
  - Distribuição de Chamados por **Status** (Pie Chart).
  - Distribuição de Chamados por **Prioridade** (Doughnut Chart).

## ⚙️ Configuração e Instalação

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose instalados na máquina.

### Executando com Docker (Recomendado)

1. **Clone o repositório:**

   ```
   git clone [https://github.com/marcio-eduardo/customer_service.git](https://github.com/marcio-eduardo/customer_service.git)
   cd customer_service-university-group
   ```

2. Inicie os serviços:

   Execute o comando na raiz do projeto (onde está o arquivo docker-compose.yml):

   ```
   docker-compose up --build
   ```

   *Isso irá baixar as imagens do MySQL, compilar o Backend (Maven) e o Frontend (Node/Vite) e iniciar os containers.*

3. **Acesse a aplicação:**

   - **Frontend:** [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)
   - **Backend API:** [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080)

### Credenciais Padrão (Banco de Dados)

Definidas no `docker-compose.yml`:

- **User:** `admin`
- **Password:** `admin123`
- **Database:** `serviceDB`

## 📂 Estrutura de Diretórios

```
customer_service-university-group/
├── customer_service_back/       # Backend Java Spring Boot
│   ├── src/main/java/           # Código fonte Java (Controllers, Services, Models)
│   ├── src/main/resources/      # Configurações (application.properties) e SQL inicial
│   └── Dockerfile               # Definição da imagem Docker do Backend
│
├── customer_service_front/      # Frontend React + Vite
│   ├── src/
│   │   ├── Components/          # Componentes reutilizáveis (Layout, Button, Navbar)
│   │   ├── contexts/            # Contexto de Autenticação (AuthContext)
│   │   ├── pages/               # Páginas da aplicação (Dashboard, Login, Tickets)
│   │   └── lib/                 # Configurações de bibliotecas (Axios, React Query)
│   └── Dockerfile               # Definição da imagem Docker do Frontend
│
├── docker-compose.yml           # Orquestração dos serviços
└── README.md                    # Documentação do projeto
```