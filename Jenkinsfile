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
            when {
              branch 'dev'
            }
            agent {
                docker {
                    image 'stormysmoke/cloud-foundry-cli:latest'
                }
            }
            environment { 
                APP = 'sent2vec-client-DEV'
            }
            steps {
                withCredentials([string(credentialsId: 'cf-user', variable: 'USER'),
                                 string(credentialsId: 'cf-password', variable: 'PASSWORD'),
                                 string(credentialsId: 'rabbitmq-dev', variable: 'RABBITMQ_URI')]) {
                    sh 'jenkins/deploy-to-cf.sh "$APP" "$USER" "$PASSWORD" "$RABBITMQ_URI"'
                }
            }
        }
        stage('Deploy to Prod') {
            when {
              branch 'master'
            }
            agent {
                docker {
                    image 'stormysmoke/cloud-foundry-cli:latest'
                }
            }
            environment { 
                APP = 'sent2vec-client'
            }
            steps {
                withCredentials([string(credentialsId: 'cf-user', variable: 'USER'),
                                 string(credentialsId: 'cf-password', variable: 'PASSWORD'),
                                 string(credentialsId: 'rabbitmq-prod', variable: 'RABBITMQ_URI')]) {
                    sh 'jenkins/deploy-to-cf.sh "$APP" "$USER" "$PASSWORD" "$RABBITMQ_URI"'
                }
            }
        }
    }
}
