# Extreme-Todo BackEnd

# Concept

### Concept

- Test-Driven-Development(JEST)
- atomic

### Function

- 다크모드
- 할 일 todo
    - 카테고리
- 공부시간 기록
    - 랭킹
- 알림
- 소셜 로그인

# 와이어 프레임

![Untitled](https://user-images.githubusercontent.com/56210700/232810471-76c9caf4-cbb1-4dbe-8461-b2adee2ffb67.png)


# 기능명세

### 전체

1. 뽀모도로, 쉬는시간 설정 값 lcoalStorage에 저장
2. unmount될 때 현재 뽀모도로 진행시간 값을 localStorage에 저장

*로그인을 안했을 때*

1. 랭킹 기능 사용 불가(집계에서도 제외)
2. DB가 아닌 localstorage에 할 일 저장
3. 당일에 한 일

### 타이머

1. 현재시간
2. 뽀모도로 집중시간 
20, 25, 30, 35, 40 분 
3. 쉬는시간 5, 10, 15 분 
4. 일시정지/재개 - 쉬는 시간 추가 
5. 누적 공부시간(뽀모도로의 진행에 따라 자동 측정) 
6. 누적 쉬는 시간(자동 측정)
7. 쉬는 시간 끝나면 뽀모도로 자동 재개

### 할일

1. 할 일 작성
    1. 내용, 소요시간, 카테고리, 완료여부(false)
2. 완료했을 때 done = true/false
    1. DONE 완료된 할일
    2. TODO 해야할 일 
3. 할 일 수정
    1. 내용, 소요시간, 카테고리
4. 할 일 삭제
5. 할 일 불러오기
6. 소요시간을 반영한 진행도 표시 - 5분단위
ex) 60분 소요 태스크를 5분 했을 경우 8.3% 진행
7. 뽀모도로 만료 시 현재 할 일 자동삭제
8. 현재 할 일 자동삭제 시 다음 할 일 자동으로 현재 할 일 목록으로 반영
9. 순서 변경 하기

### 추이

1. 일간 추이 :: 어제 내 공부시간 vs 오늘 내 공부시간 +-
2. 주간 추이 :: 지난 주 vs 이번 주 내 공부시간 +-
3. 월간 추이 :: 지난 달 내 공부시간 vs 이번 달 내 공부시간 +-

작동방식 : 

1. 새벽 5시가 땡 하고 되면 `오늘 데이터`는 어제 데이터에 저장
2. `오늘 데이터`는 이번 주 데이터에 더해주기(누적 값)
3. `오늘 데이터`는 이번 달 데이터에 더해주기(누적 값)
4. 일요일/월요일의 새벽 5시가 되면 `이번 주 데이터`는 `지난 주 데이터`
5. 이번 주 데이터는 다시 초기화
6. 01일 새벽 5시가 되면 `이번 달 데이터`는 `지난 달 데이터`로 저장되고
7. 이번 달 데이터는 다시 초기화

### 설정

- 의지박약박멸모드 ON/OFF
- 초기화

### 소셜로그인

- 로그인(회원가입 겸)
- 로그아웃
- 회원탈퇴(?)

# Skill set

| Language | TS |
| --- | --- |
| Framework | NestJS |
| Database | MySQL |

# Convention

- 함수, 변수는 **camelCase**
- 클래스명 **PascalCase**
- 폴더명, endpoint **snake_case**
- commit message :: 국문
    
    ```jsx
    **Commit 유형 지정**
    (Create) => 새로운 컴포넌트, 기능을 완성
    (Update) => 수정, 추가, 보완 등 개정
    (Delete) => 삭제
    (Install) => 패키지 설치
    (Bug) => 오류 존재
    (Fix) => 오타, 오류 수정
    ex) Create : 회원가입 컴포넌트
    ex) Create : 회원가입 컴포넌트 WIP
    
    **Commit Message 구조**
    type(타입) : title(제목)
    WIP(Work In Progress) : 완성 전에 커밋할 경우 제목 뒤에 붙임
    body(본문, 생략 가능)
    ```
    
- Issue
    - 트러블 발생
    - 기능 제안
- Git-Flow
    - main
    - develop
    - feature
- CI/CD, Infrastructure
    - frontend - AWS S3
    - backend - Fly.io, MySQL, Docker
    - Github Actions
- TODO, FIX 메시지 작성
- Linter, formatter
    
    
    | ESLint | 2.2.6 |
    | --- | --- |
    | Prettier | 9.8.0 |

# API

[API 문서](https://www.notion.so/687f64ea26e14c4bb99a75de7c63873c)

# 세팅

[사용 모듈 - backend](https://www.notion.so/107f7459205f4c3c89cd8f792c41251a)


# 공부한 내용

[공부하면서 새로 찾은 내용](https://www.notion.so/060d00dd19604eac8d3235415b67cfde)
