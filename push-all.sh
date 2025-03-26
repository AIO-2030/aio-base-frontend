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

echo "Pushing to origin/$BRANCH..."
git push origin $BRANCH
echo "Pushing to upstream/main..."
git push upstream main
