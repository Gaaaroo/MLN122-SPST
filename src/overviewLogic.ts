import type {
  MarxistAlignment,
  OverviewConfig,
  OverviewOutcome,
  RealWorldCase,
  TimelinePhase,
} from "./overviewTypes";
import { REAL_WORLD_CASES } from "./overviewTypes";
import {
  estimateFifaRevenueB,
  estimateHostCostB,
  HOST_COST_BY_EDITION,
} from "./realWorldData";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

const CASE_PROFILES: Record<string, Partial<OverviewConfig>> = {
  "germany-2006": {
    infrastructure: 35,
    publicPrivate: 25,
    socialSpend: 65,
    tourismFocus: 55,
    laborProtection: 70,
    teams: 32,
    asiaSlots: 4,
    chinaPriority: 20,
  },
  "south-africa-2010": {
    infrastructure: 60,
    publicPrivate: 40,
    socialSpend: 45,
    tourismFocus: 60,
    laborProtection: 50,
    teams: 32,
    asiaSlots: 4,
    chinaPriority: 15,
  },
  "brazil-2014": {
    infrastructure: 85,
    publicPrivate: 55,
    socialSpend: 25,
    tourismFocus: 70,
    laborProtection: 30,
    teams: 32,
    asiaSlots: 4,
    chinaPriority: 25,
  },
  "russia-2018": {
    infrastructure: 70,
    publicPrivate: 50,
    socialSpend: 40,
    tourismFocus: 65,
    laborProtection: 45,
    teams: 32,
    asiaSlots: 4,
    chinaPriority: 30,
  },
  "qatar-2022": {
    infrastructure: 95,
    publicPrivate: 80,
    socialSpend: 20,
    tourismFocus: 85,
    laborProtection: 15,
    teams: 32,
    asiaSlots: 4,
    chinaPriority: 35,
  },
  "wc-2026": {
    infrastructure: 40,
    publicPrivate: 55,
    socialSpend: 45,
    tourismFocus: 70,
    laborProtection: 55,
    teams: 48,
    asiaSlots: 8,
    chinaPriority: 50,
  },
};

function distance(a: OverviewConfig, b: Partial<OverviewConfig>): number {
  const keys: (keyof OverviewConfig)[] = [
    "infrastructure",
    "publicPrivate",
    "socialSpend",
    "tourismFocus",
    "laborProtection",
    "asiaSlots",
    "chinaPriority",
  ];
  let sum = 0;
  for (const k of keys) {
    sum += Math.abs(a[k] - (b[k] ?? a[k]));
  }
  if (b.teams !== undefined && a.teams !== b.teams) sum += 25;
  return sum;
}

function matchCases(config: OverviewConfig): RealWorldCase[] {
  return REAL_WORLD_CASES.map((c) => {
    const profile = CASE_PROFILES[c.id];
    const maxDist = 400;
    const dist = distance(config, profile);
    const match = clamp(Math.round(100 - (dist / maxDist) * 100), 5, 98);
    return { ...c, match };
  }).sort((a, b) => b.match - a.match);
}

function buildTags(
  c: OverviewConfig,
  o: {
    protestRisk: number;
    whiteElephantRisk: number;
    infrastructureLegacy: number;
  },
): string[] {
  const tags: string[] = [];
  if (c.infrastructure > 70) tags.push("Đầu tư hạ tầng lớn");
  if (c.infrastructure < 35) tags.push("Tái sử dụng / chi tiết kiệm");
  if (c.publicPrivate > 65) tags.push("Tư nhân dẫn dắt");
  if (c.publicPrivate < 35) tags.push("Nhà nước chủ đạo");
  if (c.socialSpend > 65) tags.push("An sinh được ưu tiên");
  if (c.socialSpend < 30) tags.push("Cắt giảm phúc lợi xã hội");
  if (c.tourismFocus > 70) tags.push("Thương hiệu quốc gia");
  if (c.laborProtection < 30) tags.push("Lao động chịu áp lực");
  if (c.laborProtection > 65) tags.push("Bảo vệ người lao động");
  if (c.teams >= 48) tags.push("World Cup 48 đội (104 trận)");
  if (c.chinaPriority > 70) tags.push("Thị trường Trung Quốc");
  if (o.protestRisk > 55) tags.push("Rủi ro biểu tình");
  if (o.whiteElephantRisk > 55) tags.push("Nguy cơ sân trắng");
  if (o.infrastructureLegacy > 65) tags.push("Di sản bền vững");
  return tags.slice(0, 8);
}

