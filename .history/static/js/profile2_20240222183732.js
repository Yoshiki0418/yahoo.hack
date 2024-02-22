// モーダルを開く関数
function openModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    // モーダル表示後にボタンのイベントリスナーを再設定
    setupButtonListeners();
}

// モーダルを閉じる関数
function closeModal() {
    document.getElementById('myModal').style.display = "none";
}

// グローバル変数でアップロードされたメディアを格納
var uploadedMedia = null;
let mediaType = null; // メディアのタイプを格納するグローバル変数

// 画像または動画を表示し、グローバル変数に格納する関数
function displayImage10(event, containerId) {
    var file = event.target.files[0];
    if (!file) {
        console.error("ファイルが選択されていません");
        return;
    }

    // グローバル変数にファイルを格納
    uploadedMedia = file;

    if (uploadedMedia) {
        // ファイルタイプに基づいてメディアタイプを決定
        mediaType = uploadedMedia.type.startsWith('image/') ? 'image' : 'video';
    }

    var reader = new FileReader();
    var imageContainer = document.getElementById(containerId);

    reader.onload = function(e) {
        imageContainer.innerHTML = ''; // 既存の内容をクリア
        var mediaElement = file.type.startsWith('image/') ? 'img' : 'video';
        var element = document.createElement(mediaElement);
        element.src = e.target.result;
        if (mediaElement === 'video') {
            element.controls = true;
        }
        imageContainer.appendChild(element);
    };

    reader.onerror = function(e) {
        console.error("ファイルの読み込みに失敗しました");
    };

    reader.readAsDataURL(file);
}

// ファイルが選択された時の処理
function fileSelected(event) {
    var file = event.target.files[0];
    if (file && file.type.startsWith('image/')) { // 画像ファイルのみ処理
        var reader = new FileReader();
        reader.onload = function(e) {
            // 新しいitem_blockを作成してitemsContainerに追加
            var newItemBlock = createNewItemBlock(e.target.result);
            document.getElementById('itemsContainer').appendChild(newItemBlock);
        };
        reader.readAsDataURL(file); // 画像ファイルをDataURLとして読み込む
    }
}

// 新しいitem_blockにフォーム要素を追加する関数の拡張版
function createNewItemBlock(imageSrc) {
    var newItemBlock = document.createElement('div');
    newItemBlock.className = 'add_item_block';

    // 画像表示用のdivとimg要素
    var addPicDiv = document.createElement('div');
    addPicDiv.className = 'add_item_pic';
    var imgElement = document.createElement('img');
    imgElement.src = imageSrc;
    addPicDiv.appendChild(imgElement);
    newItemBlock.appendChild(addPicDiv);

    // 価格入力エリア
    var priceDiv = document.createElement('div');
    priceDiv.className = 'form-price';
    var priceLabel = document.createElement('label');
    priceLabel.className = 'topic';
    priceLabel.setAttribute('for', 'price');
    priceLabel.textContent = '価格';
    var priceInput = document.createElement('input');
    priceInput.type = 'text';
    priceInput.id = 'price';
    priceInput.name = 'price';
    priceInput.className = 'form-control';
    priceDiv.appendChild(priceLabel);
    priceDiv.appendChild(priceInput);
    newItemBlock.appendChild(priceDiv);

    // 系統選択エリア
    var styleDiv = createSelectDiv('style', '系統', ['カジュアル', 'フォーマル', 'スポーティ']);
    newItemBlock.appendChild(styleDiv);

    // カテゴリー選択エリア
    var categoryDiv = createSelectDiv('category', 'カテゴリー', ['トップス', 'ボトムス', 'シューズ']);
    newItemBlock.appendChild(categoryDiv);

    // ブランド入力エリア
    var brandDiv = document.createElement('div');
    brandDiv.className = 'form-brand';
    var brandLabel = document.createElement('label');
    brandLabel.className = 'topic';
    brandLabel.setAttribute('for', 'brand');
    brandLabel.textContent = 'ブランド';
    var brandInput = document.createElement('input');
    brandInput.type = 'text';
    brandInput.id = 'brand';
    brandInput.name = 'brand';
    brandInput.className = 'form-control';
    brandDiv.appendChild(brandLabel);
    brandDiv.appendChild(brandInput);
    newItemBlock.appendChild(brandDiv);

    // 販売元URL入力エリア
    var sellerUrlDiv = document.createElement('div');
    sellerUrlDiv.className = 'form-seller-url';
    var sellerUrlLabel = document.createElement('label');
    sellerUrlLabel.className = 'topic';
    sellerUrlLabel.setAttribute('for', 'sellerUrl');
    sellerUrlLabel.textContent = '販売元URL';
    var sellerUrlInput = document.createElement('input');
    sellerUrlInput.type = 'text';
    sellerUrlInput.id = 'sellerUrl';
    sellerUrlInput.name = 'sellerUrl';
    sellerUrlInput.className = 'form-control';
    sellerUrlDiv.appendChild(sellerUrlLabel);
    sellerUrlDiv.appendChild(sellerUrlInput);
    newItemBlock.appendChild(sellerUrlDiv);

    // 削除ボタンの追加
    var deleteButton = document.createElement('button');
    deleteButton.textContent = '×';
    deleteButton.className = 'delete-item-btn'; // CSSでスタイルを設定できるようにクラスを追加
    deleteButton.onclick = function() {
        newItemBlock.remove(); // このボタンが属するitem_blockを削除
    };
    newItemBlock.appendChild(deleteButton);

    return newItemBlock;
}

