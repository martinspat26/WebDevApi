const PORT = process.env.PORT || 8000
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const webpages = [
    {
        name: 'eurogamer',
        adress: 'https://www.eurogamer.net/authors/1460',
        base:'http://www.eurogamer.net',
    },
    {
        name: 'steam',
        adress: 'https://store.steampowered.com/app/739630/Phasmophobia/',
        base: '',
    },
    {
        name: 'gamesradar',
        adress: 'https://www.gamesradar.com/uk/search/?searchTerm=phasmophobia',
        base: '',
    }
]

webpages.forEach(webpage => {
    axios.get(webpage.adress)
    .then(reponse => {
        const html = reponse.data
        const $ = cheerio.load(html)

        $('a:contains("update")', html).each(function (){
            const title = $(this).text()
            const url = $(this).attr('href')

            articles.push({
                title,
                url: webpage.base + url,
                source: webpage.name
            })
        })
    })
})
const articles = []


app.get('/', (req, res) => {
    res.json('Welcome to my phasmophobia updates API. De forma a poder testar a API na sua totalidade, devera acrescentar os seguintes endpoints: Para ver todas as informaçoes das várias páginas web acerca de updates:/news Se quiser obter informação de websites especificos, deverá usar os seguintes endpoints:/news/eurogamer /news/steam /news/gamesradar ')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:webpageID', (req,res) => {
    const webpageID = req.params.webpageID

    const webpageAddress = webpages.filter(webpage => webpage.name == webpageID)[0].adress
    const webpageBase = webpages.filter(webpage => webpage.name== webpageID)[0].base


    axios.get(webpageAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const targetedArticles = []

            $('a:contains("update")',html).each(function (){
                const title = $(this).text()
                const url = $(this).attr('href')
                targetedArticles.push({
                    title,
                    url:webpageBase + url,
                    source: webpageID
                })
            })
            res.json(targetedArticles)
        }).catch(err => console.log(err))
})
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))