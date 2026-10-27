# 단위 변환기

길이·무게·온도·부피 변환, 양방향 숫자 입력, 단위 교환을 지원합니다. 모든 계산은 브라우저에서 이루어집니다.

## 실행

Node.js 22 이상과 npm이 필요합니다. API key, 계정, backend, 외부 서비스 설정은 필요하지 않습니다.

```sh
npm ci --ignore-scripts
npm run dev -- --host 127.0.0.1
```

표시된 localhost URL을 브라우저에서 엽니다.

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

`dist/`를 HTTPS 정적 hosting에 배포할 수 있습니다. Vite dev/preview server는 로컬 확인용입니다. 

## 검증과 한계

5개 Node test: metric 기준값·음수·0, 모든 지원 단위 쌍 round trip, 잘못된 숫자·범위, 미소값 표시, 단위 변경 중 overflow 후 복구.

로컬 production build를 Ego Lite에서 1440×900, 1024×768, 390×844, 360×800으로 확인했습니다. 길이·역방향 입력·단위 교환·무게·온도·부피 변환과 가로 overflow를 확인했습니다. 공개 배포·원격 CI 실행은 이 source 준비 단계에 포함되지 않습니다.

소수점 계산은 JavaScript 부동소수점 연산이며 imperial 단위 비율은 원본의 근삿값을 사용합니다. 갤런·쿼트·파인트·컵은 미국식 근삿값입니다. 정밀 계측·과학 계산의 보정이나 측정 불확도를 제공하지 않습니다. UI 출력은 일반 숫자 최대 소수 10자리, 매우 크거나 작은 수는 지수 표기 6자리로 반올림합니다.

## Source edition

기존 first-party 앱에서 실행에 필요한 source와 검토한 SVG favicon만 분리했습니다. 환경 파일, 운영 이력, 예전 문서, 미사용 UI·legacy code, raster/OG 자산은 포함하지 않았습니다. 의존성은 `package-lock.json`에 고정하고 CI action은 commit SHA로 고정했습니다. `.github/workflows/ci.yml`은 push/PR에서 읽기 권한만 사용하여 typecheck, test, build, audit를 수행합니다.

MIT License입니다. 기존 `ATTRIBUTIONS.md`를 보존했으며 실제 포함된 third-party package와 license 원문은 `THIRD_PARTY_NOTICES.md`를 확인하세요. 원본 attribution의 Unsplash 문구는 원본 보존용이며 이 edition에는 사진이 없습니다.
