/**
 * Landing "cuộn sách" — trục: chi phí, doanh thu, lợi nhuận,
 * thành tựu, trước/sau, rủi ro, tác hại.
 * Mỗi chương có một điều rút ra gắn với Kinh tế chính trị Mác - Lênin (MLN122).
 * Số liệu ưu tiên docs MLN122; bổ sung từ FIFA, Statista, nghiên cứu ETH/ESPN.
 */

export interface ScrollTakeaway {
  /** Ý chính ngắn, dễ nhớ */
  concept: string;
  /** Giải thích 1-2 câu, tiếng Việt đời thường */
  body: string;
}

export const SCROLL_META = {
  brand: 'Hostia',
  brandYear: '2034',
  course: 'MLN122 - Kinh tế chính trị World Cup',
  scrollHint: 'Cuộn xuống',
} as const;

export const SCROLL_HERO = {
  kicker: 'MLN122 - Câu chuyện đăng cai World Cup',
  titleLine1: 'CÁN CÂN',
  titleLine2: 'WORLD CUP',
  quote:
    'Một tháng bóng đá, hàng chục thậm chí hàng trăm tỷ đô. Ai làm ra của cải? Ai giữ thương hiệu? Ai thu tiền? Ai trả hóa đơn?',
  quoteAttr: 'Bốn câu hỏi của kinh tế chính trị Mác - Lênin',
} as const;

/** 1 — Tổng chi phí */
export const SCROLL_COSTS = {
  chapter: '01 - Tổng chi phí',
  titleLine1: 'HÓA ĐƠN',
  titleLine2: 'ĐĂNG CAI',
  lead: 'Tiền xây sân, tàu điện, lo an ninh phần lớn lấy từ ngân sách nhà nước, tức tiền thuế và nợ công của cả nước. FIFA không trả khoản này.',
  rows: [
    {
      year: '2010',
      host: 'Nam Phi',
      cost: '$3.6B',
      note: 'Chủ yếu cho 5 sân mới, lớn hơn GDP của khoảng 40 nước lúc đó; tuyến tàu Gautrain khoảng 3,6 tỷ tính riêng',
    },
    {
      year: '2014',
      host: 'Brazil',
      cost: '$15B',
      note: 'Con số FIFA công bố; vài nghiên cứu ước tới 11 đến 20 tỷ tùy cách tính',
    },
    {
      year: '2018',
      host: 'Nga',
      cost: '$11.6B',
      note: 'Ban đầu ước khoảng 20 tỷ rồi giảm; riêng sân St. Petersburg đội vốn hơn 5 lần',
    },
    {
      year: '2022',
      host: 'Qatar',
      cost: '$220B',
      note: 'Gồm cả tàu điện, sân bay, thành phố mới; riêng sân bóng chỉ khoảng 6,5 đến 7 tỷ',
    },
  ],
  breakdown: {
    title: 'Tiền đổ vào đâu?',
    items: [
      {
        title: 'Sân vận động',
        body: 'Chuẩn FIFA: vòng bảng ít nhất 40.000 chỗ, bán kết 60.000, chung kết 80.000. Thêm khu VIP, mái che, camera, cỏ thật.',
      },
      {
        title: 'Giao thông và đô thị',
        body: 'Thường tốn hơn cả sân: tàu điện, sân bay, cao tốc. Qatar chi khoảng 36 tỷ cho tàu Doha, 45 tỷ cho thành phố Lusail.',
      },
      {
        title: 'An ninh và mạng',
        body: 'Vòng bảo vệ quanh sân cộng an ninh mạng. Nga 2018 chặn hơn 25 triệu vụ tấn công mạng chỉ trong một tháng.',
      },
      {
        title: 'Đấu thầu và hợp đồng',
        body: 'Chỉ làm hồ sơ xin đăng cai đã tốn 50 đến 150 triệu, thua là mất trắng. FIFA được miễn giảm thuế, còn nước chủ nhà lo cảnh sát, y tế, hạ tầng.',
      },
    ],
  },
  foot: 'Nguồn: tài liệu dự án và Statista (chi phí đăng cai 1994 đến 2022). Con số 220 tỷ của Qatar là cả hạ tầng quốc gia gắn với giải, không chỉ riêng sân bóng.',
  takeaway: {
    concept: 'Cả xã hội gánh chi phí',
    body: 'Nhà nước lấy tiền thuế dựng sẵn "sân khấu" cho giải. Chi phí do cả xã hội gánh, đây là bước đầu để bên tổ chức kiếm lời mà không phải tự bỏ đủ vốn.',
  } satisfies ScrollTakeaway,
} as const;

