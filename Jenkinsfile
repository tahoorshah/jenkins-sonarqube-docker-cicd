pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'sample-node-app'
        DOCKER_TAG = "${BUILD_NUMBER}"
        SONARQUBE_SERVER = 'SonarQube'
    }
    stages {
        stage('Checkout') {
            steps {
                sh '''
                rm -rf workspace-temp
                cp -r /var/lib/jenkins/sample-app workspace-temp
                '''
            }
        }
        stage('SonarQube Analysis') {
            steps {
                dir('workspace-temp') {
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        script {
                            def scannerHome = tool 'sonar-scanner'
                            sh """
                            \${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=sample-node-app \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://localhost:9000 \
                            -Dsonar.exclusions=node_modules/**,tests/**
                            """
                        }
                    }
                }
            }
        }
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }
        stage('Build Image') {
            steps {
                dir('workspace-temp') {
                    sh '''
                    docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                    docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                    '''
                }
            }
        }
        stage('Smoke Test') {
            steps {
                sh '''
                docker run -d --name test-${BUILD_NUMBER} -p 3001:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}
                sleep 12
                curl -sf http://localhost:3001/health || exit 1
                echo "Smoke test passed."
                '''
            }
            post {
                always {
                    sh "docker stop test-${BUILD_NUMBER} || true; docker rm test-${BUILD_NUMBER} || true"
                }
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                docker stop sample-app-prod || true
                docker rm sample-app-prod || true
                docker run -d --name sample-app-prod \
                --restart unless-stopped \
                -p 3000:3000 \
                -e APP_VERSION=${DOCKER_TAG} \
                ${DOCKER_IMAGE}:${DOCKER_TAG}
                echo "Deployed: http://localhost:3000"
                '''
            }
        }
    }
    post {
        always {
            sh '''
            docker images ${DOCKER_IMAGE} \
            --format "\\{\\{.Repository\\}\\}:\\{\\{.Tag\\}\\}" \
            | tail -n +6 | xargs -r docker rmi || true
            '''
        }
        success { echo "Build ${BUILD_NUMBER} deployed." }
        failure { echo "Build ${BUILD_NUMBER} FAILED." }
    }
}
