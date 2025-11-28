# Documentação dos Commits - Refatoração do Sistema

**Autor:** Yuri  
**Data:** 27 de novembro de 2025  
**Branch:** refatctoring/refatoracao-da-modelagem-endpoints-e-visualizacao-no-frontend

---

## Resumo Executivo

Esta documentação descreve 7 commits realizados como parte de uma refatoração completa do sistema de atendimento ao cliente. O trabalho incluiu a implementação de novas funcionalidades de gerenciamento de usuários (Admin e Moderator), refatoração de modelos de dados, criação de DTOs com validação, implementação de tratamento global de exceções, e melhorias significativas na interface do usuário com localização para português.

---

## 1. Add admin and moderator user models; refactor company and user models


### Descrição
Primeiro commit da refatoração, estabelecendo a base de dados atualizada. Adicionou novos modelos para usuários administrativos (Admin e Moderator), removeu o modelo Technical obsoleto, e refatorou os modelos existentes de Company, CompanyUser, User e Ticket.

### Arquivos Modificados
- **Adicionados:**
  - `AdminUser.java` (58 linhas) - Modelo para usuários administradores
  - `ModeratorUser.java` (55 linhas) - Modelo para usuários moderadores

- **Modificados:**
  - `Company.java` (8 linhas alteradas)
  - `CompanyUser.java` (32 linhas refatoradas)
  - `User.java` (19 linhas alteradas)
  - `TicketModel.java` (24 linhas modificadas)
  - `TicketPriority.java` (8 linhas ajustadas)

- **Removidos:**
  - `Technical.java` (34 linhas deletadas)

### Impacto
- Estabeleceu hierarquia de usuários do sistema (User, Admin, Moderator)
- Removeu conceito obsoleto de "Technical"
- Preparou base para controle de acesso baseado em roles

---

## 2. Implement Admin and Moderator user services; refactor Company service

### Descrição
Implementou a camada de serviços para os novos tipos de usuários (Admin e Moderator), refatorou serviços existentes de Company e CompanyUser, removeu TechnicalService obsoleto, e expandiu funcionalidades do TicketService.

### Arquivos Modificados
- **Adicionados:**
  - `AdminUserService.java` (75 linhas) - Lógica de negócio para administradores
  - `ModeratorUserService.java` (70 linhas) - Lógica de negócio para moderadores

- **Modificados:**
  - `CompanyService.java` (19 linhas alteradas)
  - `CompanyUserService.java` (39 linhas refatoradas)
  - `TicketService.java` (70 linhas expandidas)

- **Removidos:**
  - `TechnicalService.java` (57 linhas deletadas)

### Impacto
- Implementou CRUD completo para Admin e Moderator
- Melhorou tratamento de erros nos serviços de Company
- Expandiu funcionalidades de gerenciamento de tickets
- Removeu código legado relacionado a Technical

---

## 3. Add global exception handling and enhance ticket security configuration

### Descrição
Adicionou tratamento global de exceções usando @ControllerAdvice, refatorou configurações de segurança web, e melhorou o entry point de autenticação JWT.

### Arquivos Modificados
- **Adicionados:**
  - `GlobalExceptionHandler.java` (131 linhas) - Tratamento centralizado de exceções

- **Modificados:**
  - `WebSecurityConfig.java` (30 linhas alteradas) - Configurações de segurança atualizadas
  - `AuthEntryPointJwt.java` (6 linhas modificadas)

### Funcionalidades do GlobalExceptionHandler
- Tratamento de `ResourceNotFoundException`
- Tratamento de `MethodArgumentNotValidException` (validação de DTOs)
- Tratamento de `BadCredentialsException`
- Tratamento de `AccessDeniedException`
- Handler genérico para exceções não previstas

### Impacto
- Padronizou respostas de erro da API
- Melhorou experiência do desenvolvedor com mensagens claras
- Aumentou segurança com tratamento adequado de exceções de autenticação
- Facilitou debugging com stack traces estruturados

