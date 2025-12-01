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
  - Sistema de tabs para filtrar por perfil (Moderador, Técnico, Cliente)
  - Modais de edição e exclusão de usuários
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
- Implementado CRUD Completo de Empresas:
  - Backend: Criados DTOs `CompanyRequest`, `CompanyResponse` e `UpdateCompanyRequest`
  - CompanyService refatorado seguindo padrão Repository com validações:
    - Validação de CNPJ e email duplicados (create e update)
    - Verificação de usuários vinculados antes de deletar (previne foreign key constraint)
    - Métodos @Transactional para operações de escrita
    - Update parcial (atualiza apenas campos não nulos)
  - CompanyController atualizado para usar DTOs com validações @Valid
  - UserRepository: Adicionados métodos `countByCompanyId` e `existsByCompanyId`
  - Frontend: ViewCompaniesPage com CRUD completo
    - Modal de edição com máscaras de CNPJ e telefone
    - Validação de CNPJ antes do submit
    - Modal de exclusão com aviso sobre usuários vinculados
    - React Query para cache e gerenciamento de estado
    - Toast com duração estendida (5s) para erros de constraint
    - Botões de ação visíveis apenas para Moderadores
- Criação de Guia Postman:
  - Criado arquivo `postman.md` com um guia detalhado para popular o banco e testar o CRUD da API.
  - O guia inclui a criação de 5 empresas, 15 usuários (Moderadores, Técnicos, Clientes) e 20 tickets, seguindo regras de negócio específicas.
  - O documento serve como um roteiro de testes para as funcionalidades de Empresas, Usuários e Tickets.
- Criação de Guia SQL:
  - Criado arquivo `SQL.md` contendo os scripts SQL para popular o banco de dados com o mesmo conjunto de dados do guia Postman.
  - O arquivo serve como uma alternativa para a população de dados diretamente no banco, sem a necessidade de usar a API.
- Correção e Formatação do Guia Postman:
  - Padronizadas todas as senhas para "123456" na seção de criação de usuários.
  - Corrigido o payload para usar o campo `role` (string) em vez de `roles` (array).
  - Adicionada observação no `postman.md` sobre a inconsistência do campo CPF (presente no frontend/DevLog, mas ausente no backend).
  - Corrigida a indentação de todos os blocos JSON no arquivo `postman.md` para melhor legibilidade.
- Refatoração Final da Convenção de Roles:
  - Refatorado `UserService.java` para alinhar com a convenção da API, aceitando `COMPANY_USER`, `TECH_USER`, e `MODERATOR_USER`.
  - Corrigido o `postman.md` para enviar os nomes de `role` corretos, garantindo consistência entre a documentação e o backend.
- Correção de Endpoints de Tickets no Guia Postman:
  - Corrigido o endpoint para fechamento de tickets no `postman.md`, adicionando o `{id}` na URL.
  - Corrigida a rota de criação de tickets para `POST /api/tickets/open`.
  - Corrigidas as rotas de listagem de tickets abertos/resolvidos para `GET /api/tickets/status/open` e `GET /api/tickets/status/resolved`.
- Correção de Enum de Prioridade de Ticket:
  - Identificado erro de desserialização do `TicketPriority` devido a valores incorretos (`MEDIUM` em vez de `MEDIA`).
  - Corrigidos os valores de `priority` nos arquivos `postman.md` e `SQL.md` para usar os nomes corretos do enum em português (`BAIXA`, `MEDIA`, `ALTA`, `URGENTE`).
- Correção de Erro de Serialização (Lazy Loading):
  - Identificado erro `Type definition error: [simple type, class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor]` na criação e fechamento de tickets.
  - Causa: Retorno direto da entidade JPA (`TicketModel`) com relações `FetchType.LAZY` do controller.
  - Corrigido o `TicketController.java`: os métodos `openTicket` e `closeTicket` agora retornam o DTO `TicketResponse` para evitar a serialização de proxies do Hibernate.
- Correção de Rota de Fechamento de Ticket (Frontend):
  - Identificada inconsistência entre a navegação na `TicketDetailsPage` (que tentava acessar `/tickets/:id/fechar`) e a definição da rota.
  - Padronizada a rota em `app.routes.tsx` para `/tickets/:id/encerrar`.
  - Corrigida a chamada `navigate` na `TicketDetailsPage` para usar a rota `/tickets/:id/encerrar`, resolvendo o problema de acesso à página.
