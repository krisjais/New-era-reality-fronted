const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/admin/AdminDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Import APP_CONFIG
content = content.replace(
  "import { useAppStore } from '@/lib/store'",
  "import { useAppStore } from '@/lib/store'\nimport { APP_CONFIG } from '@/lib/config'"
);

// Add getAuthToken helper
content = content.replace(
  "const CHART_COLORS = ['#C9A84C', '#2563eb', '#60a5fa', '#1d4ed8', '#C9A84C']",
  "const CHART_COLORS = ['#C9A84C', '#2563eb', '#60a5fa', '#1d4ed8', '#C9A84C']\n\nfunction getAuthToken() {\n  if (typeof document === 'undefined') return '';\n  return document.cookie.split('; ').find(row => row.startsWith('admin_token='))?.split('=')[1] || '';\n}\n\nconst authHeaders = () => ({\n  'Content-Type': 'application/json',\n  'Authorization': `Bearer ${getAuthToken()}`\n});"
);

// Replace fetch URL pattern
content = content.replace(
  /\`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'https:\/\/new-era-reality-backend\.onrender\.com\/api'\}\/([^\`]*)\`/g,
  "\`${APP_CONFIG.API_URL}/$1\`"
);

// Update fetch options to include auth headers
content = content.replace(
  /fetch\(`\$\{APP_CONFIG\.API_URL\}\/([^`]*)`\)/g,
  "fetch(`${APP_CONFIG.API_URL}/$1`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })"
);

// We need to also add headers to fetch calls that already have an options object
content = content.replace(
  /fetch\(([^,]+),\s*\{\s*method:\s*'([^']+)'\s*\}\s*\)/g,
  "fetch($1, { method: '$2', headers: { 'Authorization': `Bearer ${getAuthToken()}` } })"
);

content = content.replace(
  /fetch\(([^,]+),\s*\{\s*method:\s*'([^']+)',\s*headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\}\s*,\s*body:/g,
  "fetch($1, { method: '$2', headers: authHeaders(), body:"
);

// Remove AdminLogin component
content = content.replace(/\/\/ Login Screen[\s\S]*?\/\/ Dashboard Overview/, "// Dashboard Overview");

// Update main component
content = content.replace(
  "  if (!isAdminAuthenticated) {\n    return <AdminLogin />\n  }",
  ""
);

content = content.replace(
  "              onClick={() => { setAdminAuth(false); router.push('/') }}",
  "              onClick={() => { document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; window.location.href = '/' }}"
);
content = content.replace(
  "                    onClick={() => { setAdminAuth(false); router.push('/') }}",
  "                    onClick={() => { document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; window.location.href = '/' }}"
);


fs.writeFileSync(filePath, content);
console.log("Refactored AdminDashboard.tsx successfully.");
