document.addEventListener('DOMContentLoaded', function() {
  let isImageUploaded = false; // 画像がアップロードされているか追跡する変数
  const saveButton = document.querySelector('.button-save');
  const inputFields = document.querySelectorAll('.input-field1, .input-field2, .input-field3, .input-field4, .input-field5, .input-field6, .input-field7');
  const imageUpload = document.getElementById('imageUpload');

  function previewImage() {
      const file = imageUpload.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              const preview = document.getElementById('imagePreview');
              preview.style.backgroundImage = `url(${e.target.result})`;
              preview.style.backgroundSize = 'cover';
              preview.style.backgroundPosition = 'center';

              document.getElementById('imageUploadLabel').style.display = 'none';
              isImageUploaded = true; // 画像がアップロードされたとマーク
              updateSaveButtonState();
          };
          reader.readAsDataURL(file);
      }
  }

  function updateSaveButtonState() {
      let isAllFilled = true;
      const requiredFields = [inputFields[0], inputFields[1], inputFields[6]]; // 1, 2, 7番目が必須
      requiredFields.forEach(field => {
          if (!field.value) isAllFilled = false;
      });

      if (isAllFilled && isImageUploaded) {
          saveButton.disabled = false;
          saveButton.style.backgroundColor = "blue"; // 背景色を青に変更
          saveButton.style.color = "white"; // 文字色を白に設定
      } else {
          saveButton.disabled = true;
          saveButton.style.backgroundColor = ""; // デフォルトの背景色にリセット
          saveButton.style.color = ""; // デフォルトの文字色にリセット
      }
  }

  function resetInputFields() {
      inputFields.forEach(field => {
          field.value = '';
      });
  }

  saveButton.addEventListener('click', function() {
      var saveArea = document.getElementById('saveArea');
      var file = imageUpload.files[0];
      if (file) {
          var reader = new FileReader();
          reader.onloadend = function() {
              var imageContainer = document.createElement('div');
              imageContainer.className = 'image-container';
              saveArea.appendChild(imageContainer);

              var img = document.createElement('img');
              img.src = reader.result;
              img.className = 'saveArea-image';
              imageContainer.appendChild(img);

              var deleteButton = document.createElement('button');
              deleteButton.className = 'delete-button';
              deleteButton.innerHTML = '×';
              imageContainer.appendChild(deleteButton);

              deleteButton.addEventListener('click', function() {
                  saveArea.removeChild(imageContainer);
              });

              document.getElementById('imagePreview').style.backgroundImage = '';
              document.getElementById('imageUploadLabel').style.display = 'block';
              imageUpload.value = '';
              isImageUploaded = false;
              updateSaveButtonState();
          };
          reader.readAsDataURL(file);
      }

      resetInputFields();
      updateSaveButtonState();
  });

  updateSaveButtonState();
  inputFields.forEach(field => {
      field.addEventListener('input', updateSaveButtonState);
  });
  imageUpload.addEventListener('change', previewImage);
});
