const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();

const read = (relPath) => fs.readFileSync(path.join(root, relPath), "utf8");
const exists = (relPath) => fs.existsSync(path.join(root, relPath));
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const failures = [];

const packageJson = JSON.parse(read("package.json"));
const scripts = packageJson.scripts || {};
for (const forbiddenScript of ["build:css", "build:tailwind", "build:tailwind:watch"]) {
  if (Object.prototype.hasOwnProperty.call(scripts, forbiddenScript)) {
    failures.push(`Starter package.json must not define \`${forbiddenScript}\`; build ownership belongs to gem repos.`);
  }
}

const config = read("_config.yml");
if (!/^\s*theme:\s*al_folio_core\s*$/m.test(config)) {
  failures.push("`_config.yml` must keep `theme: al_folio_core` for thin-starter wiring.");
}
if (!/^\s*-\s*al_folio_core\s*$/m.test(config)) {
  failures.push("`_config.yml` plugins must include `al_folio_core`.");
}
if (!/^\s*-\s*al_folio_distill\s*$/m.test(config)) {
  failures.push("`_config.yml` plugins must include `al_folio_distill` (distill is plugin-owned).");
}
if (!/^\s*-\s*al_cookie\s*$/m.test(config)) {
  failures.push("`_config.yml` plugins must include `al_cookie` (cookie consent is plugin-owned).");
}
if (!/^\s*-\s*al_icons\s*$/m.test(config)) {
  failures.push("`_config.yml` plugins must include `al_icons` (icon runtime is plugin-owned).");
}
if (!/^\s*-\s*al_math\s*$/m.test(config)) {
  failures.push("`_config.yml` plugins must include `al_math` when math features are enabled.");
}

for (const libraryKey of ["fontawesome", "academicons", "scholar-icons"]) {
  if (!new RegExp(`^\\s{2}${escapeRegExp(libraryKey)}:\\s*$`, "m").test(config)) {
    failures.push(`\`_config.yml\` must define \`third_party_libraries.${libraryKey}\` for al_icons runtime wiring.`);
    continue;
  }
  if (!new RegExp(`^\\s{2}${escapeRegExp(libraryKey)}:[\\s\\S]*?^\\s{4}integrity:\\s*$[\\s\\S]*?^\\s{6}css:\\s*\"sha`, "m").test(config)) {
    failures.push(`\`_config.yml\` should define an SRI hash for \`third_party_libraries.${libraryKey}.integrity.css\`.`);
  }
}

for (const libraryKey of ["tikzjax", "tocbot"]) {
  if (!new RegExp(`^\\s{2}${escapeRegExp(libraryKey)}:\\s*$`, "m").test(config)) {
    failures.push(`\`_config.yml\` must define \`third_party_libraries.${libraryKey}\` for v1 runtime contracts.`);
  }
}

const gemfile = read("Gemfile");
// The point of this check is that `al_math` is pinned to *a* released version,
// not to any particular one. Hard-coding the number here meant every routine
// version bump failed the style contract until someone remembered to edit this
// file too, which is a tripwire for the bump rather than for the boundary.
if (!/gem 'al_math', '= \d+\.\d+\.\d+'/.test(gemfile)) {
  failures.push("`Gemfile` should pin `al_math` to an exact released version (`= x.y.z`).");
}
if (/gem 'al_math',\s*:git =>/.test(gemfile)) {
  failures.push("`Gemfile` must not use git-branch pin for `al_math`; use released gem version.");
}

// `_includes` is deliberately NOT in this list. This repo is a personal site built from
// the al-folio starter, not the starter itself, and al-folio explicitly supports a site
// shadowing gem-owned includes (see "local overrides: your site vs. this repo" in
// docs/ARCHITECTURE.md). We keep one such override, `_includes/header.liquid`, to add
// new-tab/custom-href support to navbar entries. Track drift with:
//   bundle exec al-folio upgrade overrides audit
// The rest of the boundary still holds: no local layouts, Sass, or CSS build pipeline.
for (const forbiddenPath of ["_layouts", "_sass", "_scripts", "assets/tailwind", "tailwind.config.js", "assets/webfonts"]) {
  if (exists(forbiddenPath)) {
    failures.push(`Starter must not own core component path \`${forbiddenPath}\`; move ownership to the corresponding gem.`);
  }
}

for (const forbiddenGlobPath of [
  "assets/fonts/academicons.woff",
  "assets/fonts/academicons.ttf",
  "assets/fonts/scholar-icons.woff",
  "assets/fonts/scholar-icons.ttf",
]) {
  if (exists(forbiddenGlobPath)) {
    failures.push(`Starter must not own icon runtime artifact \`${forbiddenGlobPath}\`; icon ownership belongs to al_icons.`);
  }
}

// `test/visual` and `test/integration_distill.sh` were dropped from this list when the
// al-folio demo posts were deleted. Both asserted against the starter's own sample content
// (e.g. /blog/2021/distill/), and the visual suite additionally forced `--baseurl /al-folio`
// and targeted the removed /repositories/ page, so it could not pass on this site anyway.
for (const requiredPath of ["test/integration_plugin_toggles.sh"]) {
  if (!exists(requiredPath)) {
    failures.push(`Starter integration/visual contract missing required path: \`${requiredPath}\`.`);
  }
}

if (failures.length > 0) {
  console.error("Starter style contract check failed:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log("Starter style contract check passed.");
