# Atlas CMMS API

This is the REST backend (Java8-Spring Boot) of the web
application.
We would be very happy to have new contributors join us.
**And please star the repo**.

## How to run locally ?
Set these environment variables.
- `SMTP_USER` after [creating an app password with Google](https://support.google.com/accounts/answer/185833?hl=en)
- `SMTP_PWD` after [creating an app password with Google](https://support.google.com/accounts/answer/185833?hl=en)
- `GCP_JSON` after creating a Google Cloud Storage bucket, then creating a service account following the section **Create a service account** of
  this [tutorial](https://medium.com/@raviyasas/spring-boot-file-upload-with-google-cloud-storage-5445ed91f5bc)
- `GCP_PROJECT_ID` the Google Cloud project id can also be found in the `GCP_JSON`
- `GCP_BUCKET_NAME` Google Cloud Storage bucket name
- `FASTSPRING_PWD` (optional: can replace with a placeholder) after creating a FastSpring account
- `FASTSPRING_USER` optional after creating a FastSpring account
- `MAIL_RECIPIENTS` emails separated by a comma: you can provide your email

Without docker, you should first install and use JDK 8 then create a Postgres database. After that go to [src/main/resources/application-dev.yml](src/main/resources/application-dev.yml), change the url, username and password.
