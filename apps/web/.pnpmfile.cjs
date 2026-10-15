// Временный трюк: в проекте стоит TypeScript 7 (нативный, без JS-API), а
// typescript-eslint и плагины, которым нужна типизация, умеют только TS < 6.1.
// Поэтому для них подменяем peer-зависимость `typescript` на собственную
// копию TS 6. Остальной проект (tsc, vite, oxlint-tsgolint) остаётся на TS 7.
// Убрать, когда typescript-eslint начнёт поддерживать TS 7.
const LEGACY_TS = 'npm:typescript@~6.0.3';

const needsLegacyTs = (name) =>
  name === 'typescript-eslint' ||
  name === 'ts-api-utils' ||
  name.startsWith('@typescript-eslint/') ||
  name.startsWith('@eslint-react/') ||
  name.startsWith('eslint-plugin-react-');

function readPackage(pkg) {
  if (needsLegacyTs(pkg.name) && pkg.peerDependencies?.typescript) {
    delete pkg.peerDependencies.typescript;
    if (pkg.peerDependenciesMeta) delete pkg.peerDependenciesMeta.typescript;
    pkg.dependencies = { ...pkg.dependencies, typescript: LEGACY_TS };
  }
  return pkg;
}

module.exports = { hooks: { readPackage } };
