import tempfile
import os
from PIL import Image
import cv2
from ultralytics import YOLO
import cv2
import numpy as np
import imgsim

def ensure_dir(directory):
    """Ensure directory exists."""
    if not os.path.exists(directory):
        os.makedirs(directory)

def detect_and_crop_items_from_video(video_path, filename, detection_interval=3):
    model = YOLO('static/model/best.pt')
    cap = cv2.VideoCapture(video_path)
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = 0

    base_dir = 'static/post_image/image-cut'
    class_dirs = {'tops': 'tops', 'bottoms': 'bottoms'}

    for class_dir in class_dirs.values():
        ensure_dir(os.path.join(base_dir, class_dir))

    cropped_images_paths = []

    # Initialize imgsim Vectorizer and existing vectors list
    vtr = imgsim.Vectorizer()
    existing_vectors = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

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

                    # imgsim vectorization and similarity check
                    new_vector = vtr.vectorize(cv2.imread(cropped_image_path))
                    is_duplicate = any(imgsim.distance(new_vector, existing_vector) < 0.6 for existing_vector in existing_vectors)
                    
                    if not is_duplicate:
                        existing_vectors.append(new_vector)
                        cropped_images_paths.append(cropped_image_path)
                    else:
                        os.remove(cropped_image_path)

            os.remove(frame_path)
        frame_count += 1

    cap.release()
    return cropped_images_paths

# 使用例
video_path = '/Users/yamamoto116/ultralytics/画面収録 2024-02-19 18.45.30.mp4'
cropped_images = detect_and_crop_items_from_video(video_path, "aaa")
print(cropped_images)