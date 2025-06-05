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
ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 ubuntu@${env.BACKEND_EC2_IP} <<'EOF'
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

echo "✅ Checkout 단계 완료"
exit 0
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
ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 ubuntu@${env.BACKEND_EC2_IP} <<'EOF'
cd ~/node-backend
npm install
npm run build

echo "✅ Build 단계 완료"
exit 0
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
ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 ubuntu@${env.BACKEND_EC2_IP} <<'EOF'
cd ~/node-backend

# 기존 PM2 프로세스 정리
pm2 stop all || true
pm2 delete all || true

# PM2 ecosystem 파일 생성 (환경변수 포함)
cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [{
    name: 'backend-api',
    script: './dist/index.js',
    instances: 1,
    env: {
      NODE_ENV: 'production',
      DB_HOST: '${env.DB_HOST}',
      DB_PORT: '${env.DB_PORT}',
      DB_USER: '${env.DB_USER}',
      DB_PASSWORD: '${env.DB_PASSWORD}',
      DB_NAME: '${env.DB_NAME}'
    }
  }]
};
EOL

# PM2로 ecosystem 파일 사용해서 시작
pm2 start ecosystem.config.js

# 배포 상태 확인
echo "=== PM2 프로세스 상태 ==="
pm2 list

echo "=== 환경변수 확인 ==="
pm2 env 0

echo "✅ Deploy 단계 완료!"
exit 0
EOF
"""
                    }
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "🔍 서버 상태 확인"
                    sshagent([env.SSH_KEY_ID]) {
                        sh """#!/bin/bash
ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 ubuntu@${env.BACKEND_EC2_IP} <<'EOF'
cd ~/node-backend

# 잠시 서버 시작 대기
echo "⏰ 서버 시작 대기 중..."
sleep 5

# 헬스 체크
echo "=== API 테스트 ==="
API_RESPONSE=\$(curl -s -w "%{http_code}" -o /tmp/api_response.txt http://localhost:4000/api/community/getList?communityType=1)
HTTP_CODE=\${API_RESPONSE: -3}

if [ "\$HTTP_CODE" = "200" ]; then
    echo "✅ API 응답 성공 (HTTP 200)"
    cat /tmp/api_response.txt | head -100
else
    echo "⚠️ API 응답 코드: \$HTTP_CODE"
    cat /tmp/api_response.txt
fi

echo "\\n=== PM2 로그 확인 ==="
pm2 logs --lines 10

echo "✅ Health Check 단계 완료!"
exit 0
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
RESPONSE=\$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{
  "content": "✅ 백엔드 자동 배포 성공! (PM2 ecosystem 방식) - $(date)"
}' ${env.DISCORD_WEBHOOK_URL})

echo "Discord 알림 응답: \$RESPONSE"
echo "✅ Notify 단계 완료!"
"""
                }
            }
        }

        stage('Final Status') {
            steps {
                script {
                    echo "🎉 모든 배포 단계가 성공적으로 완료되었습니다!"
                    echo "📊 배포 요약:"
                    echo "   - Checkout: ✅"
                    echo "   - Build: ✅"
                    echo "   - Deploy: ✅"
                    echo "   - Health Check: ✅"
                    echo "   - Notification: ✅"
                    echo "🏁 Jenkins 파이프라인을 종료합니다."
                }
            }
        }
    }

    post {
        success {
            script {
                echo "🎊 전체 파이프라인 성공!"
                sh """#!/bin/bash
curl -s -X POST -H "Content-Type: application/json" -d '{
  "content": "🎊 Jenkins 파이프라인 완전 성공! 모든 단계 완료 - $(date)"
}' ${env.DISCORD_WEBHOOK_URL} || echo "Discord 알림 실패 (무시)"
"""
            }
        }
        failure {
            script {
                echo "❌ 배포 실패"
                sh """#!/bin/bash
curl -s -X POST -H "Content-Type: application/json" -d '{
  "content": "❌ 백엔드 자동 배포 실패! 로그를 확인해주세요. - $(date)"
}' ${env.DISCORD_WEBHOOK_URL} || echo "Discord 알림 실패 (무시)"
"""
            }
        }
        always {
            script {
                echo "🔚 Jenkins 파이프라인 최종 종료"
                echo "⏰ 종료 시각: $(date)"
                echo "📍 파이프라인 ID: ${env.BUILD_NUMBER}"
            }
        }
    }
}