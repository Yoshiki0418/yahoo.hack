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

    function displayImage10(event, containerId) {
        console.log("displayImage10が呼び出されました。"); // 関数が呼び出されたことを確認
        var file = event.target.files[0]; // 選択されたファイルを取得
        if (file) {
            console.log("選択されたファイル:", file); // 選択されたファイルの情報を表示
            var reader = new FileReader(); // FileReader インスタンスを作成
    
            reader.onload = function(e) {
                console.log("ファイルの読み込みが完了しました。"); // 読み込み完了をログ出力
                var imageContainer = document.getElementById(containerId);
                if (!imageContainer) {
                    console.error("指定されたcontainerIdが見つかりません:", containerId);
                    return;
                }
                imageContainer.innerHTML = ''; // 既存の内容をクリア
                
                if (file.type.startsWith('image/')) {
                    var img = document.createElement('img');
                    img.src = e.target.result;
                    imageContainer.appendChild(img);
                } else if (file.type.startsWith('video/')) {
                    console.log("123。");
                    var video = document.createElement('video');
                    video.src = e.target.result;
                    video.controls = true; // コントロールを表示
                    video.autoplay = true; // 自動再生
                    imageContainer.appendChild(video);
                }
            };
    
            reader.onerror = function(e) {
                console.error("ファイルの読み込み中にエラーが発生しました。", e);
            };
    
            reader.readAsDataURL(file); // ファイルの内容をDataURLとして読み込む
        } else {
            console.log("ファイルが選択されていません。");
        }
    }
});

