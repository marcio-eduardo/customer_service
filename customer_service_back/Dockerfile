# Estágio 1: Build da aplicação com Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia o pom.xml para baixar as dependências
COPY pom.xml .

# Copia o restante do código-fonte
COPY src ./src

# Executa o build do projeto com Maven, pulando os testes para agilizar
RUN mvn clean package -DskipTests

# Estágio 2: Imagem final, apenas com o Java e o JAR
FROM eclipse-temurin:21-jre

# Define o diretório de trabalho
WORKDIR /app

# Copia o JAR gerado no estágio de build para a imagem final
COPY --from=build /app/target/customer_service_back-0.0.1.jar /app/customer_service_back.jar

# Define o comando para rodar a aplicação
CMD ["java", "-jar", "/app/customer_service_back.jar"]