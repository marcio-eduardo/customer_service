# Guia de Scripts SQL para População do Banco

Este arquivo contém os scripts SQL necessários para popular o banco de dados do **Trust Assist System (TAS)** com o mesmo conjunto de dados detalhado no arquivo `postman.md`.

Este script pode ser executado diretamente em um cliente MySQL conectado ao banco de dados `serviceDB` ou pode ser usado como base para o arquivo `data.sql` do Spring Boot.

**Nota:** A senha para todos os usuários é `password123`. O hash a seguir corresponde a essa senha e foi gerado usando BCrypt.
`$2a$10$3g5vO0a.lY6u3A.O0.B87uK.N.3O2.l5u0v.E6.uB2.eB5.O0.a.O`

---

## Script SQL Completo

```sql
-- ##################################################################
-- # 1. INSERÇÃO DE PAPÉIS (ROLES)
-- ##################################################################
-- Garante que os papéis fundamentais existam no sistema.
INSERT IGNORE INTO roles(id, name) VALUES(1, 'ROLE_COMPANY_USER');
INSERT IGNORE INTO roles(id, name) VALUES(2, 'ROLE_TECH_USER');
INSERT IGNORE INTO roles(id, name) VALUES(3, 'ROLE_MODERATOR');
INSERT IGNORE INTO roles(id, name) VALUES(4, 'ROLE_ADMIN'); -- Assumindo que o admin é necessário

-- ##################################################################
-- # 2. INSERÇÃO DE EMPRESAS (COMPANIES)
-- ##################################################################
INSERT INTO companies (id, name, cnpj, address, phone, email) VALUES
(1, 'Quantum Soluções Digitais', '11111111000111', 'Rua da Inovação, 100, São Paulo, SP', '11911111111', 'contato@quantumsolucoes.com'),
(2, 'Nexus TI Integrada', '22222222000122', 'Avenida Central, 200, Belo Horizonte, MG', '31922222222', 'suporte@nexusti.com'),
(3, 'Virtua Tech Labs', '33333333000133', 'Praça da Conectividade, 300, Curitiba, PR', '41933333333', 'comercial@virtuatech.com'),
(4, 'Alpha Hardware Co.', '44444444000144', 'Estrada do Silício, 400, Campinas, SP', '19944444444', 'vendas@alphahardware.com'),
(5, 'CyberSec Consultoria', '55555555000155', 'Alameda dos Dados, 500, Brasília, DF', '61955555555', 'contato@cybersec.com');

-- ##################################################################
-- # 3. INSERÇÃO DE USUÁRIOS (USERS)
-- ##################################################################
-- Senha para todos: 'password123'
SET @pwd_hash = '$2a$10$3g5vO0a.lY6u3A.O0.B87uK.N.3O2.l5u0v.E6.uB2.eB5.O0.a.O';

-- Admin User (ID: 1)
INSERT INTO users (id, username, email, password, company_id) VALUES
(1, 'admin.user', 'admin@tas.com', @pwd_hash, NULL);

-- Moderadores (IDs: 2-3)
INSERT INTO users (id, username, email, password, company_id) VALUES
(2, 'moderador.ana', 'ana.m@tas.com', @pwd_hash, NULL),
(3, 'moderador.rafael', 'rafael.m@tas.com', @pwd_hash, NULL);

-- Técnicos (IDs: 4-6)
INSERT INTO users (id, username, email, password, company_id) VALUES
(4, 'tech.carlos', 'carlos.t@tas.com', @pwd_hash, NULL),
(5, 'tech.beatriz', 'beatriz.t@tas.com', @pwd_hash, NULL),
(6, 'tech.lucas', 'lucas.t@tas.com', @pwd_hash, NULL);

-- Usuários de Empresa (IDs: 7-16)
INSERT INTO users (id, username, email, password, company_id) VALUES
(7, 'joao.silva', 'joao.silva@quantumsolucoes.com', @pwd_hash, 1),
(8, 'maria.santos', 'maria.santos@quantumsolucoes.com', @pwd_hash, 1),
(9, 'fernando.costa', 'fernando.costa@nexusti.com', @pwd_hash, 2),
(10, 'gabriela.lima', 'gabriela.lima@nexusti.com', @pwd_hash, 2),
(11, 'rodrigo.alves', 'rodrigo.alves@virtuatech.com', @pwd_hash, 3),
(12, 'camila.souza', 'camila.souza@virtuatech.com', @pwd_hash, 3),
(13, 'bruno.oliveira', 'bruno.oliveira@alphahardware.com', @pwd_hash, 4),
(14, 'larissa.pereira', 'larissa.pereira@alphahardware.com', @pwd_hash, 4),
(15, 'andre.martins', 'andre.martins@quantumsolucoes.com', @pwd_hash, 1),
(16, 'juliana.ribeiro', 'juliana.ribeiro@quantumsolucoes.com', @pwd_hash, 1);

-- ##################################################################
-- # 4. ASSOCIAÇÃO DE PAPÉIS A USUÁRIOS (USER_ROLES)
-- ##################################################################
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 4), -- admin.user -> ROLE_ADMIN
(2, 3), -- moderador.ana -> ROLE_MODERATOR
(3, 3), -- moderador.rafael -> ROLE_MODERATOR
(4, 2), -- tech.carlos -> ROLE_TECH_USER
(5, 2), -- tech.beatriz -> ROLE_TECH_USER
(6, 2), -- tech.lucas -> ROLE_TECH_USER
(7, 1), -- joao.silva -> ROLE_COMPANY_USER
(8, 1), -- maria.santos -> ROLE_COMPANY_USER
(9, 1), -- fernando.costa -> ROLE_COMPANY_USER
(10, 1), -- gabriela.lima -> ROLE_COMPANY_USER
(11, 1), -- rodrigo.alves -> ROLE_COMPANY_USER
(12, 1), -- camila.souza -> ROLE_COMPANY_USER
(13, 1), -- bruno.oliveira -> ROLE_COMPANY_USER
(14, 1), -- larissa.pereira -> ROLE_COMPANY_USER
(15, 1), -- andre.martins -> ROLE_COMPANY_USER
(16, 1); -- juliana.ribeiro -> ROLE_COMPANY_USER

-- ##################################################################
-- # 5. INSERÇÃO DE CHAMADOS (TICKETS)
-- ##################################################################

-- Tickets NÃO ATRIBUÍDOS (10)
INSERT INTO tickets (title, description, status, priority, company_id, opened_by_id, created_at) VALUES
('Software de Contabilidade não abre', 'O aplicativo ''ContaCerta'' fecha imediatamente após a inicialização.', 'OPEN', 'ALTA', 1, 8, NOW()),
('Monitor piscando constantemente', 'O monitor do meu computador fica piscando em intervalos aleatórios. Modelo Dell P2419H.', 'OPEN', 'MEDIA', 2, 10, NOW()),
('Não consigo acessar a VPN', 'Ao tentar conectar na VPN da empresa, recebo o erro ''Credenciais inválidas'', mas a senha está correta.', 'OPEN', 'ALTA', 3, 12, NOW()),
('Impressora não imprime colorido', 'Todos os documentos saem em preto e branco, mesmo com cartuchos coloridos cheios.', 'OPEN', 'BAIXA', 4, 14, NOW()),
('Sistema ERP com lentidão extrema', 'A navegação entre os módulos do ERP está levando mais de 1 minuto por clique.', 'OPEN', 'URGENTE', 1, 9, NOW()),
('Mouse sem fio desconectando', 'O mouse para de funcionar a cada poucos minutos e preciso remover e reconectar o dongle USB.', 'OPEN', 'MEDIA', 2, 11, NOW()),
('E-mail não sincroniza no Outlook', 'Minha caixa de entrada não atualiza desde ontem. Erro 0x800CCC0E.', 'OPEN', 'ALTA', 3, 13, NOW()),
('Webcam não é detectada em reuniões', 'A webcam integrada do meu notebook (Lenovo T480) não é reconhecida pelo Teams ou Zoom.', 'OPEN', 'MEDIA', 4, 15, NOW()),
('Erro ao salvar planilhas grandes', 'O Excel trava e fecha ao tentar salvar uma planilha com mais de 50.000 linhas.', 'OPEN', 'ALTA', 1, 16, NOW()),
('Teclado com teclas falhando', 'As teclas ''E'', ''R'' e ''T'' do meu teclado externo não funcionam.', 'OPEN', 'BAIXA', 2, 10, NOW());

-- Tickets ATRIBUÍDOS (10)
INSERT INTO tickets (title, description, status, priority, company_id, opened_by_id, assigned_to_id, created_at) VALUES
('Servidor de arquivos inacessível', 'A pasta compartilhada ''\\SRV-FILES01'' não pode ser acessada de nenhuma estação.', 'IN_PROGRESS', 'URGENTE', 1, 8, 4, NOW()),
('Falha no backup diário do banco de dados', 'O job de backup do SQL Server falhou com erro de ''permissão negada no disco''.', 'OPEN', 'ALTA', 2, 10, 5, NOW()),
('Ataque de phishing detectado', 'Recebemos múltiplos e-mails suspeitos solicitando senhas. Possível ataque em andamento.', 'IN_PROGRESS', 'URGENTE', 3, 12, 6, NOW()),
('Upgrade de memória RAM em desktop', 'Solicito upgrade de 8GB para 16GB de RAM no desktop do setor de design. Patrimônio: DT-FIN-03.', 'OPEN', 'BAIXA', 4, 14, 4, NOW()),
('Firewall bloqueando acesso a sistema parceiro', 'Não conseguimos acessar o portal do nosso fornecedor (portal.fornecedor.com). Acesso negado pelo firewall.', 'OPEN', 'ALTA', 1, 9, 5, NOW()),
('Instalação do Adobe Photoshop', 'Necessito da instalação do Adobe Photoshop no meu novo computador.', 'OPEN', 'MEDIA', 2, 11, 6, NOW()),
('Problema com certificado digital', 'O certificado digital para assinatura de notas fiscais expirou e não consigo renovar.', 'IN_PROGRESS', 'ALTA', 3, 13, 4, NOW()),
('Computador não liga (sem sinal)', 'O computador do gerente de contas não dá nenhum sinal de vida ao apertar o botão de ligar.', 'OPEN', 'URGENTE', 4, 15, 5, NOW()),
('Rede Wi-Fi instável na sala de reuniões', 'O sinal da rede sem fio ''Corp-WiFi'' cai constantemente na sala de reuniões 3.', 'OPEN', 'MEDIA', 1, 16, 6, NOW()),
('Erro de tela azul (BSOD)', 'Meu computador está reiniciando sozinho e exibindo uma tela azul com o código ''IRQL_NOT_LESS_OR_EQUAL''.', 'RESOLVED', 'ALTA', 2, 10, 4, NOW());

-- Exemplo de atualização de um ticket para RESOLVED com notas
UPDATE tickets
SET
    status = 'RESOLVED',
    resolved_at = NOW(),
    resolution_notes = 'O problema de tela azul foi causado por um driver de vídeo desatualizado. O driver foi atualizado para a versão mais recente e o sistema foi estabilizado.'
WHERE id = 20; -- ID do ticket sobre BSOD

```