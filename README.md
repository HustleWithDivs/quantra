# 🛠️ Prerequisites
Before executing initialization scripts, ensure your host machine has the following tools installed and active:
* Docker & Docker Compose (Desktop or Engine v20.10+)
* Node.js (v18 or higher; needed for local Scaffolding hooks)

> Note: The uv Python package manager is automatically downloaded and installed contextually if missing during ./setup.sh execution.
## ⚡ Quick Start Flow
Getting up and running on a completely new machine requires running only two simple shell scripts in sequence:
### Step 1: Initialize the Machine
Run the setup automation script to configure directories, pull packages via uv, scaffold your React environment, and build internal Docker layers.
```Bash
chmod +x setup.sh start.sh
./setup.sh
```

### Step 2: Spin Up the Cluster
Launch your synchronized multi-runtime application using the execution controller:
```Bash
./start.sh
```

## 📂 Project Structure
```text
app-skeleton/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── agents/          # Agent logic & prompts
│   │   ├── tools/           # Agent tools & skills
│   │   └── main.py          # Entry point (FastAPI)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── [Vite/React Boilerplate]
├── docker-compose.yml
├── setup.sh
├── setup.ps1
├── setup.sh
└── start.sh
```

## 🌐 Endpoint Access Ports
Once start.sh executes successfully, your workspace exposes the following endpoints with hot-reloading mapped directly to your local file system edits:
| Component | Target Address | Functionality |
| :--- | :--- | :--- |
| **Frontend** | http://localhost:5173 | React Application Interface |
| **Backend** |http://localhost:8000 | Backend APIFastAPI Engine Core |
| API Docs | http://localhost:8000/docs| Swagger API Specifications

## 🛠️ Modifying Dependencies
### Python Backend
To introduce new libraries for your Agentic routines (e.g., langgraph, numpy, chromadb):\
 - Append the library name directly to the ```/backend/requirements.txt ``` file.
 - Re-trigger the environment compiler to let ```uv``` reconstruct dependencies:
 ```Bash
 cd backend
uv pip install -r requirements.txt
```
- Re-build your underlying Docker layers: ```docker compose build backend```.
### React Frontend
To append structural frontend primitives or packages:
```Bash
cd frontend
npm install <package-name>
```
## 🐳 Container Configuration Notes
- Both frontend and backend mounts use relative standard host volumes. Modifying application logic inside your workspace editor triggers active **Hot-Module Reloading (HMR)** inside Docker immediately without requiring container restarts.
- The backend image relies on a highly efficient Python base layer injecting the official uv binary architecture for sub-second system execution hooks.
-The frontend development environment is engineered to be entirely self-contained while preserving a lightning-fast local developer experience.

### 📦 Volume Mapping & Dependency Isolation

The frontend service uses a dual-volume mounting strategy in `docker-compose.yml`:

| Volume Declaration | Type | Purpose |
| :--- | :--- | :--- |
| `- ./frontend:/app` | **Bind Mount** | Mirrors your local source code into the container. Code changes locally instantly register inside Docker. |
| `- /app/node_modules` | **Anonymous Volume** | Hides and protects the container's internal `node_modules` directory from being overwritten by your host machine's directory. |

> ⚠️ **Critical Architecture Note:** The anonymous volume ensures that Node binaries compiled inside the Linux container are never accidentally overwritten or corrupted by host OS node dependencies (e.g., Mac/Windows npm setups). 

---

### ⚡ Hot Module Replacement (HMR) over Docker

Because Vite handles real-time UI updates via WebSockets, the frontend container explicitly forces Vite to bind to all network interfaces:

```dockerfile
CMD ["npm", "run", "dev", "--", "--host"]
```
## 🪟 Windows Execution (PowerShell Flow)

If you are developing natively on Windows without WSL2, use the PowerShell alternatives:

```powershell
# 1. Initialize the machine environment
.\setup.ps1

# 2. Spin up the container services
.\start.ps1
```
>Note: If your system throws a script execution policy error, bypass it for your active terminal session using: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process.