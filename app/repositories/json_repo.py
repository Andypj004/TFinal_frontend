#Creacion del repositorio JSON

import json
import os
from typing import List, Dict

class JSONRepository:
    def __init__(self, file_path: str):
        self.file_path = file_path
        folder = os.path.dirname(self.file_path)
        if folder and not os.path.exists(folder):
            os.makedirs(folder)
        if not os.path.exists(self.file_path):
            with open(self.file_path, 'w') as f:
                json.dump([], f)
    def get_all(self) -> List[Dict]:
        try:
            if os.path.getsize(self.file_path) == 0:
                return []
            with open(self.file_path, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []

    def save_all(self, data: List[Dict]):
        with open(self.file_path, 'w') as f:
            json.dump(data, f, indent=4)