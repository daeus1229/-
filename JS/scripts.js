const rightScroll = document.getElementById('rightScroll');
  const leftSlides = document.querySelectorAll('.left-slide');
 
  /* data-left 속성을 가진 요소들 : 자기소개 패널, 작업물 하나하나, 연락처 패널 */
  const trackedElements = Array.from(rightScroll.querySelectorAll('[data-left]'));
 
  const workLeftNum = document.getElementById('workLeftNum');
  const workLeftTitle = document.getElementById('workLeftTitle');
  const workLeftDesc = document.getElementById('workLeftDesc');

  const spacerEl = document.querySelector('.spacer');

  /* 마지막으로 확정된 상태를 기억해뒀다가, 매칭되는 요소가 없는
     "빈 구간"(섹션 제목/패딩 등)에서는 이걸 그대로 유지합니다. */
  let currentActiveKey = 'intro';
 
  function onScroll() {
    const centerY = rightScroll.scrollTop + rightScroll.clientHeight / 2;
 
    let matched = null;
    trackedElements.forEach((el) => {
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      if (centerY >= top && centerY < bottom) matched = el;
    });

    if (matched) {
      currentActiveKey = matched.dataset.left;
    } else if (centerY < spacerEl.offsetHeight) {
      /* 아직 첫 화면(스페이서) 구간일 때만 intro로 판단 */
      currentActiveKey = 'intro';
    }
    /* 그 외의 매칭 실패(섹션 사이 여백 등)는 이전 상태를 그대로 유지 */
 
    leftSlides.forEach((slide) => {
      slide.classList.toggle('active', slide.dataset.slide === currentActiveKey);
    });
 
    if (currentActiveKey === 'work' && matched) {
      workLeftNum.textContent = matched.dataset.num || '';
      workLeftTitle.textContent = matched.dataset.title || '';
      workLeftDesc.textContent = matched.dataset.desc || '';
    }
  }
 
  rightScroll.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
 
  /* ---------- 작업물 클릭 -> 상세 페이지 ----------
     각 .work-item 안의 .work-gallery(hidden) 블록에 img/p 태그를
     원하는 순서로 넣어두면, 클릭했을 때 그 내용만 그대로 나타납니다.
     예)
     <div class="work-gallery" hidden>
       <img src="../img/A.png">
       <p>사진 사이에 들어갈 설명 텍스트</p>
       <img src="../img/B.png">
     </div>
  */
  const workDetail = document.getElementById('workDetail');
  const detailImages = document.getElementById('detailImages');
  const closeDetailBtn = document.getElementById('closeDetail');
 
  document.querySelectorAll('.work-item').forEach((item) => {
    item.addEventListener('click', () => {
      /* 기존에 떠있던 사진/텍스트 지우고 새로 채우기 */
      detailImages.innerHTML = '';

      /* .work-gallery 안에 넣어둔 img/p 태그를 순서 그대로 복사해서 채워줍니다 */
      const gallery = item.querySelector('.work-gallery');
      if (gallery) {
        Array.from(gallery.children).forEach((node) => {
          detailImages.appendChild(node.cloneNode(true));
        });
      }

      workDetail.classList.add('open');
      workDetail.scrollTop = 0;
    });
  });
 
  closeDetailBtn.addEventListener('click', () => {
    workDetail.classList.remove('open');
  });