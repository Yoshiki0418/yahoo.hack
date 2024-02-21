$(document).ready(function() {
    console.log("Document is ready");
    // モーダルを開くイベント
    $('#myBtn').on('click', function() {
        $('#myModal').css('display', 'block');
        setupButtonListeners();
    });

    // モーダルを閉じるイベント
    $('.close').on('click', function() {
        $('#myModal').css('display', 'none');
    });

    // モーダルの外側をクリックしたときに閉じる処理
    $(window).on('click', function(event) {
        if (event.target == $('#myModal')[0]) {
            $('#myModal').css('display', 'none');
        }
    });

    // AIモードボタンのイベントリスナーを動的に追加する処理
    function setupButtonListeners() {
        $('#AI-mode').off('click').on('click', aiModeButtonClickHandler);
    }

    function aiModeButtonClickHandler() {
        console.log("AIモードボタンが押されました。");
        // AIモードを有効化するコードをここに記述
    }

    // 画像または動画を表示する関数
    $('input[type="file"]').on('change', function(event) {
        displayImage10(event, 'upload-show');
    });

    function displayImage10(event, containerId) {
        var file = event.target.files[0];
        if (!file) {
            console.error("ファイルが選択されていません");
            return;
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            $('#' + containerId).html(''); // 既存の内容をクリア
            var mediaElement = file.type.startsWith('image/') ? 'img' : 'video';
            var element = $(document.createElement(mediaElement));
            element.attr('src', e.target.result);
            if (mediaElement === 'video') {
                element.attr('controls', true);
            }
            $('#' + containerId).append(element);
        };

        reader.onerror = function(e) {
            console.error("ファイルの読み込みに失敗しました");
        };

        reader.readAsDataURL(file);
    }

    // アイテムを追加する関数
    function addItem() {
        var itemsContainer = $('#itemsContainer');
        if (itemsContainer.length == 0) {
            console.error("itemsContainerが見つかりません。");
            return;
        }

        var newItem = $('<div></div>').addClass('add_item_block');
        // newItemのinnerHTMLにフォーム要素を追加（具体的なHTMLは省略）
        itemsContainer.append(newItem);
    }
});
