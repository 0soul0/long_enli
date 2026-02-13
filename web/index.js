import { execSync } from 'child_process';

// Zeabur defaults to running "node index.js"
// We redirect this to our configured start script
execSync('npm run build', { stdio: 'inherit' });
execSync('npm run start', { stdio: 'inherit' });
