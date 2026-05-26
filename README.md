# 🎭 라이어 게임 프론트

React + Vite로 만든 라이어 게임 클라이언트.

## 기술 스택

- **Framework:** React 18
- **Bundler:** Vite
- **Real-time:** Socket.io-client
- **Build output:** `/liar/` 서브패스 (Caddy 라우팅)

## 개발

```bash
npm install
npm run dev
```

Vite dev server가 `/api/*`, `/socket.io/*`를 백엔드(3001)로 프록시합니다.

## 빌드

```bash
npm run build
```

출력: `dist/` — 서버의 `public/`으로 복사되어 express.static으로 서빙됩니다.

Docker 빌드 시에는 멀티스테이지로 서버 Dockerfile에서 자동 빌드됩니다.

## Caddy 라우팅

```
catchmind-tree.duckdns.org/liar/* → liar_app:3001
```
