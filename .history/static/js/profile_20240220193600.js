// モーダルを開く関数
function openModal() {
  document.getElementById('myModal').style.display = "block";
}

// モーダルを閉じる関数
function closeModal() {
  document.getElementById('myModal').style.display = "none";
}

// クローゼット収納用モーダルウィンドウを開く関数
function openModal_closet() {
  document.getElementById('closetModal').style.display = "block";
}

// クローゼット収納用モーダルウィンドウを閉じる関数
function closeModal_closet() {
  document.getElementById('closetModal').style.display = "none";
}

document.getElementById('myBtn').addEventListener('click', function(event) {
  // モーダルを直接開かない
  document.getElementById('uploadInput').click();
});

function displayImage(event, containerId) {
  var imageContainer = document.getElementById(containerId);
  var file = event.target.files[0];
  var reader = new FileReader();

  reader.onload = function(e) {
      var img = document.createElement('img');
      img.src = e.target.result;
      imageContainer.innerHTML = ''; // コンテナをクリア
      imageContainer.appendChild(img); // 新しい画像を追加

      // 画像が選択された後にモーダルを開く
      openModal();
  };

  reader.readAsDataURL(file);
}

// ページ読み込み時にモーダル関連のイベントリスナーを設定
window.onload = function() {
  document.getElementsByClassName('close')[0].addEventListener('click', closeModal);
  document.getElementsByClassName('close')[1].addEventListener('click', closeModal_closet);
  window.onclick = function(event) {
      if (event.target == document.getElementById('myModal')) {
          closeModal();
      } else if (event.target == document.getElementById('closetModal')) {
          closeModal_closet();
      }
  }
};