/** 2 — Doanh thu */
export const SCROLL_REVENUE = {
  chapter: '02 - Doanh thu',
  titleLine1: 'AI THU TIỀN?',
  titleLine2: '',
  lead: 'Có hai túi tiền khác nhau. FIFA bán bản quyền truyền hình và tài trợ toàn cầu. Nước chủ nhà chủ yếu sống nhờ khách du lịch và tiêu dùng trong vài tuần.',
  fifa: {
    title: 'Doanh thu FIFA (mỗi chu kỳ 4 năm)',
    items: [
      {
        label: '2015 đến 2018',
        value: '$6.42B',
        note: 'Chu kỳ World Cup Nga 2018',
      },
      {
        label: '2019 đến 2022',
        value: '$7.57B',
        note: 'Báo cáo FIFA, tăng 18% so với kỳ trước',
      },
      {
        label: 'Vé và gói VIP 2022',
        value: '$929M',
        note: 'Vé 686 triệu, gói VIP 243 triệu tại Qatar (báo cáo FIFA)',
      },
      {
        label: '2023 đến 2026',
        value: '$15B+',
        note: 'FIFA dự kiến 11 tỷ, sau giải 2026 công bố vượt 15 tỷ nhờ vé và gói VIP giá cao',
      },
    ],
  },
  host: {
    title: 'Tiền vào của nước chủ nhà',
    items: [
      {
        title: 'Du lịch',
        body: 'Qatar 2022 đón khoảng 1 đến 1,4 triệu khách tùy nguồn (IMF ước 1 triệu). IMF tính du lịch cộng bản quyền giúp GDP năm đó tăng thêm khoảng 0,7 đến 1%.',
      },
      {
        title: 'Tiêu dùng trong nước',
        body: 'Đức 2006: nghiên cứu đo được thêm khoảng 700.000 đêm lưu trú và 0,9 tỷ đô thu nhập du lịch ròng — còn bán lẻ nói chung gần như không tăng.',
      },
      {
        title: 'Dịch vụ ngắn hạn',
        body: 'Nam Phi 2010: chỉ 309.000 khách đến vì giải (dự báo 483.000), chi khoảng 0,5 tỷ đô — bùng lên vài tuần rồi nguội nhanh.',
      },
      {
        title: 'Hỗ trợ từ FIFA',
        body: 'Năm 2026 FIFA chỉ hỗ trợ sửa sân khoảng 200 đến 400 triệu cho cả 3 nước, cộng tiền thưởng đội. Trong khi đó 11 thành phố Mỹ ước hụt ít nhất 250 triệu chi phí tổ chức.',
      },
    ],
  },
  takeaway: {
    concept: 'Ai sở hữu thì người đó hưởng',
    body: 'FIFA giữ thương hiệu và bản quyền truyền hình, nguồn thu lớn và ổn định. Nước chủ nhà bỏ tiền xây sân nhưng không nắm cỗ máy in tiền chính. Ai sở hữu thì người đó được chia phần lớn.',
  } satisfies ScrollTakeaway,
} as const;

