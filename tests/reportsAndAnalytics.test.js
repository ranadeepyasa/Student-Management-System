import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../server/app.js';

let server;
let baseUrl;

describe('Academic Analytics & Data Export Suite', () => {
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

  test('GET /api/reports/dashboard-stats provides aggregated institutional intelligence', async () => {
    const res = await fetch(`${baseUrl}/reports/dashboard-stats`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.summary.totalStudents >= 12);
    assert.ok(json.data.summary.totalDepartments >= 5);
    assert.ok(json.data.summary.averageGpa >= 3.0);
    assert.ok(Array.isArray(json.data.departmentDistribution));
    assert.ok(Array.isArray(json.data.yearDistribution));
  });

  test('GET /api/reports/export/students.csv outputs valid RFC-4180 CSV file', async () => {
    const res = await fetch(`${baseUrl}/reports/export/students.csv`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get('content-type').includes('text/csv'));
    assert.ok(res.headers.get('content-disposition').includes('students_report.csv'));

    const text = await res.text();
    const lines = text.trim().split('\r\n');
    assert.ok(lines.length >= 13, 'CSV must include header plus at least 12 student rows');
    assert.ok(lines[0].startsWith('Student ID,First Name,Last Name,Email'));
  });
});
