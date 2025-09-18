<h1>🐾 펫어웰: Farewell, my pet</h1>

<blockquote>
  반려동물을 잃은 뒤 보호자가 겪는 상실 극복을 돕는 기록·위로 커뮤니티 서비스
  <strong>펫어웰</strong>의 프론트엔드 저장소입니다.
</blockquote>

<hr />

<h2>📖 Introduction</h2>

<p>
  펫어웰은 반려동물과의 이별을 겪은 사람들이 <strong>기록하고, 나누고, 회복</strong>할 수 있도록 돕는 서비스를 지향합니다.
</p>

<p><strong>서비스 목표</strong></p>
<ol>
  <li><strong>자신의 감정을 솔직하게 되돌아보며</strong> 상실의 감정을 안전하게 표현하고 정리합니다.</li>
  <li><strong>주변(펫어웰 커뮤니티)의 지지를 받고</strong> 서로의 이야기에 공감과 위로를 주고받습니다.</li>
  <li><strong>필요하다면 전문가에게 상담을 받아</strong> 회복을 위한 적절한 도움을 연결합니다.</li>
</ol>

<hr />

<h2>👥 Developers</h2>

<table style="width:100%; table-layout:fixed; text-align:center;">
  <tbody>
    <tr>
      <td>
        <a href="https://github.com/hxrdtxlxvx" target="_blank" rel="noreferrer">
          <img src="https://github.com/hxrdtxlxvx.png?size=140" alt="@hxrdtxlxvx" />
        </a>
      </td>
      <td>
        <a href="https://github.com/cjiyun" target="_blank" rel="noreferrer">
          <img src="https://github.com/cjiyun.png?size=140" alt="@cjiyun" />
        </a>
      </td>
    </tr>
    <tr>
      <td><a href="https://github.com/hxrdtxlxvx" target="_blank" rel="noreferrer">김민주</a></td>
      <td><a href="https://github.com/cjiyun" target="_blank" rel="noreferrer">최지윤</a></td>
    </tr>
    <tr>
      <td>FE</td>
      <td>FE</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>🛠️ Tech Stack</h2>

<table>
  <thead>
    <tr>
      <th>분야</th>
      <th>스택</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>FE</strong></td>
      <td>
        <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
        &nbsp;
        <img src="https://img.shields.io/badge/React%20Native-61DAFB?logo=react&logoColor=000000" alt="React Native" />
        &nbsp;
        <img src="https://img.shields.io/badge/TanStack%20Query-FF4154?logo=reactquery&logoColor=white" alt="TanStack Query (React Query)" />
        &nbsp;
        <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
      </td>
    </tr>
  </tbody>
</table>

<hr />

<h2>🖼️ Screenshots</h2>
<p><!-- 스크린샷 이미지가 준비되면 아래에 <img /> 태그로 추가하세요. --></p>

<hr />

<h2>🗂 Project Structure</h2>

<pre><code>PAREWELL-FE/
├─ assets/                      # 아이콘·스플래시·폰트·이미지 등 앱 정적 자산
│  ├─ icon/                     # 앱 아이콘 등
│  ├─ image/                    # 화면에서 쓰는 이미지
│  └─ fonts/                    # 커스텀 폰트(선택)
├─ src/                         # 애플리케이션 소스 코드
│  ├─ components/               # UI 컴포넌트
│  │  ├─ common/                # 버튼, 모달 등 범용(공통) 컴포넌트
│  │  └─ ...                    # auth, home 등 페이지 전용 컴포넌트
│  ├─ hooks/                    # 커스텀 훅
│  ├─ layouts/                  # 화면 공통 레이아웃
│  ├─ mocks/                    # 목킹 데이터 및 설정
│  ├─ navigation/               # React Navigation 구성
│  ├─ provider/                 # 루트/기능별 Provider 모음
│  ├─ screens/                  # 라우트에 매핑되는 화면 단위 컴포넌트
│  │  ├─ home/                  # 홈 화면 관련 스크린
│  │  └─ ...                    # diary, letter 등 각 도메인별 스크린
│  ├─ services/                 # API 호출·비즈니스 로직 계층
│  ├─ store/                    # 전역 상태 관리
│  ├─ types/                    # TypeScript 타입 정의
│  └─ utils/                    # 유틸 모음
├─ App.tsx                      # 앱 진입점
├─ global.css                   # Tailwind 지시자 및 전역 유틸
├─ tailwind.config.js           # Tailwind 설정
├─ metro.config.js              # Metro 번들러 설정
├─ babel.config.js              # Babel 설정
├─ nativewind-env.d.ts          # NativeWind 타입 선언
├─ tsconfig.json                # TypeScript 설정
├─ eslint.config.mjs            # ESLint 규칙 및 플러그인 설정
├─ commitlint.config.mjs        # 커밋 메시지 규칙
└─ README.md                    # 프로젝트 문서
</code></pre>

```

```
