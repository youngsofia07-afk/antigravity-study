// 올인원 중고거래 통합 데이터 모듈

// 1. 플랫폼 정보 정의
const PLATFORMS = {
  carrot: { name: '당근마켓', color: '#ff7e36', lightColor: '#ffebd2', badgeClass: 'badge-carrot' },
  bunjang: { name: '번개장터', color: '#f72f4e', lightColor: '#ffe5e8', badgeClass: 'badge-bunjang' },
  joonggonara: { name: '중고나라', color: '#03c75a', lightColor: '#e1f9eb', badgeClass: 'badge-joonggonara' }
};

// 2. 카테고리 정의
const CATEGORIES = {
  digital: '디지털/가전',
  fashion: '패션/의류',
  living: '리빙/가구',
  hobby: '도서/티켓/취미'
};

// 3. 가상 매물 데이터 (검색 및 필터링용)
const PRODUCTS = [
  // --- 디지털/가전 ---
  {
    id: 1,
    platform: 'carrot',
    title: '아이폰 15 프로 128GB 내츄럴 티타늄 자급제',
    category: 'digital',
    price: 980000,
    date: '2026-06-18',
    status: 'selling',
    location: '서울 마포구 공덕동',
    condition: 'S', // S: 미개봉/S급, A: 사용감 적음, B: 사용감 많음
    description: '구매한 지 한 달 정도 되었고, 케이스와 필름 부착해서 기스 전혀 없습니다. 배터리 성능 100%입니다.',
    views: 124,
    hearts: 12,
    seller: { nickname: '사과농장주인', rating: '39.5도' }
  },
  {
    id: 2,
    platform: 'bunjang',
    title: '아이폰 15 프로 256GB 블랙 풀박스 급처',
    category: 'digital',
    price: 1050000,
    date: '2026-06-19',
    status: 'selling',
    location: '서울 강남구 역삼동',
    condition: 'A',
    description: '액정에 미세한 생활 기스 제외하고 테두리 깨끗합니다. 박스랑 미사용 정품 케이블 포함입니다.',
    views: 89,
    hearts: 8,
    seller: { nickname: '폰가게아님', rating: '별 4.5' }
  },
  {
    id: 3,
    platform: 'joonggonara',
    title: '[미개봉] 아이폰 15 프로 128G 화이트 자급제 팝니다',
    category: 'digital',
    price: 1100000,
    date: '2026-06-17',
    status: 'selling',
    location: '전국 택배 배송',
    condition: 'S',
    description: '완전 미개봉 새제품입니다. 영수증 동봉 가능하며, 직거래는 대전 서구에서 가능합니다.',
    views: 210,
    hearts: 15,
    seller: { nickname: '신뢰거래자', rating: '우수회원' }
  },
  {
    id: 4,
    platform: 'carrot',
    title: '맥북 에어 M3 13인치 8G/256G 스페이스 그레이',
    category: 'digital',
    price: 1150000,
    date: '2026-06-18',
    status: 'selling',
    location: '서울 서대문구 신촌동',
    condition: 'A',
    description: '집에서 유튜브 시청용으로만 가끔 썼습니다. 배터리 사이클 18회로 상태 극상입니다.',
    views: 95,
    hearts: 14,
    seller: { nickname: '신촌자취러', rating: '41.2도' }
  },
  {
    id: 5,
    platform: 'bunjang',
    title: '맥북 에어 M2 13인치 스타라이트 16G/512G 램업글',
    category: 'digital',
    price: 1250000,
    date: '2026-06-19',
    status: 'reserved',
    location: '경기 성남시 분당구',
    condition: 'A',
    description: '디자인 작업용으로 램 16기가 모델로 업그레이드했습니다. 파우치 같이 드려요.',
    views: 142,
    hearts: 22,
    seller: { nickname: '디자이너K', rating: '별 5.0' }
  },
  {
    id: 6,
    platform: 'joonggonara',
    title: '맥북 에어 M1 13인치 스그 8G 256G 가성비 템',
    category: 'digital',
    price: 680000,
    date: '2026-06-16',
    status: 'completed',
    location: '서울 종로구 혜화동',
    condition: 'B',
    description: '외관 모서리에 찍힘이 다소 있습니다. 감안해서 저렴하게 올립니다. 성능은 이상 없습니다.',
    views: 310,
    hearts: 9,
    seller: { nickname: '빠른판매만', rating: '일반회원' }
  },
  {
    id: 7,
    platform: 'carrot',
    title: '닌텐도 스위치 OLED 화이트 풀세트 + 타이틀 2개',
    category: 'digital',
    price: 320000,
    date: '2026-06-19',
    status: 'selling',
    location: '서울 영등포구 여의도동',
    condition: 'A',
    description: '구입 후 동물의 숲만 잠깐 하다가 보관해 두었습니다. 조이콘 쏠림 없고 상태 아주 좋습니다. 마리오카트, 젤다 포함.',
    views: 75,
    hearts: 11,
    seller: { nickname: '여의도직딩', rating: '37.8도' }
  },

  // --- 패션/의류 ---
  {
    id: 8,
    platform: 'carrot',
    title: '나이키 에어포스 1 07 로우 올화이트 270 사이즈',
    category: 'fashion',
    price: 85000,
    date: '2026-06-18',
    status: 'selling',
    location: '인천 연수구 송도동',
    condition: 'A',
    description: '실착 3회 미만으로 밑창 솔도 거의 살아있습니다. 사이즈 미스로 판매합니다.',
    views: 65,
    hearts: 5,
    seller: { nickname: '신발정리중', rating: '36.5도' }
  },
  {
    id: 9,
    platform: 'bunjang',
    title: '[265] 슈프림 x 나이키 에어포스 1 로우 화이트 새상품',
    category: 'fashion',
    price: 185000,
    date: '2026-06-19',
    status: 'selling',
    location: '서울 용산구 한남동',
    condition: 'S',
    description: '크림에서 구입한 100% 정품 미개봉 새제품입니다. 슈프림 여분 빨간 끈 포함입니다.',
    views: 120,
    hearts: 18,
    seller: { nickname: '한남스트릿', rating: '별 4.9' }
  },
  {
    id: 10,
    platform: 'joonggonara',
    title: '나이키 에어포스 1 로우 슈프림 블랙 275 정품',
    category: 'fashion',
    price: 160000,
    date: '2026-06-17',
    status: 'completed',
    location: '경기 용인시 기흥구',
    condition: 'A',
    description: '5회 정도 조심스럽게 착용했습니다. 앞코 구김 방지 슈가드 넣어서 보관하여 상태 좋습니다.',
    views: 112,
    hearts: 7,
    seller: { nickname: '안전거래환영', rating: '우수회원' }
  },
  {
    id: 11,
    platform: 'bunjang',
    title: '아크테릭스 베타 LT 재킷 블랙 M사이즈 팝니다',
    category: 'fashion',
    price: 520000,
    date: '2026-06-19',
    status: 'selling',
    location: '대구 수성구 범어동',
    condition: 'A',
    description: '아웃도어 활동 없이 도심에서 윈드브레이커로 몇 번 입었습니다. 발수 상태 짱짱합니다.',
    views: 154,
    hearts: 25,
    seller: { nickname: '고프코어매니아', rating: '별 5.0' }
  },
  {
    id: 12,
    platform: 'carrot',
    title: '파타고니아 신칠라 스냅티 오트밀 L사이즈',
    category: 'fashion',
    price: 110000,
    date: '2026-06-18',
    status: 'selling',
    location: '서울 송파구 잠실동',
    condition: 'A',
    description: '보풀이나 늘어남 거의 없고 상태 양호합니다. 구매 후 드라이클리닝 해두었습니다.',
    views: 43,
    hearts: 4,
    seller: { nickname: '잠실주민', rating: '45.0도' }
  },

  // --- 리빙/가구 ---
  {
    id: 13,
    platform: 'carrot',
    title: '허먼밀러 에어론 체어 풀 스펙 B사이즈 미네랄',
    category: 'living',
    price: 1650000,
    date: '2026-06-17',
    status: 'selling',
    location: '서울 서초구 반포동',
    condition: 'A',
    description: '23년 초 구매제품으로 정품 보증서 보유하고 있습니다. 포스처핏, 조절형 팔걸이 등 다 들어간 풀옵션입니다.',
    views: 180,
    hearts: 30,
    seller: { nickname: '개발자A', rating: '52.1도' }
  },
  {
    id: 14,
    platform: 'joonggonara',
    title: '허먼밀러 에어론 리마스터드 풀 라이트 그레이 B사이즈',
    category: 'living',
    price: 1550000,
    date: '2026-06-18',
    status: 'reserved',
    location: '경기 성남시 분당구',
    condition: 'A',
    description: '이사하게 되면서 가구 정리 차 급처합니다. 직거래만 가능하며, 차로 실어가셔야 합니다.',
    views: 130,
    hearts: 14,
    seller: { nickname: '이사준비중', rating: '일반회원' }
  },
  {
    id: 15,
    platform: 'carrot',
    title: '이케아 토르스비 식탁 테이블 (화이트/크롬)',
    category: 'living',
    price: 60000,
    date: '2026-06-16',
    status: 'completed',
    location: '서울 강동구 천호동',
    condition: 'B',
    description: '상판 유리에 생활 스크래치가 있습니다. 프레임 튼튼합니다. SUV 승용차에 실립니다.',
    views: 98,
    hearts: 3,
    seller: { nickname: '미니멀라이프', rating: '48.9도' }
  },
  {
    id: 16,
    platform: 'carrot',
    title: '데스커 컴퓨터 책상 1200x600 내추럴 화이트',
    category: 'living',
    price: 70000,
    date: '2026-06-19',
    status: 'selling',
    location: '서울 동작구 사당동',
    condition: 'A',
    description: '사용 기간 6개월 미만으로 흔들림 없고 상판 흠집 없이 깨끗합니다. 다리 분리해 뒀습니다.',
    views: 55,
    hearts: 6,
    seller: { nickname: '사당동주민', rating: '36.5도' }
  },

  // --- 도서/티켓/취미 ---
  {
    id: 17,
    platform: 'carrot',
    title: '슬램덩크 오리지널 박스판 전권 세트 (1~31권)',
    category: 'hobby',
    price: 120000,
    date: '2026-06-18',
    status: 'selling',
    location: '서울 마포구 망원동',
    condition: 'S',
    description: '박스 보관만 하여 변색 전혀 없고 책장 주름도 없는 S급 상태입니다. 소장용 추천.',
    views: 88,
    hearts: 13,
    seller: { nickname: '수집가', rating: '55.0도' }
  },
  {
    id: 18,
    platform: 'bunjang',
    title: '슬램덩크 신장재편판 전권 세트 (1~20권 완결)',
    category: 'hobby',
    price: 95000,
    date: '2026-06-19',
    status: 'selling',
    location: '인천 부평구 부평동',
    condition: 'A',
    description: '한 번 정독하고 꽂아두어 새 책 같은 상태입니다. 겉표지 래핑 및 상태 양호합니다.',
    views: 62,
    hearts: 8,
    seller: { nickname: '부평직거래', rating: '별 4.8' }
  },
  {
    id: 19,
    platform: 'joonggonara',
    title: '레고 스타워즈 75192 밀레니엄 팔콘 조립품',
    category: 'hobby',
    price: 650000,
    date: '2026-06-15',
    status: 'completed',
    location: '경기 고양시 일산동구',
    condition: 'A',
    description: '장식장 내 보관하여 먼지 없고 누락 부품 없습니다. 설명서 및 박스 보유 중입니다. 직거래 선호.',
    views: 220,
    hearts: 19,
    seller: { nickname: '레고빌더', rating: '최우수회원' }
  },
  {
    id: 20,
    platform: 'bunjang',
    title: '레고 테크닉 42115 람보르기니 시안 미개봉 새제품',
    category: 'hobby',
    price: 360000,
    date: '2026-06-19',
    status: 'selling',
    location: '부산 진구 전포동',
    condition: 'S',
    description: '레고 코리아 정품 칼박 미개봉 상품입니다. 박스 모서리 찍힘 없이 깨끗합니다.',
    views: 104,
    hearts: 11,
    seller: { nickname: '미개봉만팜', rating: '별 4.5' }
  }
];

