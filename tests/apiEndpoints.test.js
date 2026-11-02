import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Backend Server Configuration & Route Contracts', () => {
  test('Server app.js defines essential middleware and health check', () => {
    const appPath = path.join(rootDir, 'server', 'app.js');
    assert.ok(fs.existsSync(appPath), 'server/app.js must exist');
    const content = fs.readFileSync(appPath, 'utf8');
    assert.ok(content.includes('/api/health'), 'Health check route must be configured');
    assert.ok(content.includes('cors('), 'CORS middleware must be configured');
    assert.ok(content.includes('helmet('), 'Helmet security middleware must be configured');
  });

  test('Database schema defines tables for users, departments, and students', () => {
    const schemaPath = path.join(rootDir, 'server', 'database', 'schema.sql');
    assert.ok(fs.existsSync(schemaPath), 'schema.sql must exist');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS `users`'), 'users table defined');
    assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS `departments`'), 'departments table defined');
    assert.ok(schema.includes('CREATE TABLE IF NOT EXISTS `students`'), 'students table defined');
  });

  test('GitHub integration service is configured with correct defaults', () => {
    const ghServicePath = path.join(rootDir, 'server', 'services', 'githubService.js');
    assert.ok(fs.existsSync(ghServicePath), 'githubService.js must exist');
    const content = fs.readFileSync(ghServicePath, 'utf8');
    assert.ok(content.includes('Student-Management-System'), 'Default repo must match Student-Management-System');
    assert.ok(content.includes('ranadeepyasa'), 'Default owner must match ranadeepyasa');
  });
});
