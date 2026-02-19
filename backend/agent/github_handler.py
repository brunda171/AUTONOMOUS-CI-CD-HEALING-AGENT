import os
import shutil
from git import Repo, Actor
import time

class GitHubHandler:
    def __init__(self, repo_url: str, team_name: str, leader_name: str):
        self.repo_url = repo_url
        self.team_name = team_name
        self.leader_name = leader_name
        self.repo_name = repo_url.split("/")[-1].replace(".git", "")
        self.local_path = os.path.join(os.getcwd(), "repos", f"{self.team_name}_{self.leader_name}", self.repo_name)
        self.repo = None
        
        # Git Author
        self.author = Actor("AI Agent", "agent@hackathon.com")

    async def clone_repo(self):
        if os.path.exists(self.local_path):
            shutil.rmtree(self.local_path)
        
        # Add basic retry logic or error handling if needed
        self.repo = Repo.clone_from(self.repo_url, self.local_path)
        return self.local_path
        
    async def create_branch(self):
        # Format: TEAM_NAME_LEADER_NAME_AI_Fix
        branch_name = f"{self.team_name}_{self.leader_name}_AI_Fix".upper().replace(" ", "_")
        
        current = self.repo.create_head(branch_name)
        current.checkout()
        return branch_name
        
    async def apply_fix(self, repo_path, fix):
        # fix is a dict: {'file': 'path/to/file', 'code': 'full_content_or_diff'}
        # Assuming 'code' contains the FULL file content for simplicity in this hackathon scope
        # OR we can assume it replaces specific lines. 
        # For robustness, let's assume the AI provides the FULL file content or we do a simple overwrite.
        
        target_file = os.path.join(repo_path, fix['file'])
        
        with open(target_file, 'w', encoding='utf-8') as f:
            f.write(fix['code'])
        
    async def commit_changes(self, message):
        self.repo.index.add('*')
        self.repo.index.commit(message, author=self.author, committer=self.author)
        
        # In a real scenario, we would push. 
        # For the hackathon, we might want to avoid pushing to random repos unless authorized.
        # But the requirement says "Must NOT push to main branch", implies we SHOULD push to the new branch.
        # We need creating a remote if it doesn't exist or just push to origin.
        try:
            origin = self.repo.remote(name='origin')
            origin.push(refspec=f'{self.repo.active_branch.name}:{self.repo.active_branch.name}')
        except Exception as e:
            print(f"Push failed (might need auth): {e}")
