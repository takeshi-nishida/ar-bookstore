import express from 'express';
import path from 'path';
import request from 'request';

const pubdir = path.join(__dirname, 'public');
const app = express();

const appId = process.env.APP_ID;

app.set('port', process.env.PORT || 3000);

app.use(express.static(pubdir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const booksSearchUrl = "https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?format=json&formatVersion=2&applicationId=" + appId;

app.get('/api', (req, res, next) => {
    console.log("api accessed")
    const url = booksSearchUrl + "&sort=sales" + "&booksGenreId=000";
    request.get(url, (err, _, body) => {
        if(err){
            next(err);
        }
        else{
            res.send(body);
        }
    });
});

app.get('/image', (req, res) => {
    const url = req.query.url as string || "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4956/9784088824956.gif?_ex=200x200";
    request.get(url).pipe(res);
});

const server = app.listen(app.get('port'), () => {
    console.log('Express server running at port: ' + app.get('port'));
    console.log('APP_ID:' + appId);
});