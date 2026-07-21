/**
 * Dữ liệu bàn cờ "Đường đến World Cup".
 * Con số trong thẻ sự kiện & chi phí bám theo docs/realWorldData.ts (không bịa).
 */
import type {
  BuildOption,
  CountryArchetype,
  CountryProfile,
  EventCard,
  Tile,
} from "./boardgameTypes";

export const TURNS_PER_PLAYER = 12;

/** Màu dải nhóm địa ốc theo từng cạnh bàn cờ (chỉ trang trí kiểu Monopoly) */
const GROUP = {
  south: "var(--orange)",
  west: "var(--green)",
  north: "var(--cyan)",
  east: "var(--purple)",
} as const;

export const COUNTRY_PROFILES: Record<CountryArchetype, CountryProfile> = {
  developing: {
    id: "developing",
    label: "Nước đang phát triển",
    blurb:
      "Ít tiền, dễ vay nợ để đăng cai. Muốn thắng phải tiết kiệm, tái dùng sân như Đức 2006 — xây lớn là ôm nợ và sân trắng.",
    startingBudgetB: 10,
    budgetPerLap: 8,
    tourismBaseB: 1.5,
    socialBase: 12,
  },
  developed: {
    id: "developed",
    label: "Nước phát triển",
    blurb:
      "Ngân sách khá, hạ tầng sẵn. Dễ giữ cân bằng kinh tế và an sinh nếu không sa đà xây mới.",
    startingBudgetB: 25,
    budgetPerLap: 13,
    tourismBaseB: 2.5,
    socialBase: 16,
  },
  resource: {
    id: "resource",
    label: "Nước giàu tài nguyên",
    blurb:
      "Rất nhiều tiền, thừa sức xây hoành tráng kiểu Qatar. Nhưng chi to mà bỏ mặc an sinh thì sân trắng và bất bình đẳng kéo điểm xuống.",
    startingBudgetB: 55,
    budgetPerLap: 18,
    tourismBaseB: 3,
    socialBase: 7,
  },
};

/**
 * Bàn cờ vòng vuông 20 ô (kiểu Monopoly): 4 góc + 4 ô mỗi cạnh, đi 1 vòng = 1 kỳ World Cup.
 * Góc: 0 Khởi hành (GO), 5 Sân bay quốc tế, 10 Hội nghị G20, 15 Cấm vận.
 * Ô "xây" (sân/metro/an sinh) có dải màu nhóm như địa ốc Monopoly; cơ chế giữ nguyên.
 */
