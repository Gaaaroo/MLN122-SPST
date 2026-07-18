/**
 * Landing “cuộn sách” — trục: chi phí · doanh thu · lợi nhuận ·
 * thành tựu · trước/sau · rủi ro · tác hại.
 * Số liệu ưu tiên docs MLN122; bổ sung từ FIFA, Statista, nghiên cứu ETH/ESPN.
 */

export const SCROLL_META = {
  brand: 'Hostia',
  brandYear: '2034',
  course: 'MLN122 · Kinh tế chính trị World Cup',
  scrollHint: 'Cuộn xuống để đọc cán cân',
} as const;

export const SCROLL_HERO = {
  kicker: 'CUỘN SÁCH ĐĂNG CAI',
  titleLine1: 'CÁN CÂN',
  titleLine2: 'WORLD CUP',
  quote:
    'Một tháng bóng đá. Hàng chục — thậm chí hàng trăm — tỷ đô. Ai trả? Ai thu? Ai gánh rủi ro?',
  quoteAttr: 'Góc nhìn kinh tế chính trị',
} as const;

/** 1 — Tổng chi phí */
export const SCROLL_COSTS = {
  chapter: '— 01 · TỔNG CHI PHÍ —',
  titleLine1: 'HÓA ĐƠN',
  titleLine2: 'ĐĂNG CAI',
  lead: 'Số tiền nước chủ nhà đổ vào ~30 ngày bóng đá — thường lớn hơn nhiều doanh thu FIFA cả chu kỳ.',
  rows: [
    {
      year: '2010',
      host: 'Nam Phi',
      cost: '$3.6B',
      note: '5 sân mới + Gautrain; lớn hơn GDP ~40 quốc gia lúc đó',
    },
    {
      year: '2014',
      host: 'Brazil',
      cost: '$15B',
      note: 'FIFA công bố; nghiên cứu khác ước tới ~$11–20B tùy phạm vi',
    },
    {
      year: '2018',
      host: 'Nga',
      cost: '$11.6B',
      note: 'Ước ban đầu ~$20B rồi điều chỉnh; sân St. Petersburg đội vốn ~540%',
    },
    {
      year: '2022',
      host: 'Qatar',
      cost: '~$220B*',
      note: '*Gồm metro, sân bay, thành phố mới — sân riêng ~$6.5–7B',
    },
  ],
  breakdown: {
    title: 'Tiền đổ vào đâu?',
    items: [
      {
        title: 'Sân vận động',
        body: 'Quy chuẩn FIFA: vòng bảng ≥40.000 · bán kết ≥60.000 · chung kết ≥80.000. VIP, mái che, spider cam, cỏ tự nhiên.',
      },
      {
        title: 'Giao thông & đô thị',
        body: 'Thường tốn hơn sân: metro, sân bay, cao tốc. Qatar: Doha Metro ~$36B; Lusail ~$45B.',
      },
      {
        title: 'An ninh & mạng',
        body: 'Pháo đài quanh sân + tường lửa. Nga 2018: >25 triệu tấn công mạng bị chặn trong 1 tháng.',
      },
      {
        title: 'Đấu thầu & hợp đồng',
        body: 'Hồ sơ đấu thầu $50–150M (thua = mất trắng). FIFA ưu đãi thuế; host trả cảnh sát, y tế, hạ tầng.',
      },
    ],
  },
  foot: 'Nguồn tổng hợp: docs dự án · Statista (chi phí đăng cai 1994–2022). Qatar $220B là ước tính hạ tầng quốc gia gắn WC, không chỉ sân bóng.',
} as const;

