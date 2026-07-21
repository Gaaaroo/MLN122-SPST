import type {
  MarxistAlignment,
  MetricDriver,
  MetricExplanation,
  OverviewConfig,
  OverviewOutcome,
  RealWorldCase,
} from "./overviewTypes";
import { REAL_WORLD_CASES } from "./overviewTypes";
import {
  estimateFifaRevenueB,
  estimateHostCostB,
  HOST_COST_BY_EDITION,
  MODEL_WC_TEAMS,
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
    asiaSlots: 4,
    chinaPriority: 20,
  },
  "south-africa-2010": {
    infrastructure: 60,
    publicPrivate: 40,
    socialSpend: 45,
    tourismFocus: 60,
    laborProtection: 50,
    asiaSlots: 4,
    chinaPriority: 15,
  },
  "brazil-2014": {
    infrastructure: 85,
    publicPrivate: 55,
    socialSpend: 25,
    tourismFocus: 70,
    laborProtection: 30,
    asiaSlots: 4,
    chinaPriority: 25,
  },
  "russia-2018": {
    infrastructure: 70,
    publicPrivate: 50,
    socialSpend: 40,
    tourismFocus: 65,
    laborProtection: 45,
    asiaSlots: 4,
    chinaPriority: 30,
  },
  // Qatar: nhà nước chi gần như toàn bộ (quỹ nhà nước, Vision 2030) — không phải tư nhân dẫn dắt
  "qatar-2022": {
    infrastructure: 95,
    publicPrivate: 30,
    socialSpend: 20,
    tourismFocus: 85,
    laborProtection: 15,
    asiaSlots: 4,
    chinaPriority: 35,
  },
  "wc-2026": {
    infrastructure: 40,
    publicPrivate: 55,
    socialSpend: 45,
    tourismFocus: 70,
    laborProtection: 55,
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
  if (c.asiaSlots >= 8) tags.push("Suất châu Á tối đa (2026)");
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
      "Kết quả chủ yếu do tiền và hạ tầng bỏ ra tới đâu quyết định.";
  } else if (dominant === "Phân tích giai cấp") {
    summary =
      "Lợi ích đang chia không đều — phải hỏi ai được hưởng và ai è cổ trả tiền.";
  } else {
    summary =
      "Cái được và cái mất đang khá cân bằng, chưa nghiêng hẳn về bên nào.";
  }

  return {
    historicalMaterialism,
    classAnalysis,
    dialecticalMethod,
    dominant,
    summary,
  };
}

function scoreLevel(v: number): string {
  if (v >= 65) return "cao";
  if (v >= 40) return "trung bình";
  return "thấp";
}

function riskLevel(v: number): string {
  if (v >= 55) return "cao";
  if (v >= 30) return "trung bình";
  return "thấp";
}

function pickDrivers(items: MetricDriver[], limit = 4): MetricDriver[] {
  return items.slice(0, limit);
}

