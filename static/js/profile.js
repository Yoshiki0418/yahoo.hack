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

window.onload = function() {
  // モーダル1のイベントリスナーを設定
  document.getElementById('myBtn').addEventListener('click', openModal);
  document.getElementsByClassName('close')[0].addEventListener('click', closeModal);

  // モーダル2のイベントリスナーを設定
  document.getElementById('closetBtn1').addEventListener('click', openModal_closet);
  document.getElementById('closetBtn2').addEventListener('click', openModal_closet);
  document.getElementById('closetBtn3').addEventListener('click', openModal_closet);
  document.getElementById('closetBtn4').addEventListener('click', openModal_closet);
  document.getElementById('closetBtn5').addEventListener('click', openModal_closet);

  document.getElementsByClassName('close')[1].addEventListener('click', closeModal_closet);

  // window.onclick イベントは1つの関数にまとめて設定する
  window.onclick = function(event) {
    if (event.target == document.getElementById('myModal')) {
      closeModal();
    }
    if (event.target == document.getElementById('closetModal')) {
      closeModal_closet();
    }
  };
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


/*
// クローゼット収納
document.getElementById("upload-button").addEventListener("click", function(event) {
  event.preventDefault(); // デフォルトのフォーム送信をキャンセル

  var fileInput = document.getElementById("uploadInput");
  var fileList = fileInput.files;

  if (fileList.length > 0) {
    var file = fileList[0];
    var reader = new FileReader();

    reader.onload = function(event) {
      var imageSrc = event.target.result;
      
      // 画像を表示する処理を行う関数を呼び出す
      displayImage(imageSrc);
      
      // モーダルウィンドウを閉じる
      closeModal();
    };

    reader.readAsDataURL(file);
  } else {
    alert("ファイルを選択してください。");
  }
});

// モーダルウィンドウを閉じる関数
function closeModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}

// 画像を表示する関数
function displayImage(imageSrc) {
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
}

// アイテムを削除する関数
function deleteItem(button) {
  button.parentElement.remove();
}
*/


document.addEventListener('DOMContentLoaded', function() {
  let processedImageUrl = null; // 背景削除後の画像URLを保持する変数
  let isImageUploaded = false;
  const saveButton = document.querySelector('.button-save');
  const inputFields = document.querySelectorAll('.input-field1, .input-field2, .input-field3, .input-field4, .input-field5, .input-field6, .input-field7');
  const imageUpload = document.getElementById('imageUpload');
  const backgroundTransparencyButton = document.querySelector('.background_transparency');

  imageUpload.addEventListener('change', function() {
      previewImage();
      handleFileUpload();
  });

  // ファイルアップロードハンドラー
  function handleFileUpload() {
      const file = imageUpload.files[0];
      if (file) {
          // ボタンをアクティブにする
          backgroundTransparencyButton.disabled = false;
          backgroundTransparencyButton.style.backgroundColor = '#4CAF50'; // 例: 緑色に変更
          backgroundTransparencyButton.style.color = 'white'; // テキストの色を白に変更

          // ここにプレビュー機能やその他の処理を追加する
          previewImage(); // プレビュー関数を呼び出す
      }
  }

  backgroundTransparencyButton.addEventListener('click', function() {
      if (isImageUploaded) {
          let formData = new FormData();
          formData.append('image', imageUpload.files[0]);
  
          fetch('/remove-background', {
              method: 'POST',
              body: formData,
          })
          .then(response => {
              if (response.ok) {
                  return response.json(); // JSONオブジェクトとしてレスポンスを解析
              }
              throw new Error('Network response was not ok.');
          })
          .then(data => {
              processedImageUrl = data.file_path; // 背景削除後の画像URLをグローバル変数に保存
              previewProcessedImg(); // 背景削除後の画像プレビューを更新する関数を呼び出し
              backgroundTransparencyButton.disabled = true;
              backgroundTransparencyButton.style.backgroundColor = ''; 
              backgroundTransparencyButton.style.color = '';
          })
          .catch(error => console.error('Error:', error));
      }
  });
  

  function previewImage() {
      const file = imageUpload.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              // アップロードされた画像のデータURLをグローバル変数に保存
              processedImageUrl = e.target.result;
  
              const img = document.getElementById('imagePreview').querySelector('img');
              if (!img) { // imgタグがまだなければ作成
                  const newImg = document.createElement('img');
                  document.getElementById('imagePreview').appendChild(newImg);
              }
              img.src = processedImageUrl; // 背景削除後の画像URLを設定
              document.getElementById('imageUploadLabel').style.display = 'none';
              img.style.display = 'block'; // imgタグを表示
              isImageUploaded = true;
              updateSaveButtonState();
          };
          reader.readAsDataURL(file);
      }
  }

  function previewProcessedImg() {
      if (processedImageUrl) { // 背景削除後の画像URLが存在する場合
          const img = document.getElementById('imagePreview').querySelector('img');
          if (!img) { // imgタグがまだなければ作成
              const newImg = document.createElement('img');
              document.getElementById('imagePreview').appendChild(newImg);
          }
          img.src = processedImageUrl; // 背景削除後の画像URLを設定
          document.getElementById('imageUploadLabel').style.display = 'none';
          img.style.display = 'block'; // imgタグを表示
      }
  }

  function updateSaveButtonState() {
      let isAllFilled = true;
      const requiredFields = [inputFields[0], inputFields[1], inputFields[2]]; 
      requiredFields.forEach(field => {
          if (!field.value) isAllFilled = false;
      });

      saveButton.disabled = !(isAllFilled && isImageUploaded);
      saveButton.style.backgroundColor = saveButton.disabled ? "" : "blue";
      saveButton.style.color = saveButton.disabled ? "" : "white";
  }

  saveButton.addEventListener('click', function() {
      const saveArea = document.getElementById('saveArea');
      const file = imageUpload.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = function() {
              const saveArea = document.getElementById('saveArea');
              const imageContainer = document.createElement('div');
              imageContainer.className = 'image-container';
              saveArea.appendChild(imageContainer);

              const img = document.createElement('img');
              img.src = processedImageUrl; // 背景削除後の画像URLを使用
              img.className = 'saveArea-image';
              imageContainer.appendChild(img);

              backgroundTransparencyButton.disabled = true;
              backgroundTransparencyButton.style.backgroundColor = ''; 
              backgroundTransparencyButton.style.color = '';

              // 入力フィールドの情報を取得し、未入力の場合は "none" を表示
              const infoText = Array.from(inputFields).map((field, index) => {
                  const fieldName = document.querySelector(`.information-${index + 1}`).textContent.trim();
                  const fieldValue = field.value.trim() === '' ? 'none' : field.value.trim();
                  return `${fieldName}: ${fieldValue}`;
              }).join(', ');

              img.dataset.info = infoText;

              img.addEventListener('click', function() {
                  const modal = document.getElementById('imageInfoModal');
                  const modalText = document.getElementById('modal-info-text');
                  modalText.textContent = this.dataset.info; // モーダルに情報をセット
                  modal.style.display = 'flex'; // モーダルを表示
              });

              const deleteButton = document.createElement('button');
              deleteButton.className = 'delete-button';
              deleteButton.textContent = '×';
              imageContainer.appendChild(deleteButton);

              deleteButton.addEventListener('click', function() {
                  saveArea.removeChild(imageContainer);
              });

              document.getElementById('imagePreview').style.backgroundImage = '';
              document.getElementById('imageUploadLabel').style.display = 'block';
              imageUpload.value = '';
              isImageUploaded = false;
              updateSaveButtonState();
              resetInputFields();
              document.getElementById('imagePreview').querySelector('img').style.display = 'none';
          };
          reader.readAsDataURL(file);
      }
  });

  function resetInputFields() {
      inputFields.forEach(field => field.value = '');
  }

  updateSaveButtonState();
  inputFields.forEach(field => {
      field.addEventListener('input', updateSaveButtonState);
  });
  imageUpload.addEventListener('change', previewImage);

  // モーダルを閉じる処理
  const closeButton = document.querySelector('.close-button');
  closeButton.addEventListener('click', function() {
      const modal = document.getElementById('imageInfoModal');
      modal.style.display = 'none';
  });

  // モーダル外クリックで閉じる
  window.addEventListener('click', function(event) {
      const modal = document.getElementById('imageInfoModal');
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  });
});
