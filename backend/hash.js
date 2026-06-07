// Run this script to generate proper password hashes
// node generate-hash.js

const bcrypt = require('bcryptjs');

async function generateHash() {
    const adminHash = await bcrypt.hash('admin123', 10);
    console.log('Admin password hash (password: admin123):');
    console.log(adminHash);
}

generateHash();