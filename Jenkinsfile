pipeline {
    agent any

    environment {
        DOCKER_USER = 'bhaumik182001'
        REPO_URL    = 'https://github.com/Bhaumik182001/my-blog-app.git'
        EC2_IP      = '65.1.73.114'
    }

    stages {

        // ── 1. Clone ────────────────────────────────────────────────────────
        stage('Clone') {
            steps {
                git branch: 'main', url: "${REPO_URL}"
            }
        }

        // ── 2. Build & Push both images ─────────────────────────────────────
        stage('Build & Push Images') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-hub-creds',
                        usernameVariable: 'DOCK_USER',
                        passwordVariable: 'DOCK_PASS'
                    )]) {
                        sh "echo \$DOCK_PASS | docker login -u \$DOCK_USER --password-stdin"
                    }

                    // Frontend — built for linux/amd64 from root Dockerfile
                    sh """
                        docker build --platform linux/amd64 -t ${DOCKER_USER}/devops-spa-frontend:latest .
                        docker push ${DOCKER_USER}/devops-spa-frontend:latest
                    """

                    // Backend — built for linux/amd64 from backend/Dockerfile
                    sh """
                        docker build --platform linux/amd64 -t ${DOCKER_USER}/devops-spa-backend:latest -f backend/Dockerfile backend/
                        docker push ${DOCKER_USER}/devops-spa-backend:latest
                    """
                }
            }
        }

        // ── 3. Deploy to K3s node via SSH ───────────────────────────────────
        stage('Deploy') {
            steps {
                sshagent(['aws-ec2-key']) {

                    // Ensure the k8s directory exists on the remote node
                    sh "ssh -o StrictHostKeyChecking=no ec2-user@${EC2_IP} 'mkdir -p /home/ec2-user/k8s'"

                    // Copy all Kubernetes manifests to the node
                    sh "scp -o StrictHostKeyChecking=no k8s/*.yaml ec2-user@${EC2_IP}:/home/ec2-user/k8s/"

                    // Apply all manifests (k3s embeds kubectl as 'k3s kubectl')
                    sh """
                        ssh -o StrictHostKeyChecking=no ec2-user@${EC2_IP} '
                            k3s kubectl apply -f /home/ec2-user/k8s/
                            k3s kubectl rollout status deployment/backend-deployment  --timeout=120s
                            k3s kubectl rollout status deployment/frontend-deployment --timeout=120s
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful — frontend available at http://${EC2_IP}:30080"
        }
        failure {
            echo "Pipeline failed. Check logs above for details."
        }
    }
}