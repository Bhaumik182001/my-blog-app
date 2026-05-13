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
  * `pages/` - Home, About, and Contact views
  * `components/` - UI Components
  * `main.jsx` - React Entry Point
* `public/` - Static Assets & SVGs
* `Dockerfile` - Multi-stage build instructions for Node + Nginx
* `nginx.conf` - Custom Nginx configuration for SPA routing
* `package.json` - Node dependencies and build scripts
* `tailwind.config.js` - Tailwind CSS configuration
* `README.md` - Project documentation

*(Note: Infrastructure files like `main.tf`, `Jenkinsfile`, and `docker-compose.yml` are managed alongside this repository for the complete pipeline).*

---

## ⚙️ Deployment & Execution Guide

### 1. Infrastructure Provisioning (Terraform)
This project uses Terraform to eliminate manual cloud configuration.
1. Ensure the AWS CLI is configured locally with valid IAM credentials.
2. Navigate to the directory containing `main.tf`.
3. Initialize the Terraform backend and review the execution plan:
   > terraform init
   > terraform plan
4. Provision the AWS environment (EC2, Security Groups, Docker installation script):
   > terraform apply -auto-approve

### 2. Containerization (Local Validation)
To build and test the multi-stage Docker container locally before pushing to the pipeline:

> docker build -t devops-spa .
> docker run -d -p 8080:80 devops-spa

*Note: The included `nginx.conf` features a `try_files` directive explicitly designed to route all unhandled requests to `index.html`, ensuring seamless React Router navigation without 404 errors.*

### 3. Continuous Integration & Deployment (Jenkins)
The CI/CD pipeline is handled by a containerized Jenkins instance. 
1. A GitHub Webhook is configured (via an Ngrok tunnel) to trigger the pipeline on a push to the `main` branch.
2. The pipeline executes the following stages:
   * **Stage 1 (Checkout):** Pulls the latest code from GitHub.
   * **Stage 2 (Build):** Executes the multi-stage Docker build.
   * **Stage 3 (Deploy):** SSHs into the Terraform-provisioned AWS EC2 instance, stops the old container, and starts the newly built image on Port 80.

### 4. Observability Stack
To ensure high availability and performance tracking, the infrastructure includes a monitoring stack deployed alongside the web application:
* **cAdvisor:** Attached to the Docker daemon to expose container resource usage.
* **Prometheus:** Configured to scrape cAdvisor metrics at regular intervals.
* **Grafana:** Connected to Prometheus as a data source, providing visual dashboards for instance RAM, CPU load, and network traffic.

---

## 👨‍💻 Author
**Bhaumik**
*Software Developer | Cloud Infrastructure & DevOps*
