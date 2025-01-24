
pipeline {
    agent any
    tools {
        jdk "OpenJDK-21"
        maven "M3"
    }
    environment {
        BRANCH = "${env.BRANCH_NAME}".toLowerCase()
        IMAGENAME = "irccs-auth"
        NEXUSERNAME = "docker_service_user"
        NEXPASSWORD = "Infocube123"
        DOCKER_REPOSITORY = "nexus.infocube.it:443/i3/irccs"
    }
    
    stages {
        stage('Workspace Cleaning') {
            steps {
                cleanWs()
            }
        }

        stage('Process Branch') {
            steps {
                script {
                    if (env.CHANGE_ID != null) {
                        echo "Triggered by PR: ${env.CHANGE_ID}"
                        echo "Source Branch: ${env.CHANGE_BRANCH}"
                        echo "Destination Branch: ${env.CHANGE_TARGET}"
                    } else {
                        echo "Triggered by commit on branch ${BRANCH_NAME}"
                    }
                }
            }
        }

        
        //stage('Clone Repository') {
          //  steps {
        //     checkout scmGit(branches: [[name: "*/${env.BRANCH_NAME}"]],force: true, extensions: [], userRemoteConfigs: [[url: 'git@github.com:infocube-it/irccs-microservice-auth.git']])
         /*   script {
                    if (env.CHANGE_ID != null) {
                        BRANCH = "${env.CHANGE_BRANCH}".toLowerCase()
                        BRANCH_NAME = "${env.CHANGE_BRANCH}".toLowerCase()  
                    }
                    VER = readMavenPom().getVersion()
                }
                echo "VersionID  --->>  ${VER}"
            }
        }

        stage('Build Java package') {
            steps {
                sh(script: "sed -i 's|prod.keycloak-domain=http://irccs-keycloak|prod.keycloak-domain=http://10.99.88.146:9445|g' ./src/main/resources/application.properties")
                sh('mvn clean package -DskipTests -U')
            }
        }

        stage('Build Docker image') {
            steps {
                script{ 
                sh "docker build -t ${IMAGENAME}-${BRANCH}:${VER} --build-arg folder=target ."
                sh "docker login -u ${NEXUSERNAME} -p ${NEXPASSWORD} ${DOCKER_REPOSITORY}"
                sh "docker tag ${IMAGENAME}-${BRANCH}:${VER} ${DOCKER_REPOSITORY}/${IMAGENAME}-${BRANCH}:${VER}"
                sh "docker push ${DOCKER_REPOSITORY}/${IMAGENAME}-${BRANCH}:${VER}"
                    }
            }
        }

        stage('Build Kubernetes image') {
            steps {
                script{ 
                sh "rm src/main/resources/application.properties && mv src/main/resources/application.propertiesK src/main/resources/application.properties"
                sh "rm Dockerfile && mv DockerfileK Dockerfile"
                sh "mvn clean package -DskipTests -U"
                sh "docker build -t ${IMAGENAME}_k8s-${BRANCH}:${VER} --build-arg folder=target ."
                sh "docker login -u ${NEXUSERNAME} -p ${NEXPASSWORD} ${DOCKER_REPOSITORY}"
                sh "docker tag ${IMAGENAME}_k8s-${BRANCH}:${VER} ${DOCKER_REPOSITORY}/${IMAGENAME}_k8s-${BRANCH}:${VER}"
                sh "docker push ${DOCKER_REPOSITORY}/${IMAGENAME}_k8s-${BRANCH}:${VER}"
                   }

                }
        }

stage ('Deploy source file update')
{
    steps {
                           // when {
                        //expression { env.CHANGE_ID != null }
                        //}
                            script{
                            sh "git clone git@github.com:infocube-dev-team/irccs-deploy.git"
                            //sh "cd irccs-deploy && git checkout ${CHANGE_TARGET}"
                            sh "cd irccs-deploy && git checkout develop"
                            //Version update for docker
                            //sh "sed version new-version file docker"
                            //Version update for Kubernetes
                            sh(script: "sed -i 's|image:.*|image: nexus.infocube.it/i3/irccs/${IMAGENAME}_k8s-${BRANCH}:${VER}|' irccs-deploy/kubernetes/auth.yaml")
                            sh "cd irccs-deploy && git add ."
                            sh '''
                            cd irccs-deploy
                            git diff --exit-code
                            if [ $? -ne 0 ]; then
                                git commit -m "Source updated"
                                git push || true
                            else
                                echo "No changes to push"
                            fi
                            '''

                            }
                            

        }
}*/
        stage('Deploy') {
            steps {
                script {
                    //DEPLOY_JOB = env.JOB_NAME.replaceAll('build', 'deploy')
                    DEPLOY_JOB = 'DeploySingleMicroservice'
                    build job: "${DEPLOY_JOB}", parameters: [
                    //string(name: 'DEPLOYBRANCH', value: ${CHANGE_TARGET})
                    string(name: 'DEPLOYBRANCH', value: 'develop'),
                    string(name: 'IMAGENAME', value: ${IMAGENAME})]
                
            }
        }
    }

        stage('Notify') {
            steps {
                script {
                    if (currentBuild.currentResult == 'FAILURE') {
                        emailext(
                            subject: "Build '${env.BUILD_NUMBER}' '${env.JOB_NAME}' Failed",
                            body: "The 'Build' stage of the job '${env.JOB_NAME}' '${env.BUILD_NUMBER}' failed. Please check the logs.",
                            to: 'claudio.poli,michele.marrandino@infocube.it,gennaro.aurilia@infocube.it'
                        )
                        error("Build failed, stopping pipeline execution.")
                    }
                }
            }
        }
    }
}
