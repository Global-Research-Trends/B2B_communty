# Contributing to B2B Community Projects

Thank you for contributing to our B2B Community! This guide will help you collaborate effectively with your team.

## Getting Started

1. **Ensure you have access**
   - Verify you're a member of the organization team
   - If you can't push code, see [TEAM_SETUP.md](TEAM_SETUP.md)

2. **Clone the repository**
   ```bash
   git clone https://github.com/Global-Research-Trends/[repository-name].git
   cd [repository-name]
   ```

3. **Set up your development environment**
   - Follow any setup instructions in the project's README
   - Install required dependencies

## Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - for new features
- `fix/` - for bug fixes
- `docs/` - for documentation changes
- `refactor/` - for code refactoring

### 2. Make Your Changes

- Write clean, readable code
- Follow the project's coding standards
- Comment complex logic
- Keep commits focused and atomic

### 3. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "Add user authentication feature"
```

Good commit message examples:
- ✓ "Add user login endpoint with JWT authentication"
- ✓ "Fix pagination bug in user list API"
- ✓ "Update README with setup instructions"
- ✗ "fix bug" (too vague)
- ✗ "changes" (not descriptive)

### 4. Push Your Branch

```bash
git push origin feature/your-feature-name
```

If you encounter permission errors, see [TEAM_SETUP.md](TEAM_SETUP.md).

### 5. Create a Pull Request

1. Go to the repository on GitHub
2. Click **"Pull requests"** → **"New pull request"**
3. Select your branch to merge into `main`
4. Fill in the PR template:
   - **Title**: Brief description of changes
   - **Description**: Detailed explanation of what and why
   - **Related issues**: Link any related issues
5. Request review from team members
6. Address any review comments

### 6. After Merge

Clean up your local branches:

```bash
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

## Code Review Guidelines

### As an Author

- Keep PRs focused and reasonably sized
- Write clear PR descriptions
- Respond to review comments promptly
- Be open to feedback

### As a Reviewer

- Be constructive and respectful
- Explain the reasoning behind suggestions
- Approve when satisfied with changes
- Test the changes if possible

## Collaboration Best Practices

### Communication

- **Ask questions** - No question is too small
- **Share progress** - Keep team updated on your work
- **Report blockers** - Speak up if you're stuck
- **Help teammates** - Review PRs, answer questions

### Code Quality

- **Test your changes** - Ensure code works before pushing
- **Write tests** - Add unit/integration tests when appropriate
- **Document code** - Add comments for complex logic
- **Follow standards** - Maintain consistency with existing code

### Git Best Practices

1. **Pull frequently**
   ```bash
   git pull origin main
   ```
   Stay up-to-date with team changes

2. **Commit often**
   - Make small, logical commits
   - Each commit should represent a complete thought

3. **Write good messages**
   - Present tense: "Add feature" not "Added feature"
   - Imperative mood: "Fix bug" not "Fixes bug"
   - Be specific about what changed

4. **Keep branches updated**
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/your-branch
   git merge main
   ```

## Common Issues and Solutions

### Issue: Can't push to repository

**Solution:** Check [TEAM_SETUP.md](TEAM_SETUP.md) for permission setup

### Issue: Merge conflicts

**Solution:**
```bash
git checkout main
git pull origin main
git checkout your-branch
git merge main
# Resolve conflicts in your editor
git add .
git commit -m "Resolve merge conflicts"
git push origin your-branch
```

### Issue: Accidentally committed to wrong branch

**Solution:**
```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Switch to correct branch
git checkout correct-branch

# Commit changes
git add .
git commit -m "Your message"
```

### Issue: Need to undo last commit

**Solution:**
```bash
# Undo last commit and discard changes
git reset --hard HEAD~1

# Undo last commit but keep changes
git reset --soft HEAD~1
```

## Project-Specific Guidelines

(Add project-specific guidelines here as needed)

- Coding standards
- Testing requirements
- Documentation expectations
- Deployment procedures

## Getting Help

- **Technical Issues**: Open an issue in the repository
- **Access Issues**: See [TEAM_SETUP.md](TEAM_SETUP.md) or contact your team lead
- **Process Questions**: Ask in team chat or standup meetings
- **Code Questions**: Ask in PR comments or team discussions

## Resources

- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Markdown Guide](https://www.markdownguide.org/)

---

Happy coding! 🚀 Remember: we're a team, and we're here to help each other succeed.
