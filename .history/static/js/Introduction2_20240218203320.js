document.addEventListener('DOMContentLoaded', function() {
    let isImageUploaded = false;
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
                isImageUploaded = true;
                updateSaveButtonState();
            };
            reader.readAsDataURL(file);
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
                const imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';
                saveArea.appendChild(imageContainer);

                const img = document.createElement('img');
                img.src = reader.result;
                img.className = 'saveArea-image';
                imageContainer.appendChild(img);

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
