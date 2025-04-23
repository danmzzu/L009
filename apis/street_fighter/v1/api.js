const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs').promises;
const path = require('path');
const databaseDir = path.join(__dirname, 'database');
const validLanguages = ['en', 'es', 'pt'];

// Substitua 'SEU_RAPIDAPI_PROXY_SECRET' pela variável de ambiente ou sistema de segredos
const rapidAPIProxySecret = process.env.RAPIDAPI_PROXY_SECRET;

const checkRapidAPIProxySecret = (req, res, next) => {
    const proxySecret = req.headers['X-RapidAPI-Proxy-Secret'];

    if (proxySecret === rapidAPIProxySecret) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden. Request not originating from RapidAPI.' });
    }
};

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-RapidAPI-Proxy-Secret');
    next();
});

// Middleware para verificar se o diretório do banco de dados existe
const ensureDatabaseDirExists = async (req, res, next) => {
    try {
        await fs.mkdir(databaseDir, { recursive: true });
        next();
    } catch (error) {
        console.error('Error creating database directory:', error);
        res.status(500).json({ message: 'Error initializing server.' });
    }
};

app.use(ensureDatabaseDirExists);

// Aplica o middleware de verificação do Proxy Secret às rotas de personagens
app.use('/:language/characters', checkRapidAPIProxySecret);
app.use('/:language/characters/:id', checkRapidAPIProxySecret);

app.get('/:language/characters', async (req, res) => {
    const language = req.params.language;

    if (validLanguages.includes(language)) {
        const filePath = path.join(databaseDir, `${language}.json`);
        try {
            await fs.access(filePath); // Verifica se o arquivo existe
            const data = await fs.readFile(filePath, 'utf8');
            const characters = JSON.parse(data);

            const charactersWithoutImage = characters.map(({ image, ...rest }) => rest);
            res.json(charactersWithoutImage);

        } catch (error) {
            if (error.code === 'ENOENT') {
                return res.status(404).json({ message: `Language file for ${language} not found.` });
            } else if (error instanceof SyntaxError) {
                return res.status(500).json({ message: `Error parsing JSON for ${language}.` });
            } else {
                console.error(`Error reading language file for ${language}:`, error);
                return res.status(500).json({ message: `Error reading language file for ${language}.` });
            }
        }
    } else {
        return res.status(400).json({ message: 'Invalid language parameter in URL.' });
    }
});

app.get('/:language/characters/:id', async (req, res) => {
    const language = req.params.language;
    const characterId = parseInt(req.params.id);

    if (validLanguages.includes(language)) {
        const filePath = path.join(databaseDir, `${language}.json`);
        try {
            await fs.access(filePath); // Verifica se o arquivo existe
            const data = await fs.readFile(filePath, 'utf8');
            const characters = JSON.parse(data);
            const character = characters.find(char => char.id === characterId);

            if (character) {
                const { image, ...rest } = character;
                res.json(rest);
            } else {
                res.status(404).json({ message: 'Character not found' });
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                return res.status(404).json({ message: `Language file for ${language} not found.` });
            } else if (error instanceof SyntaxError) {
                return res.status(500).json({ message: `Error parsing JSON for ${language}.` });
            } else {
                console.error(`Error reading language file for ${language}:`, error);
                return res.status(500).json({ message: `Error reading language file for ${language}.` });
            }
        }
    } else {
        return res.status(400).json({ message: 'Invalid language parameter in URL.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});