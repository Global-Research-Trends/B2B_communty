# Repository Access Troubleshooting Flowchart

```
┌─────────────────────────────────────────┐
│  Team member can't push to repository   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Is repo under organization?            │
│  (Global-Research-Trends/repo-name)     │
└──────┬──────────────────────┬───────────┘
       │ NO                   │ YES
       │                      │
       ▼                      ▼
┌──────────────┐     ┌────────────────────┐
│ TRANSFER     │     │ Check team access  │
│ Repository   │     │ to repository      │
│ to Org       │     └─────┬──────────────┘
└──────┬───────┘           │
       │                   ▼
       │            ┌──────────────────────┐
       │            │ Does team have       │
       │            │ WRITE access?        │
       │            └─┬─────────────┬──────┘
       │              │ NO          │ YES
       │              │             │
       ▼              ▼             ▼
┌──────────────┐  ┌──────────┐  ┌────────────────┐
│ Grant team   │  │ Add team │  │ Check team     │
│ write access │  │ to repo  │  │ membership     │
│ to repo      │  │ w/ write │  │                │
└──────┬───────┘  └────┬─────┘  └────┬───────────┘
       │               │              │
       │               │              ▼
       │               │        ┌─────────────────┐
       │               │        │ Is user in team?│
       │               │        └─┬──────────┬────┘
       │               │          │ NO       │ YES
       │               │          │          │
       │               │          ▼          ▼
       │               │    ┌─────────┐  ┌────────┐
       │               │    │ Add     │  │ Issue  │
       │               │    │ user to │  │ should │
       │               │    │ team    │  │ be     │
       │               │    └────┬────┘  │ fixed! │
       │               │         │       └────────┘
       └───────────────┴─────────┴───────────┘
                       │
                       ▼
              ┌────────────────┐
              │ TEST ACCESS    │
              │ git push       │
              └────────────────┘
```

## Decision Tree

### 1. Repository Location
**Question:** Where is the repository?
- Personal account (`github.com/username/repo`) → **Transfer to org**
- Organization account (`github.com/Global-Research-Trends/repo`) → **Continue to step 2**

### 2. Team Access
**Question:** Does the team have access to the repository?
- No → **Add team to repository**
- Yes → **Continue to step 3**

### 3. Permission Level
**Question:** Does the team have WRITE permission?
- No (Read/Triage) → **Change permission to Write**
- Yes → **Continue to step 4**

### 4. Team Membership
**Question:** Is the user a member of the team?
- No → **Add user to team**
- Yes → **Contact support (unusual case)**

## Quick Reference

| Issue | Solution | File Reference |
|-------|----------|---------------|
| Can't push to repo | Follow flowchart above | [QUICK_FIX.md](QUICK_FIX.md) |
| Need detailed steps | Read full guide | [TEAM_SETUP.md](TEAM_SETUP.md) |
| Admin troubleshooting | Use checklist | [ADMIN_CHECKLIST.md](ADMIN_CHECKLIST.md) |
| Team collaboration | Read guidelines | [CONTRIBUTING.md](CONTRIBUTING.md) |

## Common Scenarios

### Scenario A: Repo Created Under Personal Account
```
Problem: github.com/alice/project-x
Solution: Transfer to github.com/Global-Research-Trends/project-x
Then: Grant team write access
```

### Scenario B: Team Has No Access
```
Problem: Team not listed in repo's "Collaborators and teams"
Solution: Add team with write permission
```

### Scenario C: Team Has Read-Only Access
```
Problem: Team has "Read" permission
Solution: Change to "Write" permission
```

### Scenario D: User Not in Team
```
Problem: User tries to push but isn't team member
Solution: Add user to team
```

## Step-by-Step Resolution

1. **Identify** - What's the repo URL? Who can't push?
2. **Diagnose** - Follow the flowchart above
3. **Fix** - Apply the appropriate solution
4. **Verify** - Test with `git push`
5. **Document** - Record resolution for future reference

---

**See also:**
- [README.md](README.md) - Main documentation entry point
- [ADMIN_GUIDE.md](ADMIN_GUIDE.md) - Complete admin guide
