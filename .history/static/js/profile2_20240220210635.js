// モーダルを開く関数
function openModal() {
    document.getElementById('myModal').style.display = "block";
  }
  
  // モーダルを閉じる関数
  function closeModal() {
    document.getElementById('myModal').style.display = "none";
  }


// ページ読み込み時にイベントリスナーを設定
window.onload = function() {
    // モーダル1のイベントリスナーを設定
    document.getElementById('myBtn').addEventListener('click', openModal);
    document.getElementsByClassName('close')[0].addEventListener('click', closeModal);
    window.onclick = function(event) {
      if (event.target == document.getElementById('myModal')) {
        closeModal();
      }
    } 
};