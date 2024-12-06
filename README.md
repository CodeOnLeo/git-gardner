# 🪴 GitGardener - 깃허브 잔디 관리

## 프로젝트 개요
GitGardener는 GitHub 계정을 활용하여 매일 저녁 10시를 기준으로 사용자의 잔디 상태를 관리하고, 알림 이메일을 발송하여 커밋을 유도합니다.

---

## 주요 기능
1. **GitHub 로그인 (OAuth2)**:
   - 사용자는 GitHub 계정을 통해 간단히 로그인할 수 있습니다.
   - OAuth2 인증으로 안전하게 사용자 정보를 관리합니다.
   
2. **이메일 입력 및 알림 설정**:
   - 알림 이메일 주소를 설정하여 커밋 알림을 받을 수 있습니다.
   - 간단한 이메일 입력 폼을 제공하며, 추가 정보 입력은 필요하지 않습니다.

---

## 기술 스택
- **프론트엔드**:
  - React
- **백엔드**:
  - Spring Boot
  - Spring Security OAuth2
- **배포**:
  - 통합 배포
- **API**:
  - GitHub GraphQL API

---

## 시스템 아키텍처
```mermaid
graph TD
    User["사용자"]
    Browser["웹 브라우저 (React)"]
    Server["백엔드 서버 (Spring Boot)"]
    Database["데이터베이스 (MySQL)"]
    GitHub["GitHub API (OAuth2 및 GraphQL)"]
    
    User -->|GitHub 로그인| Browser
    Browser -->|REST API 호출| Server
    Server -->|OAuth2 인증| GitHub
    Server -->|GraphQL 데이터 조회| GitHub
    Server -->|데이터 저장| Database
    Browser -->|결과 표시| User
```

---

## 플로우 차트
```mermaid
flowchart TD
    Start["사용자 웹사이트 접속"]
    Login["GitHub 로그인"]
    SetEmail["알림 이메일 설정"]
    StoreData["서버에 사용자 정보 저장"]
    CheckGrass["잔디 상태 확인"]
    Notify["사용자에게 알림 전송"]
    End["작업 완료"]

    Start --> Login
    Login -->|로그인 성공| SetEmail
    SetEmail -->|저장| StoreData
    StoreData --> CheckGrass
    CheckGrass -->|잔디 없음| Notify
    Notify --> End
```

---

## 시퀀스 다이어그램
```mermaid
sequenceDiagram
    participant User as 사용자
    participant Frontend as 프론트엔드 (React)
    participant Backend as 백엔드 (Spring Boot)
    participant GitHub as GitHub API
    participant DB as 데이터베이스

    User ->> Frontend: GitHub 로그인 요청
    Frontend ->> Backend: OAuth2 인증 요청
    Backend ->> GitHub: 인증 토큰 요청
    GitHub -->> Backend: 인증 토큰 반환
    Backend -->> Frontend: 로그인 성공 상태 반환
    User ->> Frontend: 이메일 주소 입력
    Frontend ->> Backend: 이메일 저장 요청
    Backend ->> DB: 사용자 정보 저장
    Backend ->> GitHub: 잔디 상태 GraphQL 조회
    GitHub -->> Backend: 잔디 상태 데이터 반환
    Backend ->> Frontend: 잔디 상태 데이터 반환
```

---

## 사용 방법

1. **GitHub 로그인**:
   - 웹사이트에서 "GitHub 계정으로 로그인" 버튼을 클릭합니다.
   - OAuth2 인증을 통해 GitHub 계정을 연결합니다.

2. **알림 이메일 입력**:
   - 알림을 받을 이메일 주소를 입력합니다.

---

## 배포 URL

---

## 문의
- 프로젝트 관련 문의: **star901210@hanmail.net**
- GitHub Repository: [https://github.com/TalkingPotato90/git-gardener](https://github.com/TalkingPotato90/git-gardener)
