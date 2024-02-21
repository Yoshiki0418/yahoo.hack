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
});