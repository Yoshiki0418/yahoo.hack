document.addEventListener("DOMContentLoaded", function() {
  // 初期画像を設定
  setInitialImage();

  // 画像クリックイベントを設定
  document.querySelectorAll('.rectangle-clickable').forEach(item => {
    item.addEventListener('click', function() {
      var imgSrc = this.getAttribute('src');
      document.querySelector('.main-image').setAttribute('src', imgSrc);
    });
  });

  // カテゴリーと画像の設定
  const categories = ["ストリート系", "カジュアル系", "スポーツ系"];
  const images = {
    "main": ["Street1.jpg", "Casual1.jpg", "Sports1.jpg"],
    "sub": [
      ["Street1.jpg", "Casual1.jpg", "Sports1.jpg"],
      ["Street2.jpg", "Casual2.jpg", "Sports2.jpg"],
      ["Street3.jpg", "Casual3.jpg", "Sports3.jpg"],
      ["Street4.jpg", "Casual4.jpg", "Sports4.jpg"]
    ]
  };
  let currentIndex = 0;

  // 次に進むボタンの初期設定
  const nextButton = document.getElementById("next-button");
  nextButton.disabled = true;
  nextButton.style.opacity = "0.5"; // 初期状態では薄く表示

  // LIKEとNOPEボタンのイベントハンドラ
  document.querySelector(".LIKE-button").addEventListener("click", function() {
    handleCategorySelection('LIKE');
  });

  document.querySelector(".NOPE-button").addEventListener("click", function() {
    handleCategorySelection('NOPE');
  });

  // 次に進むボタンのイベントハンドラ
  nextButton.addEventListener("click", function() {
    window.location.href = "/introduction2";
  });

  function setInitialImage() {
    var initialImgSrc = document.querySelector('.sub-image1').getAttribute('src');
    document.querySelector('.main-image').setAttribute('src', initialImgSrc);
  }

  function updateUI() {
    if (currentIndex < categories.length) {
      document.querySelector(".text-category").textContent = categories[currentIndex];
      document.querySelector(".main-image").src = `../static/img/${images.main[currentIndex]}`;
      images.sub.forEach((value, index) => {
        document.querySelector(`.sub-image${index + 1}`).src = `../static/img/${value[currentIndex]}`;
      });
    } else {
      document.querySelector(".choice").style.display = 'none';
      document.querySelector(".sub-image").style.display = 'none';
      displayCompletionMessage();
    }
  }

  function handleCategorySelection(preference) {
    if (currentIndex < categories.length) {
      savePreference(preference);
      currentIndex++;
      updateUI();
      if (currentIndex >= 2) {
        nextButton.disabled = false;
        nextButton.style.backgroundColor = "blue"; // 押せるようになったら背景色を青に変更
        nextButton.style.color = "white"; // 文字色を白に設定

      }
    }
  }

  function savePreference(preference) {
    fetch('/save-preference', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({category: categories[currentIndex], preference: preference}),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

  function displayCompletionMessage() {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = "登録が完了しました";
    messageDiv.style.cssText = "color: black; font-weight: bold; position: fixed; right: 25%; transform: translateX(50%); top: 50%;";
    document.body.appendChild(messageDiv);
  }
});

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("next-button").addEventListener("click", function() {
      window.location.href = "/introduction2"; // Flaskのルートに合わせて変更
  });
});