// 選択肢を持つdivを作成するヘルパー関数
function createSelectDiv(id, label, options) {
    var div = document.createElement('div');
    div.className = 'form-' + id;
    var selectLabel = document.createElement('label');
    selectLabel.className = 'topic';
    selectLabel.setAttribute('for', id);
    selectLabel.textContent = label;
    var select = document.createElement('select');
    select.id = id;
    select.name = id;
    select.className = 'form-control';
    var defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '選択してください';
    select.appendChild(defaultOption);
    options.forEach(function(optionText) {
        var option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        select.appendChild(option);
    });
    div.appendChild(selectLabel);
    div.appendChild(select);
    return div;
}

// 価格が適切な数値であるか検証する関数
function validatePrices() {
    const itemsContainer = document.getElementById('itemsContainer');
    const itemBlocks = itemsContainer.getElementsByClassName('add_item_block');
    for (const itemBlock of itemBlocks) {
        const priceInput = itemBlock.querySelector('input[name="price"]');
        if (!priceInput.value.trim() || isNaN(priceInput.value)) {
            alert('価格は数値で入力してください。');
            return false; // 検証失敗
        }
    }
    return true; // すべての価格が適切な数値である
}



// ページ読み込み完了後に実行される関数
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('myBtn').addEventListener('click', openModal);
    document.getElementsByClassName('close')[0].addEventListener('click', closeModal);
    // モーダルの外側をクリックしたときに閉じる処理
    window.addEventListener('click', function(event) {
        if (event.target == document.getElementById('myModal')) {
            closeModal();
        }
    });

    // AIモードボタンが再度クリックされた時の処理
    document.getElementById('AI-mode').addEventListener('click', function() {
        if (!uploadedMedia || !mediaType) {
            console.error("アップロードされたファイルまたはメディアタイプがありません");
            return;
        }
    
        const formData = new FormData();
        formData.append('file', uploadedMedia); // ファイルを追加
        formData.append('mediaType', mediaType); // メディアタイプを追加
    
        // Flaskサーバーへの送信
        fetch('/ai-cuter', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('送信成功:', data);
            const itemsContainer = document.getElementById('itemsContainer'); // アイテムを追加するコンテナー
        
            // サーバーから受け取った各カテゴリーのアイテムに対してループ
            for (const category in data) {
                const imageSrc = data[category]; // 画像のパス
                const newItemBlock = createNewItemBlock(imageSrc); // 新しいitem_blockを作成
                itemsContainer.appendChild(newItemBlock); // itemsContainerに追加
            }
        })
        .catch(error => {
            console.error('送信エラー:', error);
        });
    });

    // handモードボタンのイベントリスナーを動的に追加する処理を純粋なJavaScriptで実装
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'hand-mode') {
            console.log("handモードボタンが押されました。");
            document.getElementById('hidden-file-input').click();
            // AIモードを有効化するコードをここに記述
        }
    });

    document.getElementById('uploadButton').addEventListener('click', function() {
        if (!validatePrices()) {
            return; // 価格入力に問題がある場合は処理を中断
        }
        // フォームデータを準備
        const formData = new FormData();
    
        // コーディネートの画像・動画を追加
        if (uploadedMedia && mediaType) {
            formData.append('mediaType', mediaType); // 'image' or 'video'
            formData.append('uploadedMedia', uploadedMedia); // Blob or File
        }
    
        // 各アイテムの情報を追加
        const itemsContainer = document.getElementById('itemsContainer');
        const itemBlocks = itemsContainer.getElementsByClassName('add_item_block');
        Array.from(itemBlocks).forEach((itemBlock, index) => {
            const imgElement = itemBlock.querySelector('img');
            const priceInput = itemBlock.querySelector('input[name="price"]');
            const styleSelect = itemBlock.querySelector('select[name="style"]');
            const categorySelect = itemBlock.querySelector('select[name="category"]');
            const brandInput = itemBlock.querySelector('input[name="brand"]');
            const sellerUrlInput = itemBlock.querySelector('input[name="sellerUrl"]');
    
            // 画像URLをフォームデータに追加
            if (imgElement) {
                formData.append(`items[${index}][imageSrc]`, imgElement.src);
            }
    
            // その他の情報をフォームデータに追加
            formData.append(`items[${index}][price]`, priceInput.value);
            formData.append(`items[${index}][style]`, styleSelect.value);
            formData.append(`items[${index}][category]`, categorySelect.value);
            formData.append(`items[${index}][brand]`, brandInput.value);
            formData.append(`items[${index}][sellerUrl]`, sellerUrlInput.value);
        });

        console.log('Success:' )
        // データをFlaskに送信する前にフォームデータの内容をコンソールに出力
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        // データをFlaskに送信
        fetch('/post-file', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
    });
});



