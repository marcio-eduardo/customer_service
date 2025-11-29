# Guia Completo Postman: Teste e População de Dados (Trust Assist System)

Este documento serve como um guia detalhado para testar as funcionalidades da API do **Trust Assist System (TAS)** e para popular o banco de dados com um conjunto robusto de dados de exemplo usando o Postman.

**URL Base da API:** `http://localhost:8080`

**Premissa:** Antes de começar, garanta que a aplicação esteja rodando e que o usuário `admin.user` exista no banco de dados com `ROLE_ADMIN`.

---

## Parte 1: Autenticação Inicial

Para realizar operações de criação (empresas, usuários), você precisa se autenticar com uma conta que tenha privilégios de administrador.

- **Usuário Admin Padrão:**
  - **Username:** `admin.user`
  - **Password:** `password123`

### Requisição de Login

- **Método:** `POST`
- **Endpoint:** `/api/auth/signin`
- **Body (raw, JSON):**
  ```json
  {
      "username": "admin.user",
      "password": "password123"
  }
  ```

**Ação:** Após executar esta requisição, o Postman irá armazenar automaticamente o cookie de sessão (`meuapp-jwt`), que será enviado nas requisições seguintes.

---

## Parte 2: CRUD de Empresas (`/api/companies`)

Vamos criar 5 empresas e depois testar as operações de leitura, atualização e exclusão.

### 2.1. Criar Empresas (CREATE)

Execute as 5 requisições `POST` a seguir. **Anote os IDs** retornados no corpo da resposta para usar mais tarde.

```json
// Requisição 1: POST /api/companies
{
    "name": "Quantum Soluções Digitais",
    "cnpj": "11111111000111",
    "address": "Rua da Inovação, 100, São Paulo, SP",
    "phone": "11911111111",
    "email": "contato@quantumsolucoes.com"
}
// Requisição 2: POST /api/companies
{
    "name": "Nexus TI Integrada",
    "cnpj": "22222222000122",
    "address": "Avenida Central, 200, Belo Horizonte, MG",
    "phone": "31922222222",
    "email": "suporte@nexusti.com"
}
// Requisição 3: POST /api/companies
{
    "name": "Virtua Tech Labs",
    "cnpj": "33333333000133",
    "address": "Praça da Conectividade, 300, Curitiba, PR",
    "phone": "41933333333",
    "email": "comercial@virtuatech.com"
}
// Requisição 4: POST /api/companies
{
    "name": "Alpha Hardware Co.",
    "cnpj": "44444444000144",
    "address": "Estrada do Silício, 400, Campinas, SP",
    "phone": "19944444444",
    "email": "vendas@alphahardware.com"
}
// Requisição 5: POST /api/companies
{
    "name": "CyberSec Consultoria",
    "cnpj": "55555555000155",
    "address": "Alameda dos Dados, 500, Brasília, DF",
    "phone": "61955555555",
    "email": "contato@cybersec.com"
}
```

### 2.2. Listar Todas as Empresas (READ)

- **Método:** `GET`
- **Endpoint:** `/api/companies`
- **Verificação:** Confirme se as 5 empresas criadas aparecem na lista.

### 2.3. Buscar Empresa por ID (READ)

- **Método:** `GET`
- **Endpoint:** `/api/companies/1` (substitua `1` por um ID válido)
- **Verificação:** Confirme se os dados da "Quantum Soluções Digitais" são retornados.

### 2.4. Atualizar Empresa (UPDATE)

- **Método:** `PUT`
- **Endpoint:** `/api/companies/1`
- **Body (raw, JSON):**
  ```json
  {
      "name": "Quantum Soluções Globais",
      "address": "Rua da Inovação Mundial, 101, São Paulo, SP"
  }
  ```
- **Verificação:** O nome e o endereço da empresa com ID 1 devem ser atualizados.

### 2.5. Deletar Empresa (DELETE)

- **Método:** `DELETE`
- **Endpoint:** `/api/companies/5`
- **Verificação:** A empresa com ID 5 ("CyberSec Consultoria") será excluída. Tente listá-la novamente para confirmar. **Nota:** A exclusão falhará se houver usuários vinculados a esta empresa.

