-- Insere os papéis (roles) apenas se eles não existirem, usando a sintaxe do MySQL
INSERT IGNORE INTO roles(name) VALUES('ROLE_USER');
INSERT IGNORE INTO roles(name) VALUES('ROLE_ADMIN');
INSERT IGNORE INTO roles(name) VALUES('ROLE_MODERATOR');

-- Adicionar outros dados iniciais aqui, se necessário,
-- certificando-se de que a sintaxe é compatível com MySQL.
-- Por exemplo, se for inserir Clientes PF para teste:
-- INSERT IGNORE INTO clientes_pf (id_cliente, nome, cpf, endereco, telefone, email, data_cadastro) VALUES (1, 'João Silva Teste', '11122233344', 'Rua Teste 123', '11999998888', 'joao.teste@example.com', CURDATE());
-- Lembre-se que para tabelas com AUTO_INCREMENT (como clientes_pf agora), você geralmente não insere o ID manualmente,
-- a menos que queira forçar um valor específico e saiba o que está a fazer.
-- Exemplo sem ID explícito:
-- INSERT INTO clientes_pf (nome, cpf, endereco, telefone, email, data_cadastro) VALUES ('Maria Outra Teste', '55566677788', 'Avenida Exemplo 456', '21988887777', 'maria.outra@example.com', CURDATE());

