# Admin Guide - Managing Team Permissions

This guide is for organization administrators managing the Global-Research-Trends organization and team access.

## Quick Fix for Current Issue

If team members cannot push to a repository, follow these steps:

### Step 1: Verify Repository Location

Check if the repository is under the organization or a personal account:
- ✓ Correct: `https://github.com/Global-Research-Trends/[repo-name]`
- ✗ Incorrect: `https://github.com/[username]/[repo-name]`

### Step 2: Grant Team Access

1. Navigate to repository settings:
   ```
   https://github.com/Global-Research-Trends/[repo-name]/settings/access
   ```

2. Click **"Add teams"** (or **"Manage access"** → **"Add teams"**)

3. Search for the team (e.g., "interns")

4. Select **"Write"** permission level

5. Click **"Add team"**

### Step 3: Verify Team Membership

1. Go to team page:
   ```
   https://github.com/orgs/Global-Research-Trends/teams/[team-name]
   ```

2. Verify all 4 members are listed

3. Add any missing members:
   - Click **"Add a member"**
   - Search for username
   - Click **"Add [username] to [team-name]"**

## Managing Teams

### Creating a New Team

1. Go to organization settings:
   ```
   https://github.com/orgs/Global-Research-Trends/teams
   ```

2. Click **"New team"**

3. Configure:
   - **Team name**: (e.g., "interns", "developers")
   - **Description**: Purpose of the team
   - **Team visibility**: 
     - Visible: All org members can see
     - Secret: Only team members can see

4. Click **"Create team"**

### Adding Team Members

1. Navigate to team page

2. Click **"Members"** tab

3. Click **"Add a member"**

4. Enter GitHub username

5. Click **"Add [username] to [team-name]"**

### Setting Team Permissions

#### Repository-Level Permissions

Set permissions per repository:

1. Go to repository **Settings** → **Collaborators and teams**
2. Find the team
3. Change permission level:
   - **Read**: View and clone only
   - **Write**: Can push code ← **Required for development**
   - **Admin**: Full repository access

#### Organization-Level Base Permissions

Set default permissions for all repositories:

1. Go to organization **Settings** → **Member privileges**
2. Under **Base permissions**, select:
   - **No permission**: Must be granted per repo
   - **Read**: Can view all repos
   - **Write**: Can push to all repos
   - **Admin**: Full access to all repos

**Recommendation**: Set base permission to "Read" and grant "Write" per repository or per team.

## Repository Management

### Transferring Repository to Organization

If a repository was created under a personal account:

1. Have the repository owner go to:
   ```
   https://github.com/[username]/[repo-name]/settings
   ```

2. Scroll to **"Danger Zone"** → **"Transfer ownership"**

3. Enter organization name: `Global-Research-Trends`

4. Enter repository name to confirm

5. Click **"I understand, transfer this repository"**

### Setting Up New Repositories

Best practice for creating team repositories:

1. **Create under organization**:
   - Select organization from profile dropdown
   - Click **"New repository"**
   - Create repository

2. **Grant team access immediately**:
   - Go to Settings → Collaborators and teams
   - Add relevant teams with appropriate permissions

3. **Configure branch protection** (for production repos):
   - Settings → Branches
   - Add rule for `main` branch:
     - ☑ Require pull request reviews
     - ☑ Require status checks to pass
     - ☑ Restrict who can push

### Repository Templates

Create a template repository for common setups:

1. Create a repository with common files:
   - README.md template
   - .gitignore
   - LICENSE
   - CONTRIBUTING.md
   - Basic project structure

2. Go to Settings → Check **"Template repository"**

3. Team members can use: **"Use this template"** button

## Team Permission Levels

| Level      | Read | Clone | Issues/PRs | Push | Settings | Delete |
|------------|------|-------|------------|------|----------|--------|
| Read       | ✓    | ✓     | ✗          | ✗    | ✗        | ✗      |
| Triage     | ✓    | ✓     | ✓          | ✗    | ✗        | ✗      |
| Write      | ✓    | ✓     | ✓          | ✓    | ✗        | ✗      |
| Maintain   | ✓    | ✓     | ✓          | ✓    | ✓*       | ✗      |
| Admin      | ✓    | ✓     | ✓          | ✓    | ✓        | ✓      |

*Limited settings access

## Common Admin Tasks

### Audit Team Access

Regularly review team permissions:

1. List all teams:
   ```
   https://github.com/orgs/Global-Research-Trends/teams
   ```

2. For each team, check:
   - Current members
   - Repositories the team can access
   - Permission levels

### Remove Team Member

1. Go to team page
2. Click **"Members"** tab
3. Find member → Click **"..." → "Remove from team"**

### Change Team Permissions

1. Go to repository **Settings** → **Collaborators and teams**
2. Find the team
3. Use dropdown to change permission level
4. Changes take effect immediately

### Grant Individual Access (Not Recommended)

For special cases only:

1. Repository Settings → Collaborators and teams
2. Click **"Add people"**
3. Enter username
4. Select permission level

**Note**: Prefer team-based permissions for easier management.

## Security Best Practices

1. **Use teams, not individual collaborators**
   - Easier to manage as people join/leave
   - Consistent permissions across repositories

2. **Principle of least privilege**
   - Grant minimum required permissions
   - Use Read/Write, avoid Admin unless necessary

3. **Enable 2FA requirement**
   - Organization Settings → Authentication security
   - Require 2FA for all members

4. **Use branch protection**
   - Protect main/production branches
   - Require reviews before merge
   - Prevent force pushes

5. **Audit regularly**
   - Review team memberships quarterly
   - Check repository access permissions
   - Remove inactive members

## Troubleshooting

### User can't push despite being in team

1. Verify user is actually in the team (Members tab)
2. Check team has Write access to repository
3. Verify repository is under organization
4. Check branch protection rules aren't blocking
5. Ensure user is using correct authentication (SSH keys or token)

### User not receiving team notifications

1. Check team visibility (must be Visible)
2. User should check their GitHub notification settings
3. Verify user has starred/watched relevant repositories

### Can't find team in repository settings

1. Verify team exists in organization
2. Check team visibility (Secret teams have limited discoverability)
3. Ensure you have admin access to both team and repository

## Scripts and Automation

### List All Teams and Members (via gh CLI)

```bash
# List all teams
gh api orgs/Global-Research-Trends/teams

# List team members
gh api orgs/Global-Research-Trends/teams/[team-slug]/members

# List team repositories
gh api orgs/Global-Research-Trends/teams/[team-slug]/repos
```

### Bulk Add Repositories to Team

For multiple repositories, consider using GitHub CLI:

```bash
# Grant team access to repository
gh api repos/Global-Research-Trends/[repo-name]/teams/[team-slug] \
  -X PUT \
  -f permission='push'
```

## Resources

- [GitHub Teams Documentation](https://docs.github.com/en/organizations/organizing-members-into-teams)
- [Managing Team Access](https://docs.github.com/en/organizations/managing-access-to-your-organizations-repositories/managing-team-access-to-an-organization-repository)
- [Repository Permission Levels](https://docs.github.com/en/organizations/managing-access-to-your-organizations-repositories/repository-permission-levels-for-an-organization)

---

**For the current issue**: Ensure the intern team has **Write** permission on the repository in question. If the repo is under a personal account, transfer it to the organization first.
