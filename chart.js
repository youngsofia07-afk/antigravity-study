// 순수 SVG 기반의 동적 시세 차트 모듈

/**
 * 주어진 컨테이너에 시세 추이 SVG 차트를 렌더링하는 함수
 * @param {string} containerId - 차트가 삽입될 부모 엘리먼트 ID
 * @param {Array} dataPoints - { date, avgPrice, volume, minPrice, maxPrice } 형태의 데이터 배열
 */
function renderSVGChart(containerId, dataPoints) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // 기존 차트 제거
  container.innerHTML = '';

  if (!dataPoints || dataPoints.length === 0) {
    container.innerHTML = '<div class="no-data-msg">차트 데이터를 불러올 수 없습니다.</div>';
    return;
  }

  // 1. 컨테이너 크기 감지 (반응형 대응)
  const rect = container.getBoundingClientRect();
  const width = rect.width || 800;
  const height = rect.height || 300;

  // 차트 내부 패딩 설정 (축 텍스트 표시 영역 확보)
  const padding = { top: 20, right: 30, bottom: 40, left: 85 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // 2. 값 범위(Min, Max) 계산
  const prices = dataPoints.map(d => d.avgPrice);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  // Y축 최댓값/최솟값 보정 (여유 공간 제공)
  const priceRange = maxPrice - minPrice;
  const yMax = maxPrice + (priceRange * 0.15 || maxPrice * 0.1);
  const yMin = Math.max(0, minPrice - (priceRange * 0.15 || minPrice * 0.1));

  // 3. 좌표 매핑 함수 정의
  const getX = (index) => {
    return padding.left + (index / (dataPoints.length - 1)) * chartWidth;
  };

  const getY = (price) => {
    if (yMax === yMin) return padding.top + chartHeight / 2;
    return padding.top + chartHeight - ((price - yMin) / (yMax - yMin)) * chartHeight;
  };

  // 4. SVG 엘리먼트 생성 (Namespace 필요)
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "chart-svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  // 5. Defs 설정 (그라데이션 및 필터 효과)
  const defs = document.createElementNS(svgNS, "defs");

  // 면 채우기용 그라데이션
  const linearGradient = document.createElementNS(svgNS, "linearGradient");
  linearGradient.setAttribute("id", "chart-gradient");
  linearGradient.setAttribute("x1", "0");
  linearGradient.setAttribute("y1", "0");
  linearGradient.setAttribute("x2", "0");
  linearGradient.setAttribute("y2", "1");

  const stop1 = document.createElementNS(svgNS, "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "#ff7e36");
  stop1.setAttribute("stop-opacity", "0.4");

  const stop2 = document.createElementNS(svgNS, "stop");
  stop2.setAttribute("offset", "100%");
  stop2.setAttribute("stop-color", "#ff7e36");
  stop2.setAttribute("stop-opacity", "0.0");

  linearGradient.appendChild(stop1);
  linearGradient.appendChild(stop2);
  defs.appendChild(linearGradient);
  svg.appendChild(defs);

  // 6. 가로 그리드선 및 Y축 라벨 그리기 (4개 구분선)
  const gridCount = 4;
  for (let i = 0; i <= gridCount; i++) {
    const ratio = i / gridCount;
    const priceValue = yMin + ratio * (yMax - yMin);
    const yPos = getY(priceValue);

    // 가로 점선
    const gridLine = document.createElementNS(svgNS, "line");
    gridLine.setAttribute("x1", padding.left);
    gridLine.setAttribute("y1", yPos);
    gridLine.setAttribute("x2", width - padding.right);
    gridLine.setAttribute("y2", yPos);
    gridLine.setAttribute("class", "chart-grid-line");
    svg.appendChild(gridLine);

    // Y축 텍스트 (가격 포맷: 만원 단위 또는 원 단위)
    const yText = document.createElementNS(svgNS, "text");
    yText.setAttribute("x", padding.left - 12);
    yText.setAttribute("y", yPos + 4);
    yText.setAttribute("text-anchor", "end");
    yText.setAttribute("class", "chart-axis-text");
    yText.textContent = formatPriceKorean(priceValue);
    svg.appendChild(yText);
  }

  // 7. X축 날짜 텍스트 그리기 (간격을 두고 그리기)
  const xLabelInterval = Math.max(1, Math.floor(dataPoints.length / 5));
  dataPoints.forEach((d, index) => {
    if (index % xLabelInterval === 0 || index === dataPoints.length - 1) {
      const xPos = getX(index);
      const yPos = height - padding.bottom + 20;

      const xText = document.createElementNS(svgNS, "text");
      xText.setAttribute("x", xPos);
      xText.setAttribute("y", yPos);
      xText.setAttribute("text-anchor", "middle");
      xText.setAttribute("class", "chart-axis-text");
      xText.textContent = d.date;
      svg.appendChild(xText);

      // X축 눈금선 (짧게)
      const tick = document.createElementNS(svgNS, "line");
      tick.setAttribute("x1", xPos);
      tick.setAttribute("y1", height - padding.bottom);
      tick.setAttribute("x2", xPos);
      tick.setAttribute("y2", height - padding.bottom + 5);
      tick.setAttribute("stroke", "#eaebee");
      svg.appendChild(tick);
    }
  });

  // 8. 데이터 라인 경로(Path) 빌드
  let pathD = "";
  let areaD = "";

  dataPoints.forEach((d, index) => {
    const xPos = getX(index);
    const yPos = getY(d.avgPrice);

    if (index === 0) {
      pathD = `M ${xPos} ${yPos}`;
      areaD = `M ${xPos} ${height - padding.bottom} L ${xPos} ${yPos}`;
    } else {
      // Cubic Bezier 커브로 부드러운 라인 그리기 (텐션 조정)
      const prevX = getX(index - 1);
      const prevY = getY(dataPoints[index - 1].avgPrice);
      const cpX1 = prevX + (xPos - prevX) / 2;
      const cpY1 = prevY;
      const cpX2 = prevX + (xPos - prevX) / 2;
      const cpY2 = yPos;

      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${xPos} ${yPos}`;
      areaD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${xPos} ${yPos}`;
    }

    if (index === dataPoints.length - 1) {
      areaD += ` L ${xPos} ${height - padding.bottom} Z`;
    }
  });

  // 영역 채우기 패스 추가 (그라데이션)
  const areaPath = document.createElementNS(svgNS, "path");
  areaPath.setAttribute("d", areaD);
  areaPath.setAttribute("class", "chart-area");
  svg.appendChild(areaPath);

  // 꺾은선 패스 추가 (라인)
  const linePath = document.createElementNS(svgNS, "path");
  linePath.setAttribute("d", pathD);
  linePath.setAttribute("class", "chart-line");
  svg.appendChild(linePath);

  // 9. 인터랙티브 요소: 가이드 라인 (십자선 중 세로선만 표시)
  const guideLine = document.createElementNS(svgNS, "line");
  guideLine.setAttribute("y1", padding.top);
  guideLine.setAttribute("y2", height - padding.bottom);
  guideLine.setAttribute("class", "chart-guide-line");
  svg.appendChild(guideLine);

  // 10. 툴팁 준비 (부모 래퍼에 절대 좌표 배치용 HTML 엘리먼트 생성)
  let tooltip = container.parentElement.querySelector('.chart-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    container.parentElement.appendChild(tooltip);
  }

  // 11. 데이터 포인트 원(Circle) 및 투명 호버 감지 영역 그리기
  dataPoints.forEach((d, index) => {
    const xPos = getX(index);
    const yPos = getY(d.avgPrice);

    // 호버 시 강조할 도트
    const point = document.createElementNS(svgNS, "circle");
    point.setAttribute("cx", xPos);
    point.setAttribute("cy", yPos);
    point.setAttribute("r", "5");
    point.setAttribute("class", "chart-point");
    svg.appendChild(point);

    // 이벤트 감지 범위를 넓혀주는 투명 큰 원 (모바일 및 PC 호버 편의성 제공)
    const hoverZone = document.createElementNS(svgNS, "circle");
    hoverZone.setAttribute("cx", xPos);
    hoverZone.setAttribute("cy", yPos);
    hoverZone.setAttribute("r", "20");
    hoverZone.setAttribute("fill", "transparent");
    hoverZone.setAttribute("cursor", "pointer");

    // 마우스 호버 이벤트 바인딩
    hoverZone.addEventListener("mouseenter", () => {
      point.setAttribute("r", "7");
      point.setAttribute("stroke-width", "4");

      guideLine.setAttribute("x1", xPos);
      guideLine.setAttribute("y1", padding.top);
      guideLine.setAttribute("x2", xPos);
      guideLine.setAttribute("y2", height - padding.bottom);
      guideLine.classList.add("active");

      tooltip.innerHTML = `
        <div class="tooltip-date">${d.date} 시세 리포트</div>
        <div class="tooltip-price">평균가: <b>${d.avgPrice.toLocaleString()}원</b></div>
        <div class="tooltip-range" style="font-size: 11px; color: #888;">범위: ${d.minPrice.toLocaleString()}원 ~ ${d.maxPrice.toLocaleString()}원</div>
        <div class="tooltip-volume">거래 건수: <b>${d.volume}건</b></div>
      `;
      tooltip.style.left = `${xPos}px`;
      tooltip.style.top = `${yPos}px`;
      tooltip.classList.add("active");
    });

    hoverZone.addEventListener("mouseleave", () => {
      point.setAttribute("r", "5");
      point.setAttribute("stroke-width", "3");
      guideLine.classList.remove("active");
      tooltip.classList.remove("active");
    });

    svg.appendChild(hoverZone);
  });

  container.appendChild(svg);
}

/**
 * 숫자를 한국어 금액 단위(만 원/억)로 가독성 있게 포맷팅하는 헬퍼 함수
 */
function formatPriceKorean(price) {
  if (price === 0) return '0원';
  
  if (price >= 100000000) {
    const eok = Math.floor(price / 100000000);
    const man = Math.round((price % 100000000) / 10000);
    return man > 0 ? `${eok}억 ${man}만` : `${eok}억`;
  }
  
  if (price >= 10000) {
    return `${Math.round(price / 10000)}만원`;
  }
  
  return `${Math.round(price).toLocaleString()}원`;
}

// 브라우저 더블클릭(file://) 대응 전역 네임스페이스 등록
window.DealChart = { renderSVGChart };
