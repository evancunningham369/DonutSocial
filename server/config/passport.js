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
passport.use(new LocalStrategy({usernameField: 'username', passwordField: 'password'}, login_account));

passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });
  
passport.deserializeUser(async (user, done) => {
try {
    done(null, user.userId);
} catch (err) {
    done(err);
}
});

export default passport;