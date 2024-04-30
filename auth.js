import passport from 'passport';
import expressSession from 'express-session';
import LocalStrategy from 'passport-local';
import { createHash } from 'crypto';
import { getUserById } from './users/model.js';

export default function (app) 
{
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await getUserById({ id:id });
    if (!user) 
    {
      done('User not found');
    }
    else 
    {
      done(null, user);
    }
  });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const hash = createHash('md5').update(password).digest('hex');
      const user = await getUserById({ username:username, password: hash });
      if (!user)
      {
        done(null, false);
      }
      else
      {
        done(null, user);
      }
    }),
  );

  app.use(
    expressSession({
      secret: 'top secret', //właściwość secret używana jest do przekazania ciągu znaków, który będzie używany do podpisania pliku cookie sesji
      resave: false, //niezmienione informacje sesji nie będą zapisywane
      saveUninitialized: false, //zapobiega zapisowi nowych niezaincjowanych sesji
      cookie : {
        sameSite: 'strict',
        //secure: true 
      }
    }),
  );
  
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/login', function(req, res) 
  {
    res.render('Login');
  });

  app.post(
    '/login',
    passport.authenticate('local', { successReturnToOrRedirect: '/showAll', failureRedirect: '/login.html', keepSessionInfo: true })
  );

  app.get('/logout', (request, response, next) => {
    request.logout(function(error) 
    {
      if (error) 
      {
        return next(error); 
      }
      response.redirect('/');
    });
  });
}