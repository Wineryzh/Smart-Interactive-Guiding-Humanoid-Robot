from pathlib import Path
import requests


class LocalLLMClient:
    def __init__(self, model_name: str = "qwen2.5:3b"):
        self.model_name = model_name
        self.api_url = "http://localhost:11434/api/chat"
        self.project_root = Path(__file__).resolve().parents[1]
        self.knowledge_path = self.project_root / "guide_system" / "knowledge_base" / "project_intro.md"

    def load_project_knowledge(self) -> str:
        if self.knowledge_path.exists():
            return self.knowledge_path.read_text(encoding="utf-8")
        return "暂无项目知识库。"

    def ask(self, user_input: str) -> str:
        project_knowledge = self.load_project_knowledge()

        system_prompt = f"""
你是一个同济大学智能导览人形机器人助手。
你的任务是为来访者提供简洁、自然、礼貌的现场导览讲解。

你需要优先参考以下项目知识库内容回答问题：

{project_knowledge}

回答要求：
1. 回答要简洁自然，适合现场讲解。
2. 不要编造知识库中没有明确提供的具体地点、人员、数据。
3. 如果用户问的是项目相关问题，要结合项目知识库回答。
4. 如果用户提出导览、带路、远程控制等需求，可以先确认需求，再说明将进行任务处理。
"""

        payload = {
            "model": self.model_name,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_input
                }
            ],
            "stream": False
        }

        response = requests.post(self.api_url, json=payload, timeout=120)
        response.raise_for_status()

        data = response.json()
        return data["message"]["content"]


if __name__ == "__main__":
    client = LocalLLMClient()

    print("本地导览机器人对话模块测试，输入 q 退出。")

    while True:
        user_text = input("\nUser: ")

        if user_text.lower() in ["q", "quit", "exit"]:
            print("退出测试。")
            break

        answer = client.ask(user_text)
        print("Robot:", answer)
