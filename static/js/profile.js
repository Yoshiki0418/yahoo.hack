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
  document.getElementById('closetBtn6').addEventListener('click', openModal_closet);
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
// モーダルウィンドウの外側をクリックしても閉じるようにする
window.onclick = function(event) {
  var modalBackground = document.getElementById("closetModal");
  if (event.target == modalBackground) {
      modalBackground.style.display = "none";
  }
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
    // アイコン画像がクリックされた時のイベントリスナーを設定
    document.getElementById('image').addEventListener('click', function() {
      // 隠されたファイルインプットをクリックすることで、ファイル選択ダイアログを開く
      document.getElementById('fileInput').click();
    });

    // ファイルが選択された時に、選択された画像を表示する
    document.getElementById('fileInput').addEventListener('change', function(event) {
      if(event.target.files.length > 0) {
        let selectedFile = event.target.files[0];
        let reader = new FileReader();
        let formData = new FormData();

        formData.append('iconImage', selectedFile);
        reader.onload = function(event) {
          document.getElementById('image').src = event.target.result;
        };
        
        fetch('/upload-icon', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
        });
        reader.readAsDataURL(selectedFile);
      }
    });
  });




/*イントロダクション２*/
document.addEventListener('DOMContentLoaded', function() {
  let processedImageUrl = null; // 背景削除後の画像URLを保持する変数
  let isImageUploaded = false;
  const saveButton = document.querySelector('.button-save-pro');
  const inputFields = document.querySelectorAll('.input-field1, .input-field2, .input-field3, .input-field4, .input-field5, .input-field6, .input-field7');
  const imageUpload = document.getElementById('imageUpload');
  const backgroundTransparencyButton = document.querySelector('.background_transparency');
  const changePhotoButton = document.querySelector('.change_photo');
  const nextButton = document.querySelector('.next-button');

  imageUpload.addEventListener('change', function() {
      previewImage();
      handleFileUpload();
  });

  nextButton.addEventListener('click', function() {
      let formData = new FormData();
  
      imagesData.forEach((data, index) => {
          formData.append(`images[${index}]`, data.file); // 画像ファイルを追加
          formData.append(`infos[${index}]`, data.info); // 関連情報を追加
      });
  
      for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
      }
  
      fetch('/save-all-images', {
          method: 'POST',
          body: formData,
      })
      .then(response => response.json())
      .then(data => {
          console.log('Success:', data);
          /*window.location.href = '/profile';*/
      })
      .catch(error => {
          console.error('Error:', error);
      });
      closeModal_closet();
  });
  
 

  // ファイルアップロードハンドラー
  function handleFileUpload() {
      const file = imageUpload.files[0];
      if (file) {
          // ボタンをアクティブにする
          backgroundTransparencyButton.disabled = false;
          backgroundTransparencyButton.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'; // 例: 緑色に変更
          backgroundTransparencyButton.style.color = 'white'; // テキストの色を白に変更

          // ボタンをアクティブにする
          changePhotoButton.disabled = false;
          changePhotoButton.style.backgroundColor = 'rgba(0, 0, 255, 0.5)';
          changePhotoButton.style.color = 'white'; // テキストの色を白に変更

      }
  }

  backgroundTransparencyButton.addEventListener('click', function() {
      if (isImageUploaded) {
          let formData = new FormData();
          formData.append('image', imageUpload.files[0]);
  
          // カーソルをローディングアイコンに変更し、changePhotoボタンを無効化
          document.body.style.cursor = 'wait';
          backgroundTransparencyButton.style.cursor = 'wait';
          changePhotoButton.disabled = true; // changePhotoボタンを無効化
          changePhotoButton.style.cursor = 'default'; // マウスカーソルはデフォルトのまま
  
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
  
              // ボタンを非アクティブ状態に戻す
              backgroundTransparencyButton.disabled = true;
              backgroundTransparencyButton.style.backgroundColor = ''; 
              backgroundTransparencyButton.style.color = '';
  
              // カーソルを元に戻し、changePhotoボタンを再度有効化
              document.body.style.cursor = 'default';
              backgroundTransparencyButton.style.cursor = 'default';
              changePhotoButton.disabled = false; // changePhotoボタンを再度有効化
              changePhotoButton.style.cursor = 'pointer'; // マウスカーソルをポインターに戻す
          })
          .catch(error => {
              console.error('Error:', error);
              // エラー発生時もカーソルを元に戻し、ボタンを再度有効化
              document.body.style.cursor = 'default';
              backgroundTransparencyButton.style.cursor = 'default';
              changePhotoButton.disabled = false; // changePhotoボタンを再度有効化
              changePhotoButton.style.cursor = 'pointer'; // マウスカーソルをポインターに戻す
          });
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
                  img = newImg; // この行を追加
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

  changePhotoButton.addEventListener('click', function() {
      document.getElementById('imageUpload').click();
  });

  // 画像ファイルとその情報を保持する配列
  let imagesData = [];

  saveButton.addEventListener('click', function() {
      const saveArea = document.getElementById('saveArea');
      const file = imageUpload.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function() {
              const saveArea = document.getElementById('saveArea');
              const imageContainer = document.createElement('div');
              imageContainer.className = 'image-container';
              saveArea.appendChild(imageContainer);
  
              const img = document.createElement('img');
              img.src = processedImageUrl; // FileReaderから読み込んだ画像データを使用
              img.className = 'saveArea-image';
              imageContainer.appendChild(img);
  
              // ボタンの状態更新
              backgroundTransparencyButton.disabled = true;
              backgroundTransparencyButton.style.backgroundColor = ''; 
              backgroundTransparencyButton.style.color = ''; 
              changePhotoButton.disabled = true;
              changePhotoButton.style.backgroundColor = ''; 
              changePhotoButton.style.color = ''; 
  

              // Json形式でデータを保存
              const infoObject = Array.from(inputFields).reduce((acc, field, index) => {
                  const fieldName = document.querySelector(`.information-${index + 1}`).textContent.trim();
                  const fieldValue = field.value.trim() === '' ? 'none' : field.value.trim();
                  acc[fieldName] = fieldValue; // オブジェクトにフィールド名と値を追加
                  return acc;
              }, {});
  
              const infoJson = JSON.stringify(infoObject); // オブジェクトをJSON文字列に変換
              img.dataset.info = infoJson;

              imagesData.push({ file: file, info: infoJson }); // 画像と情報を配列に追加

               // 追加された要素のインデックス（配列の最後の要素なので、length - 1となる）
              const index = imagesData.length - 1;

              // HTML要素にインデックスを紐付ける
              imageContainer.setAttribute('data-index', index);

  
              // 画像クリックでモーダル表示
              img.addEventListener('click', function() {
                  const modal = document.getElementById('imageInfoModal');
                  const modalText = document.getElementById('modal-info-text');
                  modalText.textContent = this.dataset.info; // モーダルに情報をセット
                  modal.style.display = 'flex'; // モーダルを表示
              });
  
              // 削除ボタンの追加
              const deleteButton = document.createElement('button');
              deleteButton.className = 'delete-button';
              deleteButton.textContent = '×';
              imageContainer.appendChild(deleteButton);
  
              deleteButton.addEventListener('click', function() {
                  // 削除する要素のインデックスを取得
                  const index = parseInt(imageContainer.getAttribute('data-index'), 10); // 10進数として解析
              
                  // インデックスを使用して配列から要素を削除
                  imagesData.splice(index, 1); // indexの位置から1要素を削除
              
                  // 画像コンテナをDOMから削除
                  saveArea.removeChild(imageContainer);
              
                  // imagesDataのインデックスを更新する（必要な場合）
                  document.querySelectorAll('.image-container').forEach((container, newIndex) => {
                      container.setAttribute('data-index', newIndex); // 新しいインデックスを設定
                  });
              });
              
  
              // プレビューとフォームのリセット
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
