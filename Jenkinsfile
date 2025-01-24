pipeline {
    agent any
    tools {
        jdk "OpenJDK-21"
        maven "M3"
    }
    environment {
        BRANCH = "${env.BRANCH_NAME}".toLowerCase()

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

        stage('Clone Repository') {
            steps {
                script {
                    if (env.CHANGE_ID != null) {
                        BRANCH = "${env.CHANGE_BRANCH}".toLowerCase()
                        BRANCH_NAME = "${env.CHANGE_BRANCH}"    
                    }
                }
                checkout scmGit(branches: [[name: "*/${env.BRANCH_NAME}"]],force: true, extensions: [], userRemoteConfigs: [[url: 'git@github.com:infocube-it/irccs-microservice-auth.git']])
            }
        }

        stage('Build package') {
            steps {
                sh(script: "sed -i 's|prod.keycloak-domain=http://irccs-keycloak|prod.keycloak-domain=http://10.99.88.146:9445|g' ./src/main/resources/application.properties")
                sh('mvn clean package -DskipTests -U')
            }
        }

        stage('Docker image build and push') {
            steps {
                script{ 
                    def ARTIFACT_VER = sh(script: 'mvn org.apache.maven.plugins:maven-help-plugin:3.2.0:evaluate -Dexpression=project.version -q -DforceStdout', returnStdout: true).trim()
                    echo "Artifact Version: ${ARTIFACT_VER}"
                }
                sh "imageName=$(echo irccs-auth_${BRANCH}:${VER})"
                sh "docker build -t irccs-auth:latest ."
                sh "docker login -u docker_service_user -p Infocube123 nexus.infocube.it:443"
                sh "docker tag irccs-auth:latest ${imageName} nexus.infocube.it:443/i3/irccs/irccs-auth"
                sh "docker push ${imageName} nexus.infocube.it:443/i3/irccs/irccs-auth"
            }
        }

        stage('Build immagine Kubernetes') {
            steps {
                script{ 
                    def ARTIFACT_VER = sh(script: 'mvn org.apache.maven.plugins:maven-help-plugin:3.2.0:evaluate -Dexpression=project.version -q -DforceStdout', returnStdout: true).trim()
                    echo "Artifact Version: ${ARTIFACT_VER}"
                }

                echo "${ARTIFACT_VER}"
                echo "${env.BRANCH}"
                sh('rm src/main/resources/application.properties && mv src/main/resources/application.propertiesK src/main/resources/application.properties')
                sh('rm Dockerfile && mv DockerfileK Dockerfile')
                sh('mvn clean package -DskipTests -U')
                sh "docker build --no-cache -t irccs-auth_k8s_${env.BRANCH}:${ARTIFACT_VER} --build-arg folder=target ."
                sh('docker login -u docker_service_user -p Infocube123 nexus.infocube.it:443')
                sh('docker tag irccs-auth_k8s_${VERSION} nexus.infocube.it:443/i3/irccs/irccs-auth_k8s')
                sh('docker push nexus.infocube.it:443/i3/irccs/irccs-auth_k8s')









                

            }
        }

        stage('Deploy') {
            steps {
                script {
                    DEPLOY_JOB = env.JOB_NAME.replaceAll('build', 'deploy')
                    build job: "${DEPLOY_JOB}"
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
                        error("Build failed, stopping pipeline execution.")  // Stops pipeline execution
                    }
                }
            }
        }
    }
}
