pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'colors'
            }
        }
        stage('Test') {
            steps {
                sh 'echo "Testing"'
            }
        }
        stage('Deliver') {
            steps {
                sh 'echo "Delivering"'
            }
        }
    }
}
