pipeline 
{
    agent any
    tools {
        jdk "OpenJDK-21"
        maven "M3"
    }
   
  
    stages 
    {
        stage('Workspace Cleaning') {
            steps {
                cleanWs()
                   }
        }
        
stage('Clone Repository') {
            steps {
                script {
			sh 'env'
                }
            }
        }

        
        /*stage('Test') {
            steps {
                script {
                    sh(script: "sed -i 's|hapi.base-url=http://localhost|hapi.base-url=http://10.99.88.146|g' ./src/main/resources/application.properties")
                    sh(script: 'mvn test')
                }
            }
        }*/
        
                stage('Build package') {
                steps {
                    sh(script: "sed -i 's|prod.keycloak-domain=http://irccs-keycloak|prod.keycloak-domain=http://10.99.88.146:9445|g' ./src/main/resources/application.properties")
                    //sh(script: "sed -i 's|prod.keycloak-port=9445|prod.keycloak-port=|g' ./src/main/resources/application.properties")
			
					sh('mvn clean package -DskipTests -U')
            }
        }
         stage('Docker image build and push') {
                steps {
                    sh('docker build  --no-cache -t "irccs-auth":latest --build-arg folder=target .')
                    sh('echo "Docker image irccs-auth has been built successfully."')
                    sh('docker login -u docker_service_user -p Infocube123 nexus.infocube.it:443')
                    sh('docker tag irccs-auth:latest nexus.infocube.it:443/i3/irccs/irccs-auth')
                    sh('docker push nexus.infocube.it:443/i3/irccs/irccs-auth')
            }
        }
        
        stage('Container update and restart') {
                steps {
                     sh('docker stop irccs-auth || true && docker rm irccs-auth || true')
                     sh('docker run -d -p 9090:9090 --name irccs-auth --network irccs-docker_default irccs-auth')
            }
        }
        
        stage('Build immagine Kubernetes') {
                steps {
                   
                    /*sh'''
                    sed -i 's|keycloak-url=${keycloak-domain}:${keycloak-port}|keycloak-url=http://10.99.88.210:9445|g' ./src/main/resources/application.properties'''
                    
                    
                    sh'''
                    sed -i 's|org.quarkus.irccs.fhir-server=${hapi.base-url}:${quarkus.hapi.devservices.port:60586}/fhir|org.quarkus.irccs.fhir-server=http://10.99.88.210:8080/fhir|' ./src/main/resources/application.properties
                    '''
                    
                    sh'''
                    sed -i 's|keycloak-domain=${hapi.base-url}|keycloak-domain=http://10.99.88.210|g' ./src/main/resources/application.properties
                    '''
                    
                    sh'''
                    sed -i 's|keycloak-port=${kc.admin.port.test:45180}|keycloak-port=9445|' ./src/main/resources/application.properties
                    '''
                    
                    sh(script: "sed -i 's|prod.keycloak-domain=http://irccs-keycloak|prod.keycloak-domain=http://10.99.88.210:9445|g' ./src/main/resources/application.properties")
                    //sh(script: "sed -i 's|prod.keycloak-port=9445|prod.keycloak-port=|g' ./src/main/resources/application.properties")
                    
                    sh(script: "sed -i 's|%prod.org.quarkus.irccs.fhir-server=http://fhir:8080/fhir|%prod.org.quarkus.irccs.fhir-server=http://10.99.88.210:8080/fhir|g' ./src/main/resources/application.properties")
                    //sh(script: "sed -i 's|%prod.org.quarkus.irccs.fhir-server=http://fhir:8080/fhir|%prod.org.quarkus.irccs.fhir-server=http://10.99.88.210:8080/fhir' ./src/main/resources/application.properties")
                    */
                    
                    
                    sh('rm src/main/resources/application.properties && mv src/main/resources/application.propertiesK src/main/resources/application.properties')
                    sh('rm Dockerfile && mv DockerfileK Dockerfile')
					sh('mvn clean package -DskipTests -U')
                    sh('docker build  --no-cache -t "irccs-auth_k8s":latest --build-arg folder=target .')
                    sh('docker login -u docker_service_user -p Infocube123 nexus.infocube.it:443')
                    sh('docker tag irccs-auth_k8s:latest nexus.infocube.it:443/i3/irccs/irccs-auth_k8s')
                    sh('docker push nexus.infocube.it:443/i3/irccs/irccs-auth_k8s')
            }
        }
        /*
        
        stage ('OWASP Dependency-Check Vulnerabilities') {
            steps {
                
                dependencyCheck additionalArguments: ''' 
                    -o "./" 
                    -s "/var/lib/jenkins/workspace/irccs-auth/target/quarkus-app/*.jar"
                    -f "ALL"
                    --disableYarnAudit
                    --prettyPrint
                    --nvdApiKey 572689c4-08aa-4b65-b489-c570c11b5efd
                    --nvdApiDelay=6000''', odcInstallation: 'OWASP-DC'

                dependencyCheckPublisher pattern: 'dependency-check-report.xml'
                
            }
        }
        
               stage('SonarQube analysis') { 
    steps { sh('mvn clean verify sonar:sonar -DskipTests -Dsonar.projectKey=irccs-auth -Dsonar.host.url=http://10.99.88.146:9000 -Dsonar.login=sqa_0fa2c64ee059b0dc935d0431811c86d018610057')

       }
     }*/
     
        
           
        }
    }
