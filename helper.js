import fs from "fs";
import path from "path";

const templatePath = path.join("src", "password.template.data.json");
const dataPath = path.join("src", "password.data.json");
const recordsPath = path.join("records.json");

export function readPasswordData() {
  if (fs.existsSync(dataPath)) {
    return JSON.parse(fs.readFileSync(dataPath, "utf8"));
  }
  // fallback to template if data file missing
  const template = JSON.parse(fs.readFileSync(templatePath, "utf8"));
  savePasswordData(template); // create ghost data file
  return template;
}

export function savePasswordData(data) {
  // update both ghost file and records file
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
  fs.writeFileSync(recordsPath, JSON.stringify(data, null, 2), "utf8");
}

export function generateNewPassword() {
  const now = new Date();
  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const DD = String(now.getDate()).padStart(2, "0");
  const HH = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `P-${YYYY}${MM}${DD}${HH}${mm}${ss}!`;
}

export function verifySync() {
  // if ghost file is missing, bootstrap it from template before verifying
  if (!fs.existsSync(dataPath)) {
    const template = JSON.parse(fs.readFileSync(templatePath, "utf8"));
    savePasswordData(template);
  }

  if (!fs.existsSync(recordsPath)) return false;

  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const records = JSON.parse(fs.readFileSync(recordsPath, "utf8"));
  return JSON.stringify(data) === JSON.stringify(records);
}
