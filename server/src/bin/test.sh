# spin up postgres database
docker-compose up -d postgres

# wait for Postgres to accept connections
# Postgres usually does not accept connections immediately after it is started up
echo "[db] not yet ready to accept connections"
WAIT_FOR_PG_ISREADY="while ! pg_isready; do sleep 1; done;"
docker-compose exec postgres bash -c "$WAIT_FOR_PG_ISREADY"
echo "[db] ready to accept connections"

echo "running all tests..."
mocha --recursive --exit

echo "tearing down all containers..."
docker-compose down -v --remove-orphans