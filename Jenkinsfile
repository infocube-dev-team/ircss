pipeline {
    agent any
    tools {
        jdk "OpenJDK-21"
        maven "M3"
    }
    environment {
        BRANCH_NAME = "${env.BRANCH_NAME}"
        ARTIFACT_VER =""
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
                        BRANCH_NAME = env.CHANGE_BRANCH
                    }
                }
                checkout scmGit(branches: [[name: "*/${BRANCH_NAME}"]], extensions: [], userRemoteConfigs: [[url: 'git@github.com:infocube-it/irccs-microservice-auth.git']])
            }
        }

        stage('Build package') {
            steps {
                sh(script: "sed -i 's|prod.keycloak-domain=http://irccs-keycloak|prod.keycloak-domain=http://10.99.88.146:9445|g' ./src/main/resources/application.properties")
                sh(script: """
                    ARTIFACT_VER=\$(mvn org.apache.maven.plugins:maven-help-plugin:3.2.0:evaluate -Dexpression=project.version -q -DforceStdout)
                    echo "Artifact Version: \$ARTIFACT_VER"
                    echo "ARTIFACT_VER=\$ARTIFACT_VER" >> \$WORKSPACE/.env
                """)
                sh('mvn clean package -DskipTests -U')
            }
        }

        stage('Docker image build and push') {
            steps {
                sh('source \$WORKSPACE/.env')
                sh('docker build  --no-cache -t "irccs-auth:${BRANCH_NAME}:${ARTIFACT_VER}" --build-arg folder=target .')
                sh('echo "Docker image irccs-auth has been built successfully."')
                sh('docker login -u docker_service_user -p Infocube123 nexus.infocube.it:443')
                sh('docker tag irccs-auth:${BRANCH_NAME}:${ARTIFACT_VER} nexus.infocube.it:443/i3/irccs/irccs-auth')
                sh('docker push nexus.infocube.it:443/i3/irccs/irccs-auth')
            }
        }

        stage('Build immagine Kubernetes') {
            steps {
                sh('source \$WORKSPACE/.env')
                sh('rm src/main/resources/application.properties && mv src/main/resources/application.propertiesK src/main/resources/application.properties')
                sh('rm Dockerfile && mv DockerfileK Dockerfile')
                sh('mvn clean package -DskipTests -U')
                sh('docker build  --no-cache -t "irccs-auth_k8s:${BRANCH_NAME}:${ARTIFACT_VER}" --build-arg folder=target .')
                sh('docker login -u docker_service_user -p Infocube123 nexus.infocube.it:443')
                sh('docker tag irccs-auth_k8s:${BRANCH_NAME}:${ARTIFACT_VER} nexus.infocube.it:443/i3/irccs/irccs-auth_k8s')
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
