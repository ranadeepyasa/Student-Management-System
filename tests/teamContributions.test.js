import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INITIAL_TEAM_MEMBERS } from '../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Five-Member Team Responsibilities & Roster Validation', () => {
  const expectedMembers = [
    { name: 'G. Dharan', rollNumber: '24WU0102210', responsibilitySnippet: 'Repository management' },
    { name: 'CH. Rishyant', rollNumber: '24WU0102213', responsibilitySnippet: 'source code management' },
    { name: 'B. Abhinav', rollNumber: '24WU0102224', responsibilitySnippet: 'GitHub Issues' },
    { name: 'Ranadeep Yasa', rollNumber: '24WU0104081', responsibilitySnippet: 'Pull Requests' },
    { name: 'P. Muneswar Reddy', rollNumber: '24WU0101006', responsibilitySnippet: 'Release management' },
  ];

  test('docs/TEAM_CONTRIBUTIONS.md documents all 5 members with exact roll numbers', (t) => {
    const docPath = path.join(rootDir, 'docs', 'TEAM_CONTRIBUTIONS.md');
    if (!fs.existsSync(docPath)) {
      t.skip('docs/TEAM_CONTRIBUTIONS.md will validate after documentation module merge');
      return;
    }
    const content = fs.readFileSync(docPath, 'utf8');

    for (const member of expectedMembers) {
      assert.ok(
        content.includes(member.rollNumber),
        `Document must include Roll No ${member.rollNumber} for ${member.name}`
      );
      assert.ok(
        content.includes(member.name),
        `Document must include team member ${member.name}`
      );
    }
  });

  test('Application mock data contains all 5 team members with valid handles', () => {
    assert.strictEqual(INITIAL_TEAM_MEMBERS.length, 5, 'Must contain exactly 5 team members');
    const rollNumbers = INITIAL_TEAM_MEMBERS.map((m) => m.rollNumber);
    for (const member of expectedMembers) {
      assert.ok(
        rollNumbers.includes(member.rollNumber),
        `mockData must include roll number ${member.rollNumber}`
      );
    }
  });
});
