const { execSync } = require('child_process');
const path = require('path');

const webDir = path.join(__dirname, 'web');

console.log(`Building web project in ${webDir}...`);
try {
    execSync('npm run build', { stdio: 'inherit', cwd: webDir });
} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
}

console.log(`Starting web project in ${webDir}...`);
try {
    execSync('npm run start', { stdio: 'inherit', cwd: webDir });
} catch (error) {
    console.error('Start failed:', error);
    process.exit(1);
}
