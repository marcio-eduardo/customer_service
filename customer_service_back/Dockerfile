# Estágio 1: Build da aplicação
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn
COPY pom.xml .

RUN ./mvnw dependency:go-offline -B

COPY src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY --from=builder /app/target/customer_service_back-0.0.1.jar /app/customer_service_back.jar

CMD ["java", "-jar", "/app/customer_service_back.jar"]