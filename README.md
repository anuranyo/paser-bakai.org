---

# Bakai.org Hentai Parser

## Overview

This project is designed to parse hentai content from [Bakai.org](https://bakai.org/), download images, convert them into a PDF file, and save the PDF on the server. The server is built using Node.js and Express, with auxiliary libraries like Cheerio for web scraping, Sharp for image processing, and PDFKit for generating PDF files.

## Features

- **Web Scraping**: Uses Cheerio to parse HTML content and extract image URLs.
- **Image Processing**: Converts images to PNG format using Sharp.
- **PDF Generation**: Combines images into a PDF file using PDFKit.
- **RESTful API**: Provides endpoints to process URLs and notify the user of the PDF creation.
- **Cross-Origin Resource Sharing (CORS)**: Enabled to allow cross-origin requests.
- **Error Handling**: Comprehensive error handling to manage different failure scenarios.
- **Temporary File Cleanup**: Cleans up temporary files after the PDF is created.

## Prerequisites

- Node.js (v12.x or higher)
- npm (v6.x or higher)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/anuranyo/paser-bakai.org.git
cd paser-bakai.org
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Required Directories

Ensure that the `download` and `temp` directories exist. If not, create them:

```bash
mkdir download temp
```

### 4. Run the Server

```bash
node server.js
```

By default, the server will start on port 3000.

## Usage

### 1. API Endpoint to Parse URL

To parse a URL and generate a PDF, send a POST request to `/parse-url` with a JSON body containing the URL to be parsed.

**Request:**

```json
{
    "url": "https://bakai.org/link"
}
```

**Response:**

```json
{
    "message": "PDF created",
    "file": "Generated PDF file name"
}
```

## Project Structure

- `server.js`: Main server file that handles API requests, web scraping, image processing, and PDF generation.
- `cleanup.js`: Script to clean up temporary files after PDF generation.
- `parser.js`: Client-side JavaScript file for handling form submissions and making API requests.

## Code Explanation

### `server.js`

This file sets up an Express server with two main endpoints:

- **POST /parse-url**: Accepts a URL, scrapes the page for images, processes the images, and generates a PDF.

Key parts of `server.js`:

- **fetchAndProcessURL**: Function to scrape the URL and extract image URLs.
- **convertImageToPNG**: Converts images to PNG format using Sharp.
- **addImageToPDF**: Adds images to the PDF document.
- **createPDF**: Creates the PDF document from the extracted images.
- **cleanupTempDir**: Cleans up temporary files after PDF generation.

## Troubleshooting

### Common Issues

1. **Port Already in Use**: If you encounter `EADDRINUSE` errors, ensure no other processes are using the desired port. You can change the port in `server.js` if necessary.
2. **Network Errors**: Ensure your server is running and accessible at the specified address and port.
3. **File Permissions**: Ensure the `download` and `temp` directories have the correct permissions for reading and writing files.

### Additional Help

For further assistance, please create an issue on the [GitHub repository](https://github.com/anuranyo/paser-bakai.org/issues) or contact the maintainer.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure your code follows the project's style guidelines and includes appropriate tests.

---
