# ---- Etapa de build (Maven + JDK 17) ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build
# Cachea dependencias: solo se re-descargan si cambia el pom.xml
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q clean package -DskipTests

# ---- Etapa de runtime (solo JRE, imagen ligera) ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Usuario no-root + carpeta de uploads con permisos correctos
RUN addgroup -S app && adduser -S app -G app \
    && mkdir -p /app/uploads \
    && chown -R app:app /app
COPY --from=build /build/target/*.jar app.jar
EXPOSE 8080
USER app
# Healthcheck contra un endpoint público (no requiere auth)
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD wget -q -O - http://localhost:8080/v3/api-docs >/dev/null 2>&1 || exit 1
ENTRYPOINT ["java","-XX:MaxRAMPercentage=75.0","-jar","/app/app.jar"]
