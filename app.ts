import express from 'express';
import path from 'path';
import fetch from 'node-fetch';

const pubdir = path.join(__dirname, 'public');
const app = express();

const appId = process.env.APP_ID;
const wait = parseInt(process.env.API_WAIT || "500");

app.set('port', process.env.PORT || 3000);

app.use(express.static(pubdir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const booksSearchUrl = "https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?format=json&formatVersion=2&applicationId=" + appId;

app.get('/api', (req, res, next) => {
    let genres = ["001"];
    if(typeof req.query.genres == 'string'){
        genres = req.query.genres.split(',');
    }

    console.log("API accessed. Genres = " +  genres.join(","));

    const urls = genres.map(g => booksSearchUrl + "&sort=sales" + "&booksGenreId=" + g);

    Promise.all(genres.map((g, i) => getBooks(g, i * wait)))
    .then(results =>{
        res.send(results);
    }).catch(err => console.log(err));    
});

// Fetch book info from Rakuten Books API. Add waits to avoid too many requests error.
async function getBooks(genreId: string, wait: number){
    const url = booksSearchUrl + "&sort=sales" + "&booksGenreId=" + genreId;
    await sleep(wait);
    const result = await fetch(url);
    const json = await result.json();
    const items = json["Items"];
    return { genreId, items };
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

app.get('/image', (req, res) => {
    const url = req.query.url as string || "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4956/9784088824956.gif?_ex=200x200";
    fetch(url).then(img => { img.body.pipe(res) });
});

const server = app.listen(app.get('port'), () => {
    console.log('Express server running at port: ' + app.get('port'));
    console.log('APP_ID:' + appId);
});