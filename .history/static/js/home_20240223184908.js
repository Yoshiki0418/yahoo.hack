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
  // すべての「追加」ボタンにイベントリスナーを設定
  document.querySelectorAll('.add-button').forEach(function(button) {
      button.addEventListener('click', function() {
          // 画像の追加処理（前回と同じ）
          const image = this.getAttribute('data-image');
          const dataInputArea = document.querySelector('.data-input');
          const newItem = document.createElement('div');
          newItem.classList.add('input-item');
          newItem.innerHTML = `<img src="${image}" alt="Closet Item" style="width: 100%; height: 100%; border-radius: 40px; border: 2px solid black;">`;
          dataInputArea.appendChild(newItem);
          makeDraggable(newItem);
      });
  });

  // 保存ボタンのイベントリスナーを設定
  const saveButton = document.getElementById('saveButton');
  saveButton.addEventListener('click', function() {
      // すべての画像の位置とパスを配列に格納
      const imagesData = [];
      document.querySelectorAll('.input-item img').forEach(function(img, index) {
          const rect = img.getBoundingClientRect();
          // img要素のsrc属性から画像のパスを取得
          const imagePath = img.src;
          imagesData.push({
              path: imagePath, // 画像のパスを追加
              id: index,
              x: rect.left + window.scrollX - 1000, // ページのスクロールを考慮したX座標
              y: rect.top + window.scrollY - 60,  // ページのスクロールを考慮したY座標
              width: rect.width,
              height: rect.height
          });
      });
    // ここで imagesData をバックエンドに送信する処理を記述
    sendImagesDataToBackend(imagesData);
  });

  function sendImagesDataToBackend(imagesData) {
    // サーバーのエンドポイントURLを指定します
    const url = '/make_code';
  
    // fetch APIを使用してPOSTリクエストを送信します
    fetch(url, {
      method: 'POST', // HTTPメソッドをPOSTに設定
      headers: {
        'Content-Type': 'application/json' // コンテンツタイプをJSONに設定
      },
      body: JSON.stringify(imagesData) // 画像データをJSONに変換してボディにセット
    })
    .then(response => {
      if (response.ok) {
        return response.json(); // 正常なレスポンスの場合、JSONを解析して返す
      } else {
        throw new Error('Network response was not ok.'); // レスポンスが正常でない場合、エラーを投げる
      }
    })
    .then(data => {
      console.log('Success:', data); // 成功した場合、コンソールにデータを表示
    })
    .catch((error) => {
      console.error('Error:', error); // エラーが発生した場合、コンソールにエラーを表示
    });
  }
  

  // ドラッグ可能にする関数
  function makeDraggable(element) {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      element.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // マウスの開始位置を取得
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // マウスが移動すると発火するイベント
          document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // 新しい位置を計算
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // 要素の新しい位置を設定
          element.style.top = (element.offsetTop - pos2) + "px";
          element.style.left = (element.offsetLeft - pos1) + "px";
      }

      function closeDragElement() {
          // 動きを停止
          document.onmouseup = null;
          document.onmousemove = null;
      }
  }
});