---

## 4. Add repositories for Admin and Moderator users; refactor CompanyUser repository

### Descrição
Implementou repositories JPA para novos modelos de usuários, refatorou CompanyUserRepository, removeu TechnicalRepository obsoleto, e expandiu funcionalidades do TicketRepository e UserRepository.

### Arquivos Modificados
- **Adicionados:**
  - `AdminUserRepository.java` (33 linhas) - Queries personalizadas para Admin
  - `ModeratorUserRepository.java` (27 linhas) - Queries personalizadas para Moderator

- **Modificados:**
  - `CompanyUserRepository.java` (14 linhas expandidas)
  - `TicketRepository.java` (16 linhas adicionadas)
  - `UserRepository.java` (4 linhas alteradas)

- **Removidos:**
  - `TechnicalRepository.java` (16 linhas deletadas)

### Funcionalidades Adicionadas
- Busca de Admin/Moderator por email e CPF
- Verificação de existência por email
- Queries customizadas para relacionamentos Company-User
- Filtros adicionais para tickets

### Impacto
- Habilitou acesso eficiente aos dados de Admin e Moderator
- Melhorou performance com queries otimizadas
- Removeu código não utilizado

---

## 5. Add DTOs for user management and ticket handling; implement validation constraints

### Descrição
Criou DTOs (Data Transfer Objects) para todas as entidades do sistema, implementou validações usando Bean Validation (Jakarta Validation), e refatorou DTOs de autenticação existentes.

### Arquivos Modificados
- **Adicionados:**
  - `AdminUserCreateDTO.java` (17 linhas)
  - `AdminUserUpdateDTO.java` (13 linhas)
  - `CompanyUserCreateDTO.java` (13 linhas)
  - `CompanyUserUpdateDTO.java` (11 linhas)
  - `ModeratorUserCreateDTO.java` (23 linhas)
  - `ModeratorUserUpdateDTO.java` (19 linhas)
  - `TicketAssignDTO.java` (14 linhas)
  - `TicketCloseDTO.java` (20 linhas)
  - `TicketCreateDTO.java` (25 linhas)
  - `TicketUpdateDTO.java` (17 linhas)
  - `UserRegistrationDTO.java` (37 linhas)
  - `UserUpdateDTO.java` (24 linhas)
  - `CompanyResponseDTO.java` (26 linhas)

- **Modificados:**
  - `JwtResponse.java` (43 linhas expandidas)
  - `LoginRequest.java` (26 linhas refatoradas)
  - `SignUpRequest.java` (65 linhas alteradas)

### Validações Implementadas
- `@NotBlank` para campos obrigatórios
- `@Email` para validação de e-mails
- `@Size` para limites de caracteres
- `@Pattern` para CPF, telefone, etc.
- Validações customizadas em DTOs de atualização

### Impacto
- Separou camada de apresentação da camada de domínio
- Implementou validação automática de dados de entrada
- Preveniu StackOverflowError ao serializar entidades JPA
- Melhorou segurança ao expor apenas dados necessários
- Facilitou versionamento da API

---

## 6. Implement Admin and Moderator user controllers; refactor ticket handling

### Descrição
Implementou controllers REST para Admin e Moderator, refatorou controllers existentes de Auth, Company, CompanyUser e Ticket, removeu TechnicalController obsoleto, e adicionou endpoints específicos por role.

### Arquivos Modificados
- **Adicionados:**
  - `AdminUserController.java` (117 linhas) - CRUD completo para Admin
  - `ModeratorUserController.java` (115 linhas) - CRUD completo para Moderator

- **Modificados:**
  - `AuthController.java` (108 linhas modificadas)
  - `CompanyController.java` (alterações não especificadas)
  - `CompanyUserController.java` (alterações não especificadas)
  - `TicketController.java` (138 linhas expandidas)

- **Removidos:**
  - `TechnicalController.java` (73 linhas deletadas)

