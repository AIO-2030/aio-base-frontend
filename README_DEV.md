# Git Repository Management Guide

This project is maintained in two Git repositories:
- Primary repository (origin): `git@github.com:yangsenessa/aio-base-frontend.git`
- Secondary repository (upstream): `git@github.com:yangsenessa/open-collab-space.git`

## Initial Setup

1. Clone the repository:
   ```bash
   git clone git@github.com:yangsenessa/aio-base-frontend.git
   cd aio-base-frontend
   ```

2. Add the secondary repository as upstream:
   ```bash
   git remote add upstream git@github.com:yangsenessa/open-collab-space.git
   ```

3. Verify your remotes:
   ```bash
   git remote -v
   ```

## Daily Workflow

### Pulling Latest Changes

To get the latest changes from the upstream repository:

```bash
./pull-all.sh
```

This script will:
- Fetch the latest changes from the upstream repository
- Merge them into your current branch

### Pushing Your Changes

After making and committing your changes, push to both repositories:

```bash
./push-all.sh
```

## Handling Merge Conflicts

If you encounter merge conflicts when pulling:

1. Resolve the conflicts in your code editor
2. Add the resolved files:
   ```bash
   git add <conflicted-files>
   ```
3. Complete the merge:
   ```bash
   git commit
   ```

## Best Practices

1. Always pull the latest changes before starting new work
2. Make small, focused commits with clear messages
3. Push regularly to both repositories to keep them in sync
4. Create feature branches for new functionality

## Manual Git Commands

If you need to perform operations manually:

- Pull from upstream:
  ```bash
  git fetch upstream
  git merge upstream/main  # or your current branch
  ```

- Push to both repositories:
  ```bash
  git push origin <branch-name>
  git push upstream <branch-name>
  ```

- Check current branch:
  ```bash
  git branch --show-current
  ```

- Switch to another branch:
  ```bash
  git checkout <branch-name>
  ```

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/26893e44-de51-4733-b512-79866afeb882

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/26893e44-de51-4733-b512-79866afeb882) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/26893e44-de51-4733-b512-79866afeb882) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)


