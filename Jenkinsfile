node {
  try {
    stage('Checkout') {
      checkout scm
    }
    stage('Environment') {
      sh 'git --version'
      echo "Branch: ${env.BRANCH_NAME}"
      sh 'docker -v'
      sh 'printenv'
    }
    stage('Build Docker test'){
     sh 'docker build -t AdManager-test -f Dockerfile.test --no-cache .'
    }
    stage('Docker test'){
      sh 'docker run --rm AdManager-test'
    }
    stage('Clean Docker test'){
      sh 'docker rmi AdManager-test'
    }
    stage('Deploy'){
      if(env.BRANCH_NAME == 'master'){
        sh 'docker build -t AdManager --no-cache .'
        sh 'docker tag AdManager localhost:5000/AdManager'
        sh 'docker push localhost:5000/AdManager'
        sh 'docker rmi -f AdManager localhost:5000/AdManager'
      }
    }
  }
  catch (err) {
    throw err
  }
}