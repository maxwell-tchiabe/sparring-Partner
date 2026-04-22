# ============================================================
# Stage 1 — builder
# Install system build tools + resolve all Python dependencies
# ============================================================
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS builder

WORKDIR /app

# Build-time system dependencies (compilers for native extensions)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests first to leverage Docker layer cache
COPY uv.lock pyproject.toml /app/

# Resolve & install all dependencies into a local .venv (no cache to save space)
RUN uv sync --frozen --no-cache

# Copy application source
COPY src/ /app/

# Install the package itself in editable mode inside the same .venv
RUN uv pip install -e .

# ============================================================
# Stage 2 — runtime
# Minimal image: no compilers, no build tools, no uv cache
# ============================================================
FROM python:3.13-slim-bookworm AS runtime

WORKDIR /app

# Runtime-only env config
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

# Copy the fully-resolved virtual environment from builder
COPY --from=builder /app/.venv /app/.venv

# Copy the application source (already installed, just needs the files at runtime)
COPY --from=builder /app/ai_companion /app/ai_companion

# Persistent data volume (SQLite short-term memory, etc.)
VOLUME ["/app/data"]

# Expose FastAPI port
EXPOSE 8080

# Start the API server via uvicorn (uses .venv from PATH)
CMD ["uvicorn", "ai_companion.interfaces.api.main:app", "--host", "0.0.0.0", "--port", "8080"]