- Refatoração da Página de Fechamento de Ticket (Frontend):
  - Modificada `CloseTicketPage.tsx` para suportar dois cenários de navegação:
    - Com ID na URL (`/tickets/:id/encerrar`): Carrega os detalhes do ticket automaticamente.
    - Sem ID na URL (`/tickets/encerrar`): Exibe um campo de busca para o usuário digitar o ID.
  - A lógica de submissão do formulário agora usa o endpoint `POST /api/tickets/{id}/close` e não inclui `closedByTechnicalId` no payload.
  - Adicionado item "Encerrar" no dropdown "Chamados" do `NavigationBar.tsx`, apontando para a rota `/tickets/encerrar` e visível para Moderadores/Técnicos.
- Correção de Bug no Frontend:
  - Corrigido `ReferenceError: headerTitleClass is not defined` na `CloseTicketPage.tsx` ao adicionar as definições de classe de estilo que estavam faltando.
- Implementação e Correção do Sistema de Temas e Estilização:
  - Implementado sistema de temas com `ThemeContext` e `localStorage`.
  - Adicionado seletor de temas ao menu "Configurações".
  - Refatorada a `DashboardPage.tsx` para usar cores dinâmicas nos gráficos e corrigir o efeito de hover, alinhando ao `Estilos.md`.
  - Implementada a fonte Poppins globalmente via `index.css` e `tailwind.config.js`.
  - Removidas as classes `font-['Poppins']` de todos os componentes para herdar a fonte do `body`.
  - Realizada varredura completa nas páginas e componentes para padronizar estilos e garantir consistência visual.
  - Realizada varredura completa nas páginas e componentes para padronizar estilos e garantir consistência visual.
  - Corrigido bug de importação na `DashboardPage` (`useTheme` importado do contexto errado).
- Implementação de Atribuição de Chamado a Técnico:
  - Backend:
    - Adicionado método `assignTicket` no `TicketService.java` para atribuir o chamado ao usuário logado (técnico/moderador).
    - Adicionado endpoint `PATCH /api/tickets/{id}/assign` no `TicketController.java`.
    - Implementada validação para impedir reatribuição se o chamado já tiver responsável.
    - Atualização automática do status para `IN_PROGRESS` ao assumir um chamado `OPEN`.
  - Frontend:
    - Atualizada `TicketDetailsPage.tsx` para incluir a função `handleAssignTicket` e o botão "Atender Ticket".
    - O botão "Atender Ticket" é exibido apenas para Moderadores/Técnicos quando o chamado ainda não tem responsável.
    - O botão "Encerrar Ticket" é exibido apenas após o chamado ser atribuído a um técnico.
    - Adicionado feedback visual (toasts) de sucesso e erro.

### [NEW] Listagem de Chamados em Atendimento
- **Backend:**
  - Adicionado método `findInProgressTicketsWithDetails` no `TicketRepository`.
  - Adicionado método `getInProgressTickets` no `TicketService`.
  - Criado endpoint `GET /api/tickets/status/in-progress` no `TicketController`.
- **Frontend:**
  - Criada página `ViewInProgressTicketsPage.tsx` para listar chamados com status `IN_PROGRESS`.
  - Adicionada rota `/tickets/em-atendimento`.
  - Adicionado item "Em Atendimento" no menu de navegação (visível apenas para Moderadores e Técnicos).

### [MOD] Refatoração de UI
- **NavigationBar:**
  - O dropdown "Chamados" foi refatorado para exibir as opções em uma lista vertical única, melhorando a usabilidade.
- **ViewOpenTicketsPage:**
  - O layout foi atualizado para utilizar uma tabela, padronizando com a visualização de "Chamados em Atendimento".
  - Adicionadas colunas para Empresa, Solicitante, Técnico e Prioridade.
  - Títulos centralizados e container ajustado para largura total (`w-full`) para melhor aproveitamento de tela.
  - Coluna de Prioridade estilizada para preencher toda a célula com a cor correspondente.

### [PLAN] SLA (Service Level Agreement)
- Adicionada tarefa futura para implementar regras de SLA (tempo de atendimento por cliente).

## 30/11/2025

### [FIX] Fluxo de Encerramento de Tickets
- **Backend:** Adicionada validação no `TicketService` para impedir encerramento de tickets que não estejam `IN_PROGRESS`. Ajustado `openTicket` para definir status `IN_PROGRESS` se criado com técnico.
- **Frontend:** 
  - Botão "Encerrar Ticket" agora só aparece se o status for `IN_PROGRESS`.
  - **Bug Fix:** Corrigida validação na página `CloseTicketPage.tsx` que incorretamente exigia status `OPEN`. Agora exige `IN_PROGRESS` conforme regra de negócio.

