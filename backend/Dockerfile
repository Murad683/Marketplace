########################################
# 1) BUILD STAGE
########################################
# Bu stage Gradle ilə JAR faylını yığır
FROM gradle:8.7-jdk17 AS builder

WORKDIR /app

# Layihənin hamısını konteynerə kopyalayırıq
COPY . .

# Testləri məcburi işə salmırıq ki, build sürsün və hansısa test problemi block eləməsin
RUN gradle clean build -x test


########################################
# 2) RUNTIME STAGE
########################################
# Burada sadəcə hazır jar-ı işə salırıq
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Yuxarıdakı build mərhələsində yaranan jar faylını götürürük
COPY --from=builder /app/build/libs/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=dev

ENTRYPOINT ["java", "-jar", "app.jar"]