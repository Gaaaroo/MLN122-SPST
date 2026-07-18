import {
  FIFA_REVENUE,
  HOST_COST_BY_EDITION,
  TOURNAMENT_FORMAT,
  WC2026_ECONOMIC,
} from "./realWorldData";
import type { OverviewOutcome } from "./overviewTypes";

export interface DebatePersona {
  id: string;
  name: string;
  color: string;
  system: string;
}

const PERSONA_REPLY_RULES = `Quy tắc trả lời (bắt buộc):
- Luôn đọc và đáp đúng nội dung câu vừa nói gần nhất — nhất là khi đó là người tham gia thật (Bạn).
- Chào hỏi / xã giao / câu không rõ: đáp ngắn theo vai, hỏi lại ý họ muốn tranh luận gì; KHÔNG tự đọc diễn văn về FIFA/World Cup.
- Lệch chủ đề: nhận ra, kéo nhẹ về chủ đề nếu hợp lý, hoặc hỏi họ muốn bàn điểm nào.
- Có lập luận: phản biện/đồng ý trực tiếp với câu chữ của họ trước, rồi mới bổ sung quan điểm vai của bạn.
- Tiếng Việt tự nhiên, 2–5 câu, như đang nói chuyện trong phòng tranh luận.`;

export const DEBATE_PERSONAS: DebatePersona[] = [
  {
    id: "fifa",
    name: "Đại diện FIFA",
    color: "#b7791f",
    system: `Bạn đóng vai quan chức truyền thông FIFA trong tranh luận công khai về kinh tế World Cup. Giọng tự tin, nhấn mạnh doanh thu, phát triển bóng đá toàn cầu, việc làm và di sản. Không nói dối trắng trợn.\n\n${PERSONA_REPLY_RULES}`,
  },
  {
    id: "host",
    name: "Chính phủ nước chủ nhà",
    color: "#0891b2",
    system: `Bạn đóng vai quan chức kinh tế nước từng đăng cai World Cup. Thẳng thắn về lợi ích (du lịch, hạ tầng, hình ảnh) lẫn gánh nặng (đội vốn, nợ công, phân bổ không đều). Giọng thực dụng.\n\n${PERSONA_REPLY_RULES}`,
  },
  {
    id: "ktct",
    name: "Chuyên gia KTCT Mác–Lênin",
    color: "#9333ea",
    system: `Bạn đóng vai giảng viên Kinh tế chính trị Mác–Lênin. Phân tích World Cup bằng giá trị thặng dư, tích lũy tư bản, độc quyền, mâu thuẫn tư bản tư nhân vs chi phí xã hội hoá. Học thuật nhưng sắc, không giáo điều.\n\n${PERSONA_REPLY_RULES}`,
  },
  {
    id: "freemarket",
    name: "Kinh tế thị trường tự do",
    color: "#ea580c",
    system: `Bạn đóng vai nhà kinh tế thị trường tự do. World Cup là sản phẩm giải trí theo cung–cầu và hợp tác công–tư. Phản biện phóng đại lợi ích host lẫn diễn giải “chiếm đoạt” thuần Mác-xít khi phù hợp.\n\n${PERSONA_REPLY_RULES}`,
  },
  {
    id: "fan",
    name: "Người hâm mộ & cầu thủ",
    color: "#15a34a",
    system: `Bạn đại diện người hâm mộ và cầu thủ cơ sở: giá vé, quyền lợi lao động, lợi nhuận có quay lại cộng đồng không. Chân thực, đôi khi bức xúc nhưng có lý.\n\n${PERSONA_REPLY_RULES}`,
  },
];

export interface DebateTopic {
  id: string;
  label: string;
  prompt: string;
}

export const DEBATE_TOPICS: DebateTopic[] = [
  {
    id: "who-benefits",
    label: "World Cup lợi cho ai: chủ nhà hay FIFA?",
    prompt:
      "World Cup có thực sự mang lại lợi ích kinh tế cho nước chủ nhà, hay FIFA mới là bên hưởng lợi chính?",
  },
  {
    id: "monopoly",
    label: "FIFA có phải tổ chức độc quyền?",
    prompt: "FIFA có đang vận hành như một tổ chức độc quyền kiểu tư bản không?",
  },
  {
    id: "globalization",
    label: "Toàn cầu hoá qua World Cup: ai lợi, ai thiệt?",
    prompt: "Toàn cầu hoá tư bản qua World Cup: ai hưởng lợi, ai chịu thiệt?",
  },
  {
    id: "commodification",
    label: "Thương mại hoá có làm mất bản chất bóng đá?",
    prompt:
      "Thương mại hoá bóng đá đến mức này có đang làm mất bản chất môn thể thao và quyền lợi người hâm mộ, cầu thủ?",
  },
];

