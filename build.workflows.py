import os
import shutil

# 创建 artifacts 目录
os.makedirs('artifacts', exist_ok=True)

# 文件后缀名列表
extensions = ['.exe', '.dmg', '.AppImage']

for root, dirs, files in os.walk('release'):
    for file in files:
        if any(file.endswith(ext) for ext in extensions):
            source_file = os.path.join(root, file)
            shutil.move(source_file, 'artifacts')