# Tarefas

## Fase 1: Refatoração do Modelo de Dados e Backend

-   [x] **Planejamento e Documentação**
    -   [x] Analisar o modelo de dados antigo.
    -   [x] Criar o arquivo `BD.md` com o novo modelo de dados.
-   [x] **Remoção do Modelo Antigo (Backend)**
    -   [x] Excluir entidades e repositórios de `ClientePf`, `ClientePJ` e `Technical`.
-   [x] **Implementação do Novo Modelo (Backend)**
    -   [x] Criar a entidade `Company.java` e seu repositório.
    -   [x] Refatorar a entidade `User.java` para associar com `Company`.
    -   [x] Atualizar `ERole.java` com papéis (`ROLE_COMPANY_USER`, `ROLE_TECH_USER`, `ROLE_MODERATOR`).
    -   [x] Refatorar a entidade `TicketModel.java`.
-   [x] **Refatoração e Correção da Lógica de Negócio (Backend)**
    -   [x] Implementar padrão Service/Repository para `UserService` e `CompanyService`.
    -   [x] Criar DTOs para requisições e respostas (`UserResponse`, `CompanyRequest`, etc.).
    -   [x] Implementar `CompanyController` e `UserController` com CRUD completo e validações.
    -   [x] Implementar tratamento de exceções global (`GlobalExceptionHandler`).
    -   [x] Refatorar `UserService` para alinhar a validação de `role` com a convenção da API (`COMPANY_USER`, `TECH_USER`, `MODERATOR_USER`).
    -   [x] Corrigir erro de serialização (Lazy Loading) no `TicketController` ao retornar `TicketResponse` em vez da entidade.
    -   [x] Adicionar endpoints no `UserController` para buscar usuários por role e empresa.

## Fase 2: Refatoração do Frontend

-   [x] **Atualização da Interface**
    -   [x] Remover páginas e componentes relacionados a `ClientePf` e `ClientePJ`.
    -   [x] Criar página para **criação de usuários** (`CreateUserPage.tsx`) em substituição ao registro público.
    -   [x] Criar páginas para **CRUD de empresas** (`ViewCompaniesPage.tsx`, `CreateCompanySimplePage.tsx`).
    -   [x] Criar página para **visualização e gerenciamento de usuários** (`ViewUsersPage.tsx`).
    -   [x] Refatorar a página de **criação de chamados** (`CreateTicketPage.tsx`) com lógica de seleção dinâmica.
    -   [x] Atualizar a barra de navegação (`NavigationBar.tsx`) com as novas rotas.
-   [x] **Melhorias de Usabilidade e Validação**
    -   [x] Implementar utilitário de validação e formatação (`validators.ts`) para CPF, CNPJ e telefone.
    -   [x] Aplicar máscaras de input e validações em tempo real nos formulários de criação/edição.
-   [x] **Correção de Rotas e Componentes (Frontend)**
    -   [x] Corrigir inconsistência na rota de fechamento de ticket, alinhando a chamada na `TicketDetailsPage` com a definição em `app.routes.tsx`.
    -   [x] Adicionar rota estática `/tickets/encerrar` no `app.routes.tsx` para o link do menu.
    -   [x] Adicionar o item "Encerrar" ao dropdown "Chamados" no `NavigationBar.tsx`.
    -   [x] Refatorar `CloseTicketPage.tsx` para suportar múltiplos cenários de navegação e corrigir `ReferenceError`.
-   [x] **Implementação de Funcionalidades**
    -   [x] Implementar sistema de troca de temas com `ThemeContext` e `localStorage`.
    -   [x] Adicionar seletor de temas ao menu "Configurações" no `NavigationBar.tsx`.
    -   [x] Implementar funcionalidade para técnicos assumirem chamados (`TicketDetailsPage.tsx`).
-   [x] **Refatoração Geral de Estilização e UX**
    -   [x] Refatorar `DashboardPage` para alinhar com a identidade visual, traduzir textos e corrigir cores e hover dos gráficos.
    -   [x] Realizar varredura completa nas páginas e componentes para padronizar estilos de inputs, botões, cards e modais com as variáveis do tema.
    -   [x] Alinhar `CreateUserPage` com a API do backend (removendo campos `nome` e `cpf`).
    -   [x] Implementar a fonte Poppins globalmente via `index.css` e `tailwind.config.js`.
    -   [x] Corrigir bug de importação na `DashboardPage` que quebrava a renderização.

## Fase 3: Documentação e Testes

-   [x] **Criação e Manutenção de Guias para População de Dados**
    -   [x] Criar o arquivo `postman.md` com guia para popular o banco via API.
    -   [x] Corrigir e formatar o arquivo `postman.md` para alinhamento com a convenção final de `roles`.
    -   [x] Corrigir o arquivo `postman.md` para alinhar os endpoints de tickets com o `TicketController.java` existente.
    -   [x] Corrigir os valores do enum `TicketPriority` no `postman.md` e `SQL.md` para corresponder ao backend.
    -   [x] Criar o arquivo `SQL.md` com scripts para popular o banco diretamente.
-   [ ] **Testes Automatizados (Próximos Passos)**
    -   [ ] Escrever testes de unidade para os services do backend.
    -   [ ] Escrever testes de integração para os controllers do backend.
    -   [ ] Escrever testes de componentes para o frontend.

## Fase 4: Avaliação de Chamados

-   [ ] **Implementar Avaliação de Chamados**
    -   [ ] Backend: Adicionar campo de avaliação (Rating/Comentário) no Ticket.
    -   [ ] Backend: Endpoint para avaliar ticket (apenas pelo criador/cliente).
    -   [ ] Frontend: Componente de avaliação (Estrelas/Nota).
    -   [ ] Frontend: Modal/Tela de avaliação após encerramento.
