// モーダルを開く関数
function openModal() {
  document.getElementById('myModal').style.display = "block";
}

// モーダルを閉じる関数
function closeModal() {
  document.getElementById('myModal').style.display = "none";
}


//クローゼット収納用モーダルウィンドウ
// モーダルを開く関数
function openModal_closet() {
  document.getElementById('closetModal').style.display = "block";
}

// モーダルを閉じる関数
function closeModal_closet() {
  document.getElementById('closetModal').style.display = "none";
}

document.getElementById('customButton').addEventListener('click', function() {
  document.getElementById('uploadInput10').click(); // 隠れたファイル入力をトリガー
});

// ページ読み込み時にイベントリスナーを設定
window.onload = function() {
  // モーダル1のイベントリスナーを設定
  document.getElementById('myBtn').addEventListener('click', openModal);
  document.getElementsByClassName('close')[0].addEventListener('click', closeModal);
  window.onclick = function(event) {
    if (event.target == document.getElementById('myModal')) {
      closeModal();
    }
  }

  // モーダル2のイベントリスナーを設定
  document.getElementById('closetBtn').addEventListener('click', openModal_closet);
  document.getElementsByClassName('close')[1].addEventListener('click', closeModal_closet);
  window.onclick = function(event) {
    if (event.target == document.getElementById('closetModal')) {
      closeModal_closet();
    }
  }
};



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
      // imageContainer の親要素を取得して、imageContainer を削除
      var parentElement = imageContainer.parentElement;
      parentElement.removeChild(imageContainer);
    });
  };
  
  reader.readAsDataURL(selectedFile);
}

// 削除ボタンをクリックした時の処理
function deleteItem(button) {
  var listItem = button.parentNode;
  listItem.parentNode.removeChild(listItem);
}



//クローゼット収納
document.getElementById("upload-button").addEventListener("click", function(event) {
  event.preventDefault(); // デフォルトのフォーム送信をキャンセル

  var fileInput = document.getElementById("uploadInput");
  var fileList = fileInput.files;

  if (fileList.length > 0) {
    var file = fileList[0];
    var reader = new FileReader();

    reader.onload = function(event) {
      var imageSrc = event.target.result;

      var list = document.getElementById("all-content").getElementsByTagName("ul")[0];
      var newItem = document.createElement("li");
      var deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.textContent = "X";
      deleteButton.onclick = function() {
        deleteItem(this);
      };
      var anchor = document.createElement("a");
      anchor.href = "";
      var image = document.createElement("img");
      image.src = imageSrc;
      image.width = 110;
      image.height = 110;

      anchor.appendChild(image);
      newItem.appendChild(deleteButton);
      newItem.appendChild(anchor);
      list.appendChild(newItem);
    };

    reader.readAsDataURL(file);
  } else {
    alert("Please select a file.");
  }
});

document.getElementById('myBtn').addEventListener('click', function() {
  document.getElementById('fileInput').click();
});

