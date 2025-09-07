# Usa a imagem oficial do OpenJDK 21
FROM eclipse-temurin:21-jdk

# Define diretório de trabalho dentro do container
WORKDIR /app

# Copia o JAR da aplicação para dentro do container
COPY target/customer_service_back-0.0.1.jar /app/customer_service_back.jar

# Define o comando para rodar a aplicação
CMD ["java", "-jar", "/app/customer_service_back.jar"]