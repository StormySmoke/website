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
                sh 'echo "$HOME"'
                sh 'cd && pwd'
                sh 'ls -l /home'
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
