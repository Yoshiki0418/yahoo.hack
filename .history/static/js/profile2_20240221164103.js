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
        console.error("ファイルの読み込みに失敗しました");
    };

    reader.readAsDataURL(file);
}

// ファイルが選択された時の処理
function fileSelected(event) {
    // 選択されたファイルの情報を取得する
    var file = event.target.files[0];
    if (file) {
        console.log("選択されたファイル: ", file.name);
        // ここでファイルに対する処理を行う
    }
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

    // AIモードボタンのイベントリスナーを動的に追加する処理を純粋なJavaScriptで実装
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'AI-mode') {
            console.log("AIモードボタンが押されました。");
            // AIモードを有効化するコードをここに記述
        }
    });

    // AIモードボタンのイベントリスナーを動的に追加する処理を純粋なJavaScriptで実装
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'hand-mode') {
            console.log("handモードボタンが押されました。");
            document.getElementById('hidden-file-input').click();
            // AIモードを有効化するコードをここに記述
        }
    });
});
