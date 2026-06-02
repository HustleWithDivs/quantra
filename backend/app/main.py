from fastapi import FastAPI

app = FastAPI(title="Agentic AI Backend Workspace")

@app.get("/")
def read_root():
    return {"status": "online", "message": "Agent System Initialized"}