document.addEventListener('DOMContentLoaded', function() {
  var currentIndex = 0; // 現在表示しているコーディネートのインデックス
  var coordinations = document.querySelectorAll('.num_container'); // すべてのコーディネートを取得
  var totalCoordinations = coordinations.length; // コーディネートの総数
  var changeTimeout; // 画像の自動切り替え用タイマー

  function showNextCoordination() {
    // 現在のコーディネートを非表示にする
    coordinations[currentIndex].style.display = 'none';
    clearTimeout(changeTimeout); // 既存のタイマーをクリアする

    // 次のコーディネートのインデックスを計算する（ループさせる）
    currentIndex = (currentIndex + 1) % totalCoordinations;

    // 次のコーディネートを表示する
    coordinations[currentIndex].style.display = 'block';

    // 次のコーディネートが動画か画像かに応じて処理を分岐
    var video = coordinations[currentIndex].querySelector('video');
    if (video) {
      video.play(); // 動画の場合、再生を開始する
      video.onended = showNextCoordination; // 動画が終了したら次のコーディネートを表示
    } else {
      changeTimeout = setTimeout(showNextCoordination, 10000); // 画像の場合、10秒後に次のコーディネートを表示
    }
  }

  // 最初のコーディネート以外を非表示にする
  coordinations.forEach(function(coordination, index) {
    if (index !== 0) coordination.style.display = 'none';
  });

  // 「次のコーディネートを表示」ボタンのクリックイベント
  document.getElementById('nextCoordination').addEventListener('click', showNextCoordination);

  // 最初のコーディネートが画像か動画かに応じて自動切り替えを開始する
  if (coordinations[0].querySelector('video')) {
    var firstVideo = coordinations[0].querySelector('video');
    firstVideo.onended = showNextCoordination; // 動画が終了したら次のコーディネートを表示
  } else {
    changeTimeout = setTimeout(showNextCoordination, 10000); // 画像の場合、10秒後に次のコーディネートを表示
  }
});

document.addEventListener('DOMContentLoaded', function() {
  var currentIndex2 = 0; // 現在表示しているコーディネートのインデックス
  var coordinations2 = document.querySelectorAll('.num_container2'); // すべてのコーディネートを取得
  var totalCoordinations2 = coordinations2.length; // コーディネートの総数
  var changeTimeout2; // 画像の自動切り替え用タイマー

  function showNextCoordination() {
    // 現在のコーディネートを非表示にする
    coordinations2[currentIndex2].style.display = 'none';
    clearTimeout(changeTimeout2); // 既存のタイマーをクリアする

    // 次のコーディネートのインデックスを計算する（ループさせる）
    currentIndex2 = (currentIndex2 + 1) % totalCoordinations2;

    // 次のコーディネートを表示する
    coordinations2[currentIndex2].style.display = 'block';

    // 次のコーディネートが動画か画像かに応じて処理を分岐
    var video = coordinations2[currentIndex2].querySelector('video');
    if (video) {
      video.play(); // 動画の場合、再生を開始する
      video.onended = showNextCoordination; // 動画が終了したら次のコーディネートを表示
    } else {
      changeTimeout2 = setTimeout(showNextCoordination, 10000); // 画像の場合、10秒後に次のコーディネートを表示
    }
  }

  // 最初のコーディネート以外を非表示にする
  coordinations2.forEach(function(coordination, index) {
    if (index !== 0) coordination.style.display = 'none';
  });

  // 「次のコーディネートを表示」ボタンのクリックイベント
  document.getElementById('nextCoordination2').addEventListener('click', showNextCoordination);

  // 最初のコーディネートが画像か動画かに応じて自動切り替えを開始する
  if (coordinations2[0].querySelector('video')) {
    var firstVideo = coordinations2[0].querySelector('video');
    firstVideo.onended = showNextCoordination; // 動画が終了したら次のコーディネートを表示
  } else {
    changeTimeout2 = setTimeout(showNextCoordination, 10000); // 画像の場合、10秒後に次のコーディネートを表示
  }
});




// document.addEventListener('DOMContentLoaded', function() {
//   var saveButton = document.getElementById('saveButton');
//   saveButton.addEventListener('click', function() {
//     const selectedItems = document.querySelectorAll('.input-item');
//     const itemsToSave = [];

//     selectedItems.forEach(function(item) {
//       const id = item.querySelector('.text-info p:nth-child(4)').textContent.replace('id: ', '');
//       itemsToSave.push({id});
//     });

//     console.log('保存された項目:', itemsToSave);

//     var formData = new FormData();
//     formData.append('items', JSON.stringify(itemsToSave));

//     // fetch APIを使用してサーバーにPOSTリクエストを送信
//     fetch('save-coordinate', {
//       method: 'POST',
//       body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log(data);
//       window.location.href = '/profile';
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
//   });
// });