function buildMarxistLens(
  c: OverviewConfig,
  inequality: number,
  protest: number,
): MarxistAlignment {
  const historicalMaterialism = clamp(
    c.infrastructure * 0.4 + c.socialSpend * 0.3 + (100 - c.publicPrivate) * 0.2,
    0,
    100,
  );
  const classAnalysis = clamp(
    c.laborProtection * 0.45 + c.socialSpend * 0.35 + (100 - inequality) * 0.2,
    0,
    100,
  );
  const dialecticalMethod = clamp(
    100 -
      Math.abs(c.infrastructure - 50) * 0.3 -
      Math.abs(c.socialSpend - c.tourismFocus) * 0.25 -
      protest * 0.2,
    0,
    100,
  );

  const scores = [
    { name: "Duy vật lịch sử", value: historicalMaterialism },
    { name: "Phân tích giai cấp", value: classAnalysis },
    { name: "Phương pháp biện chứng", value: dialecticalMethod },
  ].sort((a, b) => b.value - a.value);

  const dominant = scores[0]!.name;
  let summary = "";
  if (dominant === "Duy vật lịch sử") {
    summary =
      "Kết quả chủ yếu do thay đổi điều kiện vật chất (hạ tầng, ngân sách).";
  } else if (dominant === "Phân tích giai cấp") {
    summary =
      "Phân bổ lợi ích lệch — cần hỏi ai hưởng, ai trả chi phí.";
  } else {
    summary =
      "Mâu thuẫn giữa tăng trưởng & công bằng đang được cân bằng tương đối.";
  }

  return {
    historicalMaterialism,
    classAnalysis,
    dialecticalMethod,
    dominant,
    summary,
  };
}

function buildTimeline(
  c: OverviewConfig,
  legacy: number,
  protest: number,
  brand: number,
): TimelinePhase[] {
  const infra = c.infrastructure / 100;
  const social = c.socialSpend / 100;

  return [
    {
      year: "T0",
      label: "Đấu thầu",
      icon: "📋",
      mood: "mixed",
      caption: "Hồ sơ $50–150M — thua là mất trắng. Báo cáo thường tô hồng.",
    },
    {
      year: "+2y",
      label: "Xây dựng",
      icon: "🏗️",
      mood: infra > 0.7 && social < 0.35 ? "bad" : infra > 0.5 ? "mixed" : "good",
      caption:
        infra > 0.7
          ? "Sân + metro + sân bay — ngân sách dễ đội vốn (Nga: sân +540%)."
          : "Tái sử dụng sân có sẵn (kiểu Đức / WC 2026).",
    },
    {
      year: "+5y",
      label: "Chuẩn bị",
      icon: "⚙️",
      mood: protest > 50 ? "bad" : "mixed",
      caption:
        protest > 50
          ? "Giá nhà, di dời, lao động — biểu tình trước thềm giải (Brazil)."
          : "An ninh, visa, giao thông chặn cuối — bài học Durban 2010.",
    },
    {
      year: "+8y",
      label: "Thi đấu",
      icon: "⚽",
      mood: brand > 60 ? "good" : "mixed",
      caption: "1 tháng: cú sốc cầu + bản quyền TV toàn cầu (Qatar 2022 ~5 tỷ người xem).",
    },
    {
      year: "+10y",
      label: "Di sản",
      icon: legacy > 60 ? "🏟️" : "🏚️",
      mood: legacy > 60 ? "good" : legacy > 40 ? "mixed" : "bad",
      caption:
        legacy > 60
          ? "Metro/sân bay còn phục vụ — di sản thật."
          : "Nguy cơ voi trắng: sân ế khách, bảo trì hàng năm.",
    },
  ];
}

function buildNarrative(
  c: OverviewConfig,
  economic: number,
  protest: number,
  fifaRev: number,
  echo: RealWorldCase,
  hostCost: number,
): string {
  if (protest > 60 && c.infrastructure > 70) {
    return `Gần ${echo.name}: chi ~$${hostCost.toFixed(1)}B hạ tầng lớn — hình ảnh tăng nhưng dân chịu áp lực (Brazil 2014: biểu tình, di dời). FIFA vẫn thu bản quyền.`;
  }
  if (c.infrastructure < 40 && c.teams >= 48) {
    return `Kiểu WC 2026: tái sử dụng sân, mở rộng 48 đội. FIFA dự thu ~$${fifaRev.toFixed(1)}B — host tiết kiệm xây mới nhưng vẫn tốn cải tạo cỏ, an ninh, visa.`;
  }
  if (economic > 65 && protest < 40) {
    return `Cân bằng tương đối (gần ${echo.name}): kinh tế ${economic}/100, ổn định xã hội ${(100 - protest).toFixed(0)}/100 — hiếm trong lịch sử đăng cai.`;
  }
  if (c.teams >= 48 && c.chinaPriority > 60) {
    return `FIFA tối đa hóa thị trường: ~$${fifaRev.toFixed(1)}B/chu kỳ (docs: thường $7–9B; dự kiến 2023–26 ~$11B). Host gánh sân–metro–an ninh; FIFA nắm TV + sponsor + vé.`;
  }
  if (c.infrastructure > 85) {
    return `Quy mô kiểu Qatar: phần lớn tiền không vào sân mà vào metro/thành phố mới. Soft power cao — rủi ro voi trắng & lao động cũng cao.`;
  }
  return `Trade-off thực tế: mỗi slider có người thắng/thua. Gần nhất ${echo.name} (${echo.match}% khớp) — ${echo.blurb}`;
}

