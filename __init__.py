import os
import shutil
import folder_paths

comfy_path = os.path.dirname(folder_paths.__file__)
captain_extensions_path = os.path.abspath(os.path.dirname(__file__))

def setup_js():
    try:
        js_dest_path = os.path.join(comfy_path, "web", "extensions",  "ComfyUI-Captain-Extensions")
        js_src_path = os.path.join(captain_extensions_path, "extensions")
        print(js_src_path)
        print(js_dest_path)
        if os.path.exists(js_dest_path):
            shutil.rmtree(js_dest_path)

        shutil.copytree(js_src_path, js_dest_path)
        
    except Exception as e:
        print(f"An error occurred: {e}")

setup_js()

NODE_CLASS_MAPPINGS = {}