### Endpoints Adicionados
**AdminUserController:**
- `POST /api/admin/users` - Criar admin
- `GET /api/admin/users` - Listar admins
- `GET /api/admin/users/{id}` - Buscar admin por ID
- `PUT /api/admin/users/{id}` - Atualizar admin
- `DELETE /api/admin/users/{id}` - Deletar admin

**ModeratorUserController:**
- `POST /api/moderator/users` - Criar moderador
- `GET /api/moderator/users` - Listar moderadores
- `GET /api/moderator/users/{id}` - Buscar moderador por ID
- `PUT /api/moderator/users/{id}` - Atualizar moderador
- `DELETE /api/moderator/users/{id}` - Deletar moderador

### Impacto
- Completou API REST para gerenciamento de usuários
- Implementou endpoints com segurança baseada em roles
- Melhorou organização de endpoints de autenticação
- Expandiu funcionalidades de gerenciamento de tickets
- Removeu endpoints obsoletos

---

## 7. Update company and user management pages with improved loading states

### Descrição
Refatorou páginas do frontend para componentes controlados, implementou estados de loading e tratamento de erros, localizou interface para português, e aplicou o TAS Design System consistentemente.

### Arquivos Modificados (11 arquivos, 758 inserções, 313 deleções)
- `SelectCompanyForUserPage.tsx` - Refatorado com estados de loading
- `LoginPage.tsx` - Melhorias de UX e tratamento de erros
- `SignUpPage.tsx` - Validações e máscaras de input
- `CreateTicketPage.tsx` - Filtros por role (Admin/Moderator/User)
- `ViewOpenTicketsPage.tsx` - Visualização baseada em permissões
- `ViewResolvedTicketsPage.tsx` - Interface localizada
- `ViewCompaniesPage.tsx` - Tradução completa para português
- `ViewCompanyUsersPage.tsx` - Correção de estrutura de dados + localização
- Outros componentes de layout e navegação

### Melhorias Implementadas
**UX/UI:**
- Estados de loading durante chamadas API
- Mensagens de erro contextualizadas
- Botões de cancelar para melhor navegação
- Aplicação consistente do TAS Design System

**Localização:**
- Tradução de todos os labels para português
- Formatação brasileira (CPF, CNPJ, telefone)
- Máscaras de input para campos brasileiros

**Arquitetura:**
- Componentes controlados com useState
- Validação de formulários
- Tratamento adequado de estruturas aninhadas (companyUser.user.name)
- Filtragem de dados baseada em role do usuário

### Impacto
- Melhorou significativamente a experiência do usuário
- Interface completamente em português
- Código mais manutenível com componentes controlados
- Redução de bugs relacionados a dados não controlados

---

## Métricas Gerais da Refatoração

### Resumo de Alterações
- **Commits:** 7
- **Arquivos Criados:** ~30
- **Arquivos Modificados:** ~25
- **Arquivos Deletados:** ~5
- **Linhas Adicionadas:** ~1500+
- **Linhas Removidas:** ~500+

### Principais Conquistas
1. ✅ Implementação completa de sistema de roles (User, Admin, Moderator)
2. ✅ Arquitetura DTO com validações robustas
3. ✅ Tratamento global de exceções
4. ✅ API REST completa e documentada
5. ✅ Frontend localizado para português
6. ✅ TAS Design System aplicado consistentemente
7. ✅ Remoção de código legado (Technical)

## Conclusão

Esta refatoração representa uma modernização completa do sistema, com foco em:
- **Segurança:** Roles bem definidos, JWT, tratamento de exceções
- **Qualidade:** DTOs, validações, código limpo
- **UX:** Interface localizada, estados de loading, design consistente
- **Manutenibilidade:** Arquitetura clara, código desacoplado, remoção de legacy

O sistema está agora preparado para escalar e receber novas funcionalidades com uma base sólida e bem estruturada.
