# Team Setup Guide - Fixing Repository Access Issues

## Problem Overview

If a team member created a repository and other team members cannot push code to it, this is typically because:

1. The repository was created under a **personal account** instead of the **organization account**
2. The team doesn't have **write access** to the repository
3. Repository permissions are not configured correctly

## Solution: Proper Repository Setup

Follow these steps to ensure all team members can collaborate on repositories.

### Option 1: Create New Repository Under Organization (Recommended)

This is the best approach for new repositories:

1. **Create Repository Under Organization**
   - Go to GitHub and click on your profile icon (top right)
   - Select the **Global-Research-Trends** organization (not your personal account)
   - Click the **"New"** button or go to `https://github.com/organizations/Global-Research-Trends/repositories/new`
   - Fill in repository details:
     - Repository name
     - Description
     - Public or Private
   - Click **"Create repository"**

2. **Grant Team Access to Repository**
   - Go to the repository settings: `https://github.com/Global-Research-Trends/[repository-name]/settings`
   - Click **"Collaborators and teams"** in the left sidebar
   - Click **"Add teams"**
   - Search for your team (e.g., "interns")
   - Select the appropriate permission level:
     - **Read**: Can view and clone
     - **Triage**: Can manage issues and pull requests
     - **Write**: Can push to repository (✓ Required for pushing code)
     - **Maintain**: Can manage repository without access to sensitive actions
     - **Admin**: Full access
   - Click **"Add team"**

3. **Verify Access**
   - Team members should now be able to:
     ```bash
     git clone https://github.com/Global-Research-Trends/[repository-name].git
     cd [repository-name]
     # Make changes
     git add .
     git commit -m "Test commit"
     git push origin main
     ```

### Option 2: Transfer Existing Repository to Organization

If a repository was already created under a personal account:

1. **Transfer Repository Ownership**
   - Go to the repository settings: `https://github.com/[username]/[repository-name]/settings`
   - Scroll to the bottom to **"Danger Zone"**
   - Click **"Transfer ownership"**
   - Enter the organization name: **Global-Research-Trends**
   - Enter the repository name to confirm
   - Click **"I understand, transfer this repository"**

2. **Grant Team Access** (follow steps from Option 1, step 2)

### Option 3: Add Team as Collaborators to Existing Personal Repository

If transferring isn't an option:

1. **Add Team as Collaborators**
   - Go to repository settings: `https://github.com/[username]/[repository-name]/settings`
   - Click **"Collaborators and teams"** (or just "Collaborators" for personal repos)
   - Click **"Add people"**
   - Add each team member individually with **write** access
   - OR add the team if the repository is under the organization

**Note:** This approach is less ideal because:
- Team members must be added individually
- Repository isn't centrally managed under the organization
- Harder to maintain as team changes

## Team Permission Levels Explained

| Permission | Can View | Can Clone | Can Push | Can Manage Issues/PRs | Can Manage Settings |
|------------|----------|-----------|----------|----------------------|---------------------|
| Read       | ✓        | ✓         | ✗        | ✗                    | ✗                   |
| Triage     | ✓        | ✓         | ✗        | ✓                    | ✗                   |
| Write      | ✓        | ✓         | ✓        | ✓                    | ✗                   |
| Maintain   | ✓        | ✓         | ✓        | ✓                    | ✓ (limited)         |
| Admin      | ✓        | ✓         | ✓        | ✓                    | ✓                   |

**For pushing code, team members need at least "Write" permission.**

## Configuring Default Team Permissions

Organization admins can configure default permissions for teams:

1. Go to organization settings: `https://github.com/organizations/Global-Research-Trends/settings/profile`
2. Click **"Teams"** in the left sidebar
3. Click on your team (e.g., "interns")
4. Configure team settings:
   - **Team visibility**: Visible or Secret
   - **Default repository permission**: Set to "Write" for development teams

## Best Practices

1. ✓ **Always create repositories under the organization**, not personal accounts
2. ✓ **Grant team access immediately** after creating a repository
3. ✓ **Use team permissions** instead of individual collaborators
4. ✓ **Set meaningful team names** (e.g., "interns", "developers", "reviewers")
5. ✓ **Document repository purpose** in README files
6. ✓ **Use branch protection rules** for important branches (main/master)

## Troubleshooting

### Error: "Permission denied (publickey)"
- Check your SSH keys are configured: `ssh -T git@github.com`
- Or use HTTPS instead: `git clone https://github.com/...`

### Error: "remote: Permission to ... denied to [username]"
- You don't have write access to the repository
- Ask repository owner or org admin to grant your team write access
- Follow the steps in this guide to add team access

### Error: "Protected branch update failed"
- The branch has protection rules
- You may need to create a pull request instead of pushing directly
- Contact repository admin to adjust branch protection rules

## Quick Commands Reference

```bash
# Check current remote URL
git remote -v

# Change remote URL to organization repository
git remote set-url origin https://github.com/Global-Research-Trends/[repository-name].git

# Verify you can authenticate
git ls-remote

# Push changes
git push origin main
```

## Getting Help

If you're still having issues:
1. Verify you're a member of the team in the organization
2. Verify the team has write access to the repository
3. Check with your organization admin
4. Open an issue in this B2B_community repository with details about the error

---

**Remember:** Always create repositories under the **Global-Research-Trends** organization and grant your team write access to ensure smooth collaboration! 🚀