### [FIX] Dashboard e Tema de Login
- **Backend:** 
  - Corrigido bug no Dashboard onde estatísticas eram globais. Agora, usuários de empresa veem apenas dados de sua própria empresa.
  - **Bug Fix:** Corrigida permissão no `DashboardController` que bloqueava acesso de usuários de empresa (erro 403). Agora acessível a todos autenticados.
- **Frontend:** Tela de Login agora força o tema "Tech Blue" por padrão, mantendo a identidade visual solicitada.
- **UI:** Atualizado ícone da tela de login (`NuvemConfig-Wite.svg`) para usar a cor `--tas-secondary-hover` através de máscara CSS, permitindo coloração dinâmica de SVG rasterizado.
- **UI:** Adicionado efeito de hover na logo do `NavigationBar`, transitando da cor do texto (`--tas-text-on-primary`) para a cor secundária (`--tas-secondary`), alinhado com o comportamento dos links de texto.
- **UX:** Melhorada a usabilidade do modal de edição de empresas em `ViewCompaniesPage.tsx`. Agora é possível fechar o modal clicando fora dele (backdrop) ou no botão "Cancelar".
- **UI/UX:** Padronização dos modais de edição e exclusão em `ViewCompaniesPage` e `ViewUsersPage`. Botões "Cancelar" posicionados à esquerda e "Salvar/Excluir" à direita. Botão "Cancelar" estilizado com fundo da página (`bg-tas-bg-page`) e texto cinza (`text-tas-text-secondary`); ao passar o mouse, assume fundo cinza (`bg-tas-text-secondary`) e texto escuro (`text-tas-text-on-card`).
- **UI:** Atualizado label do menu de "Criar Empresa" para "Adicionar Empresas" em `NavigationBar.tsx`.
- **UX:** Removido botão "Cancelar" do formulário de criação de empresas em `CreateCompanySimplePage.tsx` para simplificar a interface.
- **UI:** Padronizada a página de criação de usuários (`CreateUserPage.tsx`) para seguir o mesmo estilo visual e estrutura da criação de empresas (Header externo, Card interno, tipografia e cores consistentes).

### [PLAN] Avaliação de Atendimento
- Adicionada tarefa futura para permitir que clientes avaliem o atendimento após o encerramento do ticket.

### [PLAN] Avaliação de Atendimento
- Adicionada tarefa futura para permitir que clientes avaliem o atendimento após o encerramento do ticket.

## 30/11/2025 (Noite)

### [FEAT] Implementação de SLA (Service Level Agreement)
- **Backend:**
  - Adicionado campo `sla` na entidade `Company` e `dueDate` na entidade `Ticket`.
  - Implementada lógica de cálculo de SLA baseada na prioridade do ticket e no SLA da empresa.
  - Criado endpoint `POST /api/tickets/fix-slas` para corrigir tickets antigos sem data de vencimento.
- **Frontend:**
  - Adicionado campo de SLA nos formulários de criação e edição de empresas.
  - Exibição do prazo de SLA e status (No Prazo/Atrasado) nos detalhes do ticket.

### [FEAT] Gestão Avançada de Tickets
- **Backend:**
  - Unificação da listagem de tickets com endpoint `GET /api/tickets/search` suportando filtros por status, empresa e técnico.
  - Implementados endpoints para Pausar, Reatribuir (`/reassign`) e Cancelar (`/cancel`) tickets.
  - Endpoint de Escalada (`/escalate`) atualizado para permitir atribuir a um moderador específico.
- **Frontend:**
  - Criada página unificada `/tickets` com filtros dinâmicos na URL.
  - Implementado modal de gerenciamento para Moderadores (Pausar, Reatribuir, Cancelar).
  - Implementado fluxo de escalada para Técnicos, permitindo selecionar um Moderador.

### [FEAT] Nome e Sobrenome do Usuário
- **Backend:**
  - Adicionados campos `firstName` e `lastName` na entidade `User`, DTOs e `UserDetailsImpl`.
  - Atualizado `UserService` para processar esses campos na criação e atualização.
  - Atualizado `AuthController` para retornar esses dados no login.
- **Frontend:**
  - Atualizado `AuthContext` e `LoginPage` para capturar e armazenar nome e sobrenome.
  - `NavigationBar` atualizado para exibir "Nome Sobrenome" do usuário logado.
  - Formulários de criação e edição de usuários atualizados com os novos campos.

### [FIX] Correções Diversas
- **Frontend:**
  - Corrigido bug na `LoginPage` que não salvava os dados do usuário no contexto.
  - Corrigido seletor de empresa na `ViewUsersPage` que não exibia a empresa atual do cliente.
  - Ajustados labels e comportamento do seletor de papéis no modal de edição de usuários.
  - Corrigido layout do Footer para evitar sobreposição de conteúdo.

