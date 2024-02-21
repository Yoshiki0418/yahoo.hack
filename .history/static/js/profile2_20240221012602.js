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

document.addEventListener('DOMContentLoaded', function() {
    // "AIモードを使用する"ボタンに対するイベントリスナーを設定
    document.getElementById('AI-mode').addEventListener('click', function() {
        console.log("AIモードボタンが押されました。");
        // ここにAIモードを起動するためのコードを追加できます。
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
      <div class="form-style">
        <label class="topic" for="style">系統</label>
        <select id="style" name="style" class="form-control">
            <option value="">選択してください</option>
            <option value="casual">カジュアル</option>
            <option value="formal">フォーマル</option>
            <option value="sporty">スポーティ</option>
            <!-- 他の系統オプションを追加 -->
        </select>
    </div>
            
    <div class="form-category">
        <label class="topic" for="category">カテゴリー</label>
        <select id="category" name="category" class="form-control">
            <option value="">選択してください</option>
            <option value="tops">トップス</option>
            <option value="bottoms">ボトムス</option>
            <option value="outerwear">シューズ</option>
            <!-- 他のカテゴリーオプションを追加 -->
        </select>
    </div>

    <div class="form-brand">
        <label class="topic" for="brand">ブランド</label>
        <input type="text" id="brand" name="brand" class="form-control">
    </div>
    `;
    
    // itemsContainerに新しいアイテムを追加
    document.getElementById('itemsContainer').appendChild(newItem);
  }

// アイテム追加ボタンにクリックイベントリスナーを追加する関数
function setupAddItemButton() {
    // 'addItemButton' IDを持つ要素を取得
    var addItemButton = document.getElementById('addItemButton');
  
    // 要素が存在するかどうかを確認
    if (addItemButton) {
      addItemButton.addEventListener('click', function() {
        console.log("アイテム追加ボタンがクリックされました");
        addItem();
      });
    } else {
      // ボタンが見つからない場合のエラーログ
      console.error("アイテム追加ボタンが見つかりません。IDを確認してください。");
    }
  }
  
  // ドキュメントが完全に読み込まれた後に関数を実行
  document.addEventListener('DOMContentLoaded', setupAddItemButton);
  
// // モーダルを開く関数
// function openModal() {
//     var modal = document.getElementById('myModal');
//     modal.style.display = "block";

//     // モーダルが開かれた後にアイテム追加ボタンのイベントリスナーを設定
//     setupAddItemButton();
// }

// // モーダルを閉じる関数
// function closeModal() {
//     document.getElementById('myModal').style.display = "none";
// }

// // 新しいアイテムを追加する関数
// function addItem() {
//     console.log("1");
//     var itemsContainer = document.getElementById('itemsContainer');
//     if (!itemsContainer) {
//         console.error('itemsContainerが見つかりません。');
//         return;
//     }
    
//     // 新しいアイテムブロックのHTMLを生成
//     var newItemHTML = `
//         <div class="add_item_block">
//             <!-- 新しいアイテムの内容 -->
//             <p>新しいアイテムが追加されました。</p>
//             <!-- ここに更に詳細なフォームや情報を追加できます -->
//         </div>
//     `;

//     // 新しいアイテムブロックをitemsContainerに追加
//     itemsContainer.insertAdjacentHTML('beforeend', newItemHTML);
// }

// // モーダル関連のイベントリスナーを設定
// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('myBtn').addEventListener('click', openModal);
//     document.getElementsByClassName('close')[0].addEventListener('click', closeModal);
//     document.addEventListener('click', function(event) {
//       if (event.target == document.getElementById('myModal')) {
//         closeModal();
//       }
//     });
// });

// document.addEventListener('DOMContentLoaded', function() {
//     // "カメラロールから選択"ボタンにイベントリスナーを設定
//     document.getElementById('hand-mode').addEventListener('click', function() {
//         // 隠れたファイル入力をプログラムでクリック
//         document.getElementById('hiddenFileInput').click();
//     });
// });

