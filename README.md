# Trust Assist System (TAS)

### 1. Do que se trata o projeto?

O projeto é um **Sistema de Atendimento ao Cliente (Customer Service)**, nomeado "Trust Assist System". A sua finalidade é gerir o ciclo de vida de tickets de suporte, desde a abertura até à resolução, e também manter um registo de clientes (Pessoa Física e Pessoa Jurídica).

As principais funcionalidades já implementadas ou em desenvolvimento são:

- **Autenticação de Utilizadores:** Controlo de acesso com diferentes níveis de permissão (USER, MODERATOR, ADMIN).
- **Cadastro de Clientes:** O sistema agora suporta o autocadastro de clientes (Pessoa Física), vinculando a conta de usuário a um perfil de cliente.
- **Gestão de Clientes:** CRUD (Criar, Ler, Atualizar, Apagar) para clientes do tipo Pessoa Física (PF) e Pessoa Jurídica (PJ).
- **Gestão de Tickets (Chamados):**
  - Abertura de novos tickets associados a um cliente, com fluxos diferentes para clientes e administradores.
  - Encerramento de tickets com notas de resolução.
  - Visualização de tickets abertos e resolvidos.
- **Dashboard:** Uma página inicial que exibe métricas em tempo real sobre os tickets, como total de chamados abertos, resolvidos, em andamento e por prioridade.

### 2. Tecnologias Utilizadas

O projeto está dividido em duas partes principais: `customer_service_back` (o backend) e `customer_service_front` (o frontend).

#### Tecnologias do Backend

- **Java 21:** A linguagem de programação principal.
- **Spring Boot 3:** Framework para a criação de APIs.
- **Spring Data JPA (Hibernate):** Para a persistência de dados (ORM).
- **Spring Security:** Para autenticação e autorização.
- **JWT (JSON Web Tokens):** Estratégia de autenticação stateless.
- **MySQL:** Base de dados relacional.
- **Maven:** Gestão de dependências e build.
- **Docker:** O backend está "containerizado" para facilitar a execução.

#### Tecnologias do Frontend

- **React 18:** Biblioteca para a construção da interface.
- **TypeScript:** Superset do JavaScript com tipagem estática.
- **Vite:** Ferramenta de build e servidor de desenvolvimento.
- **Tailwind CSS:** Framework de CSS "utility-first" para estilização.
- **React Router DOM:** Para gestão de rotas.
- **Axios:** Cliente HTTP para comunicação com a API.
- **Docker:** O frontend também está preparado para ser executado num container.

#### Como Inicializar o Projeto Completo com Docker

A forma mais simples de colocar todo o sistema a funcionar é utilizando o Docker Compose.

**Pré-requisitos:**
- Ter o [Docker](https://www.docker.com/get-started) e o Docker Compose instalados.

**Passo a Passo:**
1.  Na raiz do projeto, execute:
    ```bash
    docker-compose up --build
    ```
2.  Aguarde a inicialização dos containers.
3.  Aceda à Aplicação:
    -   **Frontend:** `http://localhost:5173`
    -   **Backend (API):** `http://localhost:8080`
4.  Para parar a aplicação, pressione `Ctrl + C` no terminal e depois execute `docker-compose down`.

### 3. Novas Funcionalidades e Melhorias Recentes

- **Dashboard com Dados Reais:** O dashboard foi completamente refeito para consumir dados em tempo real do backend, eliminando os dados fictícios. Agora, os gráficos e cartões refletem o estado atual dos tickets no sistema.
- **Implementação da Prioridade de Tickets:** Foi adicionada a lógica de "prioridade" aos chamados no backend.
- **Fluxo de Cadastro de Cliente:** O processo de cadastro foi corrigido e agora, ao criar uma conta de usuário, um perfil de cliente (Pessoa Física) é automaticamente criado e vinculado.
- **Fluxo de Abertura de Chamados:** A funcionalidade foi implementada e refinada:
  - **Clientes Finais:** Abrem chamados para si mesmos de forma automática.
  - **Administradores/Moderadores:** Utilizam uma interface aprimorada com um filtro de dois passos para selecionar primeiro o tipo de cliente (PF/PJ) e depois o cliente específico.
- **Refatoração e Qualidade de Código (Frontend):** As principais páginas (`Dashboard`, `Login`, `SignUp`, `CreateTicket`) foram refatoradas para seguir as melhores práticas de React e Tailwind CSS, resultando em um código mais limpo, organizado e profissional.

### 4. Pontos de Atenção Atuais

1.  **Dados Fictícios no Dashboard:** RESOLVIDO. Os dados agora vêm da API. (Nota: O status "Pendente" ainda é um valor estático no gráfico e pode ser implementado no futuro).
2.  **Endpoint para o Dashboard:** IMPLEMENTADO. O endpoint `/api/dashboard/stats` foi criado e está em uso.
3.  **Validação de Dados:** Adicionar mais validações, tanto no frontend (ex: verificar se um CPF tem o formato correto antes de enviar) como no backend (usando anotações como `@Size`, `@Pattern`).
4.  **Cadastro de Cliente PJ:** O fluxo de autocadastro atualmente suporta apenas clientes PF. A lógica para cadastro de clientes PJ precisa ser implementada.

### 5. Ideias de Implementação Futura

Com a base que já tem, aqui ficam algumas ideias para expandir as funcionalidades do sistema:

1.  **Página de Detalhes do Ticket:** Criar uma rota (ex: `/tickets/:id`) onde se possa ver todo o histórico de um chamado, adicionar comentários e, principalmente, **definir ou alterar a prioridade** de um chamado (função para admins/mods).
2.  **Atribuição de Tickets:** Implementar a lógica para que um técnico (Moderator/Admin) possa atribuir um ticket a si mesmo ou a outro técnico.
3.  **Sistema de Comentários nos Tickets:** Permitir que clientes e técnicos troquem mensagens dentro de um ticket.
4.  **Notificações por Email:** Enviar emails automáticos quando um ticket é aberto, atualizado ou resolvido.
5.  **Filtros e Pesquisa Avançada:** Adicionar filtros nas páginas de listagem de tickets e clientes.
6.  **Recuperação de Senha:** Implementar a funcionalidade de "Esqueceu a senha?".
7.  **Perfil do Utilizador:** Uma página onde os utilizadores possam ver e editar as suas informações.