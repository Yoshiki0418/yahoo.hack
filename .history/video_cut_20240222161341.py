import tempfile
import os
from PIL import Image
import cv2
from ultralytics import YOLO
import cv2
import numpy as np
import imgsim 

def extract_color_histogram(image_path, bins=(8, 8, 8)):
    """画像から色ヒストグラムを抽出します。"""
    image = cv2.imread(image_path)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    hist = cv2.calcHist([hsv], [0, 1, 2], None, bins, [0, 256, 0, 256, 0, 256])
    cv2.normalize(hist, hist)
    return hist.flatten()

def compare_histograms(hist1, hist2, method=cv2.HISTCMP_CORREL):
    """二つのヒストグラム間の類似度を計算します。"""
    similarity = cv2.compareHist(hist1, hist2, method)
    return similarity

def extract_features(image_path):
    """画像からORB特徴を抽出します。"""
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    orb = cv2.ORB_create()
    keypoints, descriptors = orb.detectAndCompute(gray, None)
    return keypoints, descriptors

def match_features(descriptors1, descriptors2):
    """二つの画像の特徴点ディスクリプタ間でマッチングを行います。"""
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(descriptors1, descriptors2)
    matches = sorted(matches, key=lambda x:x.distance)
    return matches

def calculate_similarity(matches, threshold=5):
    """マッチングされた特徴点の数に基づいて類似度を計算します。"""
    if len(matches) > threshold:
        return True  # 類似しているとみなす
    else:
        return False

def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def is_similar_image(descriptor1, histogram1, existing_descriptors, existing_histograms, feature_threshold=10, color_threshold=0.6):
    """特徴量ディスクリプタと色ヒストグラムを使用して、画像が類似しているかどうかを判断します。"""
    for descriptor2, histogram2 in zip(existing_descriptors, existing_histograms):
        matches = match_features(descriptor1, descriptor2)
        if calculate_similarity(matches, threshold=feature_threshold):
            color_similarity = compare_histograms(histogram1, histogram2)
            if color_similarity > color_threshold:
                return True  # 類似しているとみなす
    return False

def detect_and_crop_items_from_video(video_path, filename, detection_interval=3):
    model = YOLO('static/model/best.pt')
    cap = cv2.VideoCapture(video_path)
    
    fps = cap.get(cv2.CAP_PROP_FPS)  # フレームレートを取得
    frame_count = 0

    existing_descriptors = []  # 保存された画像の特徴量ディスクリプタを保持するリスト

    # クラス名に基づいて保存するディレクトリを指定
    base_dir = 'static/post_image/image-cut'
    class_dirs = {'tops': 'tops', 'bottoms': 'bottoms'}
    
    # クラスごとのディレクトリが存在することを確認（オプション）
    for class_dir in class_dirs.values():
        ensure_dir(os.path.join(base_dir, class_dir))

    cropped_images_paths = []
    existing_histograms = []  # 保存された画像の色ヒストグラムを保持するリスト

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # 3秒ごとに1回のペースで検出を実行
        if frame_count % (fps * detection_interval) == 0:
            _, frame_path = tempfile.mkstemp(suffix=".jpg")
            cv2.imwrite(frame_path, frame)

            results = model.predict(frame_path, save=True, save_txt=True, conf=0.2, iou=0.5)
            names = results[0].names
            boxes = results[0].boxes.xywh
            classes = results[0].boxes.cls

            original_image = Image.open(frame_path)

            for box, cls_id in zip(boxes, classes):
                class_name = names[int(cls_id)]
                
                # クラス名に基づいて保存ディレクトリを選択
                save_dir = class_dirs.get(class_name, '')
                if save_dir:
                    x_center, y_center, width, height = box.tolist()
                    left = x_center - (width / 2)
                    top = y_center - (height / 2)
                    right = x_center + (width / 2)
                    bottom = y_center + (height / 2)

                    cropped_image = original_image.crop((left, top, right, bottom))
                    cropped_image_path = os.path.join(base_dir, save_dir, f'{filename}_{frame_count}:{class_name}.png')
                    cropped_image.save(cropped_image_path)
                    cropped_images_paths.append(cropped_image_path)

            os.remove(frame_path)

            # imgsimを使用して新しい画像のベクトルを抽出
                new_vector = vtr.vectorize(cv2.imread(cropped_image_path))

                # 既存の画像ベクトルと比較して類似度を計算
                is_duplicate = False
                for existing_vector in existing_vectors:
                    distance = imgsim.distance(new_vector, existing_vector)
                    if distance < 0.6:  # 類似度の閾値は調整可能
                        is_duplicate = True
                        break

                if not is_duplicate:
                    existing_vectors.append(new_vector)  # 新しい画像ベクトルをリストに追加
                    cropped_images_paths.append(cropped_image_path)  # 重複しない場合、パスをリストに追加
                else:
                    # 重複する場合は画像を削除
                    os.remove(cropped_image_path)

            os.remove(frame_path)  # 一時ファイルを削除
        frame_count += 1

    cap.release()
    return cropped_images_paths

# # 使用例
# video_path = '画面収録 2024-02-19 18.45.30.mp4'
# cropped_images = detect_and_crop_items_from_video(video_path)
# print(cropped_images)