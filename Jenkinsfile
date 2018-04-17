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
            steps {
                sh 'docker build -t stormysmoke/sent2vec-client:0.0.1-jenkins .'
                sh 'docker push stormysmoke/sent2vec-client:0.0.1-jenkins'
            }
        }
    }
}
