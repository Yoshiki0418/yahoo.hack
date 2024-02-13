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
    var linkSection10 = document.getElementById('sidebar_input');
    var linkSection20 = document.getElementById('move2');

    var section10 = document.getElementById('sidebar');
    var section11 = document.getElementById('footer-ad-banner');
    var section20 = document.querySelector('.movie_container_main');
    var section21 = document.querySelector('.movie_container');

    // サイドバー表示ボタンクリック時の動作
    if (linkSection10) {
        linkSection10.addEventListener('click', function(event) {
            event.preventDefault();
            section10.style.display = ''; // サイドバーを表示
            section11.style.display = ''; // 広告バナーを表示
            section12.style.display = ''; // コードブロックを表示
            section20.style.display = 'none'; // メインコンテナを非表示
            section21.style.display = ''; // サイドバー表示時のコンテナを表示
        });
    }

    // 戻るボタンクリック時の動作
    if (linkSection20) {
        linkSection20.addEventListener('click', function(event) {
            event.preventDefault();
            section10.style.display = 'none'; // サイドバーを非表示
            section11.style.display = 'none'; // 広告バナーを非表示
            section12.style.display = 'none'; // コードブロックを非表示
            section20.style.display = ''; // メインコンテナを表示
            section21.style.display = 'none'; // サイドバー表示時のコンテナを非表示
        });
    }
});