/** 2 — Doanh thu */
export const SCROLL_REVENUE = {
  chapter: '— 02 · DOANH THU —',
  titleLine1: 'AI THU',
  titleLine2: 'TIỀN?',
  lead: 'Hai dòng tiền khác nhau: FIFA bán bản quyền toàn cầu; nước chủ nhà sống nhờ du lịch và tiêu dùng ngắn hạn.',
  fifa: {
    title: 'Doanh thu FIFA (chu kỳ 4 năm)',
    items: [
      {
        label: '2015–2018',
        value: '$6.42B',
        note: 'Chu kỳ Nga 2018',
      },
      {
        label: '2019–2022',
        value: '$7.57B',
        note: 'FIFA Annual Report — +18% so với chu kỳ trước',
      },
      {
        label: 'Vé + hospitality 2022',
        value: '$949M',
        note: 'Vé $686M · hospitality $243M (Qatar)',
      },
      {
        label: 'Dự kiến 2023–2026',
        value: '~$11B',
        note: 'TV ~$4.2B · tài trợ ~$2.7B · vé ~$3B (ước docs)',
      },
    ],
  },
  host: {
    title: 'Doanh thu / dòng tiền nước chủ nhà',
    items: [
      {
        title: 'Du lịch',
        body: 'Qatar 2022: >1,4 triệu khách, lưu trú 2–3 tuần; IMF ước đóng góp +0,7–1% GDP năm đó.',
      },
      {
        title: 'Tiêu dùng nội địa',
        body: 'Đức 2006: bán lẻ áo đấu/phụ kiện +~$3B so cùng kỳ; FIFA ước tác động trực tiếp tới ~€2,86B.',
      },
      {
        title: 'Dịch vụ ngắn hạn',
        body: 'Nam Phi 2010: du lịch chiếm ~55% doanh thu ngành dịch vụ quý II — bùng nổ rồi hạ nhiệt.',
      },
      {
        title: 'Hỗ trợ từ FIFA',
        body: '2026: FIFA hỗ trợ khiêm tốn (~$400M cho 3 nước) + thưởng đội — không bù nổi hóa đơn hạ tầng.',
      },
    ],
  },
} as const;

/** 3 — Lợi nhuận */
export const SCROLL_PROFIT = {
  chapter: '— 03 · LỢI NHUẬN —',
  titleLine1: 'KỲ VỌNG',
  titleLine2: 'VÀ LỖ',
  lead: 'Báo cáo đấu thầu thường tô hồng. Thực tế sau giải: host thường lỗ tài chính; FIFA gần như luôn có lãi cấu trúc.',
  gaps: [
    {
      name: 'Hàn Quốc 2002',
      expected: '$8.9B',
      actual: '$1.35B',
      note: 'Thực tế ~15% kỳ vọng (Dentsu; docs MLN122)',
    },
    {
      name: 'Nam Phi 2010',
      expected: '$6–12B',
      actual: '~$0.3B',
      note: 'Thấp hơn 30–40 lần; ETH: đầu tư công ~17× ước ban đầu',
    },
    {
      name: 'Brazil 2014',
      expected: '$9–15B',
      actual: '~$2.4B',
      note: 'Chi gấp ~5 lần; GDP 2014 chỉ +0.5%',
    },
    {
      name: 'Nga 2018',
      expected: '$26–31B',
      actual: '~$14.5B*',
      note: '*LOC chính phủ; học giả ước du lịch ~$1B',
    },
  ],
  points: [
    {
      title: 'Lời nguyền kẻ chiến thắng',
      body: 'Ai vẽ viễn cảnh lạc quan hơn thường thắng đấu thầu — rồi ôm chi phí đội vốn và doanh thu thấp hơn dự báo.',
    },
    {
      title: 'Dự báo lệch 8–10 năm',
      body: 'Nghiên cứu làm trước giải gần một thập kỷ: lạm phát, địa chính trị, chuỗi cung ứng làm số liệu trên giấy lệch thực tế.',
    },
    {
      title: 'FIFA không gánh lỗ sân',
      body: 'Bản quyền TV/tài trợ về FIFA; bê tông, an ninh, bảo trì sau giải về ngân sách công / thuế dân.',
    },
  ],
  dual: {
    left: {
      year: 'FIFA',
      label: 'CẤU TRÚC LÃI',
      points: [
        'Chu kỳ gần đây ~$7–9B doanh thu; 2026 hướng ~$11B',
        'Không trả trực tiếp sân / metro / an ninh công cộng',
        'Ưu đãi thuế ở nhiều kỳ đăng cai',
      ],
    },
    right: {
      year: 'HOST',
      label: 'THƯỜNG LỖ RÒNG',
      points: [
        'Ôm hóa đơn hạ tầng + bảo trì “voi trắng”',
        'Việc làm thời vụ — lợi ích ngắn, gánh dài',
        'Lợi ích mềm (hình ảnh) khó quy đổi ra tiền mặt',
      ],
    },
  },
} as const;