/** 3 — Lợi nhuận */
export const SCROLL_PROFIT = {
  chapter: '03 - Lợi nhuận',
  titleLine1: 'KỲ VỌNG',
  titleLine2: 'VÀ LỖ',
  lead: 'Khi xin đăng cai, báo cáo thường tô hồng. Sau giải, nước chủ nhà hay lỗ tiền mặt, còn FIFA gần như luôn có lãi nhờ cách ký hợp đồng.',
  gaps: [
    {
      name: 'Hàn Quốc 2002',
      expected: '$8.9B',
      actual: '$1.35B',
      note: 'Thu về chỉ bằng khoảng 15% con số hứa hẹn (Dentsu)',
    },
    {
      name: 'Nam Phi 2010',
      expected: '$6-12B',
      actual: '$0.5B',
      note: 'Chỉ 309.000 khách đến vì giải, chi khoảng 0,5 tỷ — kém lời hứa cả chục lần; tiền nhà nước bỏ ra gấp nhiều lần dự tính ban đầu',
    },
    {
      name: 'Brazil 2014',
      expected: '$70B',
      actual: '~$1B',
      note: 'Chính phủ từng hứa giải bơm tới 70 tỷ; Ngân hàng Trung ương chỉ đo được thêm cỡ 1 tỷ từ khách quốc tế, GDP năm 2014 chỉ nhích 0,5%',
    },
    {
      name: 'Nga 2018',
      expected: '$26-31B',
      actual: '$14.5B',
      note: 'Số do ban tổ chức nhà nước tự công bố; giới nghiên cứu độc lập ước du lịch chỉ mang về khoảng 1 đến 3 tỷ',
    },
  ],
  points: [
    {
      title: 'Lời nguyền kẻ thắng thầu',
      body: 'Ai vẽ viễn cảnh đẹp hơn thường thắng đấu thầu, rồi lãnh đủ chi phí đội vốn và doanh thu thấp hơn dự báo.',
    },
    {
      title: 'Dự báo lệch 8 đến 10 năm',
      body: 'Nghiên cứu làm trước giải gần cả chục năm. Lạm phát, chính trị, chuỗi cung ứng khiến số liệu trên giấy lệch xa thực tế.',
    },
    {
      title: 'FIFA không gánh lỗ sân',
      body: 'Bản quyền TV và tài trợ về FIFA. Còn bê tông, an ninh, bảo trì sau giải thì ngân sách công và tiền thuế dân lo.',
    },
  ],
  dual: {
    left: {
      year: 'FIFA',
      label: 'GẦN NHƯ LUÔN LÃI',
      points: [
        'Mấy chu kỳ gần đây thu 7 đến 9 tỷ; chu kỳ 2026 công bố vượt 15 tỷ',
        'Không trả trực tiếp cho sân, tàu điện hay an ninh công cộng',
        'Được miễn giảm thuế ở nhiều kỳ đăng cai',
      ],
    },
    right: {
      year: 'CHỦ NHÀ',
      label: 'THƯỜNG LỖ',
      points: [
        'Ôm hóa đơn hạ tầng và tiền bảo trì sân bỏ không',
        'Việc làm chỉ thời vụ, lợi ích ngắn mà gánh dài',
        'Lợi ích mềm như hình ảnh thì khó quy ra tiền mặt',
      ],
    },
  },
  takeaway: {
    concept: 'Lời vào túi tư nhân, lỗ chia cho dân',
    body: 'Lợi nhuận chảy về bên giữ bản quyền và các nhà thầu lớn. Còn lỗ và rủi ro đội vốn nằm ở ngân sách công. Đây là kiểu chia phần không đều rất quen dưới quan hệ tư bản.',
  } satisfies ScrollTakeaway,
} as const;

