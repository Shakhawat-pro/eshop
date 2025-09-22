# 🚀 Development Commands Cheatsheet

This file contains common commands that help during development.  
Keep it updated as you add new tools to the project.

---

## 🟦 Prisma

```bash
# Reset the database and apply all migrations
npx prisma migrate reset

# Reset database without confirmation
npx prisma migrate reset --force

# Generate Prisma client
npx prisma generate

# Push schema changes to database (without migration)
npx prisma db push

# Open Prisma Studio
npx prisma studio


---

## 🟦 NX 

```bash
# Clear Nx cache
nx reset

# Run a specific app
nx serve <app-name>

# Build a specific app
nx build <app-name>

# Run tests
nx test <app-name>

nx g @nx/next:app apps/my-new-app


# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall dependencies
rm -rf node_modules
npm install


# Discard all local changes
git reset --hard HEAD

# Revert the last commit (safe for pushed commits)
git revert HEAD

# Reset to a specific commit (dangerous, rewrites history)
git reset --hard <commit_id>

# Clean untracked files and directories
git clean -fd
