const { spawn } = require("child_process");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

const services = [
  {
    name: "backend",
    command: "npm",
    args: ["run", "dev"],
    cwd: path.join(rootDir, "backend"),
  },
  {
    name: "frontend",
    command: "npm",
    args: ["run", "dev"],
    cwd: path.join(rootDir, "Mern-Form"),
  },
];

const children = [];
let shuttingDown = false;

const shutdown = (exitCode = 0) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGINT");
    }
  }

  setTimeout(() => {
    process.exit(exitCode);
  }, 250);
};

for (const service of services) {
  const child = spawn(service.command, service.args, {
    cwd: service.cwd,
    stdio: "inherit",
    shell: true,
  });

  children.push(child);

  child.on("exit", (code) => {
    if (!shuttingDown && code && code !== 0) {
      console.error(`${service.name} exited with code ${code}`);
      shutdown(code);
    }
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
