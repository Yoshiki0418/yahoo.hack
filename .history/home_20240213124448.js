document.addEventListener("DOMContentLoaded", function() {
    var slideIndex = 0;
    showSlides(); // 初期化時にスライドショーを開始
  
    function showSlides() {
      var i;
      var slides = document.getElementsByClassName("ad-slides");
      var dots = document.getElementsByClassName("dot");
      
      // すべてのスライドを非表示にする
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      
      // 現在のスライドインデックスを増やす
      slideIndex++;
      
      // スライドインデックスが最大数を超えたら最初に戻る
      if (slideIndex > slides.length) {slideIndex = 1}
      
      // すべてのドットのアクティブ状態を解除する
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }
      
      // 現在のスライドとドットをアクティブにする
      slides[slideIndex - 1].style.display = "block";
      dots[slideIndex - 1].className += " active";
      
      // 次のスライドのためにタイマーを設定する
      setTimeout(showSlides, 4000); // 4秒後に次のスライドを表示
    }
  
    // インジケーターのドットをクリックしたときに特定のスライドを表示する関数
    function currentSlide(n) {
      slideIndex = n - 1;
      showSlides();
    }
  
    // ドットにクリックイベントを追加する
    var dots = document.getElementsByClassName("dot");
    for (var i = 0; i < dots.length; i++) {
      dots[i].addEventListener('click', (function(index) {
        return function() {
          currentSlide(index + 1);
        }
      })(i));
    }
  });

