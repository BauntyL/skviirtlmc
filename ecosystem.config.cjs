const path = require('path');

module.exports = {
  apps: [{
    name: "skviirtl-site",
    script: "./node_modules/.bin/tsx",
    args: "./server/index.ts",
    cwd: "/var/www/skviirtl-site",
    env: {
      NODE_ENV: "production",
      PORT: "5000",
      // These should be set on the VPS environment or via GitHub Secrets
      DATABASE_URL: process.env.DATABASE_URL,
      API_KEY: process.env.API_KEY || "skviirtl_secret_key_123",
      SESSION_SECRET: process.env.SESSION_SECRET || "skviirtl_secret_123"
    }
  }]
};
