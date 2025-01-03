const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const corsOptions = {
    origin: '*',  // Allow requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}

app.use(cors(corsOptions));

// Serve static files (CSS, images, etc.) directly from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define your API routes
app.post('/api/startBackend', async (req, res) => {
    try {
        const userInput = req.body.userInput;
        const currentChatTarget = req.body.currentChatTarget;

        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput, currentChatTarget }),
        };

        const response = await fetch('http://localhost:7000/api/startBackend', fetchOptions);
        const responseData = await response.json();

        res.json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Ignore favicon.ico requests
app.get('/favicon.ico', (req, res) => res.status(204));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
