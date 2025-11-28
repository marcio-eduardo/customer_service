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