---

## Parte 3: CRUD de Usuários (`/api/users`) - CORRIGIDO

Criaremos 2 Moderadores, 3 Técnicos e 10 Usuários de Empresa. **Anote os IDs** de todos para usar na criação de tickets. Os payloads abaixo estão alinhados com a convenção da API.

### 3.1. Criar Usuários (CREATE)

Execute as 15 requisições `POST /api/users` a seguir.

**Moderadores:**
```json
// POST /api/users
{
    "username": "moderador.ana",
    "email": "ana.m@tas.com",
    "password": "123456",
    "role": "MODERATOR_USER"
}
{
    "username": "moderador.rafael",
    "email": "rafael.m@tas.com",
    "password": "123456",
    "role": "MODERATOR_USER"
}
```

**Técnicos (`TECH_USER`):**
```json
// POST /api/users
{
    "username": "tech.carlos",
    "email": "carlos.t@tas.com",
    "password": "123456",
    "role": "TECH_USER"
}
{
    "username": "tech.beatriz",
    "email": "beatriz.t@tas.com",
    "password": "123456",
    "role": "TECH_USER"
}
{
    "username": "tech.lucas",
    "email": "lucas.t@tas.com",
    "password": "123456",
    "role": "TECH_USER"
}
```

**Usuários de Empresa (`COMPANY_USER`):**
```json
// POST /api/users (Usuários da Quantum - companyId: 1)
{
    "username": "joao.silva",
    "email": "joao.silva@quantumsolucoes.com",
    "password": "123456",
    "role": "COMPANY_USER",
    "companyId": 1
}
{
    "username": "maria.santos",
    "email": "maria.santos@quantumsolucoes.com",
    "password": "123456",
    "role": "COMPANY_USER",
    "companyId": 1
}
// POST /api/users (Usuários da Nexus - companyId: 2)
{
    "username": "fernando.costa",
    "email": "fernando.costa@nexusti.com",
    "password": "123456",
    "role": "COMPANY_USER",
    "companyId": 2
}
{
    "username": "gabriela.lima",
    "email": "gabriela.lima@nexusti.com",
    "password": "123456",
    "role": "COMPANY_USER",
    "companyId": 2
}
// POST /api/users (Usuários da Virtua - companyId: 3)
{
    "username": "rodrigo.alves",
    "email": "rodrigo.alves@virtuatech.com",
    "password": "123456",
    "role": "COMPANY_USER",
    "companyId": 3
}
{
    "username": "camila.souza",
    "email": "camila.souza@virtuatech.com",
    "password": "123456",
    "role": "COMPANY_USER",
    "companyId": 3
}
// POST /api/users (Usuários da Alpha - companyId: 4)
{
    "username": "bruno.oliveira",
    "email": "bruno.oliveira@alphahardware.com",
    "password": "123456",
    "role": "COMPANY_USER",
    "companyId": 4
}
{
    "username": "larissa.pereira",
    "email": "larissa.pereira@alphahardware.com",
    "password": "123456",
    "role": "COMPANY_USER",
    "companyId": 4
}
// POST /api/users (Adicionais da Quantum - companyId: 1)
{
    "username": "andre.martins",
    "email": "andre.martins@quantumsolucoes.com",
    "password": "123456",
    "role": "COMPANY_USER",
    "companyId": 1
}
{
    "username": "juliana.ribeiro",
    "email": "juliana.ribeiro@quantumsolucoes.com",
    "password": "123456",
    "role": "COMPANY_USER",
    "companyId": 1
}
```

### 3.2. Listar e Gerenciar Usuários (READ, UPDATE, DELETE)

- **Listar:** `GET /api/users`
- **Buscar por ID:** `GET /api/users/{id}`
- **Atualizar:** `PUT /api/users/{id}` (Ex: alterar o username)
- **Deletar:** `DELETE /api/users/{id}`

---

