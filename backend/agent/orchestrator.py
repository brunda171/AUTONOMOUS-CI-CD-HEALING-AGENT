import asyncio
import uuid
import time
from .github_handler import GitHubHandler
from .sandbox import Sandbox
from .ai_handler import AIHandler

class HealingOrchestrator:
    def __init__(self, repo_url: str, team_name: str, leader_name: str, job_id: str, update_status_callback):
        self.repo_url = repo_url
        self.team_name = team_name
        self.leader_name = leader_name
        self.job_id = job_id
        self.update_status = update_status_callback
        
        self.github = GitHubHandler(repo_url, team_name, leader_name)
        self.sandbox = Sandbox()
        self.ai = AIHandler()
        self.max_retries = 5

    async def run(self):
        start_time = time.time()
        
        # 1. Clone
        await self.update_status("CLONING", "Cloning repository...")
        try:
            repo_path = await self.github.clone_repo()
        except Exception as e:
            await self.update_status("FAILED", f"Cloning failed: {str(e)}")
            return

        # 2. Create Branch
        await self.update_status("BRANCHING", "Creating branch...")
        try:
            branch_name = await self.github.create_branch()
        except Exception as e:
             await self.update_status("FAILED", f"Branch creation failed: {str(e)}")
             return

        iteration = 0
        success = False
        total_fixes = 0
        
        while iteration < self.max_retries:
            iteration += 1
            await self.update_status("TESTING", f"Iteration {iteration}: Running tests...")
            
            # 3. Run Tests
            test_results = await self.sandbox.run_tests(repo_path)
            logs = test_results['logs']
            
            if test_results['passed']:
                await self.update_status("PASSED", "Tests Passed!", logs=logs)
                success = True
                break
            
            await self.update_status("ANALYZING", f"Iteration {iteration}: Tests Failed. Analyzing...", logs=logs)
            
            # 4. Analyze Failures & Fix
            fix = await self.ai.generate_fix(logs)
            
            if not fix.get('code'):
                await self.update_status("FAILED", "AI could not generate a fix.", logs=logs)
                break

            total_fixes += 1
            
            # 5. Apply Fix
            await self.update_status("FIXING", f"Applying fix to {fix.get('file')}...", logs=logs)
            await self.github.apply_fix(repo_path, fix)
            
            # 6. Commit & Push
            await self.update_status("COMMITTING", "Committing fix...", logs=logs)
            await self.github.commit_changes(fix.get('message'))
        
        end_time = time.time()
        duration = end_time - start_time
        
        # Calculate Score
        score = 100
        if duration < 300: # 5 minutes
            score += 20 # Speed bonus
        
        # Efficiency penalty
        # Assuming we track total commits, here we just use iteration count as proxy for simplicity
        # Real logic would check git log count
        if iteration > 20: 
            score -= (iteration - 20) * 2
            
        if not success:
            score = max(0, score - 50) # Heavy penalty for failure

        final_status = "PASSED" if success else "FAILED"
        await self.update_status(final_status, "Process completed.", score=score, duration=duration, branch=branch_name, total_fixes=total_fixes)
