pipeline 
{
    agent any
    tools {
        jdk "OpenJDK-21"
        maven "M3"
    }
   
  environment {
        BRANCH_NAME = "${env.BRANCH_NAME}"
    }

    stages 
    {
        stage('Workspace Cleaning') {
            steps {
                cleanWs()
                   }
        }
        
        stage('Process Branch') {
            steps {
                
                if (env.CHANGE_ID != null) 
                {
                    echo "Triggered by PR: ${env.CHANGE_ID}"
                    echo "Source Branch: ${env.CHANGE_BRANCH}"
                    echo "Destination Branch: ${env.CHANGE_TARGET}"
                }
                else
                {
                    echo "Triggered by commit on branch ${params.BRANCH_NAME}"
                }
            }
        }
    
stage('Clone Repository') {
            steps {

                if ({ env.CHANGE_ID != null }) 
                {
                    BRANCH_NAME=env.CHANGE_BRANCH

                }
                checkout scmGit(branches: [[name: "*/${BRANCH_NAME}"]], extensions: [],
                userRemoteConfigs: [[url: 'git@github.com:infocube-it/irccs-microservice-auth.git']])               

            }
        }
                stage('Build package') {
                steps {
                  
                    sh(script: "sed -i 's|prod.keycloak-domain=http://irccs-keycloak|prod.keycloak-domain=http://10.99.88.146:9445|g' ./src/main/resources/application.properties")
                    //sh(script: "sed -i 's|prod.keycloak-port=9445|prod.keycloak-port=|g' ./src/main/resources/application.properties")
		            sh('artifact_ver=$(mvn org.apache.maven.plugins:maven-help-plugin:3.2.0:evaluate -Dexpression=project.version -q -DforceStdout)')
                    sh('echo $ARTIFACT_VER')
		            sh('mvn clean package -DskipTests -U')
            }
        }


         stage('Docker image build and push') {
                steps {

                    sh('docker build  --no-cache -t "irccs-auth":${BRANCH_NAME}:${ARTIFACT_VER} --build-arg folder=target .')
                    sh('echo "Docker image irccs-auth has been built successfully."')
                    sh('docker login -u docker_service_user -p Infocube123 nexus.infocube.it:443')
                    sh('docker tag irccs-auth:${BRANCH_NAME}:${ARTIFACT_VER} nexus.infocube.it:443/i3/irccs/irccs-auth')
                    sh('docker push nexus.infocube.it:443/i3/irccs/irccs-auth')
                    
            }
        }
        
                                //DA RIMUOVERE
                        //SE PR AVVIARE AGGIORNARE SOURCE E AVVIARE BUILD DEPLOY
        /*stage('Container update and restart') {
                steps {
                    when {
                        expression { env.CHANGE_ID != null }
                        }
                     sh('docker stop irccs-auth || true && docker rm irccs-auth || true')
                     sh('docker run -d -p 9090:9090 --name irccs-auth --network irccs-docker_default irccs-auth')
            }
        }*/
        

        stage('Build immagine Kubernetes') {
                steps {
                    sh('rm src/main/resources/application.properties && mv src/main/resources/application.propertiesK src/main/resources/application.properties')
                    sh('rm Dockerfile && mv DockerfileK Dockerfile')
					sh('mvn clean package -DskipTests -U')
                    sh('docker build  --no-cache -t "irccs-auth_k8s":${BRANCH_NAME}:${ARTIFACT_VER} --build-arg folder=target .')
                    sh('docker login -u docker_service_user -p Infocube123 nexus.infocube.it:443')
                    sh('docker tag irccs-auth_k8s:${BRANCH_NAME}:${ARTIFACT_VER} nexus.infocube.it:443/i3/irccs/irccs-auth_k8s')
                    sh('docker push nexus.infocube.it:443/i3/irccs/irccs-auth_k8s')
            }
        }
        
        
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
        //SISTEMARE PUNTAMENTI - EVENTUALMENTE ATTIVARE SONAR SU PREPROD
        /*
    stage('SonarQube analysis') { 
        steps { 
            sh('mvn clean verify sonar:sonar -DskipTests -Dsonar.projectKey=irccs-auth -Dsonar.host.url=http://10.99.88.146:9000 -Dsonar.login=sqa_0fa2c64ee059b0dc935d0431811c86d018610057')
       }
     }      */

    stage('Deploy') 
        { steps 
    {  
    when { expression { env.CHANGE_ID != null } }
    sh('git clone git@github.com:infocube-dev-team/irccs-deploy.git')
    sh('cd irccs-deploy && git checkout ${env.CHANGE_TARGET}')
    sh('cd irccs-deploy/kubernetes && sed -i "s|\(image: nexus\.infocube\.it/i3/irccs/irccs:\)[^[:space:]]*|\1${BRANCH_NAME}:${ARTIFACT_VER}|" auth.yaml')
    sh('cd irccs-deploy/docker && sed -i "s|\(image: nexus\.infocube\.it/i3/irccs/irccs:\)[^[:space:]]*|\1${BRANCH_NAME}:${ARTIFACT_VER}|" auth.yaml')
    sh('cd irccs-deploy && git add * && git commit -m "Source updated" && git push')
    DEPLOY_JOB = "${env.JOB_NAME.replaceAll('build', 'deploy')}"
    build job: "${env.DEPLOY_JOB}"
    }
}
    stage('Notify') 
        { steps 
    {  
        if (currentBuild.currentResult == 'FAILURE') {
            emailext(
                subject: "Build '${env.BUILD_NUMBER} '${env.JOB_NAME}' Failed",
                body: "The 'Build' stage of the job '${env.JOB_NAME}' '${env.BUILD_NUMBER} failed. Please check the logs.",
                to: 'claudio.poli,michele.marrandino@infocube.it,gennaro.aurilia@infocube.it'
            )
            error("Build failed, stopping pipeline execution.")
        }

        }
    }
    }
}

 
