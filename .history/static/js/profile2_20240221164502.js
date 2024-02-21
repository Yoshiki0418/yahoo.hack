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

// 新しいitem_blockを作成する関数
function createNewItemBlock(imageSrc) {
    // 新しいdiv要素を作成（add_item_block）
    var newItemBlock = document.createElement('div');
    newItemBlock.className = 'add_item_block';

    // 画像を表示するためのdiv（add_item_pic）とimg要素を作成
    var addPicDiv = document.createElement('div');
    addPicDiv.className = 'add_item_pic';
    var imgElement = document.createElement('img');
    imgElement.src = imageSrc; // FileReaderで読み込んだ画像のDataURLを設定
    addPicDiv.appendChild(imgElement);
    
    // newItemBlockにaddPicDivを追加
    newItemBlock.appendChild(addPicDiv);

    // ここで、価格、系統、カテゴリー、ブランドに関する要素を追加しても良い
    // 省略していますが、上記のHTML構造に従って要素を作成・追加してください

    return newItemBlock;
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
