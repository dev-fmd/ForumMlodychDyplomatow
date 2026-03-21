import { execFileSync } from "node:child_process";
import path from "node:path";
import parseSpdxExpression from "spdx-expression-parse";
import { fileURLToPath } from "node:url";
import config from "../license-allowlist.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const configPath = path.join(rootDir, "license-allowlist.json");
const allowedLicenses = new Set(config.allowedLicenses ?? []);

function evaluateSpdxNode(node) {
  if (typeof node === "string") {
    return allowedLicenses.has(node);
  }

  if (node.license) {
    if (node.exception) {
      return allowedLicenses.has(`${node.license} WITH ${node.exception}`);
    }

    return allowedLicenses.has(node.license);
  }

  if (node.conjunction === "and") {
    return evaluateSpdxNode(node.left) && evaluateSpdxNode(node.right);
  }

  if (node.conjunction === "or") {
    return evaluateSpdxNode(node.left) || evaluateSpdxNode(node.right);
  }

  return false;
}

function isAllowedLicense(license) {
  try {
    return evaluateSpdxNode(parseSpdxExpression(license));
  } catch {
    return allowedLicenses.has(license);
  }
}

const rawOutput = execFileSync("pnpm", ["licenses", "list", "--json"], {
  cwd: rootDir,
  encoding: "utf8",
  maxBuffer: 20 * 1024 * 1024,
});

const licensesByType = JSON.parse(rawOutput);
const disallowed = Object.entries(licensesByType)
  .filter(([license]) => !isAllowedLicense(license))
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([license, packages]) => ({
    license,
    packages: [...packages]
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((pkg) => `${pkg.name}@${pkg.versions.join(", ")}`),
  }));

if (disallowed.length > 0) {
  console.error("Found packages with licenses outside the allowlist:\n");

  for (const entry of disallowed) {
    for (const pkg of entry.packages) {
      console.error(`- ${pkg} (${entry.license})`);
    }
  }

  console.error(
    `\nUpdate ${path.relative(rootDir, configPath)} only after approving the new licenses.`
  );
  process.exit(1);
}

console.log(`License check passed.`);
