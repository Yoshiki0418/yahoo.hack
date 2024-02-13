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






  document.addEventListener('DOMContentLoaded', function() {
    var linkSection10 = document.getElementById('fixed-button');
    var linkSection20 = document.getElementById('move2');//戻るボタンに適用する

    var section10 = document.getElementById('display1');
    var section11 = document.getElementById('display0');
    var section12 = document.getElementById('category_block1');
    var section20 = document.getElementById('display2');
    var section21 = document.getElementById('category_block2');

    if(linkSection10 && section10 && section20) {
        linkSection10.addEventListener('click', function(event) {
            event.preventDefault(); 
            section10.style.display = 'none'; // 表示スタイルに応じて変更
            section11.style.display = 'none';
            section12.style.display = 'none';
            section20.style.display = '';
            section21.style.display = '';
        });
    }

    if(linkSection20 && section10 && section20) {
        linkSection20.addEventListener('click', function(event) {
        event.preventDefault();
        section10.style.display = '';
        section11.style.display = '';
        section12.style.display = '';
        section20.style.display = 'none';
        section21.style.display = 'none';
        });
    }
});