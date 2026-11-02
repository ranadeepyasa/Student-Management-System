import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../server/app.js';
import jwt from '../server/node_modules/jsonwebtoken/index.js';

let server;
let baseUrl;
let authToken;

describe('Department Management & Referential Integrity Suite', () => {
  before(async () => {
    authToken = jwt.sign(
      { userId: 1, username: 'admin', email: 'admin@woxsen.edu.in', role: 'Admin / Team Leader' },
      process.env.JWT_SECRET || 'devflow_super_secret_jwt_key_2026_academic',
      { expiresIn: '2h' }
    );

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

  test('GET /api/departments returns all academic departments with student counts', async () => {
    const res = await fetch(`${baseUrl}/departments`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data.length >= 5, 'contains at least 5 baseline departments');
    const cse = data.data.find((d) => d.code === 'CSE');
    assert.ok(cse, 'CSE department must exist');
    assert.ok(cse.student_count > 0, 'CSE student_count must be computed');
  });

  test('POST /api/departments creates new department with unique code and name', async () => {
    const code = `DPT${Math.floor(100 + Math.random() * 899)}`;
    const newDept = {
      code,
      name: `Department of Emerging Technologies ${code}`,
      head_of_department: 'Dr. Test Faculty',
      email: `emerging.${code.toLowerCase()}@woxsen.edu.in`,
      phone: '+91 99887 76655',
      building: 'Research Block C',
      established_year: 2026,
    };

    const res = await fetch(`${baseUrl}/departments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(newDept),
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.code, code);
  });

  test('POST /api/departments rejects duplicate department code with 409 Conflict', async () => {
    const duplicate = {
      code: 'CSE',
      name: 'Duplicate Computer Science',
    };

    const res = await fetch(`${baseUrl}/departments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(duplicate),
    });

    assert.strictEqual(res.status, 409);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('already exists'));
  });

  test('DELETE /api/departments/:id blocks deletion if students are enrolled (Safe Delete Guard)', async () => {
    const res = await fetch(`${baseUrl}/departments/1`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });

    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('Cannot delete department'));
    assert.ok(data.enrolledCount > 0);
  });
});