export const BOARD_TILES: Tile[] = [
  // Góc GO
  {
    id: "start",
    kind: "start",
    label: "Trạm khởi hành",
    icon: "🏁",
    blurb: "Qua đây là bước vào một kỳ World Cup mới — ngân sách quốc gia được cấp thêm.",
  },
  // Cạnh Nam (nhóm cam) — các thành phố châu Á
  {
    id: "stadium-hanoi",
    kind: "stadium",
    label: "Sân Hà Nội",
    icon: "🏟️",
    blurb: "FIFA đòi sân vòng bảng ít nhất 40.000 chỗ. Tái dùng rẻ, xây mới đắt và dễ bỏ không.",
    group: GROUP.south,
  },
  {
    id: "event-south",
    kind: "event",
    label: "Khí vận",
    icon: "📦",
    blurb: "Rút một biến cố có thật từ các kỳ World Cup trước.",
  },
  {
    id: "tourism-bangkok",
    kind: "tourism",
    label: "Du lịch Bangkok",
    icon: "✈️",
    blurb: "Khách đổ về trong mùa giải — nguồn thu thật hiếm hoi của nước chủ nhà.",
  },
  {
    id: "transport-jakarta",
    kind: "transport",
    label: "Metro Jakarta",
    icon: "🚇",
    blurb: "Giao thông thường tốn hơn cả sân. Làm tốt thì dân dùng lâu dài.",
    group: GROUP.south,
  },
  // Góc: Sân bay quốc tế (đón khách = thu du lịch)
  {
    id: "airport",
    kind: "tourism",
    label: "Sân bay quốc tế",
    icon: "🛬",
    blurb: "Cửa ngõ đón khách quốc tế — thêm một đợt thu du lịch cho nước chủ nhà.",
  },
  // Cạnh Tây (nhóm xanh lá)
  {
    id: "welfare-saopaulo",
    kind: "welfare",
    label: "An sinh Sao Paulo",
    icon: "🏥",
    blurb: "Chi cho dân — y tế, nhà ở, lương. Giữ xã hội êm, chống bất bình đẳng.",
    group: GROUP.west,
  },
  {
    id: "stadium-joburg",
    kind: "stadium",
    label: "Sân Johannesburg",
    icon: "🏟️",
    blurb: "Xây sân mới hay tái dùng? Nam Phi 2010 kỳ vọng lời lớn nhưng thực thu ít.",
    group: GROUP.west,
  },
  {
    id: "security-west",
    kind: "security",
    label: "An ninh mạng",
    icon: "🛡️",
    blurb: "Chi bắt buộc. Nga 2018 chặn 25 triệu vụ tấn công mạng trong một tháng.",
  },
  {
    id: "fifa-west",
    kind: "fifa",
    label: "FIFA thu",
    icon: "📜",
    blurb: "Nộp phí tổ chức. Bản quyền, tài trợ, ưu đãi thuế — FIFA nắm đằng chuôi.",
  },
  // Góc: Hội nghị G20 (sự kiện ngoại giao lớn)
  {
    id: "g20",
    kind: "event",
    label: "Hội nghị G20",
    icon: "🌐",
    blurb: "Sự kiện ngoại giao lớn — rút một lá bài bước ngoặt.",
  },
  // Cạnh Bắc (nhóm lam) — các thành phố lớn
  {
    id: "stadium-london",
    kind: "stadium",
    label: "Sân London",
    icon: "🏟️",
    blurb: "Sân biểu tượng, lên sóng toàn cầu — nhưng chi lớn dễ đội vốn.",
    group: GROUP.north,
  },
  {
    id: "event-north",
    kind: "event",
    label: "Cơ hội",
    icon: "❓",
    blurb: "Rút một biến cố có thật từ các kỳ World Cup trước.",
  },
  {
    id: "transport-paris",
    kind: "transport",
    label: "Metro Paris",
    icon: "🚇",
    blurb: "Metro Doha khoảng 36 tỷ là ví dụ giao thông ngốn tiền hơn cả sân.",
    group: GROUP.north,
  },
  {
    id: "tourism-tokyo",
    kind: "tourism",
    label: "Du lịch Tokyo",
    icon: "✈️",
    blurb: "Mùa giải kéo khách và truyền thông — nhưng sôi động xong rồi lắng.",
  },
  // Góc: Cấm vận (chỉ ghé qua, không tốn gì)
  {
    id: "embargo",
    kind: "corner",
    label: "Cấm vận",
    icon: "🔒",
    blurb: "Chỉ ghé qua — mọi thứ chững lại, bạn không tốn gì lượt này.",
  },
  // Cạnh Đông (nhóm tím)
  {
    id: "welfare-rome",
    kind: "welfare",
    label: "An sinh Rome",
    icon: "🏥",
    blurb: "Ngân sách xã hội giúp bảo trì công trình sau giải, đỡ bỏ hoang.",
    group: GROUP.east,
  },
  {
    id: "stadium-berlin",
    kind: "stadium",
    label: "Sân Berlin",
    icon: "🏟️",
    blurb: "Đức 2006 tái dùng sân, chi tiết kiệm — mẫu di sản bền vững.",
    group: GROUP.east,
  },
  {
    id: "security-east",
    kind: "security",
    label: "An ninh",
    icon: "🛡️",
    blurb: "Vây kín sân bằng an ninh; chưa chi thì dễ dính thẻ tấn công mạng.",
  },
  {
    id: "fifa-east",
    kind: "fifa",
    label: "FIFA thu",
    icon: "📜",
    blurb: "Lại một khoản chảy vào két FIFA — nước chủ nhà không được chia bản quyền.",
  },
];

/** Mức chi trên ô sân — mô phỏng slider hạ tầng của overview */
export const STADIUM_OPTIONS: BuildOption[] = [
  {
    id: "reuse",
    label: "Tái dùng sân có sẵn",
    hint: "Kiểu Đức 2006: rẻ, ít nguy cơ sân trắng, di sản khiêm tốn.",
    costB: 3,
    legacy: 6,
  },
  {
    id: "modest",
    label: "Xây sân mới vừa phải",
    hint: "Thêm di sản nhưng bắt đầu gánh rủi ro sân trắng.",
    costB: 8,
    legacy: 10,
    stadiums: 1,
  },
  {
    id: "grand",
    label: "Xây sân hoành tráng",
    hint: "Kiểu Qatar: đẹp, lên sóng toàn cầu, nhưng đắt và dễ bỏ hoang.",
    costB: 20,
    legacy: 14,
    stadiums: 2,
  },
];

/** Mức chi trên ô giao thông/đô thị */
export const TRANSPORT_OPTIONS: BuildOption[] = [
  {
    id: "skip",
    label: "Tận dụng sẵn có",
    hint: "Không tốn thêm, cũng không để lại gì mới.",
    costB: 0,
  },
  {
    id: "upgrade",
    label: "Nâng cấp vừa phải",
    hint: "Cải thiện giao thông, di sản dùng được lâu.",
    costB: 5,
    legacy: 7,
    socialHarmony: 3,
  },
  {
    id: "metro",
    label: "Metro mới (kiểu Doha khoảng 36 tỷ)",
    hint: "Đắt nhưng dân dùng dài hạn, di sản cao nhất.",
    costB: 18,
    legacy: 14,
    socialHarmony: 5,
  },
];

