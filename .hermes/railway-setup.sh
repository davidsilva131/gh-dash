#!/bin/bash
set -e
TOKEN=$(gh.exe auth token | tr -d '\r')
~/.local/bin/railway variables --set "GITHUB_TOKEN=$TOKEN"
echo "--- variables set ---"
~/.local/bin/railway variables
