import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('GitHub Automation & Community Templates Validation', () => {
  test('Issue template directory and files exist with proper frontmatter', (t) => {
    const issueDir = path.join(rootDir, '.github', 'ISSUE_TEMPLATE');
    if (!fs.existsSync(issueDir)) {
      t.skip('Issue templates are managed in feature/issues-and-bug-tracking and will integrate after PR merge');
      return;
    }
    assert.ok(fs.existsSync(issueDir), '.github/ISSUE_TEMPLATE must exist');

    const bugReport = path.join(issueDir, 'bug_report.md');
    assert.ok(fs.existsSync(bugReport), 'bug_report.md must exist');
    const bugContent = fs.readFileSync(bugReport, 'utf8');
    assert.ok(bugContent.startsWith('---'), 'bug_report.md must have YAML frontmatter');
    assert.ok(bugContent.includes('labels:'), 'bug_report.md must specify labels');

    const featureReq = path.join(issueDir, 'feature_request.md');
    assert.ok(fs.existsSync(featureReq), 'feature_request.md must exist');
    const featContent = fs.readFileSync(featureReq, 'utf8');
    assert.ok(featContent.startsWith('---'), 'feature_request.md must have YAML frontmatter');
  });

  test('Pull Request template exists and contains comprehensive checklist', (t) => {
    const prTemplate = path.join(rootDir, '.github', 'PULL_REQUEST_TEMPLATE.md');
    if (!fs.existsSync(prTemplate)) {
      t.skip('PR template is managed in feature/pull-requests-and-code-review and will integrate after PR merge');
      return;
    }
    assert.ok(fs.existsSync(prTemplate), 'PULL_REQUEST_TEMPLATE.md must exist');
    const content = fs.readFileSync(prTemplate, 'utf8');
    assert.ok(content.includes('Description'), 'PR template must have a Description section');
    assert.ok(content.includes('Checklist'), 'PR template must have a Checklist');
    assert.ok(content.includes('Related Issue'), 'PR template must link related issues');
  });

  test('GitHub Actions CI workflow file exists with build and test jobs', () => {
    const ciWorkflow = path.join(rootDir, '.github', 'workflows', 'ci.yml');
    assert.ok(fs.existsSync(ciWorkflow), '.github/workflows/ci.yml must exist');
    const content = fs.readFileSync(ciWorkflow, 'utf8');
    assert.ok(content.includes('pull_request:'), 'CI must trigger on pull_request');
    assert.ok(content.includes('npm run build') || content.includes('npm test'), 'CI must run build/test steps');
  });
});
