.PHONY: help start stop connect init

# Database connection commands
PSQL_ADMIN := docker compose exec -T postgres psql -U intern -d postgres
PSQL_DB := docker compose exec -T postgres psql -U intern -d treasure_app_2025_test

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

start: ## Start PostgreSQL container for testing
	@if ! docker compose ps | grep -q "treasure-app-2025-api-postgres.*Up"; then \
		echo "Starting PostgreSQL container..."; \
		docker compose up -d; \
		echo "Waiting for PostgreSQL to be ready..."; \
		TIMEOUT=30; \
		COUNTER=0; \
		while ! docker compose exec -T postgres pg_isready -U intern > /dev/null 2>&1; do \
			sleep 1; \
			echo -n "."; \
			COUNTER=$$((COUNTER + 1)); \
			if [ $$COUNTER -ge $$TIMEOUT ]; then \
				echo ""; \
				echo "❌ PostgreSQL failed to start within $$TIMEOUT seconds"; \
				docker compose logs postgres; \
				exit 1; \
			fi; \
		done; \
		echo ""; \
		echo "PostgreSQL is ready!"; \
	fi

stop: ## Stop PostgreSQL container
	docker compose down

connect: ## Connect to PostgreSQL with psql
	docker compose exec postgres psql -U intern -d treasure_app_2025_test

init: ## Initialize database (drop and recreate with migrations and seed data)
	@echo "Initializing database..."; \
	echo "Dropping existing database..."; \
	$(PSQL_ADMIN) -c "DROP DATABASE IF EXISTS treasure_app_2025_test;"; \
	echo "Creating new database..."; \
	$(PSQL_ADMIN) -c "CREATE DATABASE treasure_app_2025_test;"; \
	echo "Running migrations..."; \
	for file in migration/*.sql; do \
		echo "Applying $$file..."; \
		$(PSQL_DB) < $$file; \
	done; \
	echo "Loading seed data..."; \
	for file in seed/*.sql; do \
		echo "Applying $$file..."; \
		$(PSQL_DB) < $$file; \
	done; \
	echo "Database initialization completed!"
