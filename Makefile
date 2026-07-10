PORT ?= 8000
HOST ?= 0.0.0.0
LAN_IFACE ?= en0
LAN_IP ?= $(shell ipconfig getifaddr $(LAN_IFACE) 2>/dev/null || ifconfig $(LAN_IFACE) 2>/dev/null | awk '/inet / {print $$2; exit}')
PID_FILE := .server.pid
PORT_PIDS = $(shell lsof -ti tcp:$(PORT) -sTCP:LISTEN 2>/dev/null)

.PHONY: start stop restart status

start:
	@if [ -f "$(PID_FILE)" ] && kill -0 "$$(cat $(PID_FILE))" 2>/dev/null; then \
		echo "Server already running (PID $$(cat $(PID_FILE)))"; \
		if [ -n "$(LAN_IP)" ]; then echo "Phone URL: http://$(LAN_IP):$(PORT)"; else echo "Phone URL: could not detect LAN IP. Try: make status LAN_IFACE=en1"; fi; \
		echo "Mac URL: http://127.0.0.1:$(PORT)"; \
	else \
		nohup python3 -m http.server "$(PORT)" --bind "$(HOST)" </dev/null >/tmp/robot-eye-server.log 2>&1 & \
		echo $$! > "$(PID_FILE)"; \
		sleep 0.2; \
		if kill -0 "$$(cat $(PID_FILE))" 2>/dev/null; then \
			echo "Server started (PID $$(cat $(PID_FILE)))"; \
			echo "Listening on: $(HOST):$(PORT)"; \
			if [ -n "$(LAN_IP)" ]; then echo "Phone URL: http://$(LAN_IP):$(PORT)"; else echo "Phone URL: could not detect LAN IP. Try: make status LAN_IFACE=en1"; fi; \
			echo "Mac URL: http://127.0.0.1:$(PORT)"; \
			echo "Log: /tmp/robot-eye-server.log"; \
		else \
			rm -f "$(PID_FILE)"; \
			echo "Server failed to start. Port $(PORT) may already be in use."; \
			echo "Log: /tmp/robot-eye-server.log"; \
			exit 1; \
		fi; \
	fi

stop:
	@if [ -f "$(PID_FILE)" ] && kill -0 "$$(cat $(PID_FILE))" 2>/dev/null; then \
		kill "$$(cat $(PID_FILE))"; \
		rm -f "$(PID_FILE)"; \
		echo "Server stopped."; \
	elif [ -n "$(PORT_PIDS)" ]; then \
		kill $(PORT_PIDS); \
		rm -f "$(PID_FILE)"; \
		echo "Stopped server process on port $(PORT): $(PORT_PIDS)"; \
	else \
		rm -f "$(PID_FILE)"; \
		echo "No server started by this Makefile is running."; \
	fi

restart: stop start

status:
	@if [ -f "$(PID_FILE)" ] && kill -0 "$$(cat $(PID_FILE))" 2>/dev/null; then \
		echo "Server running (PID $$(cat $(PID_FILE)))"; \
		if [ -n "$(LAN_IP)" ]; then echo "Phone URL: http://$(LAN_IP):$(PORT)"; else echo "Phone URL: could not detect LAN IP. Try: make status LAN_IFACE=en1"; fi; \
		echo "Mac URL: http://127.0.0.1:$(PORT)"; \
	elif [ -n "$(PORT_PIDS)" ]; then \
		echo "Port $(PORT) is in use by PID(s): $(PORT_PIDS)"; \
		if [ -n "$(LAN_IP)" ]; then echo "Phone URL may be: http://$(LAN_IP):$(PORT)"; else echo "Phone URL: could not detect LAN IP. Try: make status LAN_IFACE=en1"; fi; \
	else \
		echo "Server is not running."; \
	fi
