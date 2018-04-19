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
            environment { 
                IMAGE = 'stormysmoke/sent2vec-client:snapshot'
            }
            steps {
                sh 'docker build -t "$IMAGE" .'
                sh 'docker push "$IMAGE"'
            }
        }
    }
}
