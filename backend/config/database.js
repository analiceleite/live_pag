const postgres = require('postgres');

let sql;

if (process.env.NODE_ENV === 'local') {
  sql = postgres({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  });
} else {
  sql = postgres(process.env.DATABASE_URL);
}

module.exports = { sql };
