#!/bin/bash
BRANCH=$(git branch --show-current)
echo "Fetching from upstream..."
git fetch upstream

# Check if merge commit message was provided
if [ "$#" -eq 0 ]; then
    echo "Merging upstream/main into local $BRANCH..."
    git merge upstream/main
else
    echo "Merging upstream/main into local $BRANCH with message: $1"
    git merge upstream/main -m "$1"
fi

echo "Pull complete. You may now push these changes to both repositories using ./push-all.sh"
