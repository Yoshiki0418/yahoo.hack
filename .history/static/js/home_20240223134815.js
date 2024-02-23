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
  var section12 = document.getElementById('sidebar_input');
  var section20 = document.querySelector('.movie_container_main');
  var section21 = document.querySelector('.movie_container');

  var button1 = document.querySelector('#nextCoordination');
  var button2 = document.querySelector('#nextCoordination2');

  // サイドバー表示ボタンクリック時の動作
  if (linkSection10) {
      linkSection10.addEventListener('click', function(event) {
          event.preventDefault();
          section10.style.display = ''; // サイドバーを表示
          section11.style.display = ''; // 広告バナーを表示
          section12.style.display = 'none'; // コードブロックを表示
          section20.style.display = 'none'; // メインコンテナを非表示
          section21.style.display = ''; // サイドバー表示時のコンテナを表示
          button1.style.display = 'none';
          button2.style.display = '';
      });
  }

  // 戻るボタンクリック時の動作
  if (linkSection20) {
      linkSection20.addEventListener('click', function(event) {
          event.preventDefault();
          section10.style.display = 'none'; // サイドバーを非表示
          section11.style.display = 'none'; // 広告バナーを非表示
          section12.style.display = ''; // コードブロックを非表示
          section20.style.display = ''; // メインコンテナを表示
          section21.style.display = 'none'; // サイドバー表示時のコンテナを非表示
          button1.style.display = '';
          button2.style.display = 'none';
      });
  }
});


// サイドバーの選択項目の色を変更する
document.addEventListener('DOMContentLoaded', function() {
  // 全ての.type_movie要素を取得
  var typeMovies = document.querySelectorAll('.type_movie');

  // 各要素にクリックイベントリスナーを追加
  typeMovies.forEach(function(element) {
      element.addEventListener('click', function() {
          // 他の全ての要素から.selectedクラスを削除
          typeMovies.forEach(function(el) {
              el.classList.remove('selected');
          });

          // クリックされた要素に.selectedクラスを追加
          element.classList.add('selected');
      });
  });
});

// 既存のJavaScriptファイルに追加
document.addEventListener("DOMContentLoaded", function() {
var modal = document.getElementById("closet-modal");
var btn = document.querySelector(".hunger-button");
var span = document.getElementsByClassName("closet-close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
});

document.addEventListener('DOMContentLoaded', function() {
// すべての「追加」ボタンに対してイベントリスナーを設定
document.querySelectorAll('.add-button').forEach(function(button) {
    button.addEventListener('click', function() {
        // ボタンから画像、カテゴリ、ブランドの情報を取得
        const image = this.getAttribute('data-image');
        const category = this.getAttribute('data-category');
        const brand = this.getAttribute('data-brand');
        const style_id = this.getAttribute('data-style_id');
        
        // data-inputエリアを選択
        const dataInputArea = document.querySelector('.data-input');
        
        // data-inputエリアに情報を追加（既存の内容を保持しつつ新しい内容を追加）
        dataInputArea.innerHTML += `
        <div class="input-item">
            <img src="${image}" alt="Closet Item" style="width: 220px; height: 220px; border-radius: 40px; border: 2px solid black;">
            <div class="text-info">
                <p>系統: ${style_id}</p>
                <p>カテゴリ: ${category}</p>
                <p>ブランド: ${brand}</p>
            </div>
            <button class="delete-button" data-id="1">削除</button>
        </div>
    
        `;
    });
});
document.addEventListener('click', function(e) {
    if (e.target && e.target.matches('.delete-button')) {
        const itemElement = e.target.closest('.input-item');
        if (itemElement) {
            itemElement.remove();
        }
    }
});

});

document.addEventListener('DOMContentLoaded', function() {
  var currentIndex = 0; // 現在表示しているコーディネートのインデックス
  var coordinations = document.querySelectorAll('.num_container'); // すべてのコーディネートを取得
  var totalCoordinations = coordinations.length; // コーディネートの総数

  // 最初のコーディネート以外を非表示にする
  coordinations.forEach(function(coordination, index) {
      if (index !== 0) coordination.style.display = 'none';
  });

  // 「次のコーディネートを表示」ボタンのクリックイベント
  document.getElementById('nextCoordination').addEventListener('click', function() {
      // 現在のコーディネートを非表示にする
      coordinations[currentIndex].style.display = 'none';

      // 次のコーディネートのインデックスを計算する（ループさせる）
      currentIndex = (currentIndex + 1) % totalCoordinations;

      // 次のコーディネートを表示する
      coordinations[currentIndex].style.display = 'block';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var currentIndex = 0; // 現在表示しているコーディネートのインデックス
  var coordinations2 = document.querySelectorAll('.num_container2'); // すべてのコーディネートを取得
  var totalCoordinations2 = coordinations2.length; // コーディネートの総数

  // 最初のコーディネート以外を非表示にする
  coordinations2.forEach(function(coordination, index) {
      if (index !== 0) coordination.style.display = 'none';
  });

  // 「次のコーディネートを表示」ボタンのクリックイベント
  document.getElementById('nextCoordination2').addEventListener('click', function() {
      // 現在のコーディネートを非表示にする
      coordinations2[currentIndex].style.display = 'none';

      // 次のコーディネートのインデックスを計算する（ループさせる）
      currentIndex = (currentIndex + 1) % totalCoordinations2;

      // 次のコーディネートを表示する
      coordinations2[currentIndex].style.display = 'block';
  });
});