// 4. 내 판매/구매 리스트 (통합 모니터링 뷰용)
const MY_TRANSACTIONS = [
  {
    id: 101,
    type: 'sell',
    platform: 'carrot',
    title: '아이폰 14 프로 256GB 스페이스 블랙',
    category: 'digital',
    price: 780000,
    status: 'completed',
    date: '2026-06-15',
    buyerOrSeller: '민트초코러버',
    views: 185,
    hearts: 22
  },
  {
    id: 102,
    type: 'sell',
    platform: 'bunjang',
    title: '나이키 에어포스 1 07 올화이트 270',
    category: 'fashion',
    price: 85000,
    status: 'selling',
    date: '2026-06-18',
    buyerOrSeller: '-',
    views: 45,
    hearts: 3
  },
  {
    id: 103,
    type: 'sell',
    platform: 'joonggonara',
    title: '맥북 에어 M1 13인치 스그 8G 256G',
    category: 'digital',
    price: 680000,
    status: 'reserved',
    date: '2026-06-17',
    buyerOrSeller: '스튜디오개발',
    views: 114,
    hearts: 8
  },
  {
    id: 104,
    type: 'sell',
    platform: 'carrot',
    title: '데스커 컴퓨터 책상 1200x600',
    category: 'living',
    price: 70000,
    status: 'selling',
    date: '2026-06-19',
    buyerOrSeller: '-',
    views: 21,
    hearts: 2
  },
  {
    id: 105,
    type: 'buy',
    platform: 'carrot',
    title: '닌텐도 스위치 OLED 화이트',
    category: 'digital',
    price: 310000,
    status: 'completed',
    date: '2026-06-12',
    buyerOrSeller: '친절한이웃',
    views: 0,
    hearts: 0
  },
  {
    id: 106,
    type: 'buy',
    platform: 'joonggonara',
    title: '슬램덩크 오리지널 박스판 1~31권',
    category: 'hobby',
    price: 110000,
    status: 'completed',
    date: '2026-06-14',
    buyerOrSeller: '중고서적전문',
    views: 0,
    hearts: 0
  }
];

