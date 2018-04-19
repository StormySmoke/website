pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'echo "Build Stage"'
            }
        }
        stage('Test') {
            steps {
                sh 'echo "Test Stage"'
            }
        }
        stage('Deliver') {
            when {
              expression { return true}
            }
            environment { 
                IMAGE = 'stormysmoke/sent2vec-client:snapshot'
            }
            steps {
                sh 'docker build -t "$IMAGE" .'
                sh 'docker push "$IMAGE"'
            }
        }
        stage('Deploy to Dev') {
            agent {
                docker {
                    image 'kramos/cloud-foundry-cli:latest'
                }
            }
            environment { 
                APP = 'sent2vec-client-DEV'
            }
            steps {
                withCredentials([string(credentialsId: 'cf-user', variable: 'USER'), string(credentialsId: 'cf-password', variable: 'PASSWORD')]) {
                    sh 'cf login -a https://api.us-east.bluemix.net -u "$USER" -p "$PASSWORD" -o QuantumSense -s "Default Space"'
                }
                sh 'cf push'
                withCredentials([string(credentialsId: 'rabbitmq-dev', variable: 'RABBITMQ_URI_DEV')]) {
                    sh 'cf set-env "$APP" RABBITMQ_URI "$RABBITMQ_URI_DEV"
                }
                sh 'cf apps'
                sh 'cf env "$APP"'
            }
        }
    }
}
