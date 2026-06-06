#!/bin/bash

# Setup script for FoundryVTT Module Template
# Run this after creating a new repository from the template

set -e

echo "🚀 Setting up FoundryVTT Module..."

# Get the repository name (assuming we're in the repo directory)
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")

# Get GitHub repository description
REPO_OWNER=$(git config --get remote.origin.url | sed -E 's/.*github\.com[:/]([^/]+)\/.*/\1/')
echo "🔍 Repository Owner: $REPO_OWNER"
echo "🔍 Repository Name: $REPO_NAME"

if [ -n "$REPO_OWNER" ] && [ -n "$REPO_NAME" ] && [ "$REPO_OWNER" != "$REPO_NAME" ]; then
  # Try to get description from GitHub API
  echo "🌐 Fetching description from GitHub API..."
  API_RESPONSE=$(curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME")
  
  # Check if the API call was successful
  if echo "$API_RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
    echo "⚠️  GitHub API returned an error (repository may be private or not found)"
    echo "💡 Please enter a description for your module:"
    read -p "Description: " REPO_DESCRIPTION
    if [ -z "$REPO_DESCRIPTION" ]; then
      REPO_DESCRIPTION="A FoundryVTT module"
    fi
  else
    REPO_DESCRIPTION=$(echo "$API_RESPONSE" | jq -r '.description // empty' 2>/dev/null || echo "")
    
    if [ -z "$REPO_DESCRIPTION" ] || [ "$REPO_DESCRIPTION" = "null" ]; then
      echo "⚠️  Repository has no description set"
      echo "💡 Please enter a description for your module:"
      read -p "Description: " REPO_DESCRIPTION
      if [ -z "$REPO_DESCRIPTION" ]; then
        REPO_DESCRIPTION="A FoundryVTT module"
      fi
    else
      echo "✅ Successfully fetched description from GitHub: $REPO_DESCRIPTION"
    fi
  fi
else
  echo "⚠️  Could not determine repository owner, using fallback"
  REPO_DESCRIPTION="A FoundryVTT module"
fi

# Generate module variables
MODULE_ID="$REPO_NAME"
MODULE_TITLE=$(echo "$MODULE_ID" | sed 's/[-_]/ /g' | awk '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1)) tolower(substr($i,2))}}1')
MODULE_LOG_PREFIX=$(echo "$MODULE_TITLE" | grep -oE '\b\w' | tr -d '\n' | tr 'a-z' 'A-Z')
MODULE_CODE=$(echo "$MODULE_ID" | sed 's/[^a-zA-Z0-9]//g' | cut -c1-3 | tr 'a-z' 'A-Z')

echo "📝 Module ID: $MODULE_ID"
echo "📝 Module Title: $MODULE_TITLE"
echo "📝 Module Description: $REPO_DESCRIPTION"
echo "📝 Module Log Prefix: $MODULE_LOG_PREFIX"
echo "📝 Module Code: $MODULE_CODE"

# Replace placeholders in files
echo "🔄 Replacing placeholders..."

# Find and replace in all relevant files
find . -type f \( -name "*.json" -o -name "*.mjs" -o -name "*.ts" -o -name "*.js" -o -name "*.svelte" \) -not -path "./node_modules/*" -not -path "./.git/*" -print0 | while IFS= read -r -d $'\0' file; do
  if [ -f "$file" ]; then
    sed -i.bak "s#<MODULE_ID>#$MODULE_ID#g" "$file"
    sed -i.bak "s#<MODULE_TITLE>#$MODULE_TITLE#g" "$file"
    sed -i.bak "s#<MODULE_LOG_PREFIX>#$MODULE_LOG_PREFIX#g" "$file"
    sed -i.bak "s#<MODULE_CODE>#$MODULE_CODE#g" "$file"
    sed -i.bak "s#<MODULE_DESCRIPTION>#$REPO_DESCRIPTION#g" "$file"
    # Also handle GitHub template variables
    sed -i.bak "s#\${{MODULE_ID}}#$MODULE_ID#g" "$file"
    sed -i.bak "s#\${{MODULE_TITLE}}#$MODULE_TITLE#g" "$file"
    sed -i.bak "s#\${{MODULE_DESCRIPTION}}#$REPO_DESCRIPTION#g" "$file"
    sed -i.bak "s#\${{REPOSITORY_OWNER}}#geoidesic#g" "$file"
    rm -f "$file.bak"
  fi
done

# Update README.md with repository description
echo "📝 Updating README.md..."
cat > README.md << EOF
# $MODULE_TITLE

$REPO_DESCRIPTION

## Installation

1. Download the module from the [latest release](https://github.com/$REPO_OWNER/$REPO_NAME/releases/latest)
2. Extract the zip file to your FoundryVTT `Data/modules` directory
3. Restart FoundryVTT
4. Enable the module in your world settings

## Development

This module is built using the TyphonJS framework with Svelte.

### Prerequisites

- Node.js 18+ 
- Bun (recommended) or npm

### Setup

\`\`\`bash
# Install dependencies
bun install

# Start development server
bun run dev
\`\`\`

### Building

\`\`\`bash
# Build for production
bun run build
\`\`\`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
EOF

# Remove this setup script
rm -f setup.sh

echo "✅ Setup complete! Your module is ready to go."
echo "📦 Run 'bun install' to install dependencies"
echo "🔧 Run 'bun run dev' to start development"