/** 4 — Thành tựu */
export const SCROLL_ACHIEVE = {
  chapter: '04 - Thành tựu',
  titleLine1: 'NHỮNG GÌ',
  titleLine2: 'ĐẠT ĐƯỢC',
  lead: 'Không phải mọi thứ đều xấu. Hình ảnh quốc gia, hạ tầng bị ép làm cho xong, việc làm ngắn hạn đều là thật. Nhưng cần hỏi: thành tựu đó thuộc về ai, kéo dài bao lâu?',
  items: [
    {
      index: '01',
      title: 'Quyền lực mềm',
      body: 'Đức 2006 dùng chiến dịch "Thế giới làm khách nhà bạn" để sửa hình ảnh "lạnh lùng, cứng nhắc". Kết quả đo được: trên bảng xếp hạng thương hiệu quốc gia Anholt, Đức từ khoảng hạng 5 trước giải nhảy lên hạng nhì ngay sau giải, cải thiện ở cả 17 tiêu chí.',
    },
    {
      index: '02',
      title: 'Đòn bẩy hạ tầng',
      body: 'Rio nhờ World Cup mà xong tuyến buýt nhanh TransCarioca dài 39 km với 45 trạm, chi hơn 1,9 tỷ real: người dùng đi nhanh hơn 35%, một chuyến từ 109 phút còn 71 phút. Nga 2018 xây nhà ga mới cho 11 sân bay và nâng cấp 20 ga đường sắt.',
    },
    {
      index: '03',
      title: 'Hình ảnh và du lịch',
      body: 'Nga 2018: 84% khán giả đến sân nói có thiện cảm hơn với Nga; khoảng 570.000 du khách nước ngoài đến trong tháng giải, chi khoảng 600 triệu euro. Qatar 2022 đón hơn 1 triệu khách và gắn giải với Tầm nhìn 2030 để giảm phụ thuộc dầu khí.',
    },
    {
      index: '04',
      title: 'Việc làm và chi tiêu ngắn hạn',
      body: 'Cơ quan lao động Đức đếm được 25.000 đến 50.000 việc làm thêm quanh giải 2006 — phần lớn thời vụ, chỉ cỡ 0,1% lực lượng lao động. Du lịch Đức có thêm 700.000 đêm lưu trú. Brazil 2014 đón 1 triệu khách quốc tế, gần gấp đôi mức dự kiến 600.000.',
    },
    {
      index: '05',
      title: 'Cách làm 2026: tránh xây mới',
      body: 'Dùng 16 sân có sẵn ở Mỹ, Canada, Mexico thay vì xây mới. Nghiên cứu do FIFA đặt làm dự đoán GDP Mỹ tăng thêm 17,2 tỷ, toàn cầu khoảng 40,9 tỷ — nhưng giới phân tích độc lập cho rằng con số này được thổi phồng.',
    },
    {
      index: '06',
      title: 'Ngày hội chung',
      body: 'Qatar 2022: khoảng 5 tỷ người theo dõi nội dung giải, gần 1,5 tỷ người xem trận chung kết, 3,4 triệu khán giả đến sân. Ở Nam Phi 2010, khảo sát người dân trước và sau giải cho thấy niềm tự hào dân tộc tăng rõ rệt.',
    },
  ],
  takeaway: {
    concept: 'Thành tựu chưa chắc là lợi cho số đông',
    body: 'Hình ảnh đẹp và tuyến buýt mới có thể có ích thật, nhưng không tự nhiên thành "cả dân cùng thắng". Của cải làm ra vẫn chia lệch: hình ảnh và hợp đồng lớn về bên tổ chức, người lao động phần nhiều chỉ có việc làm tạm rồi hết giải là hết.',
  } satisfies ScrollTakeaway,
} as const;

/** 5 — Trước / Sau */
export const SCROLL_BEFORE_AFTER = {
  chapter: '05 - Trước và sau',
  titleLine1: 'TRƯỚC GIẢI',
  titleLine2: 'SAU GIẢI',
  lead: 'Cùng một nước, hai bức tranh. Lúc đấu thầu là lời hứa việc làm và tỷ đô. Khi đèn tắt là tiền bảo trì sân, việc làm biến mất và khoản nợ còn lại.',
  cases: [
    {
      name: 'Nam Phi 2010',
      before: [
        'Hứa hàng trăm nghìn việc làm và lợi ích tỷ đô',
        'Sân mới đạt chuẩn FIFA, làm đẹp hình ảnh châu Phi',
      ],
      after: [
        'Tỷ lệ có việc làm tụt từ khoảng 44% xuống 41% và nằm đáy cả chục năm',
        'Sân Cape Town lỗ vận hành mỗi năm, giải trong nước chưa tới 10.000 khách một trận',
        'Tàu Gautrain vé đắt gấp khoảng 5 lần xe buýt thường, bảo trì hơn 100 triệu mỗi năm',
      ],
    },
    {
      name: 'Brazil 2014',
      before: [
        'Hứa kéo theo làn sóng đầu tư, đóng góp GDP lớn',
        'Siêu dự án đô thị và sân ở 12 thành phố',
      ],
      after: [
        'Biểu tình ngay trước giải: lạm phát khoảng 6,5%, lương tối thiểu chỉ khoảng 313 đô một tháng',
        'Sân Arena da Amazônia ở Manaus gần như bỏ hoang sau giải',
        'Nợ của các thành phố đăng cai tăng, nhiều dự án hạ tầng không kịp về đích',
      ],
    },
    {
      name: 'Qatar 2022',
      before: [
        'Kế hoạch quốc gia: tàu điện, sân bay, thành phố mới',
        'Sân 974 hứa tháo dỡ rồi tặng cho Uruguay',
      ],
      after: [
        'IMF: GDP năm giải tăng thêm 0,7 đến 1%, một cú hích ngắn',
        'Kế hoạch tháo sân 974 và bớt ghế hai sân lớn phần lớn bị hoãn',
        'Việc gắn hàng trăm tỷ vào một tháng bóng đá vẫn gây tranh cãi',
      ],
    },
  ],
  takeaway: {
    concept: 'Lời hứa khác với thực tế chia phần',
    body: 'Trước giải ai cũng hô "cùng thắng". Sau giải, lợi ích ngắn hạn tan đi, phần gánh dài hạn còn ở lại. Nhìn trước và sau mới thấy ai thật sự được chia phần, thay vì chỉ nghe khẩu hiệu tăng trưởng.',
  } satisfies ScrollTakeaway,
} as const;

