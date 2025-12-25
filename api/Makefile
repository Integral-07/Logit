.PHONY: help deps dev test lint typecheck format deploy db/start

deps:
	npm install

dev: deps ## Start development server
	NODE_EXTRA_CA_CERTS=./certs/supabase-prod-ca-2021.crt TZ=UTC npm run dev

lint: db/start
	npm run lint

typecheck: 
	npm run typecheck

vitest: db/start
	npx vitest

format: 
	npm run format

deploy: 
	npm run deploy
