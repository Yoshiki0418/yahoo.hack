// モーダルを開く関数
function openModal() {
    document.getElementById('myModal').style.display = "block";
  }
  
  // モーダルを閉じる関数
  function closeModal() {
    document.getElementById('myModal').style.display = "none";
  }

  function displayImage10(event, containerId) {
    var file = event.target.files[0]; // 選択されたファイルを取得
    if (file) {
        var reader = new FileReader(); // FileReader インスタンスを作成
        var imageContainer = document.getElementById(containerId);
        if (!imageContainer) {
            console.error("指定されたcontainerIdが見つかりません:", containerId);
            return;
        }

        // 読み込み中のインジケータを表示
        imageContainer.innerHTML = '<p>読み込み中...</p>';

        reader.onload = function(e) {
            imageContainer.innerHTML = ''; // 既存の内容をクリア

            if (file.type.startsWith('image/')) {
                var img = document.createElement('img');
                img.src = e.target.result;
                imageContainer.appendChild(img);
            } else if (file.type.startsWith('video/')) {
                var video = document.createElement('video');
                video.src = e.target.result;
                video.controls = true; // コントロールを表示
                // video.autoplay = true; // 自動再生
                imageContainer.appendChild(video);
            }
        };

        reader.onerror = function(e) {
            // エラーが発生した場合は、インジケータをエラーメッセージに置き換える
            imageContainer.innerHTML = '<p>ファイルの読み込みに失敗しました。</p>';
        };

        reader.readAsDataURL(file); // ファイルの内容をDataURLとして読み込む
    }
}



  document.addEventListener('DOMContentLoaded', function() {
    // モーダル1関連のイベントリスナー
    document.getElementById('myBtn').addEventListener('click', openModal);
    document.getElementsByClassName('close')[0].addEventListener('click', closeModal);
    document.addEventListener('click', function(event) {
      if (event.target == document.getElementById('myModal')) {
        closeModal();
      }
    });
});

// アイテムを追加する関数
function addItem() {
    // 新しいフォーム要素を作成
    var newItem = document.createElement('div');
    newItem.className = 'add_item_block';
    newItem.innerHTML = `
      <div class="add_item_pic">
        <img src="../static/image/sample3.png">
      </div>
      <div class="form-price">
        <label class="topic" for="price">価格</label>
        <input type="text" id="price" name="price" class="form-control" value="¥100,000">
      </div>
      <!-- 以下、スタイル、カテゴリー、ブランドのフォーム要素を追加 -->
      <!-- 省略 -->
    `;
    
    // itemsContainerに新しいアイテムを追加
    document.getElementById('itemsContainer').appendChild(newItem);
  }
  
  // アイテム追加ボタンにクリックイベントリスナーを追加
  document.getElementById('addItemButton').addEventListener('click', addItem);

