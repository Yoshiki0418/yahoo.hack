let slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function changeSlide() {
  // すべてのスライドを非表示にする
  for (let slide of slides) {
    slide.style.opacity = 0;
  }

  // 現在のスライドを表示する
  slides[currentSlide].style.opacity = 1;

  // 次のスライドに移動、もし最後なら最初に戻る
  currentSlide = (currentSlide + 1) % slides.length;
}

// 最初のスライドを表示
changeSlide();

// 5秒ごとにスライドを切り替える
setInterval(changeSlide, 5000);
