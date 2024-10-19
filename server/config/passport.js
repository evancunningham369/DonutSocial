import 'dotenv/config';
import { google_strategy, login_account } from "../controllers/authentication-controller.js"
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const googleStrategyConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
};

passport.use(new GoogleStrategy(googleStrategyConfig, google_strategy));
passport.use(new LocalStrategy({authorizationURL: 'http://localhost:5713/home'}, login_account));

passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });
  
passport.deserializeUser(async (userId, done) => {
try {
    const result = await pool.query('SELECT * FROM account WHERE user_id = $1', [userId]);
    done(null, result.rows[0]);
} catch (err) {
    done(err);
}
});

export default passport;