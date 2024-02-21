from PIL import Image
import sys
sys.path.append('ultralytics')  # ultralyticsが含まれるディレクトリへのパスを追加

from ultralytics import YOLO

def detect_and_crop_items(image_path):
    # モデルの読み込み
    model = YOLO('static/model/best.pt')

    # 画像に対して推論を実行
    results = model.predict(image_path, save=True, save_txt=True, conf=0.2, iou=0.5)
    names = results[0].names
    boxes = results[0].boxes.xywh  # xywhは中心のx,y座標、幅、高さを表します
    classes = results[0].boxes.cls  # ここでクラスIDを取得

    # 同じクラスのバウンディングボックスを統合するための辞書を準備
    boxes_by_class = {}

    # 元の画像を開く
    original_image = Image.open(image_path)

    # 各バウンディングボックスを処理
    for box, cls_id in zip(boxes, classes):
        class_name = names[int(cls_id)]
        x_center, y_center, width, height = box.tolist()
        left = x_center - (width / 2)
        top = y_center - (height / 2)
        right = x_center + (width / 2)
        bottom = y_center + (height / 2)

        # クラス名ごとにバウンディングボックスの座標を格納
        if class_name not in boxes_by_class:
            boxes_by_class[class_name] = []
        boxes_by_class[class_name].append((left, top, right, bottom))

    # 各クラスのバウンディングボックスを統合して画像を切り取り、保存
    cropped_images_paths = []
    for class_name, boxes in boxes_by_class.items():
        # 統合するバウンディングボックスを計算
        left = min(box[0] for box in boxes)
        top = min(box[1] for box in boxes)
        right = max(box[2] for box in boxes)
        bottom = max(box[3] for box in boxes)

        # 画像を切り取る
        cropped_image = original_image.crop((left, top, right, bottom))

        # 切り取った画像を保存
        cropped_image_path = f'static/post_image/image-cut/{class_name}.png'
        cropped_image.save(cropped_image_path)
        cropped_images_paths.append(cropped_image_path)

    return cropped_images_paths

# # 使用例
# image_path = 'static/upload_image/7.jpg'
# cropped_images = detect_and_crop_items(image_path)
# print(cropped_images)
