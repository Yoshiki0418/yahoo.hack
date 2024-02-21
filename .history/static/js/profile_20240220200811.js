 // モーダルを開く関数
 function openModal_closet() {
  document.getElementById('closetModal').style.display = "block";
}

// モーダルを閉じる関数
function closeModal_closet() {
  document.getElementById('closetModal').style.display = "none";
}

// 選択された写真を表示する関数
function displayImage(event, containerId) {
  var selectedFile = event.target.files[0];
  var reader = new FileReader();
  
  reader.onload = function(event) {
      var imageUrl = event.target.result;
      var imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      
      var imageContainer = document.getElementById(containerId);
      imageContainer.innerHTML = '';
      imageContainer.appendChild(imgElement);
      
      // 削除ボタンを作成して追加
      var deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = '×';
      imageContainer.appendChild(deleteButton);
      
      // 削除ボタンのクリックイベントリスナーを設定
      deleteButton.addEventListener('click', function() {
          imageContainer.removeChild(imgElement);
          imageContainer.removeChild(deleteButton);
      });
  };
  
  reader.readAsDataURL(selectedFile);
}

document.addEventListener('DOMContentLoaded', function() {
  // 画像選択ボタンのイベントリスナー
  document.getElementById('myBtn').addEventListener('click', function() {
      document.getElementById('fileInput').click();
  });

  // モーダル関連のイベントリスナー
  document.querySelectorAll('.close').forEach(function(element) {
      element.addEventListener('click', function() {
          document.querySelectorAll('.modal').forEach(function(modal) {
              modal.style.display = "none";
          });
      });
  });

  window.onclick = function(event) {
      if (event.target == document.getElementById('closetModal')) {
          closeModal_closet();
      }
  }
});