pipeline {
  agent any

  environment {
    IMAGE_NAME     = "your-dockerhub-username/research-app"
    IMAGE_TAG      = "${BUILD_NUMBER}"
    KUBECONFIG     = credentials('kubeconfig')          
    DOCKERHUB_CRED = credentials('dockerhub-creds')
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Test') {
      steps {
        sh 'npm ci'
        sh 'npm test'
      }
    }

    stage('Docker Build') {
      steps {
        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
      }
    }

    stage('Docker Push') {
      steps {
        sh "echo ${DOCKERHUB_CRED_PSW} | docker login -u ${DOCKERHUB_CRED_USR} --password-stdin"
        sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
        sh "docker push ${IMAGE_NAME}:latest"
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        // Apliko ConfigMap dhe Secrets (nëse ndryshojnë)
        sh "kubectl apply -f k8s/base/secrets.yaml"
        sh "kubectl apply -f k8s/base/configmap.yaml"

        // Apliko shërbimet e infrastrukturës
        sh "kubectl apply -f k8s/base/postgres-deployment.yaml"
        sh "kubectl apply -f k8s/base/redis-deployment.yaml"
        sh "kubectl apply -f k8s/base/mongo-deployment.yaml"
        sh "kubectl apply -f k8s/base/kafka-deployment.yaml"

        // Përditëso image-in e backend-it me tag-un e ri
        sh "kubectl set image deployment/backend backend=${IMAGE_NAME}:${IMAGE_TAG}"

        // Nëse nuk ekziston ende, apliko deployment-in e plotë
        sh "kubectl apply -f k8s/base/backend-deployment.yaml"

        // Prit derisa rollout të përfundojë
        sh "kubectl rollout status deployment/backend --timeout=120s"
      }
    }
  }

  post {
    success {
      echo "Deploy u krye me sukses! Image: ${IMAGE_NAME}:${IMAGE_TAG}"
    }
    failure {
      echo "Pipeline dështoi. Shiko logjet më lart."
      sh "kubectl rollout undo deployment/backend || true"
    }
    always {
      sh "docker logout || true"
    }
  }
}
