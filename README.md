# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



# Welcome to Jenkins

**Jenkins** is a powerful open-source automation server used to streamline the software development lifecycle through Continuous Integration (CI) and Continuous Delivery (CD).

## Key Features

- **Continuous Integration (CI)**:
  Automate the building, testing, and validation of code changes.
- **Continuous Delivery (CD)**:
  Automate the release process to ensure code is always in a deployable state.
- **Pipeline as Code**:
  Define your entire delivery pipeline in a `Jenkinsfile` using Groovy scripts.
- **Extensible**:
  Thousands of plugins available to integrate with virtually any tool or technology.

## Getting Started

### 1. Trigger a Build Manually

- Navigate to the **Jenkins Dashboard**.
- Click on **"Build Now"** in the left-hand menu.
- Select your pipeline and specify any parameters (if required).

### 2. Pipeline Syntax (Jenkinsfile)

Jenkins pipelines are defined in a `Jenkinsfile` at the root of your repository.

**Example `Jenkinsfile`:**
```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }

        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying...'
                // Deployment steps would go here
            }
        }
    }
}
```

### 3. Monitor Your Builds

- Click on the **Pipeline Name** on the dashboard.
- Select **"#1"** (or the build number) to view the execution log.
- Use the **Blue Ocean** interface for a modern, visual representation of your pipeline.

### 4. Common Operations

- **Delete Build**: Click **"Delete Pipeline"** from the project page.
- **Archive Artifacts**: Add `archiveArtifacts artifacts: 'target/*.jar'` to your Jenkinsfile to save build outputs.
- **View Logs**: Click **"Console Output"** on any build to see detailed logs.

## Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Jenkins Blue Ocean](https://www.jenkins.io/projects/blueocean/)