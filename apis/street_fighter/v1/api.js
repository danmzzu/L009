const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs').promises;
const path = require('path');
const databaseDir = path.join(__dirname, 'database');
const validLanguages = ['en', 'es', 'pt'];

// http://loo9-street-fighter-api-production.up.railway.app/en/characters
// http://loo9-street-fighter-api-production.up.railway.app/pt/characters
// http://loo9-street-fighter-api-production.up.railway.app/es/characters

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/:language/characters', async (req, res) => {
    const language = req.params.language;
    let characters = [];

    if (validLanguages.includes(language)) {
        const filePath = path.join(databaseDir, `${language}.json`);
        try {
            const data = await fs.readFile(filePath, 'utf8');
            characters = JSON.parse(data);
            res.json(characters);
        } catch (error) {
            return res.status(500).json({ message: `Error reading language file for ${language}.` });
        }
    } else {
        return res.status(400).json({ message: 'Invalid language parameter in URL.' });
    }
});

app.get('/:language/characters/:id', async (req, res) => {
    const language = req.params.language;
    const characterId = parseInt(req.params.id);
    let characters = [];

    if (validLanguages.includes(language)) {
        const filePath = path.join(databaseDir, `${language}.json`);
        try {
            const data = await fs.readFile(filePath, 'utf8');
            characters = JSON.parse(data);
            const character = characters.find(char => char.id === characterId);

            if (character) {
                res.json(character);
            } else {
                res.status(404).json({ message: 'Character not found' });
            }
        } catch (error) {
            return res.status(500).json({ message: `Error reading language file for ${language}.` });
        }
    } else {
        return res.status(400).json({ message: 'Invalid language parameter in URL.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});