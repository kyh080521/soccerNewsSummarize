import express from 'express';
import bodyParser from 'body-parser';

import { newsSummarize } from './functions/openai.js';
import { getPlayerArticles } from './functions/articleCrawl.js'

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended : true}))

app.get('/transfer', async (req, res) => {
    const player = req.query.name; // 예시: 'Ronaldo'

    const headlines = await getPlayerArticles(player);
    const result = await newsSummarize(headlines)
    
    res.send(result)
});

app.listen(port, () => {
    console.log('3000!');
});
