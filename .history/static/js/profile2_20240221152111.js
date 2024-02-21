// モーダルを開く関数
function openModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
}

// モーダルを閉じる関数
function closeModal() {
    document.getElementById('myModal').style.display = "none";
}

// 画像または動画を表示する関数
function displayImage10(event, containerId) {
    var file = event.target.files[0];
    if (!file) {
        console.error("ファイルが選択されていません");
        return;
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
        imageContainer.innerHTML = '<p>ファイルの読み込みに失敗しました。</p>';
    };

    reader.readAsDataURL(file);
}

// アイテムを追加する関数
function addItem() {
    var itemsContainer = document.getElementById('itemsContainer');
    if (!itemsContainer) {
        console.error("itemsContainerが見つかりません。");
        return;
    }

    var newItem = document.createElement('div');
    newItem.className = 'add_item_block';
    // newItemのinnerHTMLにフォーム要素を追加
    // ここにフォーム要素のHTMLを設定する

    itemsContainer.appendChild(newItem);
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
    // AIモードボタンのイベントリスナーはここに追加
    // AIモードボタンのイベントリスナーを設定
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'AI-mode') {
            console.log("AIモードボタンが押されました。");
            // AIモードを有効化するコードをここに記述
        }
    });
});

$(document).on('click', '#AI-mode', function() {
    console.log("AIモードボタンが押されました。");
    // AIモードを有効化するコードをここに記述
});