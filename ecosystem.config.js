module.exports = {
  apps: [
    {
      name: "screenboard-frontend",
      cwd: "/home/rendy/screenboard/screenboard-v2-web",
      script: "npm",
      args: "run preview",
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
    },
  ],
};
