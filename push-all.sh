#!/bin/bash
BRANCH=$(git branch --show-current)

# Check if commit message was provided
if [ "$#" -eq 0 ]; then
    echo "No commit message provided. Usage: $0 \"Your commit message\""
    exit 1
fi

# Add all changes and commit
git add .
git commit -m "$1"

# Push to origin with the current branch
echo "Pushing to origin/$BRANCH..."
git push origin $BRANCH || { echo "Push to origin/$BRANCH failed"; exit 1; }


# Determine which branch to push to upstream
# Check if upstream/main exists
if git ls-remote --heads upstream main | grep -q main; then
    UPSTREAM_BRANCH="main"
elif git ls-remote --heads upstream master | grep -q master; then
    UPSTREAM_BRANCH="master"
else
    echo "Neither 'main' nor 'master' branch found in upstream repository."
    echo "Please specify the correct branch manually or configure upstream remote."
    exit 1
fi

# Push to upstream
echo "Pushing to upstream/$UPSTREAM_BRANCH..."
git push upstream $BRANCH:$UPSTREAM_BRANCH || { echo "Push to upstream/$UPSTREAM_BRANCH failed"; exit 1; }

# Push to public with the current branch
echo "Pushing to public/$BRANCH..."
git push public $BRANCH || { echo "Push to public/$BRANCH failed"; exit 1; }
