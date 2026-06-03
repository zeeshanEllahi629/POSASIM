import os
import shutil

src = 'temp_front_page.js'
dst = r'src\app\(front)\page.js'

try:
    shutil.copyfile(src, dst)
    print("Successfully replaced page.js")
except Exception as e:
    print("Error:", e)
