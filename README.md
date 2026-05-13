# 🚀 Enterprise DevOps Pipeline: EngBlog SPA

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)

## 📌 Project Overview
This repository demonstrates a production-grade, zero-downtime DevOps lifecycle. Instead of focusing on heavy application logic, this project utilizes a **"Thin Slice" architectural approach**: a lightweight, high-performance Single Page Application (React/Vite) acts as the payload to showcase a fully automated, scalable, and monitored cloud infrastructure.

The pipeline covers the entire software development lifecycle (SDLC), from Infrastructure as Code (IaC) and containerization to automated CI/CD deployments and real-time observability.

## 🎓 Academic Alignment (INT377)
This project was strictly engineered to demonstrate mastery of essential Cloud Computing and DevOps principles:
* **CO1 & CO2 (Containerization):** Implemented via a highly optimized, multi-stage Docker build utilizing Alpine Linux and Nginx.
* **CO3 (Infrastructure as Code):** Cloud provisioning is entirely automated using HashiCorp Terraform targeting AWS EC2.
* **CO4 (CI/CD Pipelines):** A Jenkins declarative pipeline, triggered by GitHub Webhooks, automates the build and deployment process.
* **CO5 (Observability):** Container health and system metrics are actively scraped by Prometheus and visualized via a Grafana dashboard.

---

## 🏗️ Architecture & Flow
1. **Version Control:** Developer pushes code to the `main` branch on GitHub.
2. **Infrastructure (Terraform):** An AWS EC2 `t2.micro` instance and corresponding Security Groups (allowing HTTP and SSH) are provisioned via code.
3. **CI/CD Build (Jenkins):** Jenkins catches the GitHub Webhook, clones the repository, and initiates the build pipeline.
4. **Containerization (Docker):** A multi-stage build triggers:
    * *Stage 1 (Node):* Installs dependencies and compiles the React application (`npm run build`).
    * *Stage 2 (Nginx):* Copies the static `dist` files and a custom `nginx.conf` (designed to resolve SPA routing issues) into an ultra-lightweight Alpine container.
5. **Deployment:** The container is securely deployed and run on the AWS EC2 instance.
6. **Observability:** `cAdvisor` exposes container resource usage, **Prometheus** aggregates the metrics, and **Grafana** provides a real-time visualization of CPU/Memory utilization.

---

## 🛠️ Technology Stack

### Application
* **Frontend:** React.js (v19), Vite, Tailwind CSS
* **Web Server:** Nginx (Alpine)

### DevOps & Infrastructure
* **Containerization:** Docker (Multi-stage builds)
* **Infrastructure as Code (IaC):** HashiCorp Terraform
* **Cloud Provider:** Amazon Web Services (AWS EC2, Security Groups)
* **CI/CD:** Jenkins, GitHub Webhooks, Ngrok (for local tunneling)
* **Monitoring & Observability:** cAdvisor, Prometheus, Grafana

---

## 📁 Repository Structure

* `src/` - React Application Source Code (EngBlog)
* `public/` - Static Assets & SVGs
* `Dockerfile` - Multi-stage build instructions for Node + Nginx
* `nginx.conf` - Custom Nginx configuration for SPA routing
* `main.tf` - Terraform Infrastructure as Code script
* `Jenkinsfile` - Declarative CI/CD pipeline definition
* `package.json` - Node dependencies and build scripts

---

## 🚀 Quick Start & Setup Guide

This guide provides step-by-step instructions to reproduce this DevOps pipeline from scratch.

### Prerequisites
Ensure the following tools are installed on your local machine:
* Git
* Docker Desktop
* HashiCorp Terraform
* AWS CLI (configured with valid IAM credentials via `aws configure`)
* Ngrok (for local Jenkins tunneling)

### Step 1: Local Setup & Validation
Clone the repository and verify the multi-stage Docker build locally.

git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
docker build -t devops-spa .
docker run -d -p 8080:80 devops-spa

Navigate to `http://localhost:8080` in your browser to verify the React application is running correctly behind the Nginx web server.

### Step 2: Infrastructure Provisioning (Terraform)
Automate the creation of the AWS environment. The `main.tf` script will provision a `t2.micro` instance, configure security groups (ports 80, 22), and automatically install Docker upon boot.

terraform init
terraform plan
terraform apply -auto-approve

*Take note of the public AWS IP address outputted at the end of the Terraform run.*

### Step 3: CI/CD Pipeline Configuration (Jenkins)
Ensure you have a Jenkins instance running (either locally via Docker or hosted).

1. **Expose Local Jenkins (If applicable):** Run `ngrok http 8080` to generate a public URL for your local Jenkins container.
2. **Configure GitHub Webhook:** In your GitHub repository settings, navigate to Webhooks. Add your Jenkins URL (e.g., `https://your-ngrok-url.app/github-webhook/`) and set the Content type to `application/json`.
3. **Create Jenkins Pipeline:** Create a new Pipeline project in Jenkins, connect it to your GitHub repository, and point it to the `Jenkinsfile`.
4. **Trigger Deployment:** Push a code change to the `main` branch. Jenkins will automatically intercept the webhook, build the new Docker image, and SSH into the AWS EC2 instance to deploy it.

### Step 4: Observability & Monitoring
Once the application is deployed, the monitoring stack (cAdvisor, Prometheus, Grafana) will initialize alongside it.

1. Navigate to `http://YOUR_AWS_IP:3000` to access the Grafana dashboard.
2. Add Prometheus (`http://YOUR_AWS_IP:9090`) as the data source.
3. Import the standard Docker Monitoring dashboard to visualize real-time infrastructure metrics.

---

## 👨‍💻 Author
**Bhaumik**
*Software Developer | Cloud Infrastructure & DevOps*
