# Log de Desenvolvimento

### 26 de Novembro de 2025

#### Refatoração de Nomenclaturas (Company e CompanyUser) - Segunda Tentativa

Após uma confusão na interpretação inicial da solicitação de unificação de entidades, o projeto foi revertido para o commit anterior ao início desta grande refatoração. A partir de então, uma nova abordagem foi adotada para renomear entidades e ajustar o código-fonte, focando em:

-   **`ClientePJ` para `Company`**: A entidade `ClientePJ` foi renomeada para `Company`, e seus campos foram padronizados para o inglês (`tradingName`, `taxId`, `legalName`, etc.).
-   **`ClientePF` para `CompanyUser`**: A entidade `ClientePF` foi renomeada para `CompanyUser`, e seus campos foram padronizados para o inglês (`name`, `cpf`, `address`, etc.).
-   **Estabelecimento de Relacionamento**: A relação "Um para Muitos" (`@OneToMany` / `@ManyToOne`) entre `Company` e `CompanyUser` foi estabelecida, onde uma `Company` pode ter múltiplos `CompanyUser`s e um `CompanyUser` pertence a uma `Company`.

**Componentes do Backend refatorados com sucesso:**

-   Modelos: `Company.java` e `CompanyUser.java` (renomeados e seus campos ajustados).
-   Repositórios: `CompanyRepository.java` e `CompanyUserRepository.java` (renomeados e seus métodos ajustados).
-   Serviços: `CompanyService.java` e `CompanyUserService.java` (renomeados e seus métodos/lógica ajustados).
-   Controladores: `CompanyController.java` e `CompanyUserController.java` (renomeados, mapeamentos de rotas e lógica ajustados).
-   DTOs: `TicketOpenRequest.java` (campos `clientePfId` e `clientePjId` renomeados para `companyUserId` e `companyId`).
-   Modelos de Ticket: `TicketModel.java` (campos `clientePf` e `clientePj` atualizados para `companyUser` e `company`).
-   Configuração de Segurança: `WebSecurityConfig.java` (rotas `/api/clientes-pf/**` e `/api/clientes-pj/**` atualizadas para `/api/company-users/**` e `/api/companies/**`).

**Componentes do Frontend refatorados com sucesso:**

-   Páginas de visualização: `ViewPJClientsPage.tsx` renomeada para `ViewCompaniesPage.tsx`, e `ViewPFClientsPage.tsx` renomeada para `ViewCompanyUsersPage.tsx`. Ambas foram refatoradas para buscar e exibir dados das novas entidades e suas respectivas APIs.
-   Formulários: `CreateTicketPage.tsx` foi refatorado para usar as novas entidades e endpoints ao abrir chamados. `SignUpPage.tsx` foi corrigido para remover código duplicado e comentários. `AddUserToCompanyPage.tsx` foi criada para permitir a adição de `CompanyUsers` a `Companies`.
-   Rotas: `app.routes.tsx` foi atualizado para refletir todos os novos nomes de componentes e caminhos de URL.

**Próximos passos pendentes:**

-   Limpeza final: A barra de navegação (`NavigationBar.tsx`) ainda precisa ser ajustada para refletir as novas rotas e nomenclaturas.
-   Verificação completa e testes para garantir que todas as partes do sistema funcionem conforme o esperado com a nova arquitetura.

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
