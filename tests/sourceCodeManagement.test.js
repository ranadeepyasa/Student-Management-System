import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Source Code Management & Repository Standards (CH. Rishyant)', () => {
  test('Git exclusion file (.gitignore) contains essential ignore rules', () => {
    const gitignorePath = path.join(rootDir, '.gitignore');
    assert.ok(fs.existsSync(gitignorePath), '.gitignore must exist in root');
    const content = fs.readFileSync(gitignorePath, 'utf8');
    assert.match(content, /node_modules/, '.gitignore must ignore node_modules');
    assert.match(content, /\.env/, '.gitignore must ignore .env files');
    assert.match(content, /\*\.sqlite/, '.gitignore must ignore SQLite database files');
    assert.match(content, /dist/, '.gitignore must ignore dist build outputs');
  });

  test('Source Code Management manuals exist and document conventions', () => {
    const scmGuidePath = path.join(rootDir, 'docs', 'SOURCE_CODE_MANAGEMENT.md');
    const gitGuidePath = path.join(rootDir, 'docs', 'GIT_COMMANDS_GUIDE.md');
    assert.ok(fs.existsSync(scmGuidePath), 'SOURCE_CODE_MANAGEMENT.md must exist');
    assert.ok(fs.existsSync(gitGuidePath), 'GIT_COMMANDS_GUIDE.md must exist');

    const scmContent = fs.readFileSync(scmGuidePath, 'utf8');
    assert.match(scmContent, /Conventional Commit/, 'SCM guide must cover conventional commits');
    assert.match(scmContent, /24WU0102213/, 'SCM guide must document CH. Rishyant');
  });

  test('Project root contains clean execution scripts in package.json', () => {
    const pkgPath = path.join(rootDir, 'package.json');
    assert.ok(fs.existsSync(pkgPath), 'package.json must exist');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    assert.ok(pkg.scripts.test, 'package.json must define a test script');
    assert.ok(pkg.scripts.build, 'package.json must define a build script');
    assert.ok(pkg.scripts.dev, 'package.json must define a dev script');
  });
});
