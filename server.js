const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const sharp = require('sharp');
const { execFileSync } = require('child_process');

const app = express();
const PORT = 3000;

const downloadDir = path.join(__dirname, 'download');
const tempDir = path.join(__dirname, 'temp');

app.use(cors());
app.use(bodyParser.json());

app.post('/parse-url', (req, res) => {
    const url = req.body.url;
    console.log(`Received URL: ${url}`);
    fetchAndProcessURL(url)
        .then(result => res.json({ message: 'PDF created', file: result }))
        .catch(error => {
            console.error('Error processing URL:', error);
            res.status(500).json({ error: error.message });
        });
});

app.get('/download', (req, res) => {
    const file = req.query.file;
    const filePath = path.join(downloadDir, file);
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file.');
        }
    });
});

function fetchAndProcessURL(url) {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                const images = [];

                const baseUrl = 'https://bakai.org/';

                $('div.ipsType_center img').each((index, element) => {
                    let imgSrc = $(element).attr('data-src') || $(element).attr('src');
                    if (imgSrc && !imgSrc.startsWith('http')) {
                        imgSrc = new URL(imgSrc, baseUrl).href;
                    }
                    images.push(imgSrc);
                    console.log(`Image found: ${imgSrc}`);
                });

                const nameOfhentai = $('div.ipsFlex-flex\\:11 > h1.ipsType_pageTitle span.ipsType_break').text().trim();
                console.log(`Title: ${nameOfhentai}`);

                createPDF(nameOfhentai, images)
                    .then(filePath => resolve(filePath))
                    .catch(error => reject(error));
            })
            .catch(error => reject(`Error loading page: ${error}`));
    });
}

async function convertImageToPNG(imgUrl, index) {
    try {
        const response = await axios({
            url: imgUrl,
            responseType: 'arraybuffer'
        });
        const imgData = response.data;
        const imgBuffer = Buffer.from(imgData, 'binary');
        const pngBuffer = await sharp(imgBuffer).png().toBuffer();

        const tempImgPath = path.join(tempDir, `temp_image_${index}.png`);
        await sharp(pngBuffer).toFile(tempImgPath);
        console.log(`Image converted and saved as ${tempImgPath}`);

        return pngBuffer;
    } catch (error) {
        throw new Error(`Failed to convert image ${imgUrl}: ${error.message}`);
    }
}

async function addImageToPDF(doc, imgUrl, index) {
    try {
        let imgBuffer;
        if (imgUrl.endsWith('.webp')) {
            imgBuffer = await convertImageToPNG(imgUrl, index);
        } else {
            const response = await axios({
                url: imgUrl,
                responseType: 'arraybuffer'
            });
            imgBuffer = Buffer.from(response.data, 'binary');

            const tempImgPath = path.join(tempDir, `temp_image_${index}.original`);
            await fs.promises.writeFile(tempImgPath, imgBuffer);
            console.log(`Original image saved as ${tempImgPath}`);
        }

        doc.addPage().image(imgBuffer, {
            fit: [500, 750],
            align: 'center',
            valign: 'center'
        });
        console.log(`Image added: ${imgUrl}`);
    } catch (error) {
        throw new Error(`Error adding image ${imgUrl}: ${error.message}`);
    }
}

async function createPDF(nameOfhentai, images) {
    const pdfFilePath = path.join(downloadDir, `${nameOfhentai}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfFilePath);
    doc.pipe(stream);

    doc.fontSize(25).fillColor('black').text('Created by anuranyo', { align: 'center' });
    doc.fontSize(25).fillColor('black').text(nameOfhentai, { align: 'center' });
    doc.fontSize(12).fillColor('black').text('This document contains images from the specified webpage (https://bakai.org/).', 100, 200);

    try {
        for (const [index, imgUrl] of images.entries()) {
            await addImageToPDF(doc, imgUrl, index);
        }
        doc.end();

        await new Promise((resolve) => stream.on('finish', resolve));
        console.log(`PDF created and saved at: ${pdfFilePath}`);

        execFileSync('node', ['cleanup.js']);
        console.log(`Temporary directory ${tempDir} deleted`);

        return pdfFilePath;
    } catch (error) {
        execFileSync('node', ['cleanup.js']);
        console.error(`Failed to delete temporary directory ${tempDir}:`, error);
        throw error;
    }
}

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
