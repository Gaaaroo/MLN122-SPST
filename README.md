# Hostia 2034 — World Cup Simulator

Demo web mô phỏng **lợi ích & tác hại đăng cai World Cup** và **logic kinh tế FIFA** (32 → 48 đội), gắn số liệu thực tế từ docs (2010–2026).

Dự án môn **MLN122** — Triết học Mác–Lênin / Kinh tế chính trị.

## Chạy local

```bash
npm install
npm run dev
```

Mở http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Luồng chơi

1. **Landing** — hook số liệu ($3,6B → $220B, FIFA $11B)
2. **Tổng quan** — tab số liệu thật (chi phí / lợi ích / kỳ vọng) + kéo slider + preset Đức/Brazil/Qatar/2026
3. **Chọn quốc gia** — 3 profile (đang phát triển / phát triển / tài nguyên)
4. **Chế độ Host** — 9 lượt, dashboard + 4 camera
5. **Chế độ FIFA** — 32/40/48 đội, Trung Quốc, suất châu Á
6. **Kết luận** — bài học kinh tế chính trị

## Docs nguồn

- `docs/chi-phi-dang-cai-world-cup.md`
- `docs/chi-phi-world-cup-tai-sao-tranh-dang-cai.md`
- `docs/world-cup-2026-kinh-te-va-dia-chinh-tri.md`

## Landing kể chuyện

Màn hình mở đầu (`StoryLanding`) là scrollytelling cinematic:
Hero → số liệu shock → timeline 2006–2026 (kinh tế / chính trị / rủi ro) → cỗ máy chi phí → FIFA vs host → kỳ vọng vs thật → CTA mô phỏng.

Nội dung: `src/landingContent.ts` · Style: `src/storyLanding.css` (cảm hứng [OpenHero](https://openhero.art/)).

## Cấu trúc `src/`

```
App.tsx                 # điều phối màn hình / state
types.ts, gameLogic.ts, overviewLogic.ts, overviewTypes.ts, realWorldData.ts
components/
  LandingScreen, SelectCountryScreen, HostScreen, HostResultScreen
  FifaScreen, FifaResultScreen, OverviewPanel, FactsPanel, Slider
```

Số tiền format thống nhất qua `formatUsdB()` → `$3.6B`.
