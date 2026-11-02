import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../server/app.js';

let server;
let baseUrl;

describe('Authentication & Access Control Security Suite', () => {
  before(async () => {
    await new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}/api`;
        resolve();
      });
    });
  });

  after(() => {
    if (server) server.close();
  });

  test('POST /api/auth/login succeeds with valid admin credentials', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'admin',
        password: 'Admin@Woxsen2026!',
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token, 'JWT token must be issued');
    assert.ok(data.user, 'User profile returned');
    assert.strictEqual(data.user.password_hash, undefined, 'password_hash must never be leaked');
  });

  test('POST /api/auth/login fails with invalid password (401 Unauthorized)', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'admin',
        password: 'WrongPassword!',
      }),
    });

    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, undefined);
    assert.ok(data.error.includes('Password incorrect'));
  });

  test('POST /api/auth/login fails when identifier is not registered (401)', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'nonexistent_user_999@woxsen.edu.in',
        password: 'SomePassword123!',
      }),
    });

    assert.strictEqual(res.status, 401);
  });

  test('POST /api/auth/login fails when missing body fields (400 Bad Request)', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    assert.strictEqual(res.status, 400);
  });

  test('Protected endpoint /api/students rejects request without Authorization header', async () => {
    const res = await fetch(`${baseUrl}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: 'TEST' }),
    });

    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.ok(data.error.includes('token required'));
  });
});
