# Log de Desenvolvimento

### 20 de Novembro de 2025

Uma série de atualizações foram implementadas para melhorar o processo de criação de chamados e corrigir problemas de configuração inicial.

#### Backend
- **Melhoria no Modelo de Ticket**:
  - Adicionado um campo dedicado `openDate` ao `TicketModel.java` para rastrear explicitamente a data de abertura do chamado.
  - O método `@PrePersist` foi atualizado para preencher automaticamente este campo na criação do chamado.
- **Novos Endpoints de API para Clientes**:
  - Para suportar a busca de todos os clientes para listas suspensas na interface do usuário, novos endpoints foram adicionados para retornar listas não paginadas:
    - `GET /api/clientes-pf/all`: Retorna uma lista completa de todos os clientes `ClientePf`.
    - `GET /api/clientes-pj/all`: Retorna uma lista completa de todos os clientes `ClientePj`.
  - As camadas de serviço correspondentes (`ClientePfService` e `ClientePJService`) foram atualizadas com os métodos `listarTodosSemPaginacao()`.

#### Frontend
- **Página de Criação de Chamado Melhorada**:
  - O arquivo `CreateTicketPage.tsx` foi atualizado para usar os novos endpoints `/all` (`/api/clientes-pf/all` e `/api/clientes-pj/all`).
  - Isso garante que a lista suspensa de seleção de cliente agora liste corretamente **todos** os clientes disponíveis, e não apenas a primeira página de um resultado paginado.

#### Ambiente e Configuração
- **Correção no Docker Compose para Login**:
  - Resolvido um erro `net::ERR_NAME_NOT_RESOLVED` que ocorria durante o login ao executar a aplicação com o Docker Compose.
  - A variável de ambiente `VITE_API_URL` para o serviço `frontend` no `docker-compose.yml` foi alterada de `http://backend:8080` para `http://localhost:8080`. Isso permite que o navegador resolva corretamente o endereço da API do backend.

### 25 de Novembro de 2025

Uma refatoração completa da arquitetura do projeto foi realizada para unificar e padronizar a gestão de usuários e clientes, com o objetivo de clareza e manutenção.

#### Alterações na Arquitetura Central
- **Unificação de Entidades**: As entidades `ClientePf` e `User` foram consolidadas em uma única entidade `User`. Esta nova entidade `User` agora armazena tanto os dados de login e autenticação quanto os dados pessoais (nome, CPF, endereço, telefone, data de cadastro). A entidade `ClientePf` e seus arquivos associados foram removidos do sistema.
- **Renomeação de Entidades**: A entidade `ClientePJ` foi renomeada para `Company` para maior clareza e padronização. Seus campos também foram renomeados para o inglês (ex: `cnpj` para `taxId`, `nomeFantasia` para `tradingName`).
- **Impacto nos Relacionamentos**:
  - O campo `responsavel` em `Company` agora aponta para a nova entidade `User`.
  - O `TicketModel` foi atualizado para referenciar `User` (como `requester`) e `Company` em vez de `ClientePf` e `ClientePJ`.

#### Backend
- **Modelos, Repositórios, Serviços e Controladores**: Todos os arquivos relacionados a `ClientePf` foram removidos. Os arquivos de `ClientePJ` foram renomeados para `Company` e seu conteúdo foi refatorado para o novo modelo.
- **Autenticação**: O DTO `SignUpRequest` e o `AuthController` foram atualizados para incluir os novos campos (`name`, `cpf`) durante o processo de registro de usuário.
- **Novos Endpoints**: Foram criados `UserService` e `UserController` para gerenciar e expor dados de usuários através de um novo endpoint `/api/users`.
- **Segurança**: A configuração de segurança (`WebSecurityConfig`) foi atualizada para proteger os novos endpoints `/api/companies/**` e `/api/users/**` com as permissões adequadas.

#### Frontend
- **Páginas de Clientes/Empresas**: O diretório `ViewClientsPage` foi renomeado para `CompaniesPage`. A `ViewPJClientsPage.tsx` foi renomeada para `ViewCompaniesPage.tsx` e refatorada para exibir dados de `Company`. A `ViewPFClientsPage.tsx` foi removida.
- **Páginas de Usuários**: Uma nova página `ViewUsersPage.tsx` foi criada para listar todos os usuários do sistema. A `AddUserToPJPage.tsx` foi renomeada para `AddUserToCompanyPage.tsx` e atualizada para o novo modelo.
- **Formulários**: Os formulários `SignUpPage.tsx` e `CreateTicketPage.tsx` foram refatorados para se alinharem com o novo modelo de dados, incluindo os campos `name` e `cpf` para usuários e usando `User` e `Company` para associação de tickets.
- **Rotas**: O `app.routes.tsx` foi atualizado para refletir todos os novos nomes de componentes e caminhos de URL.