/** 6 — Rủi ro */
export const SCROLL_RISKS = {
  chapter: '06 - Rủi ro',
  titleLine1: 'CÁC RỦI RO',
  titleLine2: 'ĐĂNG CAI',
  lead: 'Từ đội vốn đến an ninh, rủi ro nằm ở phần hóa đơn công, trong khi lợi nhuận lớn vẫn thuộc bên giữ bản quyền và các nhà thầu.',
  items: [
    {
      index: '01',
      title: 'Đội vốn và tham nhũng',
      body: 'Sân St. Petersburg đội vốn hơn 5 lần. Áp lực làm gấp cộng tiền lót tay đẩy ngân sách bay xa dự toán.',
    },
    {
      index: '02',
      title: 'Giao thông đô thị',
      body: 'Durban 2010 có ít nhất 6 chuyến bay phải bay vòng. Sân thì đẹp nhưng đường và sân bay không theo kịp.',
    },
    {
      index: '03',
      title: 'An ninh và tấn công mạng',
      body: 'Hàng triệu người tụ họp nên phải vây kín rất tốn kém. Nga 2018 chặn hơn 25 triệu vụ tấn công mạng trong tháng giải.',
    },
    {
      index: '04',
      title: 'Lời nguyền kẻ thắng thầu',
      body: 'Thắng đấu thầu bằng số liệu lạc quan, rồi sau giải mới nhận ra doanh thu thấp còn chi phí cao hơn nhiều.',
    },
    {
      index: '05',
      title: 'Chính trị năm 2026',
      body: 'Ba nước cùng tổ chức, thủ tục visa, căng thẳng Mỹ và Iran, an ninh nặng màu quân sự đều là rủi ro ngoài sân cỏ.',
    },
    {
      index: '06',
      title: 'Giá vé và phản ứng của fan',
      body: 'Năm 2026 lần đầu bán vé theo giá thay đổi liên tục; phí đi lại và gửi xe tăng mạnh ở vài thành phố Mỹ, dễ làm dân ngại chi tiêu.',
    },
  ],
  takeaway: {
    concept: 'Nhà nước đỡ lưng cho bên tổ chức',
    body: 'Khi rủi ro xảy ra, ngân sách và người đóng thuế thường là bên hứng chịu. Miễn thuế, bao an ninh, bù đội vốn, nhà nước gánh chi phí để bảo đảm lợi nhuận cho bên tổ chức và nhà thầu.',
  } satisfies ScrollTakeaway,
} as const;

