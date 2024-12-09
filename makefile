start-server:
	@echo "Starting Flask server..."
	python3 app.py &

wait-for-server:
	@echo "Waiting for Flask server to come online..."
	@until curl -s http://localhost:5000/ > /dev/null; do \
		sleep 1; \
	done
	@echo "Flask server is online!"

start-frontend:
	@echo "Starting frontend development server..."
	bun run dev

move-to-app:
	cd app


run: start-server wait-for-server move-to-app start-frontend

python-install:
	pip install -r requirements.txt

bun-install:
	bun install

install: python-install move-to-app bun-install


