###BlueMemories

##프로젝트 개요
  BlueMemories는 일기 작성, 공유, 감정 분석 등을 제공하는 웹 애플리케이션입니다. 사용자는 개인 일기를 작성하고 감정 분석 결과를 확인하며, 추천 콘텐츠를 통해 더 나은 감정 관리를 할 수 있습니다. 또한, 공유 일기를 통해 다른  사용자들과 일기를 공유할 수 있습니다.

##기술 스택

#백엔드

	•	언어: Java 17
	•	프레임워크: Spring Boot
	•	데이터베이스: MySQL
	•	보안: Spring Security, JWT (Json Web Token)
	•	빌드 도구: Gradle
	•	기타: AWS (S3, EC2 등)

#프론트엔드

	•	언어: JavaScript (React.js)
	•	스타일링: Styled-components
	•	패키지 관리: npm
	•	기타: Axios, React Router, React Slick 등

###설치 및 실행

##백엔드

##요구 사항

	•	Java 17 이상
	•	Gradle
	•	MySQL

##환경 변수 설정

#백엔드 서버를 실행하기 전에, 다음과 같은 환경 변수를 설정해야 합니다.


##프론트엔드

##요구 사항

	•	Node.js (v14 이상)
	•	npm 또는 Yarn

'
# frontend 디렉토리로 이동
cd frontend

# 의존성 설치
yarn install

# 개발 서버 실행
yarn start
'

프론트엔드 서버는 기본적으로 http://localhost:3000에서 실행됩니다.

##주요 기능

	•	회원가입 및 로그인: JWT 기반 인증
	•	일기 작성 및 수정: 감정 분석과 이미지 첨부 기능
	•	공유 일기: 다른 사용자들과 공유 일기 작성
	•	댓글 및 좋아요: 작성된 일기에 대한 상호작용
	•	유튜브 추천: 감정 분석 결과에 따라 맞춤형 유튜브 콘텐츠 추천

 BlueMemories/
│
├── backend/
│   ├── src/                         # 백엔드 소스 코드
│   ├── build.gradle                 # Gradle 빌드 파일
│   └── ...                          # 기타 백엔드 파일
│
├── frontend/
│   ├── public/                      # 정적 파일
│   ├── src/                         # 프론트엔드 소스 코드
│   ├── package.json                 # npm 의존성 파일
│   └── ...                          # 기타 프론트엔드 파일
│
└── README.md                        # 프로젝트 설명 파일
