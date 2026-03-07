const path = require('path');

module.exports = {
  apps: [{
    name: "skviirtl-site",
    script: "node",
    args: "dist/index.cjs",
    interpreter: "node",
    cwd: "/var/www/skviirtl-site",
    env: {
      NODE_ENV: "production",
      PORT: "5000",
      // These should be set on the VPS environment or via GitHub Secrets
      DATABASE_URL: "postgresql://neondb_owner:npg_rqYs7P0aRpMB@ep-bold-sky-ai7il3iu-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require",
      API_KEY: "skviirtl_secret_key_123",
      SESSION_SECRET: "skviirtl_secret_123"
    }
  }]
};
