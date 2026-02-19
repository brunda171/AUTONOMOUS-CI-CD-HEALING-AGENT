import docker
import os

class Sandbox:
    def __init__(self):
        self.client = docker.from_env()
        
    async def run_tests(self, repo_path):
        # We use a simple python container.
        # Volume mount the repo_path to /app
        
        try:
            container = self.client.containers.run(
                "python:3.9-slim",
                command="sh -c 'pip install pytest && if [ -f requirements.txt ]; then pip install -r requirements.txt; fi && pytest'",
                volumes={os.path.abspath(repo_path): {'bind': '/app', 'mode': 'rw'}},
                working_dir="/app",
                detach=True,
                remove=False  # Keep it briefly to inspect if needed, or set True
            )
            
            exit_code = container.wait()['StatusCode']
            logs = container.logs().decode('utf-8')
            container.remove()
            
            return {
                'passed': exit_code == 0,
                'logs': logs
            }
        except Exception as e:
            return {
                'passed': False,
                'logs': str(e)
            }
