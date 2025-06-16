import * as cheerio from 'cheerio';
import axios from 'axios';

export async function getNewsContent(articleUrl) {
    try {
        const url = articleUrl
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);
        let content = '';
    
        $("article > div > div > p").map((i, ele) => {
            const text = $(ele).text().trim();
            content +=  text + ' ';
        })

        return content
    } catch (err) {
        console.error('Error fetching BBC Sport page:', err.message);
        return [];
    }
}

export async function getPlayerArticles(playerName) {
    const url = `https://www.bbc.co.uk/search?q=${playerName}&d=SEARCH_PS&page=1`;
    try {
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);
        const titles = [];

        $('a > span ').each((_, ele) => {
            const text = $(ele).text().trim();
            const href = ele.parent.attribs.href
            if (text.toLowerCase().includes(playerName)) {
                //console.log([text, href])
                titles.push([text, href]);
            }
        });

        return [...new Set(titles)]; // 중복 x  제거
    } catch (err) {
        console.error('Error fetching BBC Sport page:', err.message);
        return [];
    }
}