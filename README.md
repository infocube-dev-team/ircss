### IRCCS MICROSERVICE AUTH
MicroServizio per la gestione della autorizzazioni per accesso a FHIR
Dipende da FHIR Server che deve essere avviato tramite docker-compose
Dipende da KeyCloak, che viene invece avviato automaticamente da quarkus dev

### How to run test for this project
#PER I TEST FHIR Server che deve essere avviato tramite docker-compose
cd $PROJECT_HOME_DIR
docker-compose up -d
# Check Fhir server and KeyCloak is runned by Quarkus Dev
quarkus dev
# See https://quarkus.io/guides/security-keycloak-authorization
# See https://quarkus.io/guides/security-oidc-bearer-token-authentication
# See https://quarkus.io/guides/security-openid-connect-dev-services
