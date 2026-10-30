FROM python:3.12-slim
WORKDIR /srv
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY frontend ./frontend
COPY backend ./backend
# monta o site e roda os testes no build: se algum teste falhar, o deploy não acontece
RUN python frontend/build.py && cd backend && CRAB_FEED=mock python -m pytest -q
WORKDIR /srv/backend
EXPOSE 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers"]
