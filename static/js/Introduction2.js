// Introduction2.js
function previewImage() {
    const input = document.getElementById('imageUpload');
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById('imagePreview');
        preview.style.backgroundImage = `url(${e.target.result})`;
        preview.style.backgroundSize = 'cover';
        preview.style.backgroundPosition = 'center';
  
        // 画像が選択されたらアップロードボタンを非表示に
        document.getElementById('imageUploadLabel').style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  }
  