# DevLog

## 27/11/2025

- Análise inicial do código finalizada.
- Foram identificadas vulnerabilidades de segurança e pontos de melhoria na configuração do back-end.
- Nenhuma vulnerabilidade crítica foi encontrada no front-end, mas uma análise de dependências é recomendada.
- Criação dos arquivos `DevLog.md` e `Tarefas.md`.

## 28/11/2025

- Início da refatoração do modelo de dados para alinhar com as novas regras de negócio.
- Criados os arquivos `BD.md` e `BD-OLD.md` para documentar e comparar os modelos de dados.
- Removidas as classes de modelo e repositórios antigos: `ClientePf`, `ClientePJ` e `Technical`.
- Atualizado o arquivo `Tarefas.md` com o plano de refatoração.
- Análise de contexto realizada: Leitura de README, DevLog e Tarefas. Próximo foco identificado: Refatoração do Frontend (SignUp, CreateTicket, Company CRUD).
- Correção de Bug: Ajustado o menu dropdown "Configurações" que fechava prematuramente. Removido gap (`mt-0.5`) entre o botão e o menu.
- Melhoria de UX: Alterado o comportamento dos submenus "Empresas" e "Usuários" no NavigationBar. Agora são seções estáticas (sempre visíveis) para evitar layout shift e fechamento acidental do menu.
- Refatoração de Segurança/Fluxo: Removido o cadastro público de usuários. A rota `/signup` foi removida e substituída pela rota protegida `/api/users` (apenas Moderadores). Criada nova página `CreateUserPage` para criação interna de usuários.
- Implementado GlobalExceptionHandler no backend para tratamento padronizado de erros (401, 403, 404, 409, 500) evitando que todos os erros sejam mascarados como 401.
- Criado UserController com endpoints protegidos: POST/GET/DELETE `/api/users` (apenas Moderadores).
- Refatoração do Frontend: Páginas de clientes PF/PJ removidas. Implementadas novas páginas de Empresas: `ViewCompaniesPage` (listar) e `CreateCompanySimplePage` (criar).
- Atualizado NavigationBar: Substituído submenu "Clientes" por "Empresas" com opções "Listar Empresas" e "Criar Empresa".
- Refatoração da CreateTicketPage: Implementada lógica de seleção dinâmica. Moderadores e Técnicos podem selecionar Empresa e Solicitante. Moderadores podem atribuir Técnico Responsável. Usuários de Empresa têm seus dados preenchidos automaticamente.
- Reorganização do repositório: Arquivo CreateCompanyPage.tsx duplicado removido. Mantida apenas CreateCompanySimplePage.tsx em uso.
- Padronização visual: Páginas de empresas (listar e criar) alinhadas com identidade TAS (fundo bg-tas-bg-page, cards bg-tas-bg-card, botões secondary).
- Commits organizados: GlobalExceptionHandler, UserController, tipos Company, páginas de empresas, CreateUserPage, rotas e navegação.

## 29/11/2025

- Refatoração Backend - Padrão Repository: Implementado padrão de 3 camadas (Controller → Service → Repository) para desacoplar lógica de negócio.
- Criados DTOs de Backend: `UserResponse` (sem nome/CPF para segurança) e `UpdateUserRequest` (DTO para atualizações parciais).
- Criado UserService: Camada de serviço com métodos createUser, getAllUsers, getUserById, updateUser, deleteUser, getRoleByName.
- Refatorado UserController: Delegação completa para UserService, reduzido para ~80 linhas, endpoints limpos.
- Criado Utilitário de Validação Frontend: Arquivo `validators.ts` com funções de formatação e validação.
  - `formatCPF()`: Formata para 000.000.000-00
  - `formatCNPJ()`: Formata para 00.000.000/0000-00
  - `formatPhone()`: Formata para (00) 00000-0000 ou (00) 0000-0000
  - `validateCPF()`: Valida CPF com dígitos verificadores
  - `validateCNPJ()`: Valida CNPJ com dígitos verificadores
  - `removeNonNumeric()`: Remove formatação para envio ao backend
- Melhorias na CreateUserPage:
  - Implementada máscara de CPF com formatação em tempo real
  - Validação de CPF antes do submit (exibe toast de erro se inválido)
  - Campo Empresa condicional: visível apenas para role "company_user"
  - Auto-limpeza do campo Empresa ao selecionar Moderador ou Técnico
  - Exibição de empresa: "Nome Fantasia - CNPJ" ao invés de só CNPJ
  - Envio de CPF sem formatação para backend (removeNonNumeric)
- Melhorias na CreateCompanySimplePage:
  - Implementada máscara de CNPJ com formatação em tempo real
  - Implementada máscara de Telefone com formatação em tempo real
  - Validação de CNPJ antes do submit
  - Envio de CNPJ e Telefone sem formatação para backend
  - Adicionados maxLength nos campos
- Melhorias na ViewCompaniesPage:
  - Aplicada formatação de CNPJ na exibição (formatCNPJ)
  - Aplicada formatação de Telefone na exibição (formatPhone)
- Implementada Página de Gestão de Usuários:
  - Criada ViewUsersPage com listagem completa de usuários
  - Sistema de tabs para filtrar por perfil (Admin, Moderador, Técnico, Cliente)
  - Modais de edição e exclusão de usuários
  - Integração com backend via axios e react-query
  - Exibição formatada: nome, CPF (com máscara), email, empresa e perfil
- Atualização de Rotas e Navegação:
  - Adicionada rota `/users/view` para visualização de usuários
  - Adicionada rota `/companies/view` para visualização de empresas
  - NavigationBar atualizado com links organizados por contexto (Usuários, Empresas, Tickets)
- Commits organizados por funcionalidade:
  1. Backend DTOs (UserResponse, UpdateUserRequest)
  2. Service layer + Repository Pattern (UserService, UserController)
  3. Frontend validators utility (validators.ts)
  4. User creation improvements (CPF mask, conditional company field)
  5. Company form masks (CNPJ, phone)
  6. Routes and navigation updates
  7. User management page (ViewUsersPage)
