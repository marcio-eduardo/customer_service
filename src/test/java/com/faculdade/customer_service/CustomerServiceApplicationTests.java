package com.faculdade.customer_service;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import static org.junit.jupiter.api.Assertions.assertFalse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CustomerServiceApplicationTests {

    @Test
	void testName() {
		
	}

	@Autowired
    private DataSource dataSource;

    @Test
    void contextLoads() {
        // Teste padrão para verificar se o contexto da aplicação carrega corretamente
    }

    @Test
    void testDatabaseConnection() throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            assertFalse(connection.isClosed());
            System.out.println("✅ Conexão com o banco de dados PostgreSQL está ativa!");
        }
    }
}
