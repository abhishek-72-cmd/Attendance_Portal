const { Sequelize } = require("sequelize");

function getDatabaseUrl() {
  const {
    DB_HOST,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_PORT = "5432",
  } = process.env;

  // Prefer a complete set of explicit variables so a stale DATABASE_URL
  // cannot silently override newer Neon credentials.
  if (DB_HOST && DB_NAME && DB_USER && DB_PASSWORD) {
    return `postgresql://${encodeURIComponent(DB_USER)}:${encodeURIComponent(
      DB_PASSWORD
    )}@${DB_HOST}:${DB_PORT}/${encodeURIComponent(DB_NAME)}?sslmode=require`;
  }

  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);

    // Neon rejects unencrypted PostgreSQL connections.
    if (!url.searchParams.has("sslmode")) {
      url.searchParams.set("sslmode", "require");
    }

    return url.toString();
  }

  throw new Error(
    "Set DATABASE_URL or all of DB_HOST, DB_NAME, DB_USER, and DB_PASSWORD"
  );
}

const sequelize = new Sequelize(getDatabaseUrl(), {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.error("DB connection failed:", error.message);
    throw error;
  }
};

module.exports = { sequelize, connectDB };
