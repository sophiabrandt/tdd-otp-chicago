SHELL := /bin/bash

export PROJECT = tdd-otp-chicago
export DB_NAME = onetimesecret

# ==============================================================================
# Building containers

# $(shell git rev-parse --short HEAD)
VERSION := 1.0

dev: docker-up

# ==============================================================================
# Running tests within the local computer

test:
	pnpm run test

test-watch:
	pnpm run test:watch

# ==============================================================================
# Docker support

docker-up:
	docker compose up -d

docker-down:
	docker compose down -v --remove-orphans

docker-clean:
	docker system prune -f	
