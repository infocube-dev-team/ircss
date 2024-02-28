### IRCCS MICROSERVICE AUTH
MicroServizio per la gestione della autorizzazioni per accesso a FHIR
Dipende da FHIR Server 
Depende da KeyCloak

### How to run test for this project
cd $PROJECT_HOME_DIR
docker-compose up -d
# Check Fhir server and KeyCloak is runned
mvn install 

