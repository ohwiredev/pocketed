---
description: Automatic commit message generator and fast AI-powered commit for all current changes
---

// turbo-all

This workflow automatically stages all changes, generates a descriptive commit
message, and commits them in one go.

### Steps:

1. **Stage All Changes**: Automatically stage all modified and new files.

```bash
git add .
```

2. **Analyze Changes**: Get the diff of staged changes to understand the
   context.

```bash
git diff --cached
```

3. **Generate & Commit**: Analyze the diff and generate a professional commit
   message following
   [Conventional Commits](https://www.conventionalcommits.org/) format:
   - Use types like `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`
   - Format: `type(scope): short description`
   - Keep the subject line under 72 characters
   - Be specific and descriptive about _what_ changed and _why_
   - Then execute the commit.

```bash
git commit -m ""
```

4. **Confirm**: Report what was committed and the final commit message used.
