# Tarefas

## Refatoração do Modelo de Dados

-   [x] **Planejamento e Documentação**
    -   [x] Analisar o modelo de dados antigo.
    -   [x] Criar o arquivo `BD.md` com o novo modelo de dados.
    -   [x] Apresentar o plano de refatoração para o usuário.
-   [x] **Remoção do Modelo Antigo**
    -   [x] Excluir `ClientePf.java` e `ClientePfRepository.java`.
    -   [x] Excluir `ClientePJ.java` e `ClientePJRepository.java`.
    -   [x] Excluir `Technical.java` e `TechnicalRepository.java`.
    -   [x] Limpar referências aos modelos antigos nos serviços e controladores.
-   [x] **Implementação do Novo Modelo**
    -   [x] Criar a entidade `Company.java` e seu repositório.
    -   [x] Refatorar a entidade `User.java` para incluir a associação com `Company`.
    -   [x] Atualizar `ERole.java` com os novos papéis: `ROLE_COMPANY_USER`, `ROLE_TECH_USER`, `ROLE_MODERATOR`.
    -   [x] Atualizar `RoleInitializer.java` para popular os novos papéis.
    -   [x] Refatorar a entidade `TicketModel.java` para usar as novas associações (`User`, `Company`).
-   [x] **Refatoração da Lógica de Negócio**
    -   [x] Atualizar `AuthService` e `AuthController` para o novo fluxo de registro e login.
    -   [x] Atualizar `TicketService` e `TicketController` para a nova lógica de criação e gerenciamento de chamados.
    -   [x] Criar `CompanyService` and `CompanyController` para gerenciar empresas.
-   [ ] **Frontend**
    -   [x] Analisar o front-end e planejar as alterações necessárias para refletir o novo modelo de dados.
    -   [x] Refatorar o serviço de autenticação no front-end (`AuthContext.tsx`).
    -   [ ] Refatorar a página de registro (`SignUpPage.tsx`) para incluir o campo de seleção de empresa.
    -   [ ] Refatorar a página de criação de chamados (`CreateTicketPage.tsx`).
    -   [x] Remover as páginas e componentes relacionados a `ClientePf` e `ClientePJ`.
    -   [ ] Adicionar uma nova página para gerenciamento de empresas (CRUD de `Company`).