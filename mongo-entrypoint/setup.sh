#!/bin/bash
set -e
mongosh <<EOF
use admin
db.auth("$MONGO_INITDB_ROOT_USERNAME", "$MONGO_INITDB_ROOT_PASSWORD")
use poster
db.createUser({
  user: "$MONGO_DB_USERNAME",
  pwd: "$MONGO_DB_PASSWORD",
  roles: [
    { role: "readWrite", db: "poster" }
  ]
})
EOF