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

1. **Navegue até à Raiz do Projeto:** Abra o terminal e certifique-se de que está na pasta principal do projeto (a que contém o ficheiro `docker-compose.yml`).

2. **Construa e Suba os Containers:** Execute o seguinte comando:

   ```
   docker-compose up --build
   ```

   - `--build`: Este argumento força o Docker a reconstruir as imagens do backend e do frontend a partir dos `Dockerfiles`. É importante usá-lo sempre que fizer alterações no código.

3. **Aguarde a Inicialização:** O Docker irá descarregar a imagem do MySQL, construir as imagens do seu backend e frontend, e iniciar os três containers. O processo pode demorar alguns minutos na primeira vez. Poderá acompanhar os logs de cada serviço no terminal.

4. **Aceda à Aplicação:**

   - O **frontend** estará acessível no seu navegador em: `http://localhost:5173`
   - O **backend** (API) estará a responder em: `http://localhost:8080`

5. **Para Parar a Aplicação:** Pressione `Ctrl + C` no terminal onde o `docker-compose` está a ser executado. Para parar e remover os containers, pode executar:

   ```
   docker-compose down
   ```

### 3. Possíveis Erros e Melhorias

O projeto está bem encaminhado, mas identifiquei alguns pontos que podem ser melhorados para aumentar a segurança e a funcionalidade.

#### Possíveis Erros / Pontos de Atenção

No momento, não há erros críticos ou pontos de atenção pendentes que requeiram ação imediata. As questões previamente identificadas em relação a credenciais e dados estáticos no dashboard foram resolvidas.

#### Sugestões de Melhoria

1. **Manter o uso de Variáveis de Ambiente:** É crucial continuar a mover informações sensíveis (se houver novas) dos ficheiros de propriedades diretamente no código para variáveis de ambiente. O `docker-compose.yml` já está preparado para isso, garantindo uma maior segurança.
2. **Tratamento de Erros no Frontend:** Melhorar o feedback ao utilizador em caso de falhas na comunicação com o backend ou erros de validação. A biblioteca `sonner` já está em uso e pode ser expandida para exibir mensagens mais claras e amigáveis ao usuário (ex: "Utilizador ou senha inválidos" em vez de apenas registrar na consola).
3. **Validação de Dados Abrangente:** Implementar validações robustas tanto no frontend (antes do envio de dados, com feedback imediato ao usuário) quanto no backend (para garantir a integridade dos dados na API, usando anotações como `@Size`, `@Pattern`, etc., nas DTOs e Models). Isso reduz erros e melhora a segurança.

### 4. Ideias de Implementação Futura

Com a base que já tem, aqui ficam algumas ideias para expandir as funcionalidades do sistema:

1. **Página de Detalhes do Ticket:** Criar uma rota (ex: `/tickets/:id`) onde se possa ver todo o histórico de um chamado, adicionar comentários, ver quem é o técnico responsável, etc.
2. **Atribuição de Tickets:** Implementar a lógica para que um técnico (Moderator/Admin) possa atribuir um ticket a si mesmo ou a outro técnico.
3. **Sistema de Comentários nos Tickets:** Permitir que clientes e técnicos troquem mensagens dentro de um ticket, criando um histórico de conversação.
4. **Notificações por Email:** Enviar emails automáticos quando um ticket é aberto, atualizado com um novo comentário ou resolvido.
5. **Filtros e Pesquisa Avançada:** Adicionar filtros nas páginas de listagem de tickets e clientes (filtrar por data, status, cliente, etc.).
6. **Recuperação de Senha:** Implementar a funcionalidade de "Esqueceu a senha?".
7. **Perfil do Utilizador:** Uma página onde os utilizadores possam ver e editar as suas informações.

## Log de Desenvolvimento

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
