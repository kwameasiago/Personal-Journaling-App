#!/bin/bash
set -e

COMPOSE_FILE="dev-docker-composer.yml"

docker compose -f "$COMPOSE_FILE" build

docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

run_service_commands() {
    local service="$1"
    shift
    docker compose -f "$COMPOSE_FILE" run "$service" sh -c "$*"
}


echo "Running schema sync and seeding for users-api..."
run_service_commands "users-api" "npx typeorm-ts-node-commonjs schema:drop -d src/config/data-source-development.ts"
run_service_commands "users-api" "npx typeorm-ts-node-commonjs schema:sync -d src/config/data-source-development.ts && npm run seed"

echo "Running schema sync for journals-api..."
run_service_commands "journals-api" "npx typeorm-ts-node-commonjs schema:drop -d src/config/data-source-development.ts"
run_service_commands "journals-api" "npx typeorm-ts-node-commonjs schema:sync -d src/config/data-source-development.ts  && npm run seed"

echo "Running schema sync for analysis-api..."
run_service_commands "analysis-api" "npx typeorm-ts-node-commonjs schema:drop -d src/config/data-source-development.ts"
run_service_commands "analysis-api" "npx typeorm-ts-node-commonjs schema:sync -d src/config/data-source-development.ts  && npm run seed"

echo "Script completed successfully."