## Parte 4: Ciclo de Vida dos Tickets (`/api/tickets`)

Criaremos 20 tickets. **Lembre-se de usar os IDs corretos** para `companyId`, `requesterId` (usuário que abre o chamado) e `assignedToId` (técnico responsável).

- **Regra 1:** Chamados abertos por `CompanyUser` não devem ter `assignedToId` na criação.
- **Regra 2:** 10 chamados não serão atribuídos, 10 serão atribuídos a técnicos.

### 4.1. Criar Tickets (CREATE)

Execute as 20 requisições `POST /api/tickets/open`.

**Tickets NÃO ATRIBUÍDOS (10):**
```json
// POST /api/tickets/open
{
    "title": "Software de Contabilidade não abre",
    "description": "O aplicativo 'ContaCerta' fecha imediatamente após a inicialização.",
    "priority": "ALTA",
    "companyId": 1,
    "requesterId": 8
}
{
    "title": "Monitor piscando constantemente",
    "description": "O monitor do meu computador fica piscando em intervalos aleatórios. Modelo Dell P2419H.",
    "priority": "MEDIA",
    "companyId": 2,
    "requesterId": 10
}
{
    "title": "Não consigo acessar a VPN",
    "description": "Ao tentar conectar na VPN da empresa, recebo o erro 'Credenciais inválidas', mas a senha está correta.",
    "priority": "ALTA",
    "companyId": 3,
    "requesterId": 12
}
{
    "title": "Impressora não imprime colorido",
    "description": "Todos os documentos saem em preto e branco, mesmo com cartuchos coloridos cheios.",
    "priority": "BAIXA",
    "companyId": 4,
    "requesterId": 14
}
{
    "title": "Sistema ERP com lentidão extrema",
    "description": "A navegação entre os módulos do ERP está levando mais de 1 minuto por clique.",
    "priority": "URGENTE",
    "companyId": 1,
    "requesterId": 9
}
{
    "title": "Mouse sem fio desconectando",
    "description": "O mouse para de funcionar a cada poucos minutos e preciso remover e reconectar o dongle USB.",
    "priority": "MEDIA",
    "companyId": 2,
    "requesterId": 11
}
{
    "title": "E-mail não sincroniza no Outlook",
    "description": "Minha caixa de entrada não atualiza desde ontem. Erro 0x800CCC0E.",
    "priority": "ALTA",
    "companyId": 3,
    "requesterId": 13
}
{
    "title": "Webcam não é detectada em reuniões",
    "description": "A webcam integrada do meu notebook (Lenovo T480) não é reconhecida pelo Teams ou Zoom.",
    "priority": "MEDIA",
    "companyId": 4,
    "requesterId": 15
}
{
    "title": "Erro ao salvar planilhas grandes",
    "description": "O Excel trava e fecha ao tentar salvar uma planilha com mais de 50.000 linhas.",
    "priority": "ALTA",
    "companyId": 1,
    "requesterId": 16
}
{
    "title": "Teclado com teclas falhando",
    "description": "As teclas 'E', 'R' e 'T' do meu teclado externo não funcionam.",
    "priority": "BAIXA",
    "companyId": 2,
    "requesterId": 10
}
```

