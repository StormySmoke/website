pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'echo "Building"'
            }
        }
        stage('Test') {
            steps {
                sh 'echo "Testing"'
            }
        }
        stage('Deliver') {
            steps {
                sh 'docker build -t stormysmoke/sent2vec-client:0.0.1-jenkins .'
                sh 'docker push stormysmoke/sent2vec-client:0.0.1-jenkins'
            }
        }
    }
}