/** 7 — Tác hại */
export const SCROLL_HARMS = {
  chapter: '07 - Tác hại',
  titleLine1: 'AI TRẢ GIÁ?',
  titleLine2: '',
  lead: 'Trên TV là ngày hội. Phía sau là chuyện di dời nhà cửa, việc làm bấp bênh, sân bỏ không và những đồng tiền lẽ ra làm được nhà ở hay bệnh viện.',
  items: [
    {
      index: '01',
      title: 'Di dời và đền bù thấp',
      body: 'Brazil 2014 có khoảng 250.000 người bị buộc rời nhà, nhiều trường hợp chỉ được đền bù cỡ 20 đến 50% giá trị thật.',
    },
    {
      index: '02',
      title: 'Sân xây xong rồi bỏ không',
      body: 'Cape Town, Manaus, Brasília có sân 40.000 đến 70.000 chỗ mà trong nước không dùng hết, mỗi năm vẫn tốn tiền bảo trì từ ngân sách.',
    },
    {
      index: '03',
      title: 'Việc làm thời vụ rồi mất',
      body: 'Ở Nam Phi, việc làm xây dựng và dịch vụ tan sau giải. Tỷ lệ có việc làm tụt xuống rồi nằm đáy cả chục năm.',
    },
    {
      index: '04',
      title: 'Đánh đổi cơ hội',
      body: 'Tiền xây sân Cape Town từng được so là đủ làm hàng chục nghìn căn nhà ở xã hội. Ưu tiên đặt lệch khỏi nhu cầu của dân.',
    },
    {
      index: '05',
      title: 'Lao động và nhân quyền',
      body: 'Qatar 2022 bị chỉ trích nhiều về điều kiện của lao động nhập cư. Hình ảnh đẹp đổi lấy tai tiếng.',
    },
    {
      index: '06',
      title: 'Miễn thuế cho FIFA',
      body: 'Ở Brazil, FIFA và đối tác được ưu đãi thuế, ước làm ngân sách hụt hàng trăm triệu đô (nghiên cứu ETH nêu khoảng 290 triệu).',
    },
  ],
  takeaway: {
    concept: 'Ai làm ra của cải, ai chịu thiệt',
    body: 'Công nhân xây sân, dân bị di dời, người đóng thuế là những người tạo điều kiện và trả giá. Phần lớn bản quyền và tài trợ lại về FIFA cùng bên tổ chức. Đó là chuyện "người làm ra không phải người được hưởng".',
  } satisfies ScrollTakeaway,
} as const;

export const SCROLL_LESSONS = {
  chapter: 'Bài học MLN122',
  title: 'World Cup soi dưới kinh tế chính trị Mác–Lênin',
  lead: 'Năm ý dưới đây gắn số liệu World Cup với khung Kinh tế chính trị Mác–Lênin: ai tạo ra của cải, ai sở hữu, ai hưởng, ai trả.',
} as const;

export const SCROLL_CLOSE = {
  quote:
    'Nhìn bằng kinh tế chính trị Mác - Lênin, World Cup là một cách chia của cải: FIFA và bên tổ chức thu bản quyền, nhà nước và người đóng thuế thường ôm hóa đơn, còn người lao động và dân đô thị gánh rủi ro lâu dài.',
  titleLine1: 'ĐẾN LƯỢT',
  titleLine2: 'BẠN CHỌN',
  ctaPrimary: 'Khám phá số liệu',
} as const;

export const SCROLL_TEAM = {
  group: 'Nhóm 1',
  members: [
    { name: 'Nguyễn Minh Châu', id: 'SE180582' },
    { name: 'Nguyễn Đức Huỳnh', id: 'SE193874' },
    { name: 'Võ Việt Minh Đức', id: 'SE193219' },
    { name: 'Trần Đăng Khoa', id: 'SE194576' },
  ],
} as const;

/** Ảnh nền — Unsplash / Wikimedia Commons. */
export const SCROLL_VISUALS = {
  chapterBg: {
    costs: '/landing/stadium-night.jpg',
    revenue: '/landing/crowd.jpg',
    profit: '/landing/pitch-ball.jpg',
    achieve: '/landing/kick.jpg',
    'before-after': '/landing/stadium-lights.jpg',
    risks: '/landing/stadium-night.jpg',
    harms: '/landing/crowd.jpg',
    lessons: '/landing/stadium-lights.jpg',
    close: '/landing/kick.jpg',
  } as Record<string, string>,
} as const;
