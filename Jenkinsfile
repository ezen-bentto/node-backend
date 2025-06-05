pipeline {
    agent any

    environment {
        SSH_KEY_ID = 'ec2-ssh-key'                     // 크리덴셜 ID 문자열 (SSH 키용)
        DISCORD_WEBHOOK_URL = credentials('discord-backend')
        BACKEND_EC2_IP = credentials('backend-ec2-ip')
        GITHUB_REPO = credentials('github-back-url')
        DB_HOST = credentials('db-host')
        DB_PORT = credentials('db-port')
        DB_USER = credentials('db-user')
        DB_PASSWORD = credentials('db-password')
        DB_NAME = credentials('db-name')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "📦 GitHub에서 소스 코드 클론/업데이트"
                    sshagent([env.SSH_KEY_ID]) {
                        sh """#!/bin/bash
ssh -o StrictHostKeyChecking=no ubuntu@${env.BACKEND_EC2_IP} <<EOF
mkdir -p ~/node-backend
cd ~/node-backend

if [ ! -d ".git" ]; then
  echo "Git repository not found. Cloning repository."
  git clone ${env.GITHUB_REPO} .
else
  echo "Git repository found. Pulling latest changes."
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
                        sh """#!/bin/bash
ssh -o StrictHostKeyChecking=no ubuntu@${env.BACKEND_EC2_IP} <<EOF
cd ~/node-backend
npm install
npm run build
EOF
"""
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "🚀 배포 시작"
                    sshagent([env.SSH_KEY_ID]) {
                        sh """#!/bin/bash
ssh -o StrictHostKeyChecking=no ubuntu@${env.BACKEND_EC2_IP} <<EOF
cd ~/node-backend
pkill -f 'node /home/ubuntu/node-backend/*.js' || true
nohup node /home/ubuntu/node-backend/dist/index.js > /dev/null 2>&1 &
echo "배포 완료!"
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
                    sh """#!/bin/bash
curl -X POST -H "Content-Type: application/json" -d '{
  "content": "✅ 백엔드 자동 배포 성공!"
}' ${env.DISCORD_WEBHOOK_URL}
"""
                }
            }
        }
    }

    post {
        failure {
            echo "❌ 배포 실패"
            sh """#!/bin/bash
curl -X POST -H "Content-Type: application/json" -d '{
  "content": "❌ 백엔드 자동 배포 실패!"
}' ${env.DISCORD_WEBHOOK_URL}
"""
        }
        always {
            echo "✅ Jenkins 파이프라인 종료"
        }
    }
}
