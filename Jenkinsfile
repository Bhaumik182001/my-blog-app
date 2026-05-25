pipeline {
    agent any
    
    environment {
        // Put your actual details here
        DOCKER_USER = 'bhaumik182001' 
        REPO_URL = 'https://github.com/Bhaumik182001/my-blog-app.git'
        EC2_IP = '13.233.178.72'
    }

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: "${REPO_URL}"
            }
        }

        stage('Build & Push') {
            steps {
                script {
                    // Jenkins logs into Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', passwordVariable: 'DOCK_PASS', usernameVariable: 'DOCK_USER')]) {
                        sh "echo \$DOCK_PASS | docker login -u \$DOCK_USER --password-stdin"
                    }
                    // Fixed: Using the correct DOCKER_USER variable from the environment block
                    sh "docker build -t ${DOCKER_USER}/devops-spa:latest ."
                    sh "docker push ${DOCKER_USER}/devops-spa:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['aws-ec2-key']) {
                    // Copy compose and prometheus files to AWS
                    sh "scp -o StrictHostKeyChecking=no docker-compose.yml prometheus.yml ec2-user@${EC2_IP}:/home/ec2-user/"
                    
                    // FIXED: Inject the DOCKER_USER variable directly into the AWS shell session
                    sh "ssh -o StrictHostKeyChecking=no ec2-user@${EC2_IP} 'DOCKER_USERNAME=${DOCKER_USER} docker-compose up -d --pull always'"
                }
            }
        }
    }
}