# Quick Fix: Team Members Can't Push to Repository

## The Problem
One team member created a repository, and other team members cannot push code to it.

## The Solution (3 Steps)

### Step 1: Check Where the Repository Lives
Is the repository URL:
- ✓ `https://github.com/Global-Research-Trends/[repo-name]` (organization) - Good!
- ✗ `https://github.com/[username]/[repo-name]` (personal) - This is the problem!

### Step 2: Fix Repository Ownership (if needed)
If the repository is under a personal account:

1. Repository owner: Go to `https://github.com/[username]/[repo-name]/settings`
2. Scroll to bottom → **"Danger Zone"** → **"Transfer ownership"**
3. Enter: `Global-Research-Trends`
4. Confirm and transfer

### Step 3: Grant Team Access
1. Go to: `https://github.com/Global-Research-Trends/[repo-name]/settings/access`
2. Click **"Add teams"**
3. Search for your team (e.g., "interns")
4. Select **"Write"** permission (required for pushing code)
5. Click **"Add team"**

## Done! ✓
Team members should now be able to push code.

Test with:
```bash
git clone https://github.com/Global-Research-Trends/[repo-name].git
cd [repo-name]
# Make changes
git add .
git commit -m "Test commit"
git push origin main
```

---

**For detailed instructions, see:**
- [TEAM_SETUP.md](TEAM_SETUP.md) - Complete guide for team members
- [ADMIN_GUIDE.md](ADMIN_GUIDE.md) - Guide for organization admins
- [CONTRIBUTING.md](CONTRIBUTING.md) - Collaboration guidelines

**Still having issues?** 
- Open an issue using the [Repository Access template](.github/ISSUE_TEMPLATE/access-issue.md)
- Contact your organization admin
