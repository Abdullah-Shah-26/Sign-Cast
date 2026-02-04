import importlib.util
import os
import uvicorn
from config import config

# Ensure the backend directory is the working directory so `uvicorn main:app`
# works even when you run this script from the repo root on Windows.
backend_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(backend_dir)

# Find the path to main.py relative to this script
main_path = os.path.join(backend_dir, "main.py")
spec = importlib.util.spec_from_file_location("main", main_path)
main = importlib.util.module_from_spec(spec)
spec.loader.exec_module(main)
app = main.app

if __name__ == "__main__":
    uvicorn.run("main:app", host=config.HOST, port=config.PORT, reload=config.DEBUG)