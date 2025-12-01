/**
 * Setup Verification Script
 * 
 * Run this script to verify your environment is properly configured
 * Usage: node verify-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 YouTube Top Videos Search - Setup Verification\n');
console.log('═'.repeat(60));

let hasErrors = false;
let warnings = [];

// Check 1: Node version
console.log('\n📦 Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion >= 18) {
  console.log(`   ✅ Node.js ${nodeVersion} (OK)`);
} else {
  console.log(`   ❌ Node.js ${nodeVersion} (Need v18 or higher)`);
  hasErrors = true;
}

// Check 2: package.json
console.log('\n📄 Checking package.json...');
if (fs.existsSync('package.json')) {
  console.log('   ✅ package.json found');
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (pkg.dependencies && pkg.dependencies.next) {
      console.log(`   ✅ Next.js dependency found (${pkg.dependencies.next})`);
    }
  } catch (e) {
    console.log('   ⚠️  Could not parse package.json');
    warnings.push('Invalid package.json format');
  }
} else {
  console.log('   ❌ package.json not found');
  hasErrors = true;
}

// Check 3: node_modules
console.log('\n📚 Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('   ✅ node_modules folder found');
  console.log('   ℹ️  Run "npm install" if you encounter issues');
} else {
  console.log('   ⚠️  node_modules not found');
  console.log('   ℹ️  Run "npm install" to install dependencies');
  warnings.push('Dependencies not installed');
}

// Check 4: Environment file
console.log('\n🔐 Checking environment configuration...');
if (fs.existsSync('.env.local')) {
  console.log('   ✅ .env.local found');
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    if (envContent.includes('YOUTUBE_API_KEY=') && 
        !envContent.includes('YOUTUBE_API_KEY=your_') &&
        !envContent.includes('YOUTUBE_API_KEY=\n') &&
        !envContent.includes('YOUTUBE_API_KEY=\r')) {
      console.log('   ✅ YOUTUBE_API_KEY appears to be set');
    } else {
      console.log('   ⚠️  YOUTUBE_API_KEY is not configured');
      warnings.push('YouTube API key not set in .env.local');
    }
  } catch (e) {
    console.log('   ⚠️  Could not read .env.local');
    warnings.push('Could not verify environment variables');
  }
} else if (fs.existsSync('.env')) {
  console.log('   ⚠️  Using .env (should use .env.local for local development)');
  warnings.push('Use .env.local instead of .env');
} else {
  console.log('   ❌ No environment file found (.env.local)');
  console.log('   ℹ️  Copy .env.example to .env.local and add your API key');
  hasErrors = true;
}

// Check 5: Required directories
console.log('\n📁 Checking project structure...');
const requiredDirs = ['app', 'components', 'lib'];
let dirsOk = true;
for (const dir of requiredDirs) {
  if (fs.existsSync(dir)) {
    console.log(`   ✅ /${dir} exists`);
  } else {
    console.log(`   ❌ /${dir} missing`);
    hasErrors = true;
    dirsOk = false;
  }
}

// Check 6: Key files
console.log('\n📝 Checking key files...');
const requiredFiles = [
  'app/page.tsx',
  'app/api/search/route.ts',
  'lib/youtube.ts',
  'components/search-form.tsx',
  'next.config.ts',
  'tsconfig.json',
];
let filesOk = true;
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} missing`);
    hasErrors = true;
    filesOk = false;
  }
}

// Check 7: TypeScript config
console.log('\n⚙️  Checking TypeScript configuration...');
if (fs.existsSync('tsconfig.json')) {
  try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    if (tsconfig.compilerOptions && tsconfig.compilerOptions.strict) {
      console.log('   ✅ Strict mode enabled');
    } else {
      console.log('   ⚠️  Strict mode not enabled');
      warnings.push('Consider enabling TypeScript strict mode');
    }
  } catch (e) {
    console.log('   ⚠️  Could not parse tsconfig.json');
    warnings.push('Invalid tsconfig.json format');
  }
} else {
  console.log('   ❌ tsconfig.json not found');
  hasErrors = true;
}

// Check 8: Documentation
console.log('\n📖 Checking documentation...');
const docFiles = ['README.md', 'SETUP.md', 'PRIVACY.md'];
for (const doc of docFiles) {
  if (fs.existsSync(doc)) {
    console.log(`   ✅ ${doc}`);
  } else {
    console.log(`   ⚠️  ${doc} missing`);
    warnings.push(`Missing documentation: ${doc}`);
  }
}

// Summary
console.log('\n' + '═'.repeat(60));
console.log('\n📊 VERIFICATION SUMMARY\n');

if (!hasErrors && warnings.length === 0) {
  console.log('🎉 All checks passed! Your setup looks good.');
  console.log('\n📝 Next steps:');
  console.log('   1. Make sure you have a YouTube API key in .env.local');
  console.log('   2. Run: npm run dev');
  console.log('   3. Open: http://localhost:3000');
  console.log('   4. (Optional) Test API: node test-api.js');
} else {
  if (hasErrors) {
    console.log('❌ ERRORS FOUND - Please fix these issues:\n');
    console.log('   • Make sure all required files exist');
    console.log('   • Configure .env.local with your YouTube API key');
    console.log('   • Run "npm install" to install dependencies\n');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    warnings.forEach(warning => {
      console.log(`   • ${warning}`);
    });
    console.log('');
  }

  console.log('📚 For help, see:');
  console.log('   • README.md - Full documentation');
  console.log('   • SETUP.md - Quick setup guide');
}

console.log('\n' + '═'.repeat(60) + '\n');

process.exit(hasErrors ? 1 : 0);






