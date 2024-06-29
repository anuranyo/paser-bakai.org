const fs = require('fs').promises;
const path = require('path');

const tempDir = path.join(__dirname, 'temp');

async function cleanup() {
    try {
        await fs.rm(tempDir, { recursive: true, force: true });
        console.log(`Temporary directory ${tempDir} deleted`);
    } catch (error) {
        console.error(`Failed to delete temporary directory ${tempDir}:`, error);
    }
}

cleanup();
 