/** Mức chi trên ô an sinh xã hội */
export const WELFARE_OPTIONS: BuildOption[] = [
  {
    id: "cut",
    label: "Cắt phúc lợi dồn cho World Cup",
    hint: "Không chi cho dân — xã hội bất mãn, bất bình đẳng tăng.",
    costB: 0,
    socialHarmony: -6,
  },
  {
    id: "mid",
    label: "Chi an sinh vừa phải",
    hint: "Giữ xã hội tạm ổn.",
    costB: 4,
    socialHarmony: 6,
    socialSpendB: 4,
  },
  {
    id: "strong",
    label: "Ưu tiên người dân",
    hint: "Chi mạnh cho y tế, nhà ở — xã hội êm, chống sân trắng.",
    costB: 10,
    socialHarmony: 14,
    socialSpendB: 10,
  },
];

/** Chi an ninh bắt buộc mỗi lần dừng ô — che các thẻ tấn công mạng */
export const SECURITY_COST_B = 4;

/** Phí nộp cho FIFA mỗi lần dừng ô FIFA (vào két FIFA) */
export const FIFA_FEE_B = 3;

/** Bộ thẻ sự kiện — mỗi thẻ là biến cố thật, số bám theo docs */
export const EVENT_DECK: EventCard[] = [
  {
    id: "cost-overrun",
    title: "Sân đội vốn",
    detail:
      "Sân ở Saint Petersburg (Nga 2018) đội vốn hơn 5 lần dự toán. Ngân sách của bạn bốc hơi một khoản.",
    tag: "Đội vốn",
    budgetB: -5,
  },
  {
    id: "eviction",
    title: "Di dời cưỡng bức",
    detail:
      "Brazil 2014 di dời khoảng 250.000 người để lấy đất, dân xuống đường phản đối.",
    tag: "Biểu tình",
    socialHarmony: -10,
  },
  {
    id: "white-elephant",
    title: "Sân trắng",
    detail:
      "Arena da Amazônia (Manaus) 44.000 chỗ giữa rừng, sau giải bỏ hoang mà vẫn tốn bảo trì. Càng nhiều sân càng tốn.",
    tag: "Di sản",
    budgetPerStadium: -2,
    legacy: -4,
  },
  {
    id: "cyberattack",
    title: "Tấn công mạng",
    detail:
      "Một tháng Nga 2018 hứng hơn 25 triệu vụ tấn công mạng. Chưa chi an ninh thì thiệt hại lớn.",
    tag: "An ninh mạng",
    penaltyIfNoSecurity: -3,
  },
  {
    id: "soft-power",
    title: "Đổi hình ảnh quốc gia",
    detail:
      "Đức 2006 với chiến dịch 'Thế giới làm khách' xóa được hình ảnh cứng nhắc — quyền lực mềm tăng.",
    tag: "Quyền lực mềm",
    socialHarmony: 8,
  },
  {
    id: "tax-break",
    title: "Ưu đãi thuế cho FIFA",
    detail:
      "FIFA được miễn giảm thuế trên doanh thu bản quyền — tiền chảy vào két FIFA, không phải nước chủ nhà.",
    tag: "Mô hình FIFA",
    fifaGainB: 2,
  },
  {
    id: "winner-curse",
    title: "Lời hứa vỡ mộng",
    detail:
      "Nam Phi 2010 mơ lời 6 đến 12 tỷ, thực tế khách chỉ chi khoảng 0,5 tỷ. Khách quốc tế đến ít hơn nhiều so với dự báo.",
    tag: "Kỳ vọng",
    tourismIncomeB: -2,
  },
  {
    id: "tourism-boom",
    title: "Bùng nổ du lịch",
    detail:
      "Qatar 2022 đón khoảng 1 đến 1,4 triệu khách; IMF ước GDP tăng khoảng 0,7 đến 1% nhờ mùa giải.",
    tag: "Du lịch",
    tourismIncomeB: 2,
  },
  {
    id: "bid-cost",
    title: "Chi phí đấu thầu",
    detail:
      "Chỉ riêng làm hồ sơ xin đăng cai đã tốn 50 đến 150 triệu USD, thua là mất trắng.",
    tag: "Chi phí ẩn",
    budgetB: -1,
  },
  {
    id: "jobs",
    title: "Việc làm ba giai đoạn",
    detail:
      "Đầu tiên là xây dựng, rồi tới dịch vụ thời vụ, cuối cùng là vận hành lâu dài. Nếu quy hoạch tử tế, di sản việc làm ở lại.",
    tag: "Lao động",
    socialHarmony: 5,
    legacy: 3,
  },
];
