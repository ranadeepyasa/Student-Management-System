import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../server/app.js';
import jwt from '../server/node_modules/jsonwebtoken/index.js';

let server;
let baseUrl;
let authToken;

describe('Student Management System - CRUD & Validation Suite', () => {
  before(async () => {
    // Generate valid signed admin token
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

  test('GET /api/students returns seeded student directory with pagination metadata', async () => {
    const res = await fetch(`${baseUrl}/students`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data), 'data must be an array of students');
    assert.ok(data.data.length >= 12, 'seeded directory contains at least 12 students');
    assert.ok(data.pagination.total >= 12, 'pagination reflects total count');
  });

  test('POST /api/students successfully creates a new student when authenticated', async () => {
    const testStudent = {
      student_id: `TEST-STU-${Date.now()}`,
      first_name: 'Priya',
      last_name: 'Reddy',
      email: `priya.test.${Date.now()}@woxsen.edu.in`,
      phone: '+91 91234 56789',
      gender: 'Female',
      department_id: 1,
      course: 'B.Tech Computer Science & Engineering',
      year_of_study: 2,
      admission_date: '2025-08-01',
      gpa: 3.89,
      status: 'Active',
      address: 'Hyderabad, India',
      emergency_contact: '+91 98480 99999',
    };

    const res = await fetch(`${baseUrl}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(testStudent),
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.student_id, testStudent.student_id);
    assert.strictEqual(data.data.first_name, 'Priya');
    assert.strictEqual(data.data.last_name, 'Reddy');
  });

  test('POST /api/students rejects duplicate student_id with 409 Conflict', async () => {
    const existing = await fetch(`${baseUrl}/students`).then((r) => r.json());
    const existingStudent = existing.data[0];

    const duplicatePayload = {
      student_id: existingStudent.student_id,
      first_name: 'Duplicate',
      last_name: 'Test',
      email: `unique.${Date.now()}@woxsen.edu.in`,
      course: 'B.Tech CSE',
    };

    const res = await fetch(`${baseUrl}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(duplicatePayload),
    });

    assert.strictEqual(res.status, 409);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('already exists'));
  });

  test('POST /api/students rejects missing mandatory fields with 400 Bad Request', async () => {
    const invalidPayload = {
      student_id: '',
      first_name: '',
      email: 'not-an-email',
    };

    const res = await fetch(`${baseUrl}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(invalidPayload),
    });

    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  test('GET /api/students with search filter finds specific student by ID or Name', async () => {
    const res = await fetch(`${baseUrl}/students?search=Ranadeep`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data.length >= 1);
    assert.ok(data.data.some((s) => s.first_name.includes('Ranadeep')));
  });

  test('GET /api/students with department filter returns only matching students', async () => {
    const res = await fetch(`${baseUrl}/students?department=Computer Science & Engineering`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    for (const s of data.data) {
      assert.strictEqual(s.department_name, 'Computer Science & Engineering');
    }
  });

  test('PUT /api/students/:id updates student record accurately', async () => {
    const listRes = await fetch(`${baseUrl}/students`).then((r) => r.json());
    const target = listRes.data[0];

    const updatePayload = {
      ...target,
      gpa: 3.99,
      status: 'Active',
    };

    const res = await fetch(`${baseUrl}/students/${target.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(updatePayload),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(parseFloat(data.data.gpa), 3.99);
  });

  test('DELETE /api/students/:id removes student record safely', async () => {
    const tempStudent = {
      student_id: `TEMP-DEL-${Date.now()}`,
      first_name: 'Delete',
      last_name: 'Me',
      email: `temp.del.${Date.now()}@woxsen.edu.in`,
      course: 'B.Tech CSE',
      year_of_study: 1,
    };

    const createRes = await fetch(`${baseUrl}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(tempStudent),
    });
    const created = await createRes.json();
    const studentId = created.data.id;

    const deleteRes = await fetch(`${baseUrl}/students/${studentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(deleteRes.status, 200);

    const verifyRes = await fetch(`${baseUrl}/students/${studentId}`);
    assert.strictEqual(verifyRes.status, 404);
  });
});
