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





var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("ad-slides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 4000); // Change image every 4 seconds
}

function currentSlide(n) {
  slideIndex = n - 1;
  showSlides();
}

