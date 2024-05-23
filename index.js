import express from 'express';
import { privateRouter as questionsPrivate } from './questions/index.js'
import { publicRouter as questionsPublic } from './questions/index.js'
import formidableMiddleware from 'express-formidable';
import { ensureLoggedIn } from 'connect-ensure-login';
import auth from "./auth.js"
import cookieParser from 'cookie-parser';

const port = 8080;
const app = express();


app.use('/', express.static('public'));
app.use('/images', express.static('public/images'));
app.use(formidableMiddleware({ encoding: 'utf-8', uploadDir: './public'}));

app.set('view engine', 'pug'); 
app.set('views', './views');

app.use(cookieParser('secretCode'));

app.use((req, resp, next) => {req.body = req.fields; next()}, (req, resp, next) => { next(); });

auth(app);

app.use('/', questionsPublic);
app.use('/questions', ensureLoggedIn("/login"), questionsPrivate);
app.use('/questionsPublic', questionsPublic);

app.get('/', (req, res) => res.redirect('questionsPublic/quiz/0'));
app.get('/showAll', (req, res) => res.redirect('questions'));
app.get('/quiz', (req, res) => res.redirect('questionsPublic/quiz/0'));

app.listen(port, () => {
  console.log(`Server pod adresem http://localhost:${port}`);
});