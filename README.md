# 👕 날씨 기반 코디 추천 웹사이트

사용자의 입력과 실시간 날씨 정보를 바탕으로  
적절한 옷차림을 추천해주는 웹 사이트입니다.  
또한 사용자가 직접 오늘의 코디를 업로드하고,  
비슷한 날씨와 나이대의 사용자 코디를 참고할 수 있도록 도와줍니다.

---

## 📌 주요 기능

- ✅ **회원가입 / 로그인 기능**
  - 비밀번호 보안 체크 및 강력한 비밀번호 추천 기능 제공

- ✅ **날씨 API 연동**
  - 선택한 도시 기준으로 실시간 날씨 정보 가져오기
  - 코디 추천에 날씨 데이터 활용

- ✅ **오늘의 코디 업로드**
  - 상의 색상, 스타일 입력
  - 이미지 업로드 기능 포함
  - 날씨 및 나이 자동 저장

- ✅ **코디 추천 시스템**
  - 현재 날씨 기준 필수
  - 나이대를 추가 필터로 선택 가능
  - 온도별 상세 의류 추천 기능 (0도 이하부터 30도 이상까지 11단계)
  - 사용자별 맞춤형 인사말이 포함된 친근한 추천문구 제공

## 🔐 비밀번호 보안

이 프로젝트는 사용자의 비밀번호 보안을 위해  
Dropbox의 오픈소스 보안 라이브러리 [zxcvbn.js](https://github.com/dropbox/zxcvbn)를 사용합니다.

- 비밀번호 강도에 따라 점수(0~4) 및 피드백 제공
- 연속된 문자, 사전 단어, 개인 정보 유사성 등 복합 요소 분석
- 안전하지 않은 비밀번호는 경고 메시지로 알려줍니다

## 💻 설치 및 실행 방법

### 필수 요구사항

- Node.js 18 이상
- MariaDB 10.6 이상

### 설치 방법

1. 저장소를 클론합니다.
   ```bash
   git clone https://github.com/your-username/climatch.git
   cd climatch
   ```

2. 의존성 패키지를 설치합니다.
   ```bash
   npm run install:all
   ```

3. MariaDB 데이터베이스를 설정합니다.
   - MariaDB가 실행 중인지 확인합니다.
   - `climatch` 데이터베이스는 서버 실행 시 자동으로 생성됩니다.

4. 백엔드 환경 설정을 위해 `back/.env` 파일을 생성합니다.
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=YOUR_DB_PASSWORD
   DB_NAME=climatch
   WEATHER_API_KEY=YOUR_WEATHER_API
   ```

## 📋 데이터베이스 구조

프로젝트는 다음과 같은 테이블로 구성되어 있습니다:

- **climatch_user**: 사용자 정보 저장
- **climatch_session**: 로그인 세션 관리
- **climatch_weather_history**: 날씨 데이터 기록
- **climatch_outfit**: 사용자가 등록한 의상 정보
