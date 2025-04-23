const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs').promises;
const path = require('path');
const databaseDir = path.join(__dirname, 'database');
const validLanguages = ['en', 'es', 'pt'];

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

            // Remover o campo 'image' de cada personagem antes de enviar a resposta
            const charactersWithoutImage = characters.map(character => {
                const { image, ...characterWithoutImage } = character;
                return characterWithoutImage;
            });

            res.json(charactersWithoutImage);
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
                // Remover o campo 'image' do personagem antes de enviar a resposta
                const { image, ...characterWithoutImage } = character;
                res.json(characterWithoutImage);
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