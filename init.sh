#!/bin/bash

# Init script for FoundryVTT Module Template
# Usage: ./init.sh <MODULE_ID> [DESCRIPTION]
#   MODULE_ID   - Required. The module id (e.g. foundryvtt-my-module). Used for Foundry and repo.
#   DESCRIPTION - Optional. Short description. If omitted and run in a git clone with remote, fetches from GitHub.
#
# Quick start: git clone <template-repo-url> foundryvtt-my-module && cd foundryvtt-my-module && ./init.sh foundryvtt-my-module "My description"

set -e

echo "Setting up FoundryVTT Module..."

if [ -n "$1" ]; then
  MODULE_ID="$1"
  REPO_OWNER=$(git config --get remote.origin.url 2>/dev/null | sed -E 's/.*github\.com[:/]([^/]+)\/.*/\1/' || true)
  REPO_NAME=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "")
  REPO_NAME="${REPO_NAME:-$MODULE_ID}"
  if [ -n "$2" ]; then
    REPO_DESCRIPTION="$2"
  else
    if [ -n "$REPO_OWNER" ] && [ -n "$REPO_NAME" ] && [ "$REPO_OWNER" != "$REPO_NAME" ]; then
      API_RESPONSE=$(curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "{}")
      if command -v jq >/dev/null 2>&1 && ! echo "$API_RESPONSE" | jq -e '.message' >/dev/null 2>&1; then
        REPO_DESCRIPTION=$(echo "$API_RESPONSE" | jq -r '.description // empty' 2>/dev/null || echo "")
      fi
      [ -z "$REPO_DESCRIPTION" ] || [ "$REPO_DESCRIPTION" = "null" ] && REPO_DESCRIPTION="A FoundryVTT module"
    else
      REPO_DESCRIPTION="A FoundryVTT module"
    fi
  fi
else
  REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
  MODULE_ID="$REPO_NAME"
  REPO_OWNER=$(git config --get remote.origin.url 2>/dev/null | sed -E 's/.*github\.com[:/]([^/]+)\/.*/\1/' || true)
  if [ -n "$REPO_OWNER" ] && [ -n "$REPO_NAME" ] && [ "$REPO_OWNER" != "$REPO_NAME" ]; then
    API_RESPONSE=$(curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME")
    if command -v jq >/dev/null 2>&1 && ! echo "$API_RESPONSE" | jq -e '.message' >/dev/null 2>&1; then
      REPO_DESCRIPTION=$(echo "$API_RESPONSE" | jq -r '.description // empty' 2>/dev/null || echo "")
    fi
    [ -z "$REPO_DESCRIPTION" ] || [ "$REPO_DESCRIPTION" = "null" ] && REPO_DESCRIPTION="A FoundryVTT module"
  else
    REPO_DESCRIPTION="A FoundryVTT module"
  fi
fi

MODULE_TITLE=$(echo "$MODULE_ID" | sed 's/[-_]/ /g' | awk '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1)) tolower(substr($i,2))}}1')
MODULE_LOG_PREFIX=$(echo "$MODULE_TITLE" | grep -oE '\b\w' | tr -d '\n' | tr 'a-z' 'A-Z')
MODULE_CODE=$(echo "$MODULE_ID" | sed 's/[^a-zA-Z0-9]//g' | cut -c1-3 | tr 'a-z' 'A-Z')

echo "Module ID: $MODULE_ID"
echo "Module Title: $MODULE_TITLE"
echo "Module Description: $REPO_DESCRIPTION"
echo "Module Log Prefix: $MODULE_LOG_PREFIX"
echo "Module Code: $MODULE_CODE"

echo "Replacing placeholders..."
find . -type f \( -name "*.json" -o -name "*.mjs" -o -name "*.ts" -o -name "*.js" -o -name "*.svelte" \) -not -path "./node_modules/*" -not -path "./.git/*" -print0 | while IFS= read -r -d $'\0' file; do
  if [ -f "$file" ]; then
    sed -i.bak "s#<MODULE_ID>#$MODULE_ID#g" "$file"
    sed -i.bak "s#<MODULE_TITLE>#$MODULE_TITLE#g" "$file"
    sed -i.bak "s#<MODULE_LOG_PREFIX>#$MODULE_LOG_PREFIX#g" "$file"
    sed -i.bak "s#<MODULE_CODE>#$MODULE_CODE#g" "$file"
    sed -i.bak "s#<MODULE_DESCRIPTION>#$REPO_DESCRIPTION#g" "$file"
    sed -i.bak "s#\${{MODULE_ID}}#$MODULE_ID#g" "$file"
    sed -i.bak "s#\${{MODULE_TITLE}}#$MODULE_TITLE#g" "$file"
    sed -i.bak "s#\${{MODULE_DESCRIPTION}}#$REPO_DESCRIPTION#g" "$file"
    sed -i.bak "s#\${{REPOSITORY_OWNER}}#geoidesic#g" "$file"
    rm -f "$file.bak"
  fi
done

REPO_OWNER="${REPO_OWNER:-geoidesic}"
REPO_NAME="${REPO_NAME:-$MODULE_ID}"

echo "Updating README.md..."
cat > README.md << EOF
# $MODULE_TITLE

$REPO_DESCRIPTION

## Installation

1. Download the module from the [latest release](https://github.com/$REPO_OWNER/$REPO_NAME/releases/latest)
2. Extract the zip file to your FoundryVTT \`Data/modules\` directory
3. Restart FoundryVTT
4. Enable the module in your world settings

## Development

This module is built using the TyphonJS framework with Svelte.

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm

### Setup

\`\`\`bash
bun install
bun run dev
\`\`\`

### Building

\`\`\`bash
bun run build
\`\`\`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
EOF

echo "Setup complete. Run 'bun install' then 'bun run dev' to start developing."
