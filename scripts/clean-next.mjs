import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const DEV_PORTS = [3000, 3001, 3002];

function stopDevServers() {
  if (process.platform !== "win32") return;

  const ports = DEV_PORTS.join(",");
  try {
    execSync(
      `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${ports} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"`,
      { stdio: "ignore" }
    );
    console.log("Stopped dev servers on ports 3000–3002");
  } catch {
    // No matching processes — fine.
  }
}

stopDevServers();

const dirs = [".next", path.join(".next", "cache")];
for (const name of dirs) {
  const dir = path.join(process.cwd(), name);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Removed ${name}`);
  }
}
if (!fs.existsSync(path.join(process.cwd(), ".next"))) {
  console.log(".next cache already clean");
}
