import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env.js";
import { googleLoginService } from "../services/auth.service.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId,
      clientSecret: env.googleClientSecret,
      callbackURL: env.googleCallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await googleLoginService(profile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export default passport;