// 5. 키워드별 시세 데이터 (최근 30일 시세 조회용)
const MARKET_TRENDS = {
  iphone: [
    { date: '05-21', avgPrice: 1060000, minPrice: 950000, maxPrice: 1150000, volume: 15 },
    { date: '05-24', avgPrice: 1050000, minPrice: 940000, maxPrice: 1130000, volume: 18 },
    { date: '05-27', avgPrice: 1055000, minPrice: 960000, maxPrice: 1140000, volume: 12 },
    { date: '05-30', avgPrice: 1040000, minPrice: 930000, maxPrice: 1120000, volume: 22 },
    { date: '06-02', avgPrice: 1030000, minPrice: 920000, maxPrice: 1100000, volume: 19 },
    { date: '06-05', avgPrice: 1025000, minPrice: 910000, maxPrice: 1110000, volume: 25 },
    { date: '06-08', avgPrice: 1010000, minPrice: 890000, maxPrice: 1080000, volume: 30 },
    { date: '06-11', avgPrice: 995000, minPrice: 880000, maxPrice: 1070000, volume: 24 },
    { date: '06-14', avgPrice: 990000, minPrice: 880000, maxPrice: 1060000, volume: 28 },
    { date: '06-17', avgPrice: 980000, minPrice: 850000, maxPrice: 1050000, volume: 35 },
    { date: '06-19', avgPrice: 1010000, minPrice: 980000, maxPrice: 1100000, volume: 10 }
  ],
  macbook: [
    { date: '05-21', avgPrice: 1180000, minPrice: 650000, maxPrice: 1320000, volume: 8 },
    { date: '05-24', avgPrice: 1170000, minPrice: 640000, maxPrice: 1300000, volume: 10 },
    { date: '05-27', avgPrice: 1160000, minPrice: 660000, maxPrice: 1290000, volume: 7 },
    { date: '05-30', avgPrice: 1150000, minPrice: 650000, maxPrice: 1280000, volume: 12 },
    { date: '06-02', avgPrice: 1120000, minPrice: 630000, maxPrice: 1270000, volume: 14 },
    { date: '06-05', avgPrice: 1100000, minPrice: 620000, maxPrice: 1250000, volume: 11 },
    { date: '06-08', avgPrice: 1080000, minPrice: 600000, maxPrice: 1260000, volume: 15 },
    { date: '06-11', avgPrice: 1050000, minPrice: 590000, maxPrice: 1280000, volume: 18 },
    { date: '06-14', avgPrice: 1030000, minPrice: 680000, maxPrice: 1250000, volume: 13 },
    { date: '06-17', avgPrice: 1010000, minPrice: 680000, maxPrice: 1250000, volume: 9 },
    { date: '06-19', avgPrice: 1026000, minPrice: 680000, maxPrice: 1250000, volume: 6 }
  ],
  airforce: [
    { date: '05-21', avgPrice: 145000, minPrice: 80000, maxPrice: 190000, volume: 22 },
    { date: '05-24', avgPrice: 142000, minPrice: 78000, maxPrice: 185000, volume: 25 },
    { date: '05-27', avgPrice: 143000, minPrice: 82000, maxPrice: 188000, volume: 20 },
    { date: '05-30', avgPrice: 141000, minPrice: 80000, maxPrice: 185000, volume: 29 },
    { date: '06-02', avgPrice: 139000, minPrice: 75000, maxPrice: 185000, volume: 34 },
    { date: '06-05', avgPrice: 138000, minPrice: 75000, maxPrice: 180000, volume: 28 },
    { date: '06-08', avgPrice: 135000, minPrice: 70000, maxPrice: 185000, volume: 40 },
    { date: '06-11', avgPrice: 137000, minPrice: 85000, maxPrice: 185000, volume: 31 },
    { date: '06-14', avgPrice: 140000, minPrice: 85000, maxPrice: 185000, volume: 33 },
    { date: '06-17', avgPrice: 142000, minPrice: 85000, maxPrice: 185000, volume: 22 },
    { date: '06-19', avgPrice: 143000, minPrice: 85000, maxPrice: 185000, volume: 18 }
  ],
  hermanmiller: [
    { date: '05-21', avgPrice: 1620000, minPrice: 1500000, maxPrice: 1700000, volume: 3 },
    { date: '05-24', avgPrice: 1610000, minPrice: 1480000, maxPrice: 1680000, volume: 5 },
    { date: '05-27', avgPrice: 1600000, minPrice: 1450000, maxPrice: 1670000, volume: 4 },
    { date: '05-30', avgPrice: 1590000, minPrice: 1450000, maxPrice: 1650000, volume: 6 },
    { date: '06-02', avgPrice: 1580000, minPrice: 1400000, maxPrice: 1650000, volume: 8 },
    { date: '06-05', avgPrice: 1600000, minPrice: 1500000, maxPrice: 1680000, volume: 5 },
    { date: '06-08', avgPrice: 1610000, minPrice: 1520000, maxPrice: 1700000, volume: 3 },
    { date: '06-11', avgPrice: 1590000, minPrice: 1450000, maxPrice: 1650000, volume: 7 },
    { date: '06-14', avgPrice: 1580000, minPrice: 1450000, maxPrice: 1650000, volume: 6 },
    { date: '06-17', avgPrice: 1600000, minPrice: 1550000, maxPrice: 1650000, volume: 4 },
    { date: '06-19', avgPrice: 1616000, minPrice: 1550000, maxPrice: 1650000, volume: 3 }
  ],
  slamdunk: [
    { date: '05-21', avgPrice: 110000, minPrice: 85000, maxPrice: 130000, volume: 12 },
    { date: '05-24', avgPrice: 108000, minPrice: 85000, maxPrice: 125000, volume: 15 },
    { date: '05-27', avgPrice: 107000, minPrice: 80000, maxPrice: 125000, volume: 10 },
    { date: '05-30', avgPrice: 105000, minPrice: 80000, maxPrice: 120000, volume: 14 },
    { date: '06-02', avgPrice: 104000, minPrice: 80000, maxPrice: 118000, volume: 16 },
    { date: '06-05', avgPrice: 103000, minPrice: 78000, maxPrice: 120000, volume: 13 },
    { date: '06-08', avgPrice: 102000, minPrice: 75000, maxPrice: 120000, volume: 18 },
    { date: '06-11', avgPrice: 101000, minPrice: 75000, maxPrice: 115000, volume: 21 },
    { date: '06-14', avgPrice: 103000, minPrice: 85000, maxPrice: 120000, volume: 11 },
    { date: '06-17', avgPrice: 107000, minPrice: 95000, maxPrice: 120000, volume: 8 },
    { date: '06-19', avgPrice: 107500, minPrice: 95000, maxPrice: 120000, volume: 9 }
  ]
};

// 브라우저 더블클릭(file://) 대응 전역 네임스페이스 등록
window.DealData = { PLATFORMS, CATEGORIES, PRODUCTS, MY_TRANSACTIONS, MARKET_TRENDS };
