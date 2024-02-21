
  
// モーダルを開く関数
function openModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = "block";

    // モーダルが開かれた後にアイテム追加ボタンのイベントリスナーを設定
    setupAddItemButton();
}

// モーダルを閉じる関数
function closeModal() {
    document.getElementById('myModal').style.display = "none";
}

// アイテム追加ボタンにクリックイベントリスナーを追加する関数
function setupAddItemButton() {
    var addItemButton = document.getElementById('addItemButton');

    // addItemButtonがnullでないことを確認（モーダル内の要素が存在するか）
    if (addItemButton) {
        // 既にイベントリスナーが設定されている可能性があるため、重複を避ける
        addItemButton.removeEventListener('click', addItem);
        addItemButton.addEventListener('click', addItem);
        console.log("アイテム追加ボタンのイベントリスナーを設定しました。");
    }
}

// モーダル関連のイベントリスナーを設定
document.addEventListener('DOMContentLoaded', function() {
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
    console.log("アイテムを追加します。");
    // ここに新しいアイテムを追加するためのロジックを実装
}
