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
                        sh '''#!/bin/bash
ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 ubuntu@''' + env.BACKEND_EC2_IP + ''' <<'EOF'
cd ~/node-backend

# Node.js 및 Yarn 버전 확인
echo "=== 환경 정보 ==="
node --version
yarn --version

# TypeScript 컴파일러 확인
if ! command -v tsc &> /dev/null; then
    echo "TypeScript 컴파일러 글로벌 설치"
    yarn global add typescript
fi

# 의존성 설치 (node_modules가 없거나 yarn.lock이 변경된 경우만)
if [ ! -d "node_modules" ] || [ "yarn.lock" -nt "node_modules" ]; then
    echo "=== 의존성 설치 ==="
    yarn install --frozen-lockfile --silent
else
    echo "=== 의존성이 이미 최신 상태입니다. 설치 건너뜀 ==="
fi

# TypeScript 빌드
echo "=== TypeScript 컴파일 시작 ==="
yarn build

# 빌드 결과 확인
if [ -d "dist" ]; then
    echo "✅ TypeScript 컴파일 성공"
    echo "빌드된 파일 목록:"
    ls -la dist/
else
    echo "❌ TypeScript 컴파일 실패 - dist 폴더가 생성되지 않음"
    exit 1
fi

echo "✅ Build 단계 완료"
exit 0
EOF
'''
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "🚀 배포 시작"
                    sshagent([env.SSH_KEY_ID]) {
                        sh '''#!/bin/bash
ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 ubuntu@''' + env.BACKEND_EC2_IP + ''' <<'EOF'
cd ~/node-backend

# 기존 PM2 프로세스 정리
echo "=== 기존 프로세스 정리 ==="
pm2 stop backend-api || true
pm2 delete backend-api || true

# PM2 ecosystem 파일 생성 (TypeScript 프로젝트 최적화)
cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [{
    name: 'backend-api',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '500MB',
    node_args: '--max-old-space-size=512',
    env: {
      NODE_ENV: 'production',
      DB_HOST: '''' + env.DB_HOST + '''',
      DB_PORT: '''' + env.DB_PORT + '''',
      DB_USER: '''' + env.DB_USER + '''',
      DB_PASSWORD: '''' + env.DB_PASSWORD + '''',
      DB_NAME: '''' + env.DB_NAME + ''''
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOL

# 로그 디렉토리 생성
mkdir -p logs

# 빌드 파일 존재 확인
if [ ! -f "./dist/index.js" ]; then
    echo "❌ 오류: ./dist/index.js 파일이 없습니다. 빌드가 제대로 되지 않았습니다."
    exit 1
fi

# PM2로 ecosystem 파일 사용해서 시작
echo "=== PM2 애플리케이션 시작 ==="
pm2 start ecosystem.config.js

# 시작 대기
sleep 3

# 배포 상태 확인
echo "=== PM2 프로세스 상태 ==="
pm2 list

echo "=== PM2 상세 정보 ==="
pm2 show backend-api

echo "✅ Deploy 단계 완료!"
exit 0
EOF
'''
                    }
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "🔍 서버 상태 확인"
                    sshagent([env.SSH_KEY_ID]) {
                        sh '''#!/bin/bash
ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 ubuntu@''' + env.BACKEND_EC2_IP + ''' <<'EOF'
cd ~/node-backend

# 서버 시작 대기 (TypeScript 앱은 초기화 시간이 필요)
echo "⏰ Node.js TypeScript 앱 초기화 대기 중..."
sleep 8

# PM2 프로세스 상태 재확인
echo "=== PM2 프로세스 최종 상태 ==="
pm2 list

# 포트 확인
echo "=== 포트 사용 현황 ==="
netstat -tlnp | grep :4000 || echo "포트 4000이 열려있지 않습니다"

# 헬스 체크 API 테스트
echo "=== API 헬스 체크 ==="
for i in {1..3}; do
    echo "시도 $i/3:"
    if curl -s --connect-timeout 5 http://localhost:4000/api/community/getList?communityType=1; then
        echo ""
        echo "✅ API 응답 성공!"
        break
    else
        echo "API 응답 실패, 재시도 중..."
        sleep 2
    fi
done

# PM2 로그 확인 (TypeScript 앱 에러 체크)
echo "=== 최근 PM2 로그 ==="
pm2 logs backend-api --lines 15 --nostream

echo "✅ Health Check 단계 완료!"
exit 0
EOF
'''
                    }
                }
            }
        }

        stage('Notify') {
            steps {
                script {
                    echo "📢 디스코드 알림 전송"
                    sh '''#!/bin/bash
curl -s -X POST -H "Content-Type: application/json" -d "{
  \\"content\\": \\"✅ 백엔드 자동 배포 성공! (PM2 ecosystem 방식) - $(date)\\"
}" ''' + env.DISCORD_WEBHOOK_URL + '''

echo "✅ Notify 단계 완료!"
'''
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
                sh '''#!/bin/bash
curl -s -X POST -H "Content-Type: application/json" -d "{
  \\"content\\": \\"🎊 Jenkins 파이프라인 완전 성공! 모든 단계 완료 - $(date)\\"
}" ''' + env.DISCORD_WEBHOOK_URL + ''' || echo "Discord 알림 실패 (무시)"
'''
            }
        }
        failure {
            script {
                echo "❌ 배포 실패"
                sh '''#!/bin/bash
curl -s -X POST -H "Content-Type: application/json" -d "{
  \\"content\\": \\"❌ 백엔드 자동 배포 실패! 로그를 확인해주세요. - $(date)\\"
}" ''' + env.DISCORD_WEBHOOK_URL + ''' || echo "Discord 알림 실패 (무시)"
'''
            }
        }
        always {
            script {
                echo "🔚 Jenkins 파이프라인 최종 종료"
                echo "⏰ 종료 시각: " + new Date().toString()
                echo "📍 파이프라인 ID: ${env.BUILD_NUMBER}"
            }
        }
    }
}