export function computeOverview(config: OverviewConfig): OverviewOutcome {
  const infra = config.infrastructure / 100;
  const priv = config.publicPrivate / 100;
  const social = config.socialSpend / 100;
  const tourism = config.tourismFocus / 100;
  const labor = config.laborProtection / 100;
  const teamFactor = (config.teams - 32) / 16;
  const china = config.chinaPriority / 100;

  const economicBenefit = clamp(
    infra * 25 + tourism * 30 + teamFactor * 10 + china * 8 + (1 - social) * 5,
    0,
    100,
  );

  const socialHarmony = clamp(
    social * 30 + labor * 35 + (1 - infra) * 10 + (1 - priv) * 8,
    0,
    100,
  );

  const infrastructureLegacy = clamp(
    (infra < 0.75 ? infra * 90 : 70 - (infra - 0.75) * 80) +
      (1 - priv) * 15 +
      social * 10,
    0,
    100,
  );

  const nationalBrand = clamp(tourism * 40 + infra * 20 + teamFactor * 15, 0, 100);

  const fifaRevenue = estimateFifaRevenueB({
    teams: config.teams,
    asiaSlots: config.asiaSlots,
    chinaPriority: config.chinaPriority,
  });

  const hostCostUsd = estimateHostCostB({
    infrastructure: config.infrastructure,
    teams: config.teams,
  });

  const hostBurden = clamp(
    (hostCostUsd / HOST_COST_BY_EDITION.QATAR_2022_TOTAL) * 100,
    5,
    100,
  );

  const protestRisk = clamp(
    infra * 30 + priv * 12 + tourism * 15 - social * 35 - labor * 40 + 15,
    0,
    100,
  );

  const whiteElephantRisk = clamp(
    infra * 50 + priv * 8 - social * 15 - (infra < 0.4 ? 20 : 0) + 10,
    0,
    100,
  );

  const inequalityIndex = clamp(
    priv * 35 + (1 - labor) * 30 + (1 - social) * 25 + infra * 10,
    0,
    100,
  );

  const dialecticBalance = clamp(
    100 - Math.abs(economicBenefit - socialHarmony) * 0.6 - protestRisk * 0.25,
    0,
    100,
  );

  const partial = {
    economicBenefit,
    socialHarmony,
    infrastructureLegacy,
    nationalBrand,
    fifaRevenue,
    hostBurden,
    protestRisk,
    whiteElephantRisk,
    inequalityIndex,
    dialecticBalance,
  };

  const matched = matchCases(config);
  const realWorldEcho = matched[0]!;
  const secondaryEchoes = matched.slice(1, 4);
  const marxistLens = buildMarxistLens(config, inequalityIndex, protestRisk);
  const timeline = buildTimeline(
    config,
    infrastructureLegacy,
    protestRisk,
    nationalBrand,
  );
  const tags = buildTags(config, partial);
  const narrative = buildNarrative(
    config,
    economicBenefit,
    protestRisk,
    fifaRevenue,
    realWorldEcho,
    hostCostUsd,
  );

  return {
    ...partial,
    hostCostUsd,
    tags,
    narrative,
    timeline,
    marxistLens,
    realWorldEcho,
    secondaryEchoes,
  };
}

export function configFromHost(host: {
  infrastructure: number;
  publicPrivate: number;
  socialPriority: number;
  stance: string;
}): OverviewConfig {
  return {
    infrastructure: host.infrastructure,
    publicPrivate: host.publicPrivate,
    socialSpend: 100 - host.socialPriority,
    tourismFocus: host.socialPriority,
    laborProtection: host.stance === "people" ? 70 : 40,
    teams: 32,
    asiaSlots: 4,
    chinaPriority: 40,
  };
}
