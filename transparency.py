from rembg import remove
from PIL import Image


# # 背景を削除したい画像のパスを指定します。
# image_path = 'static/image/situation1.png'

# # 背景が削除された画像を保存するパスを指定します。
# output_path = 'static/image/result.png'




def transparency(image_path, output_path):
    # 画像ファイルを開く
    input_image = Image.open(image_path)
    
    # rembgを使用して背景を削除
    output_image = remove(input_image)
    
    # 出力画像がRGBAモード（透明度含む）の場合、RGBモードに変換
    if output_image.mode == 'RGBA':
        # 白色の背景を設定することも可能です
        # 背景が透明な部分を白色で埋める
        rgb_image = Image.new("RGB", output_image.size, (255, 255, 255))
        rgb_image.paste(output_image, mask=output_image.split()[3]) # 3はアルファチャンネル
        output_image = rgb_image
    
    # 結果を保存（JPEG形式を指定）
    output_image.save(output_path, 'JPEG')

# 使用例
# image_path = 'input.png'
# output_path = 'output.jpeg' # JPEG形式で保存する場合は拡張子を変更
# transparency(image_path, output_path)


# 使用例
# image_path = 'input.png'
# output_path = 'output.png'
# transparency(image_path, output_path)


# transparency(image_path, output_path)