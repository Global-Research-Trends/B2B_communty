# Admin Checklist: Fixing Team Repository Access

Use this checklist to quickly resolve repository access issues.

## Issue: Team Members Cannot Push to Repository

### Investigation Phase

- [ ] Identify the repository in question
  - Repository name: _______________
  - Repository URL: _______________

- [ ] Identify who created the repository
  - Creator: _______________

- [ ] Identify who needs access
  - Team name: _______________
  - Team members affected: _______________

### Diagnosis Phase

- [ ] Check repository location
  - [ ] Repository is under organization (`Global-Research-Trends/[repo-name]`)
  - [ ] Repository is under personal account (`[username]/[repo-name]`) ← Problem!

- [ ] Check team permissions (if org repo)
  - [ ] Team exists in organization
  - [ ] Team has access to this repository
  - [ ] Team has "Write" permission (not just "Read")

- [ ] Check team membership
  - [ ] All affected users are members of the team
  - [ ] Users have accepted team invitation

### Resolution Phase

**If repository is under personal account:**
- [ ] Contact repository owner
- [ ] Ask them to transfer repository to organization
  - Settings → Danger Zone → Transfer ownership
  - Enter: `Global-Research-Trends`
- [ ] Verify transfer completed

**If repository is under organization:**
- [ ] Go to repository settings
  - URL: `https://github.com/Global-Research-Trends/[repo-name]/settings/access`
- [ ] Add team with write access
  - Click "Add teams"
  - Search for team
  - Select "Write" permission
  - Click "Add team"

**If team members are missing:**
- [ ] Go to team page
  - URL: `https://github.com/orgs/Global-Research-Trends/teams/[team-slug]`
- [ ] Add missing members
  - Click "Add a member"
  - Enter username
  - Click "Add [username] to [team-name]"

### Verification Phase

- [ ] Ask team members to test access
  ```bash
  git clone https://github.com/Global-Research-Trends/[repo-name].git
  cd [repo-name]
  git push origin main  # Should succeed
  ```

- [ ] Verify in GitHub UI
  - [ ] Team shows in repository "Collaborators and teams" section
  - [ ] Team has "Write" permission
  - [ ] All members show in team membership list

### Documentation Phase

- [ ] Document the resolution
- [ ] Update team guidelines if needed
- [ ] Consider if this indicates a training need

## Prevention Checklist

To prevent this issue in the future:

- [ ] Train team members to create repos under organization
- [ ] Set up repository templates
- [ ] Create onboarding documentation
- [ ] Establish clear repository creation process
- [ ] Review team permissions quarterly

## Common Errors and Solutions

### Error: "Permission denied (publickey)"
- User's SSH key not configured
- Solution: Use HTTPS or configure SSH keys

### Error: "remote: Permission to ... denied"
- User doesn't have write access
- Solution: Follow resolution steps above

### Error: "Protected branch update failed"
- Branch has protection rules
- Solution: Create pull request or adjust branch protection

## Resources

- [Team Setup Guide](TEAM_SETUP.md)
- [Admin Guide](ADMIN_GUIDE.md)
- [Quick Fix Guide](QUICK_FIX.md)
- [GitHub Teams Documentation](https://docs.github.com/en/organizations/organizing-members-into-teams)

---

**Date resolved:** _______________
**Resolved by:** _______________
**Resolution notes:** _______________
