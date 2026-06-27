FROM node:26-alpine AS frontend-build
WORKDIR /app/frontend
RUN npm install -g yarn
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY frontend/ ./
ENV REACT_APP_BACKEND_URL=""
ENV CI=false
RUN yarn build

FROM python:3.14-slim
WORKDIR /app
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./
COPY --from=frontend-build /app/frontend/build ./build
RUN addgroup --system app && adduser --system --ingroup app app && chown -R app:app /app

USER app

ENV PYTHONUNBUFFERED=1
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD python -c "import os, urllib.request; urllib.request.urlopen(f'http://127.0.0.1:{os.getenv(\"PORT\", \"8000\")}/api/').read()"
CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}"]
