import 'dotenv/config';
import { google_strategy_callback } from "../controllers/authentication-controller.js"
import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const googleStrategyConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
};

passport.use(new GoogleStrategy(googleStrategyConfig, google_strategy_callback));

passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });
  
passport.deserializeUser(async (id, done) => {
try {
    const result = await pool.query('SELECT * FROM account WHERE user_id = $1', [id]);
    done(null, result.rows[0]);
} catch (err) {
    done(err);
}
});

export default passport;