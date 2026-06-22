# AGENTS.md

이 저장소는 BBC 뉴스 검색 결과를 수집하고 OpenAI로 이적 소식 여부와 요약 상태를 판단하는 Node.js 프로젝트입니다.

## 실행 방법
- 설치: `npm install`
- 실행: `npm start`
- 기본 진입점: [index.js](index.js)
- 서버는 포트 3000에서 실행됩니다.

## 주요 구조
- [index.js](index.js): Express 서버를 시작하고 `/transfer?name=...` 요청을 처리합니다.
- [functions/articleCrawl.js](functions/articleCrawl.js): BBC 검색 결과와 기사 본문을 크롤링합니다.
- [functions/openai.js](functions/openai.js): OpenAI API를 호출해 이적 뉴스 여부를 판별하고 요약 결과를 생성합니다.

## 코드 작성 시 주의사항
- 이 프로젝트는 ESM(`"type": "module"`)을 사용하므로 `import`/`export` 문을 유지하세요.
- API 키가 필요하므로 실행 전 OpenAI 인증 환경이 설정되어 있는지 확인하세요.
- `newsSummarize`의 출력 형태는 클럽 이름을 키로 하는 객체를 반환하므로, 요약 결과 포맷을 바꿀 때는 호출부와 함께 확인하세요.
- 크롤링 로직은 BBC의 HTML 구조에 의존하므로 selector나 응답 처리 로직을 수정할 때는 신중하게 다루세요.

## 개발 팁
- 새로운 기능을 추가할 때는 먼저 기존 흐름([index.js](index.js), [functions/articleCrawl.js](functions/articleCrawl.js), [functions/openai.js](functions/openai.js))을 따라가세요.
- 외부 API 호출이 포함된 코드에서는 로깅과 예외 처리를 최소한으로 유지하세요.
- 테스트 스크립트가 아직 준비되어 있지 않으므로, 변경 후에는 `npm start`로 실제 실행 흐름을 검증하는 것이 좋습니다.
