# Build Stage
FROM maven:3.8.6-jdk-8 as build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests


# Runtime Stage
FROM openjdk:8-jdk-alpine

# Set environment variables for Spring Boot application
ENV API_HOST=$API_HOST
ENV DB_PWD=$DB_PWD
ENV DB_URL=$DB_URL
ENV DB_USER=$DB_USER
ENV FASTSPRING_PWD=$FASTSPRING_PWD
ENV FASTSPRING_USER=$FASTSPRING_USER
ENV FRONT_URL=$FRONT_URL
ENV GCP_BUCKET_NAME=$GCP_BUCKET_NAME
ENV GCP_JSON=$GCP_JSON
ENV GCP_PROJECT_ID=$GCP_PROJECT_ID
ENV MAIL_RECIPIENTS=$MAIL_RECIPIENTS
ENV SMTP_PWD=$SMTP_PWD
ENV SMTP_USER=$SMTP_USER
ENV SPRING_PROFILES_ACTIVE=$SPRING_PROFILES_ACTIVE
ENV JWT_SECRET_KEY=$JWT_SECRET_KEY

# Set the working directory in the container
WORKDIR /app

# Copy the compiled Spring Boot application JAR file into the container at /app
COPY --from=build /app/target/*.jar my-spring-boot-app.jar

# Expose the port that the Spring Boot application will run on
EXPOSE 8080

# Specify the command to run on container startup
CMD ["java", "-jar", "/app/my-spring-boot-app.jar"]
