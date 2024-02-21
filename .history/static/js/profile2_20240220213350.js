// モーダルを開く関数
function openModal() {
    document.getElementById('myModal').style.display = "block";
  }
  
  // モーダルを閉じる関数
  function closeModal() {
    document.getElementById('myModal').style.display = "none";
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