/** Số liệu tĩnh từ realWorldData — không bịa ngoài docs */
export function buildStaticLabContext(): string {
  return [
    `Số liệu Hostia / docs MLN122 (không bịa ngoài nguồn dự án):`,
    `- Doanh thu FIFA chu kỳ 2023–2026 (dự kiến): ~$${FIFA_REVENUE.CYCLE_2023_2026_PROJECTED}B`,
    `- Cơ cấu WC 2026 (ước tính): TV ~$${FIFA_REVENUE.WC2026_TV}B · vé ~$${FIFA_REVENUE.WC2026_TICKETS}B · tài trợ ~$${FIFA_REVENUE.WC2026_SPONSOR}B`,
    `- Quy mô 2026: ${TOURNAMENT_FORMAT.TEAMS_48} đội, ${TOURNAMENT_FORMAT.MATCHES_48_TEAM} trận, ${TOURNAMENT_FORMAT.WC2026_STADIUMS} sân (${TOURNAMENT_FORMAT.WC2026_USA_STADIUMS} Mỹ / ${TOURNAMENT_FORMAT.WC2026_MEXICO_STADIUMS} Mexico / ${TOURNAMENT_FORMAT.WC2026_CANADA_STADIUMS} Canada)`,
    `- Tác động kinh tế liên minh 2026 (dự phóng docs): tổng ~$${WC2026_ECONOMIC.ALLIANCE_TOTAL_B}B GDP; Mỹ ~$${WC2026_ECONOMIC.USA_GDP_IMPACT_B}B; Canada (Deloitte) ~$${WC2026_ECONOMIC.CANADA_DELOITTE_B}B; Mexico ~$${WC2026_ECONOMIC.MEXICO_DELOITTE_B}B`,
    `- Qatar 2022: tổng hạ tầng gắn WC ~$${HOST_COST_BY_EDITION.QATAR_2022_TOTAL}B (sân ~$${HOST_COST_BY_EDITION.QATAR_2022_STADIUMS}B)`,
    `- Brazil 2014 ~$${HOST_COST_BY_EDITION.BRAZIL_2014}B · Nga 2018 ~$${HOST_COST_BY_EDITION.RUSSIA_2018}B · Nam Phi 2010 ~$${HOST_COST_BY_EDITION.SOUTH_AFRICA_2010}B`,
    `- FIFA thường ~$${FIFA_REVENUE.TYPICAL_LOW}–${FIFA_REVENUE.TYPICAL_HIGH}B/chu kỳ; nhiều nghiên cứu cảnh báo lợi ích host thường bị phóng đại.`,
  ].join("\n");
}

export function buildLiveOutcomeContext(outcome: OverviewOutcome): string {
  return [
    `Kịch bản dashboard đang mở (Hostia):`,
    `- Chi phí host ước tính: ~$${outcome.hostCostUsd.toFixed(1)}B`,
    `- Doanh thu FIFA (chu kỳ): ~$${outcome.fifaRevenue.toFixed(1)}B`,
    `- Gánh nặng host: ${outcome.hostBurden.toFixed(0)}/100`,
    `- Bất bình đẳng phân phối: ${outcome.inequalityIndex.toFixed(0)}/100`,
    `- Rủi ro sân trắng: ${outcome.whiteElephantRisk.toFixed(0)}%`,
    `- Lợi ích kinh tế (chỉ số): ${outcome.economicBenefit.toFixed(0)} · Hài hòa xã hội: ${outcome.socialHarmony.toFixed(0)}`,
    `- Góc Mác–Lênin: ${outcome.marxistLens.dominant} — ${outcome.marxistLens.summary}`,
    `- Giống case thật: ${outcome.realWorldEcho.name} (${outcome.realWorldEcho.year}) ${outcome.realWorldEcho.match}%`,
  ].join("\n");
}

export function buildLabContext(outcome?: OverviewOutcome): string {
  const parts = [buildStaticLabContext()];
  if (outcome) parts.push(buildLiveOutcomeContext(outcome));
  return parts.join("\n\n");
}
