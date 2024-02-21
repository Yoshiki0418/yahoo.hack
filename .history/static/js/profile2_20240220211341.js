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

function displayImage(event, containerId) {
    var file = event.target.files[0]; // 選択されたファイルを取得
    if (file) {
        var reader = new FileReader(); // FileReader インスタンスを作成
        reader.onload = function(e) { // ファイルの読み込みが完了したら実行
            var imageContainer = document.getElementById(containerId); // 表示領域の要素を取得
            imageContainer.innerHTML = ''; // 既存の内容をクリア
            // 画像ファイルの場合は<img>タグで、動画ファイルの場合は<video>タグで表示
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
        reader.readAsDataURL(file); // ファイルの内容をDataURLとして読み込む
    }
}
