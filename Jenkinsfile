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
                    image: 'kramos/cloud-foundry-cli:latest'
                }
            }
            steps {
                withCredentials([string(credentialsId: 'test-credential-2', variable: 'URL')]) {
                    sh 'curl -Lks "$URL"'
                    sh 'cf -v'
                }
            }
        }
    }
}
