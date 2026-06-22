const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL || 'http://localhost:8080';
const target = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');

const content = `export const environment = {\n  production: true,\n  apiUrl: '${apiUrl}'\n};\n`;

fs.writeFileSync(target, content);
console.log('Wrote', target, 'with API_URL=' + apiUrl);
