# 🪴 GitGardener - 깃허브 잔디 관리

## 프로젝트 개요
GitGardener는 GitHub 계정을 활용하여 매일 저녁 10시를 기준으로 사용자의 잔디 상태를 관리하고, 커밋을 하지 않은 날에는 알림 이메일을 발송하여 꾸준한 개발 습관을 유도합니다.

---

## 주요 기능
1. **GitHub 로그인 (OAuth2)**:
   - 사용자는 GitHub 계정을 통해 간단히 로그인할 수 있습니다.
   - OAuth2 인증으로 안전하게 사용자 정보를 관리합니다.
   
2. **커밋 현황 대시보드**:
   - 최근 4주간의 커밋 내역을 시각적으로 확인할 수 있습니다.
   - 오늘 날짜는 빨간색으로 강조 표시됩니다.
   - GitHub GraphQL API를 통해 실시간 커밋 데이터를 가져옵니다.

3. **일일 커밋 체크 및 알림**:
   - 매일 저녁 22시(오후 10시)에 자동으로 당일 커밋 여부를 확인합니다.
   - 커밋을 하지 않은 경우 설정된 이메일로 알림을 발송합니다.
   - Spring Boot의 스케줄러를 활용한 자동화된 알림 시스템입니다.

4. **이메일 알림 서비스**:
   - JavaMailSender를 통한 안정적인 이메일 발송 기능을 제공합니다.
   - 커밋 누락 시 개인화된 알림 메시지를 전송합니다.

---

## 기술 스택
- **프론트엔드**:
  - React 18
  - React Context (상태 관리)
  - CSS3 (스타일링)
  
- **백엔드**:
  - Spring Boot 3
  - Spring Security OAuth2
  - Spring Mail (JavaMailSender)
  - Spring Scheduling (@Scheduled)
  - Gradle (빌드 도구)
  
- **외부 API**:
  - GitHub OAuth2 API (인증)
  - GitHub GraphQL API (커밋 데이터 조회)
  
- **개발 도구**:
  - Node.js & npm (프론트엔드 패키지 관리)
  - Gradle (백엔드 의존성 관리)

---

## 시스템 아키텍처
```mermaid
graph TD
    User["사용자"]
    Browser["웹 브라우저 (React)"]
    Server["백엔드 서버 (Spring Boot)"]
    GitHub["GitHub API (OAuth2 및 GraphQL)"]
    EmailService["이메일 서비스 (JavaMailSender)"]
    Scheduler["스케줄러 (매일 22시)"]
    
    User -->|GitHub 로그인| Browser
    Browser -->|REST API 호출| Server
    Server -->|OAuth2 인증| GitHub
    Server -->|GraphQL 데이터 조회| GitHub
    Server -->|커밋 현황 데이터| Browser
    Browser -->|대시보드 표시| User
    Scheduler -->|일일 커밋 체크| Server
    Server -->|커밋 확인| GitHub
    Server -->|알림 이메일 발송| EmailService
    EmailService -->|이메일 전송| User
```

---

## 플로우 차트
```mermaid
flowchart TD
    Start["사용자 웹사이트 접속"]
    Login["GitHub OAuth2 로그인"]
    Dashboard["대시보드 진입"]
    ViewCommits["최근 4주 커밋 현황 확인"]
    DailyCheck["매일 22시 자동 체크"]
    HasCommit{"오늘 커밋 여부"}
    SendEmail["알림 이메일 발송"]
    NoAction["알림 없음"]
    End["작업 완료"]

    Start --> Login
    Login -->|인증 성공| Dashboard
    Dashboard --> ViewCommits
    ViewCommits --> End
    
    DailyCheck --> HasCommit
    HasCommit -->|커밋 없음| SendEmail
    HasCommit -->|커밋 있음| NoAction
    SendEmail --> End
    NoAction --> End
```

---

## 시퀀스 다이어그램
```mermaid
sequenceDiagram
    participant User as 사용자
    participant Frontend as 프론트엔드 (React)
    participant Backend as 백엔드 (Spring Boot)
    participant GitHub as GitHub API
    participant Scheduler as 스케줄러
    participant EmailService as 이메일 서비스

    Note over User, GitHub: 사용자 로그인 및 대시보드
    User ->> Frontend: GitHub 로그인 요청
    Frontend ->> Backend: OAuth2 인증 요청
    Backend ->> GitHub: 인증 토큰 요청
    GitHub -->> Backend: 인증 토큰 반환
    Backend -->> Frontend: 로그인 성공 상태 반환
    
    Frontend ->> Backend: 커밋 현황 요청
    Backend ->> GitHub: GraphQL로 최근 4주 커밋 데이터 조회
    GitHub -->> Backend: 커밋 현황 데이터 반환
    Backend -->> Frontend: 커밋 현황 데이터 반환
    Frontend -->> User: 대시보드에 커밋 현황 표시

    Note over Scheduler, EmailService: 매일 22시 자동 알림
    Scheduler ->> Backend: 일일 커밋 체크 실행
    Backend ->> GitHub: 오늘의 커밋 여부 확인
    GitHub -->> Backend: 커밋 데이터 반환
    alt 커밋이 없는 경우
        Backend ->> EmailService: 알림 이메일 발송 요청
        EmailService ->> User: 커밋 알림 이메일 전송
    end
```

---

## 사용 방법

### 1. GitHub 로그인
웹사이트에 접속하여 "GitHub 계정으로 로그인" 버튼을 클릭합니다.

<img width="484" alt="스크린샷 2024-12-09 오후 10 38 53" src="https://github.com/user-attachments/assets/18beeece-ff65-49a6-aad9-c24985fd2da4">

OAuth2 인증을 통해 GitHub 계정을 안전하게 연결합니다.

<img width="986" alt="스크린샷 2024-12-09 오후 10 41 49" src="https://github.com/user-attachments/assets/f1dd9684-4b74-41c2-a9fa-9940e162d78e">

### 2. 대시보드 확인
로그인 성공 후 대시보드에서 다음과 같은 정보를 확인할 수 있습니다:

- **최근 4주간의 커밋 내역**: GitHub에서 실시간으로 가져온 커밋 데이터를 시각적으로 표시
- **오늘 날짜 강조**: 현재 날짜는 빨간색으로 표시되어 쉽게 확인 가능
- **로그아웃 옵션**: 
  - "애플리케이션 로그아웃": 앱에서만 로그아웃
  - GitHub 로그아웃 링크: GitHub 계정에서도 완전히 로그아웃

<img width="469" alt="스크린샷 2024-12-18 오후 5 52 18" src="https://github.com/user-attachments/assets/56b42a88-e06f-4228-b445-56f00a16eb3a" />

### 3. 자동 알림 시스템
- **매일 22시 자동 체크**: 서버에서 자동으로 당일 커밋 여부를 확인합니다.
- **이메일 알림**: 커밋을 하지 않은 날에는 등록된 이메일로 알림을 발송합니다.
- **개인화된 메시지**: "[GitGardener] 커밋 안했어요." 제목으로 친근한 알림을 받을 수 있습니다.

---

## 실행 방법

### 백엔드 실행
```bash
cd backend
./gradlew bootRun
```

### 프론트엔드 실행
```bash
cd frontend
npm install
npm start
```

---

## 배포 URL

---

## 문의
- 프로젝트 관련 문의: **star901210@hanmail.net**
- GitHub Repository: [https://github.com/CodeOnLeo/git-gardner](https://github.com/CodeOnLeo/git-gardner)