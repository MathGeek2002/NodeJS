import express from 'express';
import { router as questionsRouter } from './questions/index.js'
import formidableMiddleware from 'express-formidable';
import { ensureLoggedIn } from 'connect-ensure-login';
import auth from "./auth.js"
import cookieParser from 'cookie-parser';
import session from 'express-session';

const port = 8080;
const app = express();

app.use('/', express.static('public'));
app.use('/images', express.static('public/images'));
app.use(formidableMiddleware({ encoding: 'utf-8', uploadDir: './public'}));

app.set('view engine', 'pug'); 
app.set('views', './views');

app.use(session(
  {
    secret: 'super secret',
    resave: true,
    saveUninitialized: true
  }
));

app.use(cookieParser('secretCode'));

app.use((req, resp, next) => {req.body = req.fields; next()}, (req, resp, next)=>{ next(); });

auth(app);

app.use('/', ensureLoggedIn('/login.html'), questionsRouter);
app.use('/questions', questionsRouter);

app.get('/', (req, res) => res.redirect('questions'));
app.get('/new', (req, res) => res.redirect('questions/new'));

app.listen(port, () => {
  console.log(`Server pod adresem http://localhost:${port}`);
});