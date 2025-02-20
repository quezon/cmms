# Atlas CMMS API

This is the REST backend (Java8-Spring Boot) of the web
application.
We would be very happy to have new contributors join us.
**And please star the repo**.

## How to run locally ?

Set these environment variables.

| **Name**          | **Optional** | **Description**                                                                                                                                                                     |
|-------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `SMTP_USER`       | Yes          | The SMTP username after creating an app password with Google. [Learn how to create an app password](https://support.google.com/accounts/answer/185833?hl=en)                        |
| `SMTP_PWD`        | Yes          | The SMTP password after creating an app password with Google. [Learn how to create an app password](https://support.google.com/accounts/answer/185833?hl=en)                        |
| `GCP_JSON`        | Yes          | The Google Cloud JSON key after creating a service account following [this tutorial](https://medium.com/@raviyasas/spring-boot-file-upload-with-google-cloud-storage-5445ed91f5bc). |
| `GCP_PROJECT_ID`  | Yes          | The Google Cloud project ID, also found in the `GCP_JSON` file.                                                                                                                     |
| `GCP_BUCKET_NAME` | Yes          | The name of the Google Cloud Storage bucket.                                                                                                                                        |
| `FASTSPRING_PWD`  | Yes          | The password for your FastSpring account. Fastspring is a payment gateway                                                                                                           |
| `FASTSPRING_USER` | Yes          | The username for your FastSpring account.                                                                                                                                           |
| `MAIL_RECIPIENTS` | Yes          | Comma-separated email addresses of the super admins for sending emails. You can provide your email address.                                                                         |

Without docker, you should first install and use JDK 8 then create a Postgres database. After that go
to [src/main/resources/application-dev.yml](src/main/resources/application-dev.yml), change the url, username and
password.

```shell
mvn spring-boot:run
```