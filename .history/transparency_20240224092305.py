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
    
    # 出力画像がRGBAモードでない場合、変換は不要
    # 既に透明度をサポートしているため、直接PNGとして保存
    output_image.save(output_path, 'PNG')

# 使用例


# 使用例
# image_path = 'input.png'
# output_path = 'output.jpeg' # JPEG形式で保存する場合は拡張子を変更
# transparency(image_path, output_path)


# 使用例
# image_path = 'input.png'
# output_path = 'output.png'
# transparency(image_path, output_path)


# transparency(image_path, output_path)