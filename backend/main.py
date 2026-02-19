from fastapi import FastAPI, WebSocket, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import asyncio
import json
from typing import Dict, List, Optional

app = FastAPI(title="Autonomous CI/CD Healing Agent")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AgentRequest(BaseModel):
    repo_url: str
    team_name: str
    leader_name: str

from .agent.orchestrator import HealingOrchestrator

# In-memory store for demo purposes (in production use a database/Redis)
job_status = {}

async def update_job_status(job_id: str, status: str, message: str, logs: Optional[str] = None, score: int = 0, duration: float = 0, branch: str = "", total_fixes: int = 0):
    if job_id not in job_status:
        job_status[job_id] = {}
        
    current = job_status[job_id]
    current["status"] = status
    current["message"] = message
    if logs:
        # Append logs for timeline
        if "logs" not in current: 
            current["logs"] = []
        current["logs"].append({"timestamp": asyncio.get_event_loop().time(), "message": message, "details": logs})
        
    if score > 0: current["score"] = score
    if duration > 0: current["time_taken"] = duration
    if branch: current["branch_name"] = branch
    if total_fixes > 0: current["total_fixes"] = total_fixes
    
async def start_healing_process(request: AgentRequest, job_id: str):
    orchestrator = HealingOrchestrator(
        repo_url=request.repo_url,
        team_name=request.team_name,
        leader_name=request.leader_name,
        job_id=job_id,
        update_status_callback=lambda s, m, **kwargs: update_job_status(job_id, s, m, **kwargs)
    )
    await orchestrator.run()

@app.get("/")
def read_root():
    return {"message": "Autonomous CI/CD Healing Agent API is running"}

@app.post("/run")
async def run_agent(request: AgentRequest, background_tasks: BackgroundTasks):
    job_id = f"{request.team_name}_{request.leader_name}"
    
    # Initialize job status
    job_status[job_id] = {
        "status": "QUEUED",
        "logs": [],
        "fixes": [],
        "score": 0,
        "iterations": []
    }
    
    background_tasks.add_task(start_healing_process, request, job_id)
    return {"job_id": job_id, "message": "Agent started"}

@app.get("/status/{job_id}")
def get_status(job_id: str):
    if job_id not in job_status:
        raise HTTPException(status_code=404, message="Job not found")
    return job_status[job_id]

@app.websocket("/ws/{job_id}")
async def websocket_endpoint(websocket: WebSocket, job_id: str):
    await websocket.accept()
    try:
        while True:
            if job_id in job_status:
                await websocket.send_json(job_status[job_id])
            await asyncio.sleep(1) # Send updates every second
    except Exception as e:
        print(f"WebSocket error: {e}")
