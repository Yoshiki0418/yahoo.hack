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
                video.autoplay = true; // 自動再生
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

