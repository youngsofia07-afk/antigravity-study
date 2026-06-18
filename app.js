// DEALHUB 코어 애플리케이션 상태 및 동작 제어 스크립트

document.addEventListener('DOMContentLoaded', () => {
  // 1. 전역 네임스페이스에서 데이터 가져오기 (file:// 실행 환경 대응)
  if (!window.DealData || !window.DealChart) {
    console.error('데이터 혹은 차트 모듈이 로드되지 않았습니다.');
    return;
  }
  const { PRODUCTS, MY_TRANSACTIONS, MARKET_TRENDS, PLATFORMS, CATEGORIES } = window.DealData;
  const { renderSVGChart } = window.DealChart;

  // 2. 내부 상태 (State)
  const state = {
    activeTab: 'search',
    searchQuery: '',
    filters: {
      platforms: ['carrot', 'bunjang', 'joonggonara'],
      minPrice: null,
      maxPrice: null,
      condition: 'all',
      location: ''
    },
    sortBy: 'recent',
    selectedTrendItem: 'iphone',
    myTransactionType: 'all',
    myTransactionSearch: ''
  };

  // 3. DOM 요소 매핑
  const DOM = {
    navTabs: document.querySelectorAll('.nav-tab-btn'),
    tabSections: document.querySelectorAll('.tab-content'),
    
    searchInput: document.getElementById('search-input'),
    searchSubmitBtn: document.getElementById('search-submit-btn'),
    searchClearBtn: document.getElementById('search-clear-btn'),
    recommendTags: document.querySelectorAll('.recommend-tag'),
    platformCheckboxes: document.querySelectorAll('input[name="platform"]'),
    priceMinInput: document.getElementById('price-min'),
    priceMaxInput: document.getElementById('price-max'),
    presetBtns: document.querySelectorAll('.preset-btn'),
    conditionRadios: document.querySelectorAll('input[name="condition"]'),
    filterResetBtn: document.getElementById('filter-reset-btn'),
    sortSelect: document.getElementById('sort-select'),
    productGrid: document.getElementById('product-grid'),
    noResults: document.getElementById('no-results'),
    searchTotalCount: document.getElementById('search-total-count'),
    
    trendItemBtns: document.querySelectorAll('.trend-select-btn'),
    trendAvgPrice: document.getElementById('trend-avg-price'),
    trendPriceDiff: document.getElementById('trend-price-diff'),
    trendPriceRange: document.getElementById('trend-price-range'),
    trendVolume: document.getElementById('trend-volume'),
    svgChartContainer: document.getElementById('svg-chart-container'),
    trendAnalysisText: document.getElementById('trend-analysis-text'),
    
    myTotalCount: document.getElementById('my-total-count'),
    mySellingCount: document.getElementById('my-selling-count'),
    myReservedCount: document.getElementById('my-reserved-count'),
    myCompletedCount: document.getElementById('my-completed-count'),
    tableTabBtns: document.querySelectorAll('.table-tab-btn'),
    sellTabCount: document.getElementById('sell-tab-count'),
    buyTabCount: document.getElementById('buy-tab-count'),
    tableSearchInput: document.getElementById('table-search-input'),
    transactionList: document.getElementById('transaction-list'),
    noTransactions: document.getElementById('no-transactions'),
    
    // 모달 관련 DOM
    productModal: document.getElementById('product-modal'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalPlatform: document.getElementById('modal-platform'),
    modalCondition: document.getElementById('modal-condition'),
    modalThumbnailIcon: document.getElementById('modal-thumbnail-icon'),
    modalTitle: document.getElementById('modal-title'),
    modalPrice: document.getElementById('modal-price'),
    modalCategory: document.getElementById('modal-category'),
    modalDate: document.getElementById('modal-date'),
    modalLocation: document.getElementById('modal-location'),
    modalDescription: document.getElementById('modal-description'),
    modalSellerNickname: document.getElementById('modal-seller-nickname'),
    modalSellerRating: document.getElementById('modal-seller-rating'),
    
    // 지역 필터 및 채팅 관련 DOM
    locationInput: document.getElementById('location-input'),
    chatModal: document.getElementById('chat-modal'),
    chatCloseBtn: document.getElementById('chat-close-btn'),
    chatSellerName: document.getElementById('chat-seller-name'),
    chatProductTitle: document.getElementById('chat-product-title'),
    chatMessageArea: document.getElementById('chat-message-area'),
    chatInput: document.getElementById('chat-input'),
    chatSendBtn: document.getElementById('chat-send-btn'),
    modalChatBtn: document.querySelector('.chat-btn')
  };

  // DOM이 제대로 로드되었는지 확인
  if (!DOM.searchInput) {
    console.error('필수 DOM 요소를 찾을 수 없습니다.');
    return;
  }

  // 4. 이벤트 리스너 바인딩
  initEventListeners();
  
  // 5. 초기 렌더링 호출
  renderSearchResults();
  renderTrendChart();
  renderManageView();
  
  // 6. Lucide 아이콘 초기화
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ==========================================
  // 함수 구현부
  // ==========================================

  function initEventListeners() {
    // A. 글로벌 탭 전환
    DOM.navTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        switchTab(targetTab);
      });
    });

    // B. 매물 검색 관련 이벤트
    DOM.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      DOM.searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
      // 실시간 검색 기능 원할 경우 여기서 renderSearchResults() 호출 가능
    });

    DOM.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        renderSearchResults();
      }
    });

    DOM.searchSubmitBtn.addEventListener('click', () => {
      renderSearchResults();
    });

    DOM.searchClearBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      state.searchQuery = '';
      DOM.searchClearBtn.style.display = 'none';
      renderSearchResults();
      DOM.searchInput.focus();
    });

    DOM.recommendTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const keyword = tag.textContent.trim();
        DOM.searchInput.value = keyword;
        state.searchQuery = keyword;
        DOM.searchClearBtn.style.display = 'block';
        renderSearchResults();
      });
    });

    DOM.platformCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        state.filters.platforms = Array.from(DOM.platformCheckboxes)
          .filter(c => c.checked)
          .map(c => c.value);
        renderSearchResults();
      });
    });

    if (DOM.locationInput) {
      DOM.locationInput.addEventListener('input', (e) => {
        state.filters.location = e.target.value.trim();
        renderSearchResults();
      });
    }

    DOM.priceMinInput.addEventListener('input', (e) => {
      state.filters.minPrice = e.target.value ? parseInt(e.target.value, 10) : null;
      renderSearchResults();
    });

    DOM.priceMaxInput.addEventListener('input', (e) => {
      state.filters.maxPrice = e.target.value ? parseInt(e.target.value, 10) : null;
      renderSearchResults();
    });

    DOM.presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const min = parseInt(btn.getAttribute('data-min'), 10);
        const max = parseInt(btn.getAttribute('data-max'), 10);
        DOM.priceMinInput.value = min;
        DOM.priceMaxInput.value = max;
        state.filters.minPrice = min;
        state.filters.maxPrice = max;
        renderSearchResults();
      });
    });

    DOM.conditionRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.filters.condition = e.target.value;
        renderSearchResults();
      });
    });

    DOM.filterResetBtn.addEventListener('click', () => {
      state.searchQuery = '';
      state.filters.platforms = ['carrot', 'bunjang', 'joonggonara'];
      state.filters.minPrice = null;
      state.filters.maxPrice = null;
      state.filters.condition = 'all';
      state.filters.location = '';
      state.sortBy = 'recent';

      DOM.searchInput.value = '';
      DOM.searchClearBtn.style.display = 'none';
      DOM.platformCheckboxes.forEach(cb => cb.checked = true);
      DOM.priceMinInput.value = '';
      DOM.priceMaxInput.value = '';
      DOM.conditionRadios.forEach(r => r.checked = (r.value === 'all'));
      if (DOM.locationInput) DOM.locationInput.value = '';
      DOM.sortSelect.value = 'recent';

      renderSearchResults();
    });

    DOM.sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderSearchResults();
    });

    // C. 시세 조회 탭 이벤트
    DOM.trendItemBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.trendItemBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedTrendItem = btn.getAttribute('data-item');
        renderTrendChart();
      });
    });

    // D. 내 거래 관리 탭 이벤트
    DOM.tableTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.tableTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.myTransactionType = btn.getAttribute('data-type');
        renderManageView();
      });
    });

    DOM.tableSearchInput.addEventListener('input', (e) => {
      state.myTransactionSearch = e.target.value.trim();
      renderManageView();
    });

    window.addEventListener('resize', () => {
      if (state.activeTab === 'trends') {
        renderTrendChart();
      }
    });

    // E. 모달 제어 이벤트
    if (DOM.modalCloseBtn) {
      DOM.modalCloseBtn.addEventListener('click', () => {
        DOM.productModal.classList.add('hidden');
      });
    }

    if (DOM.productModal) {
      DOM.productModal.addEventListener('click', (e) => {
        if (e.target === DOM.productModal) {
          DOM.productModal.classList.add('hidden');
        }
      });
    }

    // F. 가상 채팅 제어 이벤트
    if (DOM.modalChatBtn) {
      DOM.modalChatBtn.addEventListener('click', () => {
        // 상세 모달 닫고 채팅 띄우기
        DOM.productModal.classList.add('hidden');
        
        DOM.chatSellerName.textContent = DOM.modalSellerNickname.textContent;
        DOM.chatProductTitle.textContent = DOM.modalTitle.textContent;
        
        // 채팅방 초기화
        DOM.chatMessageArea.innerHTML = `
          <div class="chat-system-msg">
            <span>채팅이 시작되었습니다. 판매자에게 인사해 보세요!</span>
          </div>
        `;
        DOM.chatInput.value = '';
        DOM.chatModal.classList.remove('hidden');
      });
    }

    if (DOM.chatCloseBtn) {
      DOM.chatCloseBtn.addEventListener('click', () => {
        DOM.chatModal.classList.add('hidden');
      });
    }

    function appendChatBubble(text, type) {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${type}`;
      bubble.textContent = text;
      DOM.chatMessageArea.appendChild(bubble);
      DOM.chatMessageArea.scrollTop = DOM.chatMessageArea.scrollHeight;
    }

    function sendChatMessage() {
      const text = DOM.chatInput.value.trim();
      if (!text) return;
      
      appendChatBubble(text, 'mine');
      DOM.chatInput.value = '';
      
      setTimeout(() => {
        const reply = getContextualReply(text);
        appendChatBubble(reply, 'theirs');
      }, 1200);
    }

    function getContextualReply(userMsg) {
      const msg = userMsg.toLowerCase();

      // 인사 관련
      if (msg.match(/(안녕|반갑|하이|헬로|hello|hi)/)) {
        return pick([
          "안녕하세요! 관심 가져주셔서 감사합니다 😊",
          "안녕하세요~ 궁금한 점 있으시면 편하게 물어보세요!",
          "반갑습니다! 어떤 점이 궁금하신가요?"
        ]);
      }
      // 가격/네고/할인 관련
      if (msg.match(/(가격|네고|할인|깎|싸게|얼마)/)) {
        return pick([
          "가격은 올려둔 그대로입니다. 네고는 조금 어려워요 😅",
          "소폭 네고 가능합니다! 원하시는 가격 말씀해주세요.",
          "거의 최저가로 올려둔 거라 네고는 어려울 것 같아요 ㅠㅠ"
        ]);
      }
      // 상태/컨디션 관련
      if (msg.match(/(상태|컨디션|하자|흠집|기스|깨끗|스크래치)/)) {
        return pick([
          "상태 아주 깨끗합니다! 사용감 거의 없어요.",
          "미세한 사용감만 있고, 기능적 하자는 전혀 없습니다.",
          "깨끗하게 사용했고, 사진에 보이는 그대로입니다!"
        ]);
      }
      // 직거래/위치/장소 관련
      if (msg.match(/(직거래|직접|어디|장소|위치|만나|동네)/)) {
        return pick([
          "직거래 가능합니다! 근처 지하철역 출구에서 만나면 어떨까요?",
          "직거래 선호합니다. 시간 맞추면 편한 곳으로 갈게요!",
          "동네 카페나 지하철역 앞에서 거래 가능합니다 😊"
        ]);
      }
      // 택배 관련
      if (msg.match(/(택배|배송|우체국|편의점|보내)/)) {
        return pick([
          "택배 거래도 가능합니다! 배송비는 선불로 부탁드려요.",
          "네, 택배로 보내드릴 수 있어요. 결제 확인 후 당일 발송합니다!",
          "편의점 택배로 보내드릴게요. 보통 1~2일 안에 도착합니다."
        ]);
      }
      // 시간/일정 관련
      if (msg.match(/(언제|시간|오늘|내일|주말|평일|가능한|몇시)/)) {
        return pick([
          "오늘 저녁이나 내일 오후 다 괜찮습니다!",
          "주말에 시간 맞추면 될 것 같아요. 토요일 어떠세요?",
          "평일은 저녁 7시 이후, 주말은 자유롭게 가능합니다!"
        ]);
      }
      // 구매 의사/예약 관련
      if (msg.match(/(살게|구매|구입|예약|찜|바로)/)) {
        return pick([
          "네, 예약 잡아드릴게요! 거래 일정 알려주세요 😊",
          "감사합니다! 그럼 예약으로 변경해둘게요~",
          "좋습니다! 편하신 거래 방법 알려주시면 맞춰드릴게요."
        ]);
      }
      // 사용 기간/구매 시기 관련
      if (msg.match(/(얼마나|기간|산지|구매일|언제 사|몇 년|몇 개월)/)) {
        return pick([
          "약 3개월 전에 구매했어요. 거의 새 제품 수준입니다!",
          "올해 초에 사서 몇 번 안 썼습니다.",
          "구매한 지 반년 정도 됐는데, 사용 빈도가 적어서 상태 좋습니다!"
        ]);
      }
      // 감사/고마움 관련
      if (msg.match(/(감사|고마|ㄳ|ㄱㅅ|땡큐|thank)/)) {
        return pick([
          "아닙니다~ 좋은 거래 되길 바랍니다! 😊",
          "감사합니다! 편하게 연락주세요~",
          "별말씀을요! 궁금한 거 더 있으시면 물어보세요."
        ]);
      }
      // 결제/입금/송금 관련
      if (msg.match(/(결제|입금|송금|계좌|현금|카드|페이|토스|카카오페이|계좌번호|선입금|안전거래)/)) {
        return pick([
          "직거래 시 현금이나 계좌이체 모두 가능합니다!",
          "카카오페이나 토스로 송금해 주셔도 돼요 😊",
          "안전거래를 선호합니다. 번개페이나 당근페이 사용 가능해요!",
          "택배 거래 시 선입금 확인 후 바로 발송해 드리겠습니다.",
          "계좌이체로 부탁드려요! 입금 확인되면 바로 연락드릴게요."
        ]);
      }
      
      // 기본 응답 (매칭 키워드 없을 때)
      return pick([
        "네, 확인했습니다! 더 궁금한 점 있으시면 말씀해주세요.",
        "네~ 편하게 물어보세요!",
        "말씀 감사합니다. 추가 질문 있으시면 언제든지요 😊"
      ]);
    }

    function pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    if (DOM.chatSendBtn) {
      DOM.chatSendBtn.addEventListener('click', sendChatMessage);
    }

    if (DOM.chatInput) {
      DOM.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
      });
    }
  }

  function switchTab(tabId) {
    state.activeTab = tabId;
    DOM.navTabs.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    DOM.tabSections.forEach(section => {
      if (section.getAttribute('id') === `tab-${tabId}`) section.classList.add('active');
      else section.classList.remove('active');
    });
    if (tabId === 'trends') {
      setTimeout(() => renderTrendChart(), 50);
    }
  }

  function renderSearchResults() {
    let filtered = PRODUCTS.filter(prod => {
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const matchTitle = prod.title.toLowerCase().includes(q);
        const matchDesc = prod.description.toLowerCase().includes(q);
        const matchCat = CATEGORIES[prod.category].toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }
      if (!state.filters.platforms.includes(prod.platform)) return false;
      if (state.filters.minPrice !== null && prod.price < state.filters.minPrice) return false;
      if (state.filters.maxPrice !== null && prod.price > state.filters.maxPrice) return false;
      if (state.filters.condition !== 'all' && prod.condition !== state.filters.condition) return false;
      
      if (state.filters.location && !prod.location.includes(state.filters.location)) {
        return false;
      }
      
      return true;
    });

    filtered.sort((a, b) => {
      if (state.sortBy === 'recent') return new Date(b.date) - new Date(a.date);
      if (state.sortBy === 'price-asc') return a.price - b.price;
      if (state.sortBy === 'price-desc') return b.price - a.price;
      if (state.sortBy === 'popular') return (b.views + b.hearts * 5) - (a.views + a.hearts * 5);
      return 0;
    });

    DOM.searchTotalCount.textContent = filtered.length;
    DOM.productGrid.innerHTML = '';
    
    if (filtered.length === 0) {
      DOM.productGrid.style.display = 'none';
      DOM.noResults.style.display = 'block';
    } else {
      DOM.productGrid.style.display = 'grid';
      DOM.noResults.style.display = 'none';

      filtered.forEach(prod => {
        const platformInfo = PLATFORMS[prod.platform];
        const conditionLabel = prod.condition === 'S' ? '미개봉' : prod.condition === 'A' ? 'A급' : 'B급';
        
        let iconName = 'box';
        if (prod.category === 'digital') iconName = 'smartphone';
        else if (prod.category === 'fashion') iconName = 'shirt';
        else if (prod.category === 'living') iconName = 'armchair';
        else if (prod.category === 'hobby') iconName = 'book-open';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cursor = 'pointer'; // 클릭 가능한 요소임을 표시

        card.innerHTML = `
          <div class="card-thumbnail ${prod.category}">
            <i data-lucide="${iconName}"></i>
            <span class="platform-badge ${prod.platform}">${platformInfo.name}</span>
            <span class="condition-tag">${conditionLabel}</span>
          </div>
          <div class="card-body">
            <h4 class="card-title" title="${prod.title}">${prod.title}</h4>
            <div class="card-price">${prod.price.toLocaleString()}원</div>
            <div class="card-meta">
              <div class="card-location"><i data-lucide="map-pin"></i> <span>${prod.location}</span></div>
              <div class="card-stats">
                <span class="card-stat-item"><i data-lucide="eye"></i> <span>${prod.views}</span></span>
                <span class="card-stat-item btn-heart" style="color: var(--color-bunjang); transition: transform 0.2s; position: relative; z-index: 2;" title="찜하기">
                  <i data-lucide="heart" class="heart-icon"></i> <span class="heart-count">${prod.hearts}</span>
                </span>
              </div>
            </div>
          </div>
        `;

        // 1. 하트 버튼 클릭 이벤트
        const heartBtn = card.querySelector('.btn-heart');
        heartBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // 부모 카드 클릭으로 이벤트가 번지지 않도록 차단
          
          prod.hearts += 1;
          const countSpan = heartBtn.querySelector('.heart-count');
          countSpan.textContent = prod.hearts;
          
          // 애니메이션 효과
          heartBtn.style.transform = 'scale(1.3)';
          setTimeout(() => {
            heartBtn.style.transform = 'scale(1)';
          }, 200);

          // 하트 채우기 (Lucide SVG의 fill 속성 조작)
          const icon = heartBtn.querySelector('.heart-icon');
          if (icon) {
            icon.setAttribute('fill', 'currentColor');
          }
        });

        // 2. 전체 카드 클릭 이벤트
        card.addEventListener('click', () => {
          openProductModal(prod, platformInfo, iconName);
        });

        DOM.productGrid.appendChild(card);
      });

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  }

  function renderTrendChart() {
    const itemKey = state.selectedTrendItem;
    const trendData = MARKET_TRENDS[itemKey];
    if (!trendData) return;

    const lastPoint = trendData[trendData.length - 1];
    const firstPoint = trendData[0];
    
    DOM.trendAvgPrice.textContent = `₩ ${lastPoint.avgPrice.toLocaleString()}`;
    const diffVal = lastPoint.avgPrice - firstPoint.avgPrice;
    const diffPercent = Math.abs((diffVal / firstPoint.avgPrice) * 100).toFixed(1);
    
    if (diffVal < 0) {
      DOM.trendPriceDiff.className = 'stat-sub text-down';
      DOM.trendPriceDiff.innerHTML = `<i data-lucide="trending-down"></i> 시세 시작일 대비 ${diffPercent}% 하락 안정세`;
    } else {
      DOM.trendPriceDiff.className = 'stat-sub';
      DOM.trendPriceDiff.style.color = 'var(--color-bunjang)';
      DOM.trendPriceDiff.style.fontWeight = '600';
      DOM.trendPriceDiff.innerHTML = `<i data-lucide="trending-up"></i> 시세 시작일 대비 ${diffPercent}% 상승 중`;
    }

    const minRange = Math.min(...trendData.map(d => d.minPrice));
    const maxRange = Math.max(...trendData.map(d => d.maxPrice));
    DOM.trendPriceRange.textContent = `₩ ${minRange.toLocaleString()} ~ ${maxRange.toLocaleString()}`;

    const totalVolume = trendData.reduce((acc, curr) => acc + curr.volume, 0);
    DOM.trendVolume.textContent = `${totalVolume}건`;

    renderSVGChart('svg-chart-container', trendData);

    let reportText = '';
    if (itemKey === 'iphone') {
      reportText = `<b>[아이폰 15 프로 시세 리포트]</b><br>최근 한 달간 등록 건수가 20% 증가하며 전반적인 평균가는 안정화 추세에 있습니다. 미개봉 적정 구매가는 <b>98만 원~105만 원</b> 선입니다.`;
    } else if (itemKey === 'macbook') {
      reportText = `<b>[맥북 에어 M3/M2 시세 리포트]</b><br>자급제 학기 초 성수기가 지나며 매수세가 진정되었으나, 램 업그레이드 모델은 품귀 상태입니다. 미개봉 최저 시세는 <b>115만 원</b> 부근입니다.`;
    } else if (itemKey === 'airforce') {
      reportText = `<b>[나이키 에어포스 1 시세 리포트]</b><br>가격 변동률이 3% 미만으로 방어선이 견고합니다. <b>14만 원~16만 원</b> 선에서 거래되며 S급 중고 매물은 등록 당일 판매율이 75%를 상회합니다.`;
    } else if (itemKey === 'hermanmiller') {
      reportText = `<b>[허먼밀러 에어론 체어 시세 리포트]</b><br>보증서가 첨부된 22~23년식 풀스펙 제품은 <b>155만 원~165만 원</b> 수준이 적합하며, 당근 직거래 비율이 압도적입니다.`;
    } else if (itemKey === 'slamdunk') {
      reportText = `<b>[슬램덩크 전권세트 시세 리포트]</b><br>최근 30일간 S급 오리지널 세트는 <b>11만 원~12만 원</b>, 신장재편판은 9만 원 중반대로 가격 변동폭이 거의 존재하지 않습니다.`;
    }
    DOM.trendAnalysisText.innerHTML = reportText;

    if (window.lucide) window.lucide.createIcons();
  }

  function renderManageView() {
    const total = MY_TRANSACTIONS.length;
    const selling = MY_TRANSACTIONS.filter(t => t.type === 'sell' && t.status === 'selling').length;
    const reserved = MY_TRANSACTIONS.filter(t => t.type === 'sell' && t.status === 'reserved').length;
    const completed = MY_TRANSACTIONS.filter(t => t.status === 'completed').length;

    DOM.myTotalCount.textContent = `${total}건`;
    DOM.mySellingCount.textContent = `${selling}건`;
    DOM.myReservedCount.textContent = `${reserved}건`;
    DOM.myCompletedCount.textContent = `${completed}건`;

    const sellCount = MY_TRANSACTIONS.filter(t => t.type === 'sell').length;
    const buyCount = MY_TRANSACTIONS.filter(t => t.type === 'buy').length;
    DOM.sellTabCount.textContent = sellCount;
    DOM.buyTabCount.textContent = buyCount;

    let listData = MY_TRANSACTIONS.filter(item => {
      if (state.myTransactionType !== 'all' && item.type !== state.myTransactionType) return false;
      if (state.myTransactionSearch) {
        const q = state.myTransactionSearch.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchPartner = item.buyerOrSeller.toLowerCase().includes(q);
        const matchCat = CATEGORIES[item.category].toLowerCase().includes(q);
        if (!matchTitle && !matchPartner && !matchCat) return false;
      }
      return true;
    });

    listData.sort((a, b) => new Date(b.date) - new Date(a.date));
    DOM.transactionList.innerHTML = '';

    if (listData.length === 0) {
      DOM.transactionList.parentElement.style.display = 'none';
      DOM.noTransactions.style.display = 'block';
    } else {
      DOM.transactionList.parentElement.style.display = 'table';
      DOM.noTransactions.style.display = 'none';

      listData.forEach(item => {
        const pInfo = PLATFORMS[item.platform];
        const typeLabel = item.type === 'sell' ? '판매' : '구매';
        const statusLabel = item.status === 'selling' ? '판매중' : item.status === 'reserved' ? '예약중' : '완료';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span class="badge-chip ${pInfo.badgeClass}">${pInfo.name}</span></td>
          <td><span class="type-badge ${item.type}">${typeLabel}</span></td>
          <td style="font-weight: 600; color: var(--dark-charcoal);">${item.title}</td>
          <td>${CATEGORIES[item.category]}</td>
          <td style="font-weight: 700;">${item.price.toLocaleString()}원</td>
          <td style="color: var(--text-secondary);">${item.buyerOrSeller}</td>
          <td><span class="status-badge ${item.status}">${statusLabel}</span></td>
          <td style="color: var(--text-muted); font-size: 13px;">${item.date}</td>
        `;
        DOM.transactionList.appendChild(tr);
      });
    }
  }

  function openProductModal(prod, platformInfo, iconName) {
    if (!DOM.productModal) return;

    // 데이터 바인딩
    DOM.modalPlatform.textContent = platformInfo.name;
    DOM.modalPlatform.className = `modal-platform-badge ${prod.platform}`;
    DOM.modalPlatform.style.backgroundColor = platformInfo.color;
    
    const conditionLabel = prod.condition === 'S' ? '미개봉/S급' : prod.condition === 'A' ? '사용감 적음 (A급)' : '사용감 많음 (B급)';
    DOM.modalCondition.textContent = conditionLabel;
    
    // 썸네일 그라데이션 재설정
    DOM.modalThumbnailIcon.className = `modal-thumbnail ${prod.category}`;
    DOM.modalThumbnailIcon.innerHTML = `<i data-lucide="${iconName}"></i>`;
    
    DOM.modalTitle.textContent = prod.title;
    DOM.modalPrice.textContent = `${prod.price.toLocaleString()}원`;
    DOM.modalCategory.textContent = CATEGORIES[prod.category];
    DOM.modalDate.textContent = prod.date;
    DOM.modalLocation.textContent = prod.location;
    DOM.modalDescription.textContent = prod.description;
    
    // 판매자 정보 Баин딩
    if (prod.seller) {
      DOM.modalSellerNickname.textContent = prod.seller.nickname;
      DOM.modalSellerRating.textContent = prod.seller.rating;
    } else {
      DOM.modalSellerNickname.textContent = "알 수 없는 사용자";
      DOM.modalSellerRating.textContent = "-";
    }

    // 아이콘 렌더링 갱신
    if (window.lucide) {
      window.lucide.createIcons({ root: DOM.productModal });
    }

    // 모달 띄우기
    DOM.productModal.classList.remove('hidden');
  }
});
