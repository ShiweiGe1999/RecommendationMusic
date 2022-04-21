import { PassportStatic } from 'passport';
import { collections } from './server';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../.env` });

export default function configPassport(passport: PassportStatic) {
  const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
  const opts: any = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.JWT_SECRET || 'cow';
  passport.use(
    new JwtStrategy(opts, function (jwt_payload: any, done: any) {
      collections.users.findOne(
        { id: new ObjectId(jwt_payload.id) },
        function (err, user) {
          if (err) {
            return done(err, false);
          }
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
            // or you could create a new account
          }
        }
      );
    })
  );
}