Todas as modificações visam uma maior consistência e padronização do código, facilitando futuras manutenções e o entendimento do domínio da aplicação.

### 26 de Novembro de 2025

#### Refatoração do Fluxo de Gestão de Empresas e Usuários

Seguindo novas diretrizes de fluxo de trabalho e UX, uma refatoração significativa foi realizada para centralizar e robustecer a gestão de empresas e a associação de usuários.

**Backend:**

-   **Endpoint para Usuários Não Associados**: Foi criado um novo endpoint `GET /api/company-users/unassigned` para listar todos os `CompanyUser`s que ainda não pertencem a nenhuma empresa. Isso é fundamental para a nova interface de criação de empresas.
-   **Endpoint de Criação de Empresa Aprimorado**: O endpoint `POST /api/companies` foi modificado para aceitar um `CompanyRequestDTO`. Este DTO agora inclui, além dos dados da empresa, uma lista de IDs de usuários (`userIds`) que serão automaticamente associados à empresa no momento da sua criação. A lógica no `CompanyService` foi tornada transacional para garantir a integridade dos dados.

**Frontend:**

-   **Nova Página de Criação de Empresa (`CreateCompanyPage.tsx`)**: Uma nova página foi criada para o cadastro de empresas (`/companies/new`). A página inclui:
    -   Campos para todos os dados da empresa.
    -   Um seletor para o "Usuário Responsável", populado com todos os usuários do sistema.
    -   Uma lista de seleção múltipla (checkboxes) para "Associar Usuários", populada pelo novo endpoint de usuários não associados.
    -   Um botão que redireciona para a página de criação de usuário (`/admin/create-user`), permitindo um fluxo de trabalho contínuo.
-   **Nova Página de Seleção de Empresa (`SelectCompanyForUserPage.tsx`)**: Para habilitar o link de menu "Adicionar Usuários", foi criada uma página intermediária (`/companies/add-user`) que permite ao moderador primeiro selecionar uma empresa de uma lista e depois ser redirecionado para a página correta de associação (`/companies/:id/add-user`).
-   **Ajustes na Barra de Navegação (`NavigationBar.tsx`)**:
    -   **Layout do Submenu**: O problema de layout onde o submenu "Empresas" saía da tela foi corrigido. O menu agora abre para a esquerda quando pertence ao último item da barra de navegação.
    -   **Permissões de Acesso**: A visibilidade do submenu "Empresas" e de todo o seu conteúdo foi restringida para ser acessível **apenas por Moderadores** (`isModerator`).
    -   **Itens de Menu**: O submenu "Empresas" agora contém os quatro itens solicitados: "Adicionar Empresa", "Adicionar Usuários", "Empresas Cadastradas" e "Usuários Cadastrados", cada um apontando para o fluxo correto.

Essas mudanças criam um fluxo de gestão de empresas mais robusto, centralizado e alinhado com as regras de negócio e permissões especificadas.

#### Correção de Dependências e Componentes do Frontend

-   **Contexto**: Após a refatoração do fluxo de gestão de empresas, o build do Docker começou a falhar devido a dependências ausentes e um componente de UI que não existia.
-   **Componente Faltando (`Button.tsx`)**: O componente reutilizável `Button.tsx` estava sendo referenciado mas estava vazio. Um novo componente de botão robusto foi criado usando `class-variance-authority` para garantir consistência visual e flexibilidade.
-   **Dependências Ausentes**: As bibliotecas `react-hook-form` e `class-variance-authority`, necessárias para as novas páginas e componentes, não estavam declaradas no `package.json`. Ambas foram adicionadas para garantir que sejam instaladas corretamente durante o build do Docker.
-   **Otimização do Docker Compose**: O `docker-compose.yml` foi otimizado para não executar `npm install` a cada inicialização do contêiner. Também foi adicionada a diretiva `platform: linux/amd64` para resolver erros de compilação de pacotes nativos em arquiteturas ARM (como Macs M-series).