/** 4 — Thành tựu */
export const SCROLL_ACHIEVE = {
  chapter: '— 04 · THÀNH TỰU —',
  titleLine1: 'NHỮNG GÌ',
  titleLine2: 'ĐẠT ĐƯỢC',
  lead: 'Không phải mọi thứ đều là lỗ. Soft power, hạ tầng bị “deadline” ép xong, và cú sốc cầu ngắn hạn là những thành tựu hay được nêu.',
  items: [
    {
      index: '01',
      title: 'Quyền lực mềm',
      body: 'Đức 2006: chiến dịch “Thế giới làm khách” — đổi định kiến cứng nhắc thành thân thiện, cải thiện Nation Brands Index.',
    },
    {
      index: '02',
      title: 'Đòn bẩy hạ tầng',
      body: 'Brazil: >$700M hoàn thiện hai tuyến BRT Rio — rút ngắn ~1/2 thời gian vào trung tâm. Nga: nâng cấp 11 sân bay vệ tinh.',
    },
    {
      index: '03',
      title: 'Hình ảnh & du lịch',
      body: 'Nga 2018: ~84% du khách khảo sát nhìn Nga tích cực hơn. Qatar: gắn WC với Vision 2030 giảm phụ thuộc dầu.',
    },
    {
      index: '04',
      title: 'Việc làm ngắn hạn',
      body: 'Đức 2006: ~50.000 việc làm thời vụ trong 8 tháng trước/trong giải. Cú sốc fanzone Brazil: doanh thu nhỏ lẻ +300–400%.',
    },
    {
      index: '05',
      title: 'Mô hình 2026: tránh xây mới',
      body: '16 sân có sẵn (NFL/MLS). Oxford Economics dự phóng GDP Mỹ +$17.2B; liên minh ~$40.9B — vẫn là dự phóng.',
    },
    {
      index: '06',
      title: 'Ngày hội tập thể',
      body: 'Hàng tỷ người xem; Nam Phi 2010 và Qatar 2022 tạo khoảnh khắc tự hào quốc gia / khu vực — giá trị biểu tượng khó định lượng.',
    },
  ],
} as const;

/** 5 — Trước / Sau */
export const SCROLL_BEFORE_AFTER = {
  chapter: '— 05 · TRƯỚC & SAU —',
  titleLine1: 'TRƯỚC GIẢI',
  titleLine2: 'SAU GIẢI',
  lead: 'Cùng một quốc gia, hai bức tranh: kỳ vọng lúc đấu thầu và di sản khi đèn tắt.',
  cases: [
    {
      name: 'Nam Phi 2010',
      before: [
        'Hứa hàng trăm nghìn việc làm & lợi ích tỷ đô',
        'Sân mới đạt chuẩn FIFA, hình ảnh châu Phi',
      ],
      after: [
        'Tỷ lệ có việc làm ~44% → ~41%; đáy kéo dài cả thập kỷ',
        'Cape Town Stadium lỗ vận hành hàng năm; giải quốc nội <10.000 KH/trận',
        'Gautrain: vé đắt ~5× xe công cộng thường; bảo trì >$100M/năm',
      ],
    },
    {
      name: 'Brazil 2014',
      before: [
        'Hứa “domino” đầu tư, đóng góp GDP lớn',
        'Siêu dự án đô thị + sân 12 thành phố',
      ],
      after: [
        'Biểu tình trước thềm giải: lạm phát ~6,5%, lương tối thiểu ~$313/tháng',
        'Arena da Amazônia / Manaus — gần như bỏ hoang sau giải',
        'Nợ đô thị đăng cai tăng; nhiều dự án hạ tầng không hoàn thành đúng hạn',
      ],
    },
    {
      name: 'Qatar 2022',
      before: [
        'Vision 2030: metro, sân bay, thành phố mới',
        'Sân 974: hứa tháo dỡ / tặng Uruguay',
      ],
      after: [
        'IMF: +0,7–1% GDP năm giải — cú hích ngắn',
        'Kế hoạch tháo dỡ 974 / giảm ghế Al Bayt–Al Janoub nhiều phần hủy',
        'Chi phí “quốc gia” gắn một tháng bóng đá vẫn gây tranh cãi',
      ],
    },
  ],
} as const;

