pipeline {
    agent any

    environment {
        SSH_KEY_ID = 'ec2-ssh-key'
        DISCORD_WEBHOOK_URL = credentials('discord-backend')
        BACKEND_EC2_IP = credentials('backend-ec2-ip')
        GITHUB_REPO = credentials('github-back-url')
        DB_HOST = credentials('db-host')
        DB_PORT = credentials('db-port')
        DB_USER = credentials('db-user')
        DB_PASSWORD = credentials('db-password')
        DB_DATABASE = credentials('db-name')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "📦 GitHub에서 소스 코드 클론/업데이트"
                    sshagent([env.SSH_KEY_ID]) {
                        sh """
ssh -o StrictHostKeyChecking=no ubuntu@${env.BACKEND_EC2_IP} <<EOF
mkdir -p ~/node-backend
cd ~/node-backend

if [ ! -d ".git" ]; then
  git clone ${env.GITHUB_REPO} .
else
  git reset --hard
  git clean -fd
  git pull origin main
fi
EOF
"""
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo "🔧 빌드 시작"
                    sshagent([env.SSH_KEY_ID]) {
                        sh """
ssh -o StrictHostKeyChecking=no ubuntu@${env.BACKEND_EC2_IP} <<EOF
cd ~/node-backend
rm -rf dist
npm ci
npm run build
EOF
"""
                    }
                }
            }
        }

        stage('PM2 Deploy') {
            steps {
                script {
                    echo "🚀 PM2 clean start"
                    sshagent([env.SSH_KEY_ID]) {
                        sh """
ssh -o StrictHostKeyChecking=no ubuntu@${env.BACKEND_EC2_IP} <<EOF
cd ~/node-backend

# .env 파일이 없을 경우에만 생성
if [ ! -f .env ]; then
  echo "DB_HOST=${env.DB_HOST}" > .env
  echo "DB_PORT=${env.DB_PORT}" >> .env
  echo "DB_USER=${env.DB_USER}" >> .env
  echo "DB_PASSWORD=${env.DB_PASSWORD}" >> .env
  echo "DB_DATABASE=${env.DB_DATABASE}" >> .env
fi

# PM2 clean start
pm2 delete backend-api || true
pm2 start dist/index.js --name backend-api
pm2 save
EOF
"""
                    }
                }
            }
        }

        stage('Notify') {
            steps {
                script {
                    echo "📢 디스코드 알림 전송"
                    sh """
curl -X POST -H "Content-Type: application/json" -d '{
  "content": "✅ 백엔드 PM2 자동 배포 성공!"
}' ${env.DISCORD_WEBHOOK_URL}
"""
                }
            }
        }
    }

    post {
        failure {
            echo "❌ 배포 실패"
            sh """
curl -X POST -H "Content-Type: application/json" -d '{
  "content": "❌ 백엔드 PM2 자동 배포 실패!"
}' ${env.DISCORD_WEBHOOK_URL}
"""
        }
        always {
            echo "✅ Jenkins 파이프라인 종료"
        }
    }
}
