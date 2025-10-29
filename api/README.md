# Atlas CMMS API

This is the REST backend (Java8-Spring Boot) of the web application. We would be very happy to have
new contributors join us.

## How to run locally

Set the environment variables not starting with `REACT_APP` from [the top-level README](../README.MD#set-environment-variables).

Edit `src/main/resources/application-local.yml` to adjust database connection values for local development.

Running with the default `application.yml` vs a local/dev profile

The project ships a default `application.yml` (used when no active profile is set) and an
`application-local.yml` which contains local development overrides (for example, it disables Liquibase
and sets Hibernate's `ddl-auto: create` for fast iteration).

Examples (PowerShell):

```powershell
# Run with the default application.yml (no active profile):
mvn -DskipTests spring-boot:run

# Run using the local profile (application-local.yml will be applied on top of application.yml):
$env:SPRING_PROFILES_ACTIVE = 'local'
mvn -DskipTests spring-boot:run

# Or pass a JVM argument to set a profile for a single run:
mvn -DskipTests -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=local" spring-boot:run
```

Docker Compose note

If you run via `docker-compose`, the compose file reads the `SPRING_PROFILES_ACTIVE` environment
variable. You can set that in your environment or a `.env` file to control the active profile for
containers.
