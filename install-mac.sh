#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "========================================"
echo "  OpenClaw Dashboard - Easy Installer"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js is not installed!${NC}"
    echo ""
    echo "Please install Node.js first:"
    echo ""
    echo "Option 1 - Download from: https://nodejs.org/"
    echo "Option 2 - Using Homebrew: brew install node"
    echo ""
    echo "Then run this installer again."
    echo ""
    
    # Try to open the download page
    if command -v open &> /dev/null; then
        open "https://nodejs.org/"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://nodejs.org/"
    fi
    
    exit 1
fi

echo -e "${GREEN}[OK]${NC} Node.js found: $(node --version)"
echo ""

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo ""
    echo "----------------------------------------"
    echo "  DATABASE SETUP REQUIRED"
    echo "----------------------------------------"
    echo ""
    echo "You need a Neon database connection string."
    echo ""
    echo "1. Go to https://neon.tech and create a FREE account"
    echo "2. Create a new project"
    echo "3. Copy the connection string (starts with postgresql://)"
    echo ""
    
    read -p "Paste your DATABASE_URL here: " DATABASE_URL
    
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${RED}[ERROR] No DATABASE_URL provided. Exiting.${NC}"
        exit 1
    fi
    
    echo "DATABASE_URL=$DATABASE_URL" > .env.local
    echo ""
    echo -e "${GREEN}[OK]${NC} Created .env.local with your database URL"
fi

echo ""
echo "[STEP 1/3] Installing dependencies..."
echo "This may take a few minutes..."
echo ""
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}[ERROR] Failed to install dependencies.${NC}"
    echo "Please check your internet connection and try again."
    exit 1
fi

echo ""
echo "[STEP 2/3] Building the dashboard..."
echo ""
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}[WARNING] Build had issues, but we'll try to run anyway...${NC}"
fi

echo ""
echo "========================================"
echo "  INSTALLATION COMPLETE!"
echo "========================================"
echo ""
echo "To start the dashboard:"
echo "  ./start-dashboard.sh"
echo ""
echo "Or run manually:"
echo "  npm run dev"
echo ""
echo "The dashboard will open at http://localhost:3000"
echo ""

# Create start script
cat > start-dashboard.sh << 'EOF'
#!/bin/bash
echo "Starting OpenClaw Dashboard..."
echo ""
echo "Opening http://localhost:3000 in your browser..."

# Wait a moment then open browser
(sleep 3 && (open "http://localhost:3000" 2>/dev/null || xdg-open "http://localhost:3000" 2>/dev/null)) &

npm run dev
EOF

chmod +x start-dashboard.sh

echo -e "${GREEN}[OK]${NC} Created start-dashboard.sh for easy launching"
echo ""
