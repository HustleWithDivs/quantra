FROM python:3.11-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Crucial: Tell Python to look inside /app/app for modular absolute imports
ENV PYTHONPATH=/app/app

# Install dependencies using uv
COPY requirements.txt .
RUN uv pip install --system -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]