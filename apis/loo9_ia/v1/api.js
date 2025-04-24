const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const knowledgeBase = {
    // IA
    "como você se chama": "Eu me chamo LOO9-IA.",
    "quem criou você?": "Fui desenvolvida por Daniel Mazzeu, um programador autodidata, como um modelo de inteligência baseado em similaridade textual. Meu objetivo é responder às perguntas básicas sobre seus serviços e informações pessoais. Ainda estou em aprendizado, e as perguntas para as quais não tenho resposta são registradas para que meu criador possa me instruir.",

    // Insultos
    "você é burro?": "Burro? Eu ainda estou aprendendo, me dá um desconto!",
    "você não sabe nada": "Calma lá! Meu conhecimento está em expansão, um dia chego lá.",
    "sua resposta foi horrível": "Ouch! Anotado. Vou tentar melhorar na próxima.",
    "você é inútil": "Inútil? Mas eu tento ajudar! O que posso fazer por você agora?",
    "seu criador é ruim": "Ei, pega leve com o Daniel! Ele está se esforçando.",
    "você é lento": "Estou processando o mais rápido que consigo, a internet hoje não está ajudando muito.",
    "fala direito": "Desculpe se não fui claro. Posso tentar explicar de outra forma?",
    "que IA ruim": "Sinto muito que não tenha atendido às suas expectativas. O feedback é importante para meu desenvolvimento."
};

const randomResponses = [
    "Humm... essa me deixou pensando! Ainda não tenho a resposta.",
    "Entendi, mas essa ainda não está no meu repertório.",
    "Essa pergunta é nova para mim! Vou aprender sobre ela.",
    "Por enquanto, essa aqui passou batido no meu aprendizado.",
    "Poderia explicar um pouquinho mais o que você quer saber?",
    "Boa! Estou aprendendo cada vez mais, inclusive sobre isso.",
    "Lascou, meu criador ainda não me treinou o suficiente para responder essa questão."
];

function findBestAnswer(question) {
    const questionWords = question.toLowerCase().trim().split(/\s+/);
    let bestMatch = null;
    let maxMatchingWords = 0;

    for (const key in knowledgeBase) {
        if (knowledgeBase.hasOwnProperty(key)) {
            const keyWords = key.toLowerCase().trim().split(/\s+/);
            let matchingWords = 0;

            for (const qWord of questionWords) {
                if (keyWords.includes(qWord)) {
                    matchingWords++;
                }
            }

            if (matchingWords > maxMatchingWords) {
                maxMatchingWords = matchingWords;
                bestMatch = key;
            }
        }
    }

    if (bestMatch && maxMatchingWords > 0) {
        return knowledgeBase[bestMatch];
    } else {
        return randomResponses[Math.floor(Math.random() * randomResponses.length)];
    }
}

app.post('/', (req, res) => {
    const { question } = req.body;
    if (question) {
        const answer = findBestAnswer(question);
        res.json({ answer });
    } else {
        res.status(400).json({ error: 'The "question" query parameter is required.' });
    }
});

app.get('/', (req, res) => {
    const { question } = req.query;
    if (question) {
        const answer = findBestAnswer(question);
        res.json({ answer });
    } else {
        res.status(400).json({ error: 'The "question" query parameter is required.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});