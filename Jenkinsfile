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
              expression { return false }
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
            steps {
                withCredentials([string(credentialsId: 'test-credential-2', variable: 'URL')]) {
                    sh 'wget -q -O - "$URL"'
                }
                withCredentials([string(credentialsId: 'cf-user', variable: 'USER'), string(credentialsId: 'cf-password', variable: 'PASSWORD')]) {
                    sh 'cf login -a https://api.us-east.bluemix.net -u "$USER" -p "$PASSWORD" -o QuantumSense -s "Default Space"'
                }
                sh 'cf apps'
            }
        }
    }
}
