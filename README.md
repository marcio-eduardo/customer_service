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
- **Arquitetura:** Padrão Controller-Service-Repository.
- **Tratamento de Erros:** Global Exception Handler para respostas padronizadas.
- **Persistência:** Spring Data JPA (Hibernate).
- **Gerenciamento de Dependências:** Maven.
- **Outros:** Lombok, Jakarta Validation.

### Frontend (Interface)

- **Linguagem:** TypeScript
- **Framework:** React 18
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS com suporte a **Temas Dinâmicos**.
- **Gerenciamento de Estado/Cache:** React Query (TanStack Query).
- **Roteamento:** React Router DOM v6.
- **Cliente HTTP:** Axios.
- **Componentes:** Headless UI, React Helmet Async, Lucide React (Ícones).
- **Validação:** Máscaras de input (CPF, CNPJ, Telefone) e validações em tempo real.

### Infraestrutura

- **Containerização:** Docker & Docker Compose.

## 📋 Funcionalidades Implementadas

### 🔐 Autenticação e Controle de Acesso (RBAC)

O sistema implementa segurança baseada em papéis (Roles):

- **ROLE_COMPANY_USER:** Usuários de empresas (clientes). Podem abrir chamados e ver apenas tickets da sua empresa.
- **ROLE_TECH_USER:** Técnicos. Podem visualizar todos os chamados, assumir tickets e encerrá-los.
- **ROLE_MODERATOR:** Moderadores. Acesso total à gestão de tickets, empresas e usuários.
- **ROLE_ADMIN:** Administradores do sistema.
- **Fluxo de Login:** Autenticação JWT segura.

### 🎫 Gestão de Tickets (Chamados)

- **Abertura de Chamados:**
  - Clientes abrem tickets vinculados automaticamente à sua empresa.
  - Gestores podem abrir tickets em nome de qualquer usuário ou empresa cadastrada.
- **Fluxo de Atendimento:**
  - **Atribuição ("Self-assignment"):** Técnicos podem assumir a responsabilidade por chamados abertos.
  - **Fila de Atendimento:** Visualização dedicada para chamados com status `IN_PROGRESS`.
- **Listagem Inteligente:**
  - Filtros automáticos baseados no perfil do usuário (Clientes veem apenas os seus, Técnicos veem todos).
  - Visualização de chamados **Abertos**, **Em Atendimento** e **Resolvidos**.
- **Ciclo de Vida:**
  - Status: `OPEN` (Aberto), `IN_PROGRESS` (Em Atendimento), `RESOLVED` (Resolvido).
  - Prioridades: `BAIXA`, `MEDIA`, `ALTA`, `URGENTE` (com indicadores visuais).
- **Encerramento:** Fluxo dedicado para encerrar chamados com inserção obrigatória de "Notas de Resolução".

### 🏢 Gestão de Empresas e Clientes

- **CRUD de Empresas:**
  - Cadastro completo com validação de CNPJ e máscaras de formatação.
  - Listagem com busca e filtros.
  - Proteção contra exclusão de empresas com usuários vinculados.

### 👥 Gestão de Usuários

- **Administração de Contas:**
  - Criação de usuários com perfis específicos (Cliente, Técnico, Moderador).
  - Associação automática ou manual de usuários a empresas.
  - Listagem organizada por abas (Clientes, Técnicos, Moderadores).
  - Edição e Exclusão de usuários.

### 🎨 UI/UX e Personalização

- **Sistema de Temas:**
  - Suporte a **6 temas visuais** diferentes (Original, Tech Blue, Forest, Purple, Warm, Minimal).
  - Persistência da preferência do usuário (localStorage).
- **Dashboard:**
  - Cards com métricas em tempo real.
  - Gráficos de distribuição por **Status** e **Prioridade** (Chart.js).
  - Adaptação de cores dos gráficos conforme o tema escolhido.

## ⚙️ Configuração e Instalação

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose instalados na máquina.

### Executando com Docker (Recomendado)

1. **Clone o repositório:**

   ```
   git clone [https://github.com/marcio-eduardo/customer_service.git](https://github.com/marcio-eduardo/customer_service.git)
   cd customer_service
   ```

2. **Inicie os serviços:**

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

### Usuários de Teste (Padrão)

Consulte o arquivo `postman.md` ou `SQL.md` para scripts de população de dados, mas o usuário inicial (Moderador) gerado pelo sistema é:

- **User:** `moderator`
- **Password:** `moderator`

## 📂 Estrutura de Diretórios

```
customer_service/
├── customer_service_back/       # Backend Java Spring Boot
│   ├── src/main/java/           # Código fonte (Controllers, Services, Models, Repositories)
│   └── src/main/resources/      # Configurações e SQL inicial
│
├── customer_service_front/      # Frontend React + Vite
│   ├── src/
│   │   ├── Components/          # UI Reutilizável (Layout, Navbar, Footer)
│   │   ├── contexts/            # Contextos (Auth, Theme)
│   │   ├── pages/               # Páginas (Dashboard, Tickets, Users, Companies)
│   │   ├── services/            # Integração com API
│   │   └── lib/                 # Utilitários (Axios, Validators, Tailwind config)
│   └── Dockerfile               # Container Frontend
│
├── docker-compose.yml           # Orquestração dos serviços
└── README.md                    # Documentação do projeto
```