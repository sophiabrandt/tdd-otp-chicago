SHELL := /bin/bash

export PROJECT = tdd-otp-chicago
export DB_NAME = onetimesecret

# ==============================================================================
# Building containers

# $(shell git rev-parse --short HEAD)
VERSION := 1.0

docker: docker-up

run: dev

test: test-unit test-int test-e2e

# ==============================================================================
# Run server locally

dev:
	pnpm dlx ts-node 'src/server.ts'

# ==============================================================================
# Running tests within the local computer

test-unit:
	pnpm run test:unit

test-int:
	pnpm run test:int

test-e2e:
	pnpm run test:e2e

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
