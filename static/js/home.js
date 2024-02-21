// 既存のJavaScriptファイルに追加
document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("closet-modal");
    var btn = document.querySelector(".hunger-button");
    var span = document.getElementsByClassName("closet-close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // すべての「追加」ボタンに対してイベントリスナーを設定
    document.querySelectorAll('.add-button').forEach(function(button) {
        button.addEventListener('click', function() {
            // ボタンから画像、カテゴリ、ブランドの情報を取得
            const image = this.getAttribute('data-image');
            const category = this.getAttribute('data-category');
            const brand = this.getAttribute('data-brand');
            const style_id = this.getAttribute('data-style_id');
            
            // data-inputエリアを選択
            const dataInputArea = document.querySelector('.data-input');
            
            // data-inputエリアに情報を追加（既存の内容を保持しつつ新しい内容を追加）
            dataInputArea.innerHTML += `
            <div class="input-item">
                <img src="${image}" alt="Closet Item" style="width: 220px; height: 220px; border-radius: 40px; border: 2px solid black;">
                <div class="text-info">
                    <p>系統: ${style_id}</p>
                    <p>カテゴリ: ${category}</p>
                    <p>ブランド: ${brand}</p>
                </div>
                <button class="delete-button" data-id="1">削除</button>
            </div>
        
            `;
        });
    });
    document.addEventListener('click', function(e) {
        if (e.target && e.target.matches('.delete-button')) {
            const itemElement = e.target.closest('.input-item');
            if (itemElement) {
                itemElement.remove();
            }
        }
    });
    
});

