#!/bin/sh
set -e

export DATABASE_URL=postgresql://${PGUSER}:$(cat /run/secrets/postgres_password)@postgres:5432/${PGDATABASE}?schema=public

if [ "$NODE_ENV" = "production" ]; then
	npx prisma migrate deploy
	npx prisma generate
    npm run dev
elif [ "$NODE_ENV" = "migration" ]; then
	npx prisma migrate dev --name="$MIGRATION_NAME"
	cd /migrations
	cp -r /app/prisma/migrations/* .
else
	npx prisma migrate dev --name="$GIT_BRANCH"
	mkdir -p /migrations
	cd /migrations
	cp -r /app/prisma/migrations/* .
	cd /app
	npx prisma generate
	npx prisma db seed
	npm run dev
fi