function buildMetricExplanations(
  c: OverviewConfig,
  o: {
    economicBenefit: number;
    socialHarmony: number;
    infrastructureLegacy: number;
    nationalBrand: number;
    fifaRevenue: number;
    hostCostUsd: number;
    protestRisk: number;
    whiteElephantRisk: number;
    inequalityIndex: number;
  },
): MetricExplanation[] {
  const economicDrivers = pickDrivers([
    {
      input: "Đầu tư hạ tầng",
      direction: "tăng",
      detail: `Càng xây nhiều sân, tàu điện và sân bay thì càng tạo thêm việc làm và hút khách trong lúc diễn ra giải. Bạn đang để mức ${c.infrastructure}.`,
    },
    {
      input: "Ưu tiên du lịch / thương hiệu",
      direction: "tăng",
      detail: `Quảng bá hình ảnh kéo khách nước ngoài đến, khách sạn và hàng quán đông hơn — nhưng thường chỉ sôi động trong mùa giải rồi lắng xuống.`,
    },
    {
      input: "Ưu tiên thị trường Trung Quốc",
      direction: c.chinaPriority > 40 ? "tăng" : "giảm",
      detail: `Nhắm vào thị trường châu Á giúp bán bản quyền và tài trợ tốt hơn. Nhưng phần lời này chủ yếu về tay FIFA, nước chủ nhà chỉ được hưởng gián tiếp.`,
    },
    {
      input: "Suất vòng loại châu Á",
      direction: c.asiaSlots > 5 ? "tăng" : "giảm",
      detail: `Càng nhiều đội châu Á được dự thì khu vực càng quan tâm, kéo theo khách và sự chú ý cho nước chủ nhà.`,
    },
    {
      input: "Chi an sinh xã hội",
      direction: c.socialSpend > 50 ? "giảm" : "tăng",
      detail: `Nếu cắt bớt phúc lợi để dồn tiền cho World Cup thì con số kinh tế sự kiện nhích lên, nhưng người dân là bên chịu thiệt.`,
    },
  ]);

  const harmonyDrivers = pickDrivers([
    {
      input: "Chi an sinh xã hội",
      direction: "tăng",
      detail: `Chi cho nhà ở, y tế, lương giúp người dân yên tâm và ít bất mãn hơn. Bạn đang để mức ${c.socialSpend}.`,
    },
    {
      input: "Bảo vệ người lao động",
      direction: "tăng",
      detail: `Bảo vệ công nhân tốt (giờ làm, an toàn) thì xã hội êm hơn. Để thấp dễ lặp lại chuyện lao động khổ như ở Qatar.`,
    },
    {
      input: "Đầu tư hạ tầng",
      direction: "giảm",
      detail: `Xây quá nhiều thường kéo theo giải tỏa, đội giá nhà và đội vốn — như Brazil 2014 từng bị dân xuống đường phản đối.`,
    },
    {
      input: "Tư nhân tham gia",
      direction: "giảm",
      detail: `Để tư nhân nắm phần lớn thì lợi nhuận dồn vào số ít, người dân dễ thấy mình bị bỏ ngoài cuộc.`,
    },
  ]);

  const legacyDrivers = pickDrivers([
    {
      input: "Đầu tư hạ tầng",
      direction: c.infrastructure <= 75 ? "tăng" : "giảm",
      detail:
        c.infrastructure <= 75
          ? `Đầu tư vừa phải thì sân và tàu điện còn dùng lâu dài, giống Đức 2006. Bạn đang để mức ${c.infrastructure}.`
          : `Xây quá tay (mức ${c.infrastructure}) dễ để lại sân bỏ không sau giải, như Manaus hay Cape Town.`,
    },
    {
      input: "Tư nhân tham gia",
      direction: c.publicPrivate > 50 ? "giảm" : "tăng",
      detail: `Nhà nước giữ vai trò chính thì dễ tính chuyện dùng lâu dài; tư nhân thường chỉ nhắm lời trước mắt.`,
    },
    {
      input: "Chi an sinh xã hội",
      direction: "tăng",
      detail: `Có ngân sách xã hội thì mới đủ tiền bảo trì công trình công cộng sau khi giải kết thúc.`,
    },
  ]);

  const brandDrivers = pickDrivers([
    {
      input: "Ưu tiên du lịch / thương hiệu",
      direction: "tăng",
      detail: `Đầu tư quảng bá giúp hình ảnh đất nước đẹp lên trong mắt thế giới — Đức 2006 đổi được hình ảnh, Qatar dùng giải để đánh bóng tên tuổi.`,
    },
    {
      input: "Đầu tư hạ tầng",
      direction: "tăng",
      detail: `Sân và tàu điện hiện đại lên sóng truyền hình toàn cầu, làm nước chủ nhà trông chuyên nghiệp hơn.`,
    },
  ]);

  const fifaDrivers = pickDrivers([
    {
      input: "Suất vòng loại châu Á",
      direction: c.asiaSlots > 4 ? "tăng" : "giảm",
      detail: `Thêm suất cho châu Á thì thêm khán giả và thị trường mới, giúp FIFA bán bản quyền cao hơn.`,
    },
    {
      input: "Ưu tiên thị trường Trung Quốc",
      direction: c.chinaPriority > 40 ? "tăng" : "giảm",
      detail: `Trung Quốc có 1,4 tỷ dân — mảnh đất vàng cho quảng cáo và bản quyền. Tiền này gần như FIFA giữ, không phải nước chủ nhà.`,
    },
  ]);

  const hostCostDrivers = pickDrivers([
    {
      input: "Đầu tư hạ tầng",
      direction: "tăng",
      detail:
        c.infrastructure <= 35
          ? `Đầu tư thấp thì chi phí gần mức Nam Phi 2010 (khoảng 3,6 tỷ USD) nhờ tận dụng sân có sẵn.`
          : c.infrastructure <= 75
            ? `Đầu tư vừa thì chi phí rơi vào khoảng giữa Nam Phi và Brazil, tầm ${o.hostCostUsd.toFixed(1).replace(".", ",")} tỷ USD cho sân và giao thông.`
            : `Đầu tư rất lớn thì chi phí vọt lên cỡ Qatar (khoảng ${o.hostCostUsd.toFixed(0)} tỷ USD), vì phải làm cả tàu điện, sân bay, thành phố mới.`,
    },
  ]);

  const protestDrivers = pickDrivers([
    {
      input: "Đầu tư hạ tầng",
      direction: "tăng",
      detail: `Xây càng nhiều càng dễ giải tỏa nhà dân và đội vốn — Brazil từng phải di dời khoảng 250.000 người.`,
    },
    {
      input: "Bảo vệ người lao động",
      direction: "giảm",
      detail: `Lo cho người lao động tử tế thì ít căng thẳng và ít biểu tình hơn.`,
    },
    {
      input: "Chi an sinh xã hội",
      direction: "giảm",
      detail: `Giữ tiền cho y tế, nhà ở, giáo dục thì dân bớt bức xúc khi thấy tiền đổ vào bóng đá.`,
    },
    {
      input: "Ưu tiên du lịch / thương hiệu",
      direction: "tăng",
      detail: `Lo đánh bóng hình ảnh hơn lo cho dân địa phương thì dễ gây phản ứng ngược.`,
    },
  ]);

  const whiteElephantDrivers = pickDrivers([
    {
      input: "Đầu tư hạ tầng",
      direction: c.infrastructure < 40 ? "giảm" : "tăng",
      detail:
        c.infrastructure < 40
          ? `Dùng lại sân có sẵn nên ít nguy cơ để lại sân bỏ hoang.`
          : `Xây nhiều sân mới mà không có đội bóng đủ lớn để lấp đầy thì dễ thành sân bỏ không, như Manaus hay Durban.`,
    },
    {
      input: "Chi an sinh xã hội",
      direction: "giảm",
      detail: `Có ngân sách thì mới nuôi nổi sân và tàu điện sau giải, đỡ bỏ hoang.`,
    },
    {
      input: "Tư nhân tham gia",
      direction: "tăng",
      detail: `Tư nhân xây nhanh nhưng thường không lo phần bảo trì dài hạn, nên rủi ro bỏ không cao hơn.`,
    },
  ]);

  const inequalityDrivers = pickDrivers([
    {
      input: "Tư nhân tham gia",
      direction: "tăng",
      detail: `Càng nhiều tư nhân thì lợi nhuận (khách sạn, ăn uống, xây dựng) càng dồn vào số ít người.`,
    },
    {
      input: "Bảo vệ người lao động",
      direction: "giảm",
      detail: `Bảo vệ người lao động yếu thì phần thiệt dồn về phía công nhân, khoảng cách giàu nghèo giãn ra.`,
    },
    {
      input: "Chi an sinh xã hội",
      direction: "giảm",
      detail: `Cắt phúc lợi là đẩy gánh nặng về phía người dân thường.`,
    },
    {
      input: "Đầu tư hạ tầng",
      direction: "tăng",
      detail: `Chi rất nhiều tiền nhưng cái lợi lại không chia đều cho mọi người.`,
    },
  ]);

  return [
    {
      id: "economicBenefit",
      label: "Lợi ích kinh tế",
      summary: `Đang ở mức ${o.economicBenefit.toFixed(0)} trên 100 (${scoreLevel(o.economicBenefit)}). Chủ yếu đến từ xây hạ tầng và hút du lịch, nhưng lợi ích thường chỉ kéo dài trong mùa giải.`,
      drivers: economicDrivers,
    },
    {
      id: "socialHarmony",
      label: "Hài hòa xã hội",
      summary: `Đang ở mức ${o.socialHarmony.toFixed(0)} trên 100 (${scoreLevel(o.socialHarmony)}). Chi cho dân và bảo vệ người lao động thì tăng; xây quá nhiều hoặc để tư nhân nắm thì giảm.`,
      drivers: harmonyDrivers,
    },
    {
      id: "infrastructureLegacy",
      label: "Di sản hạ tầng",
      summary: `Đang ở mức ${o.infrastructureLegacy.toFixed(0)} trên 100 (${scoreLevel(o.infrastructureLegacy)}). Đầu tư vừa phải thì để lại thứ dùng lâu dài; xây quá tay thì dễ thành sân bỏ không.`,
      drivers: legacyDrivers,
    },
    {
      id: "nationalBrand",
      label: "Thương hiệu quốc gia",
      summary: `Đang ở mức ${o.nationalBrand.toFixed(0)} trên 100 (${scoreLevel(o.nationalBrand)}). Hình ảnh đất nước lên hay không phụ thuộc vào quảng bá du lịch và quy mô giải.`,
      drivers: brandDrivers,
    },
    {
      id: "fifaRevenue",
      label: "FIFA thu",
      summary: `Khoảng ${o.fifaRevenue.toFixed(1).replace(".", ",")} tỷ USD mỗi chu kỳ 4 năm (mô hình giải 48 đội — chu kỳ 2023–2026 FIFA công bố vượt 15 tỷ). Đây là tiền FIFA thu về; nước chủ nhà gần như không được chia phần bản quyền truyền hình.`,
      drivers: fifaDrivers,
    },
    {
      id: "hostCostUsd",
      label: "Chi phí nước chủ nhà",
      summary: `Khoảng ${o.hostCostUsd.toFixed(1).replace(".", ",")} tỷ USD, ước theo các kỳ thật (Nam Phi 3,6 tỷ đến Qatar 220 tỷ). Đây là tiền nước chủ nhà bỏ ra cho sân, tàu điện, an ninh.`,
      drivers: hostCostDrivers,
    },
    {
      id: "protestRisk",
      label: "Rủi ro biểu tình",
      summary: `Khoảng ${o.protestRisk.toFixed(0)}% (mức ${riskLevel(o.protestRisk)}). Tăng khi xây lớn và lo đánh bóng hình ảnh; giảm khi lo cho dân và người lao động.`,
      drivers: protestDrivers,
    },
    {
      id: "whiteElephantRisk",
      label: "Sân bỏ không",
      summary: `Khoảng ${o.whiteElephantRisk.toFixed(0)}% (mức ${riskLevel(o.whiteElephantRisk)}). Xây quá nhiều và để tư nhân dẫn dắt thì dễ để lại sân, tàu điện bỏ không sau giải.`,
      drivers: whiteElephantDrivers,
    },
    {
      id: "inequalityIndex",
      label: "Bất bình đẳng phân phối",
      summary: `Đang ở mức ${o.inequalityIndex.toFixed(0)} trên 100 (càng cao càng đáng lo). Nghiêng về tư nhân và cắt phúc lợi thì FIFA và giới đầu tư hưởng lợi, người lao động chịu phần thiệt.`,
      drivers: inequalityDrivers,
    },
  ];
}