/** 6 — Rủi ro */
export const SCROLL_RISKS = {
  chapter: '— 06 · RỦI RO —',
  titleLine1: 'CÁC RỦI RO',
  titleLine2: 'ĐĂNG CAI',
  lead: 'Từ đội vốn đến an ninh mạng — rủi ro nằm ở chỗ hóa đơn công, lợi nhuận tư.',
  items: [
    {
      index: '01',
      title: 'Đội vốn & tham nhũng',
      body: 'St. Petersburg: đội vốn ~540%. Áp lực deadline phút chót + hoa hồng địa phương đẩy ngân sách bay.',
    },
    {
      index: '02',
      title: 'Logistics đô thị',
      body: 'Durban 2010: ≥6 chuyến bay phải chuyển hướng; sân đẹp nhưng đường/sân bay không theo kịp.',
    },
    {
      index: '03',
      title: 'An ninh vật lý & mạng',
      body: 'Hàng triệu người tụ họp = pháo đài tốn kém. Nga 2018 chặn >25 triệu tấn công mạng/tháng giải.',
    },
    {
      index: '04',
      title: "Winner's curse",
      body: 'Thắng đấu thầu bằng số liệu lạc quan → sau giải nhận ra doanh thu thấp, chi phí cao hơn nhiều.',
    },
    {
      index: '05',
      title: 'Địa chính trị 2026',
      body: 'Liên minh 3 nước, Visa Bond, căng thẳng Mỹ–Iran, an ninh mang màu quân sự — rủi ro ngoài sân cỏ.',
    },
    {
      index: '06',
      title: 'Giá vé & phản ứng fan',
      body: '2026: dynamic pricing lần đầu; giá giao thông/đỗ xe tăng mạnh ở một số thành phố Mỹ — rủi ro “bóp” tiêu dùng.',
    },
  ],
} as const;

/** 7 — Tác hại */
export const SCROLL_HARMS = {
  chapter: '— 07 · TÁC HẠI —',
  titleLine1: 'AI TRẢ',
  titleLine2: 'GIÁ?',
  lead: 'Hào nhoáng trên TV. Phía sau: di dời, việc làm bấp bênh, voi trắng, và chi phí cơ hội với an sinh.',
  items: [
    {
      index: '01',
      title: 'Di dời & đền bù thấp',
      body: 'Brazil 2014: ~250.000 người buộc rời nhà; đền bù ước chỉ ~20–50% giá trị thực ở nhiều trường hợp được ghi nhận.',
    },
    {
      index: '02',
      title: 'Voi trắng',
      body: 'Cape Town, Manaus, Brasília… — sân 40–70k chỗ không có nhu cầu nội địa; bảo trì hàng năm đè lên ngân sách công.',
    },
    {
      index: '03',
      title: 'Việc làm thời vụ rồi mất',
      body: 'Nam Phi: việc làm xây dựng/dịch vụ tan sau giải; tỷ lệ việc làm tụt và kéo dài đáy cả thập kỷ.',
    },
    {
      index: '04',
      title: 'Chi phí cơ hội',
      body: 'Cape Town Stadium từng được so với chi phí tương đương hàng chục nghìn nhà ở xã hội — ưu tiên lệch khỏi nhu cầu dân sinh.',
    },
    {
      index: '05',
      title: 'Lao động & nhân quyền',
      body: 'Qatar 2022: chỉ trích quốc tế về điều kiện lao động nhập cư (hệ kafala) — soft power đổi lấy tổn hại hình ảnh.',
    },
    {
      index: '06',
      title: 'Miễn thuế FIFA',
      body: 'Brazil: FIFA/đối tác được ưu đãi thuế — ước hàng trăm triệu USD thất thu công (nghiên cứu ETH dẫn ~$290M).',
    },
  ],
} as const;

export const SCROLL_LESSONS = {
  chapter: '— BÀI HỌC —',
  title: 'Đọc cán cân như thế nào?',
  items: [
    {
      index: '01',
      title: 'Tách doanh thu FIFA và chi phí host',
      body: 'FIFA lãi trên bản quyền; host lãi/lỗ trên hạ tầng + du lịch ngắn hạn. Đừng cộng hai cột thành một “thắng”.',
    },
    {
      index: '02',
      title: 'Thành tựu ≠ lợi nhuận ròng',
      body: 'Soft power và BRT là thật — nhưng không tự động bù $15B hay $220B.',
    },
    {
      index: '03',
      title: 'Trước/sau mới thấy phân phối',
      body: 'Ai được việc làm ngắn hạn, ai bị di dời, ai trả bảo trì sân — đó là câu hỏi kinh tế chính trị.',
    },
    {
      index: '04',
      title: 'Mô phỏng để cảm nhận trade-off',
      body: 'Hostia 2034: kéo slider sân, an ninh, nhượng bộ FIFA — xem ai thắng trên bảng phân phối.',
    },
  ],
} as const;

export const SCROLL_CLOSE = {
  quote:
    'Dưới góc nhìn kinh tế chính trị, World Cup là cơ chế phân phối: FIFA và tư bản sự kiện thu bản quyền; nhà nước và người đóng thuế thường ôm hóa đơn; lao động và cư dân đô thị gánh rủi ro dài hạn.',
  titleLine1: 'Hãy cùng',
  titleLine2: 'nhau',
  ctaPrimary: 'Khám phá số liệu',
} as const;
