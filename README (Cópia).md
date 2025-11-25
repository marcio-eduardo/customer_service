# Trust Assist System (TAS)

### 1. Do que se trata o projeto?

O projeto é um **Sistema de Atendimento ao Cliente (Customer Service)**, nomeado "Trust Assist System". A sua finalidade é gerir o ciclo de vida de tickets de suporte, desde a abertura até à resolução, e também manter um registo de clientes (Pessoa Física e Pessoa Jurídica).

As principais funcionalidades já implementadas ou em desenvolvimento são:

- **Autenticação de Utilizadores:** Controlo de acesso com diferentes níveis de permissão (USER, MODERATOR, ADMIN).
- **Gestão de Clientes:** CRUD (Criar, Ler, Atualizar, Apagar) para clientes do tipo Pessoa Física (PF) e Pessoa Jurídica (PJ).
- **Gestão de Tickets (Chamados):**
  - Abertura de novos tickets associados a um cliente.
  - Encerramento de tickets com notas de resolução.
  - Visualização de tickets abertos e resolvidos.
- **Dashboard:** Uma página inicial que exibe métricas sobre os tickets, como o total de chamados abertos e resolvidos, com gráficos para visualização de dados.

### 2. Tecnologias Utilizadas

O projeto está dividido em duas partes principais: `customer_service_back` (o backend) e `customer_service_front` (o frontend).

#### Tecnologias do Backend

- **Java 21:** A linguagem de programação principal, utilizando uma versão moderna e de longo suporte (LTS).
- **Spring Boot 3:** O framework principal que simplifica a criação de aplicações Java robustas e autónomas. Ele gere a configuração, segurança e a criação de APIs.
- **Spring Data JPA (Hibernate):** Para a persistência de dados. Facilita a comunicação com a base de dados, mapeando objetos Java para tabelas na base de dados (ORM).
- **Spring Security:** Utilizado para implementar a autenticação e autorização, protegendo os endpoints da API.
- **JWT (JSON Web Tokens):** A estratégia de autenticação usada. Após o login, um token é gerado e enviado ao frontend para autenticar os pedidos subsequentes.
- **MySQL:** A base de dados relacional escolhida para armazenar os dados da aplicação (utilizadores, clientes, tickets).
- **Maven:** A ferramenta de gestão de dependências e de construção (build) do projeto backend.
- **Docker:** O backend está configurado para ser "containerizado", o que facilita a sua execução em qualquer ambiente de forma consistente.

#### Tecnologias do Frontend

- **React 18:** A biblioteca JavaScript para construir a interface do utilizador de forma componentizada e reativa.
- **TypeScript:** Uma extensão do JavaScript que adiciona tipagem estática, tornando o código mais seguro e fácil de manter.
- **Vite:** A ferramenta de construção e servidor de desenvolvimento. É conhecida pela sua extrema rapidez.
- **Tailwind CSS:** Um framework de CSS "utility-first" para estilizar a aplicação de forma rápida e consistente diretamente no HTML/JSX.
- **React Router DOM:** Para gerir a navegação e as rotas da aplicação (ex: `/dashboard`, `/clientes/pf`).
- **Axios:** Um cliente HTTP para fazer os pedidos à API do backend.
- **Docker:** Assim como o backend, o frontend também está preparado para ser executado num container Docker.

#### Como Inicializar o Projeto Completo com Docker

A forma mais simples de colocar todo o sistema a funcionar é utilizando o Docker Compose, que orquestra todos os serviços (backend, frontend e base de dados).

**Pré-requisitos:**

- Ter o [Docker](https://www.docker.com/get-started) e o Docker Compose instalados na sua máquina.

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

1. **Credenciais no Código:** RESOLVIDO. As credenciais da base de dados foram movidas para variáveis de ambiente.
2. **Segredo JWT no Código:** RESOLVIDO. O segredo JWT foi movido para uma variável de ambiente.
3. **Dados Fictícios no Dashboard:** A página do Dashboard (`DashboardPage.tsx`) está a usar alguns dados estáticos ("fictícios") para os gráficos de "Chamados por Status" e "Prioridade". O ideal é que estes dados venham da API.

#### Sugestões de Melhoria

1. **Usar Variáveis de Ambiente:** IMPLEMENTADO. As informações sensíveis (credenciais da base de dados, segredo JWT) foram movidas para variáveis de ambiente, configuradas no `docker-compose.yml` e lidas pelo `application.properties`.
2. **Tratamento de Erros no Frontend:** Melhorar o feedback ao utilizador. Por exemplo, na página de login, em vez de apenas registar o erro na consola, mostrar uma mensagem mais clara na própria página (ex: "Utilizador ou senha inválidos"). A biblioteca `sonner` já está a ser usada para isso, o que é ótimo! Pode expandir o seu uso.
3. **Validação de Dados:** Adicionar mais validações, tanto no frontend (ex: verificar se um CPF tem o formato correto antes de enviar) como no backend (usando anotações como `@Size`, `@Pattern` nas DTOs e Models).
4. **Endpoint para o Dashboard:** Criar um novo endpoint no backend (ex: `/api/dashboard/stats`) que retorne um resumo dos dados necessários para os gráficos do frontend, em vez de o frontend ter de fazer múltiplos pedidos e calcular os totais.

### 4. Ideias de Implementação Futura

Com a base que já tem, aqui ficam algumas ideias para expandir as funcionalidades do sistema:

1. **Página de Detalhes do Ticket:** Criar uma rota (ex: `/tickets/:id`) onde se possa ver todo o histórico de um chamado, adicionar comentários, ver quem é o técnico responsável, etc.
2. **Atribuição de Tickets:** Implementar a lógica para que um técnico (Moderator/Admin) possa atribuir um ticket a si mesmo ou a outro técnico.
3. **Sistema de Comentários nos Tickets:** Permitir que clientes e técnicos troquem mensagens dentro de um ticket, criando um histórico de conversação.
4. **Notificações por Email:** Enviar emails automáticos quando um ticket é aberto, atualizado com um novo comentário ou resolvido.
5. **Filtros e Pesquisa Avançada:** Adicionar filtros nas páginas de listagem de tickets e clientes (filtrar por data, status, cliente, etc.).
6. **Recuperação de Senha:** Implementar a funcionalidade de "Esqueceu a senha?".
7. **Perfil do Utilizador:** Uma página onde os utilizadores possam ver e editar as suas informações.

