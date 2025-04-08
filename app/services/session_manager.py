# app/services/session_manager.py

import os
import shutil

class SessionManager:
    def __init__(self, base_dir="static/uploads"):
        self.active_ids = set()
        self.base_dir = base_dir
        os.makedirs(self.base_dir, exist_ok=True)

    def generate_id(self) -> str:
        index = 1
        while True:
            user_id = f"user_{index}"
            if user_id not in self.active_ids:
                self.active_ids.add(user_id)
                user_dir = os.path.join(self.base_dir, user_id)
                os.makedirs(user_dir, exist_ok=True)
                return user_id
            index += 1

    def release_id(self, user_id: str) -> bool:
        if user_id in self.active_ids:
            user_dir = os.path.join(self.base_dir, user_id)
            if os.path.exists(user_dir):
                shutil.rmtree(user_dir)
            self.active_ids.remove(user_id)
            return True
        return False

    def is_active(self, user_id: str) -> bool:
        return user_id in self.active_ids
