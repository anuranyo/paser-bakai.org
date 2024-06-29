document.getElementById('linkForm').addEventListener('submit', handleURL);

async function handleURL(event) {
    event.preventDefault();
    const url = document.getElementById('urlInput').value;
    try {
        const response = await fetch('http://localhost:3000/parse-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        document.getElementById('message').innerText = data.message;
        document.getElementById('downloadLink').innerHTML = `<a href="http://localhost:3000/download?file=${data.file}">Download PDF</a>`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').innerText = `Error: ${error.message}`;
    }
}
