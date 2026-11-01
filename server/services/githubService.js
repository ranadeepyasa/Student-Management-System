import dotenv from 'dotenv';

dotenv.config();

const GITHUB_API_BASE = 'https://api.github.com';
const OWNER = process.env.GITHUB_OWNER || 'ranadeepyasa';
const REPO = process.env.GITHUB_REPO || 'Student-Management-System';
const TOKEN = process.env.GITHUB_TOKEN || '';

const getHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'DevFlow-Academic-Collaboration-Platform',
  };
  if (TOKEN) {
    headers.Authorization = `Bearer ${TOKEN}`;
  }
  return headers;
};

export const githubService = {
  isConfigured() {
    return Boolean(TOKEN);
  },

  getRepoCoordinates() {
    return { owner: OWNER, repo: REPO, hasToken: Boolean(TOKEN) };
  },

  async getRepositoryInfo() {
    try {
      const res = await fetch(`${GITHUB_API_BASE}/repos/${OWNER}/${REPO}`, {
        headers: getHeaders(),
      });
      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      return {
        id: data.id,
        name: data.name,
        fullName: data.full_name,
        description: data.description || 'DevFlow Collaborative Platform Repository',
        htmlUrl: data.html_url,
        defaultBranch: data.default_branch,
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        isPrivate: data.private,
        updatedAt: data.updated_at,
        pushedAt: data.pushed_at,
        isLiveGitHub: true,
      };
    } catch (err) {
      console.warn('[GitHub Service] Could not fetch remote repo info:', err.message);
      return {
        name: REPO,
        fullName: `${OWNER}/${REPO}`,
        description: 'Academic demonstration repository for DevFlow',
        htmlUrl: `https://github.com/${OWNER}/${REPO}`,
        defaultBranch: 'main',
        stars: 0,
        forks: 0,
        openIssues: 1,
        isPrivate: false,
        isLiveGitHub: false,
        fallbackNote: err.message,
      };
    }
  },

  async getBranches() {
    try {
      const res = await fetch(`${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/branches?per_page=100`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const list = await res.json();
      return list.map((b) => ({
        name: b.name,
        commitSha: b.commit.sha,
        isProtected: b.protected || false,
        isGitHub: true,
      }));
    } catch (err) {
      console.warn('[GitHub Service] getBranches fallback:', err.message);
      return [{ name: 'main', isProtected: true, isGitHub: false }];
    }
  },

  async getCommits(perPage = 20) {
    try {
      const res = await fetch(`${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/commits?per_page=${perPage}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const list = await res.json();
      return list.map((c) => ({
        sha: c.sha,
        shortSha: c.sha.substring(0, 7),
        message: c.commit.message,
        authorName: c.commit.author?.name || 'Developer',
        authorEmail: c.commit.author?.email,
        date: c.commit.author?.date,
        htmlUrl: c.html_url,
        verified: c.commit.verification?.verified || false,
        isGitHub: true,
      }));
    } catch (err) {
      console.warn('[GitHub Service] getCommits fallback:', err.message);
      return [];
    }
  },

  async getIssues() {
    try {
      const res = await fetch(`${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/issues?state=all&per_page=50`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const list = await res.json();
      // Filter out Pull Requests which GitHub returns in issues endpoint
      return list
        .filter((i) => !i.pull_request)
        .map((i) => ({
          githubId: i.id,
          number: i.number,
          title: i.title,
          body: i.body,
          state: i.state, // 'open' or 'closed'
          labels: i.labels.map((l) => l.name),
          author: i.user?.login,
          htmlUrl: i.html_url,
          commentsCount: i.comments,
          createdAt: i.created_at,
          isGitHub: true,
        }));
    } catch (err) {
      console.warn('[GitHub Service] getIssues fallback:', err.message);
      return [];
    }
  },

  async getPullRequests() {
    try {
      const res = await fetch(`${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/pulls?state=all&per_page=50`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const list = await res.json();
      return list.map((pr) => ({
        githubId: pr.id,
        number: pr.number,
        title: pr.title,
        body: pr.body,
        state: pr.state,
        isDraft: pr.draft,
        sourceBranch: pr.head.ref,
        targetBranch: pr.base.ref,
        author: pr.user?.login,
        htmlUrl: pr.html_url,
        createdAt: pr.created_at,
        isGitHub: true,
      }));
    } catch (err) {
      console.warn('[GitHub Service] getPullRequests fallback:', err.message);
      return [];
    }
  },

  async getReleases() {
    try {
      const res = await fetch(`${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/releases?per_page=20`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const list = await res.json();
      return list.map((r) => ({
        githubId: r.id,
        tagName: r.tag_name,
        name: r.name,
        body: r.body,
        isDraft: r.draft,
        isPrerelease: r.prerelease,
        publishedAt: r.published_at,
        htmlUrl: r.html_url,
        assets: r.assets?.map((a) => ({ name: a.name, size: a.size, downloadUrl: a.browser_download_url })),
        isGitHub: true,
      }));
    } catch (err) {
      console.warn('[GitHub Service] getReleases fallback:', err.message);
      return [];
    }
  },

  async createIssue(title, body, labels = []) {
    if (!TOKEN) {
      return { success: false, reason: 'GITHUB_TOKEN_NOT_CONFIGURED', note: 'Issue recorded locally in MySQL database.' };
    }
    try {
      const res = await fetch(`${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/issues`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title, body, labels }),
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || `HTTP ${res.status}`);
      }
      const created = await res.json();
      return { success: true, githubId: created.id, number: created.number, htmlUrl: created.html_url };
    } catch (err) {
      console.error('[GitHub Service] createIssue error:', err.message);
      return { success: false, error: err.message };
    }
  },

  async createBranch(branchName, baseBranch = 'main') {
    if (!TOKEN) {
      return { success: false, reason: 'GITHUB_TOKEN_NOT_CONFIGURED', note: 'Branch recorded locally in MySQL database.' };
    }
    try {
      // 1. Get SHA of base branch
      const refRes = await fetch(`${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/git/ref/heads/${baseBranch}`, {
        headers: getHeaders(),
      });
      if (!refRes.ok) throw new Error(`Could not find base branch '${baseBranch}'`);
      const refData = await refRes.json();
      const baseSha = refData.object.sha;

      // 2. Create new branch ref
      const createRes = await fetch(`${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/git/refs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: baseSha,
        }),
      });
      if (!createRes.ok) {
        const errJson = await createRes.json();
        throw new Error(errJson.message || `HTTP ${createRes.status}`);
      }
      const created = await createRes.json();
      return { success: true, ref: created.ref, sha: baseSha };
    } catch (err) {
      console.error('[GitHub Service] createBranch error:', err.message);
      return { success: false, error: err.message };
    }
  },

  async createPullRequest(title, body, head, base = 'main') {
    if (!TOKEN) {
      return { success: false, reason: 'GITHUB_TOKEN_NOT_CONFIGURED', note: 'Pull request recorded locally in MySQL database.' };
    }
    try {
      const res = await fetch(`${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/pulls`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title, body, head, base }),
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || `HTTP ${res.status}`);
      }
      const created = await res.json();
      return { success: true, githubId: created.id, number: created.number, htmlUrl: created.html_url };
    } catch (err) {
      console.error('[GitHub Service] createPullRequest error:', err.message);
      return { success: false, error: err.message };
    }
  },

  async createRelease(tagName, name, body) {
    if (!TOKEN) {
      return { success: false, reason: 'GITHUB_TOKEN_NOT_CONFIGURED', note: 'Release recorded locally in MySQL database.' };
    }
    try {
      const res = await fetch(`${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/releases`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ tag_name: tagName, name, body, draft: false, prerelease: false }),
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || `HTTP ${res.status}`);
      }
      const created = await res.json();
      return { success: true, githubId: created.id, htmlUrl: created.html_url, tagName: created.tag_name };
    } catch (err) {
      console.error('[GitHub Service] createRelease error:', err.message);
      return { success: false, error: err.message };
    }
  },
};