export function computeOverview(config: OverviewConfig): OverviewOutcome {
  const infra = config.infrastructure / 100;
  const priv = config.publicPrivate / 100;
  const social = config.socialSpend / 100;
  const tourism = config.tourismFocus / 100;
  const labor = config.laborProtection / 100;
  const china = config.chinaPriority / 100;

  const economicBenefit = clamp(
    infra * 25 + tourism * 30 + china * 8 + (1 - social) * 5,
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

  const nationalBrand = clamp(tourism * 40 + infra * 20, 0, 100);

  const fifaRevenue = estimateFifaRevenueB({
    teams: MODEL_WC_TEAMS,
    asiaSlots: config.asiaSlots,
    chinaPriority: config.chinaPriority,
  });

  const hostCostUsd = estimateHostCostB({
    infrastructure: config.infrastructure,
    teams: MODEL_WC_TEAMS,
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
  const tags = buildTags(config, partial);

  const metricExplanations = buildMetricExplanations(config, {
    economicBenefit,
    socialHarmony,
    infrastructureLegacy,
    nationalBrand,
    fifaRevenue,
    hostCostUsd,
    protestRisk,
    whiteElephantRisk,
    inequalityIndex,
  });

  return {
    ...partial,
    hostCostUsd,
    tags,
    marxistLens,
    realWorldEcho,
    secondaryEchoes,
    metricExplanations,
  };
}

