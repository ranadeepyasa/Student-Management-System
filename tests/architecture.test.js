import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Project Architecture & Directory Structure Validation', () => {
  test('Required high-level project directories exist', () => {
    const requiredDirs = ['src', 'server', 'docs', 'tests'];
    for (const dir of requiredDirs) {
      const fullPath = path.join(rootDir, dir);
      assert.ok(fs.existsSync(fullPath), `Directory ${dir} must exist`);
      assert.ok(fs.statSync(fullPath).isDirectory(), `${dir} must be a directory`);
    }
  });

  test('Required root configuration and baseline files exist', () => {
    const requiredFiles = ['package.json', 'README.md', '.gitignore'];
    for (const file of requiredFiles) {
      const fullPath = path.join(rootDir, file);
      assert.ok(fs.existsSync(fullPath), `File ${file} must exist`);
      assert.ok(fs.statSync(fullPath).size > 0, `${file} must not be empty`);
    }
  });

  test('.gitignore protects against committing sensitive and large files', () => {
    const gitignorePath = path.join(rootDir, '.gitignore');
    const content = fs.readFileSync(gitignorePath, 'utf8');
    assert.ok(content.includes('node_modules/'), '.gitignore must ignore node_modules');
    assert.ok(content.includes('dist/'), '.gitignore must ignore dist build artifacts');
    assert.ok(content.includes('.env'), '.gitignore must ignore .env files');
    assert.ok(content.includes('server/.env'), '.gitignore must ignore server .env files');
  });

  test('package.json contains valid scripts and metadata', () => {
    const pkgPath = path.join(rootDir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    assert.strictEqual(pkg.name, 'student-management-system');
    assert.ok(pkg.scripts.build, 'build script must exist');
    assert.ok(pkg.scripts.test, 'test script must exist');
    assert.strictEqual(pkg.type, 'module');
  });
});
