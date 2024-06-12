const computeWaterFallFlow = (ref, columns = 2) => {
  let resizeListener = null;

  const computeCard = () => {
    const cards = ref.children;
    const winWidth = window.innerWidth; // 当前视域宽度
    const margin = Math.round(winWidth * 0.015); // 计算card之间的间距
    const cardWidth = Math.floor((winWidth - (columns + 1) * margin) / columns); // 计算卡片宽度

    const topList = new Array(columns).fill(0); // 记录每一个列的当前顶部距离

    // 给每个card赋予宽度
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.width = cardWidth + "px";
    }

    // 计算每个card的位置偏移
    for (let i = 0; i < cards.length; i++) {
      // 判断当前哪一列比较高, card插在高的那一列
      let min = Math.min(...topList);
      const minColumn = topList.indexOf(min);

      // 计算出card的偏移量
      let left = margin * (minColumn + 1) + cardWidth * minColumn;
      let top = min + margin;
      cards[i].style.transform = `translate(${left}px, ${top}px)`;
      topList[minColumn] += cards[i].clientHeight + margin;
    }

    ref.style.height = Math.max(...topList) + margin + "px";
  };

  computeCard();

  if (!resizeListener) {
    resizeListener = window.addEventListener("resize", () => {
        computeCard();
    });
  }
};

export default computeWaterFallFlow