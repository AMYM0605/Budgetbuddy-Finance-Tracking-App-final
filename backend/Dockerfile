# ---------- BUILD STAGE ----------
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy EVERYTHING inside backend
COPY backend/ .

RUN mvn clean package -DskipTests


# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
