const fs = require('fs').promises;
const path = require('path');

const tempDir = path.join(__dirname, 'temp');

async function cleanup() {
    try {
        console.log(`Reading temporary directory: ${tempDir}`);
        const files = await fs.readdir(tempDir);
        console.log(`Files in temp directory before cleanup: ${files}`);

        for (const file of files) {
            if (file.startsWith('temp_')) {
                const filePath = path.join(tempDir, file);
                await fs.unlink(filePath);
                console.log(`Deleted ${file}`);
            }
        }

        const remainingFiles = await fs.readdir(tempDir);
        console.log(`Files in temp directory after cleanup: ${remainingFiles}`);
    } catch (error) {
        console.error(`Failed to clean temporary directory ${tempDir}:`, error);
    }
}

cleanup();