**Tickets ATRIBUÍDOS (10):**
```json
// POST /api/tickets/open
{
    "title": "Servidor de arquivos inacessível",
    "description": "A pasta compartilhada '\\\\SRV-FILES01' não pode ser acessada de nenhuma estação.",
    "priority": "URGENTE",
    "companyId": 1,
    "requesterId": 8,
    "assignedToId": 4
}
{
    "title": "Falha no backup diário do banco de dados",
    "description": "O job de backup do SQL Server falhou com erro de 'permissão negada no disco'.",
    "priority": "ALTA",
    "companyId": 2,
    "requesterId": 10,
    "assignedToId": 5
}
{
    "title": "Ataque de phishing detectado",
    "description": "Recebemos múltiplos e-mails suspeitos solicitando senhas. Possível ataque em andamento.",
    "priority": "URGENTE",
    "companyId": 3,
    "requesterId": 12,
    "assignedToId": 6
}
{
    "title": "Upgrade de memória RAM em desktop",
    "description": "Solicito upgrade de 8GB para 16GB de RAM no desktop do setor de design. Patrimônio: DT-FIN-03.",
    "priority": "BAIXA",
    "companyId": 4,
    "requesterId": 14,
    "assignedToId": 4
}
{
    "title": "Firewall bloqueando acesso a sistema parceiro",
    "description": "Não conseguimos acessar o portal do nosso fornecedor (portal.fornecedor.com). Acesso negado pelo firewall.",
    "priority": "ALTA",
    "companyId": 1,
    "requesterId": 9,
    "assignedToId": 5
}
{
    "title": "Instalação do Adobe Photoshop",
    "description": "Necessito da instalação do Adobe Photoshop no meu novo computador.",
    "priority": "MEDIA",
    "companyId": 2,
    "requesterId": 11,
    "assignedToId": 6
}
{
    "title": "Problema com certificado digital",
    "description": "O certificado digital para assinatura de notas fiscais expirou e não consigo renovar.",
    "priority": "ALTA",
    "companyId": 3,
    "requesterId": 13,
    "assignedToId": 4
}
{
    "title": "Computador não liga (sem sinal)",
    "description": "O computador do gerente de contas não dá nenhum sinal de vida ao apertar o botão de ligar.",
    "priority": "URGENTE",
    "companyId": 4,
    "requesterId": 15,
    "assignedToId": 5
}
{
    "title": "Rede Wi-Fi instável na sala de reuniões",
    "description": "O sinal da rede sem fio 'Corp-WiFi' cai constantemente na sala de reuniões 3.",
    "priority": "MEDIA",
    "companyId": 1,
    "requesterId": 16,
    "assignedToId": 6
}
{
    "title": "Erro de tela azul (BSOD)",
    "description": "Meu computador está reiniciando sozinho e exibindo uma tela azul com o código 'IRQL_NOT_LESS_OR_EQUAL'.",
    "priority": "ALTA",
    "companyId": 2,
    "requesterId": 10,
    "assignedToId": 4
}
```

### 4.2. Gerenciar Tickets (READ, UPDATE, DELETE)

- **Listar Abertos:** `GET /api/tickets/status/open`
- **Listar Resolvidos:** `GET /api/tickets/status/resolved`
- **Buscar por ID:** `GET /api/tickets/{id}`
- **Fechar um Ticket:**
  - **Método:** `POST`
  - **Endpoint:** `/api/tickets/{id}/close`
  - **Body (raw, JSON):**
    ```json
    {
        "ticketId": 20, // ID do ticket a ser fechado (OBS: O ID também deve ser passado na URL como {id})
        "resolutionNotes": "O problema de tela azul foi causado por um driver de vídeo desatualizado. O driver foi atualizado para a versão mais recente e o sistema foi estabilizado."
    }
    ```
- **Verificação:** Após fechar o ticket 20, ele deve aparecer na lista de resolvidos e não mais na de abertos.

---
**Observação Importante sobre o campo CPF:**

Foi identificado que o `DevLog.md` mencionava melhorias no frontend para lidar com o campo CPF (`Implementada máscara de CPF com formatação em tempo real`, `Validação de CPF antes do submit`, `Envio de CPF sem formatação para backend`). No entanto, após uma revisão aprofundada, **o DTO de criação de usuário (`CreateUserRequest.java`) e a entidade `User.java` do backend NÃO possuem um campo para CPF**.

Isso significa que, embora o frontend possa estar preparado para coletar e validar o CPF, o backend atualmente não o aceita nem o persiste para o usuário. As requisições Postman foram corrigidas para **não incluir** o CPF, pois a API retornaria um erro. 

Se a intenção é que o CPF seja persistido no backend, uma modificação no código do backend (entidade, DTOs e lógica de serviço) seria necessária.

Este guia fornece um fluxo de trabalho completo para popular e testar a API. Adapte os IDs e dados conforme necessário durante a execução.