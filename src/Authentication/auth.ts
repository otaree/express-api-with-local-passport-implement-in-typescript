import { Strategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

import { User } from '../Models/user';

class Auth {
    signUp(): Strategy {
        return new Strategy({
            usernameField: "email",
            passwordField: "password",
            session: false,
            passReqToCallback: true
        }, async (req: Request, email: string, password: string, done: Function) => {
            const userData = {
                email: email.trim(),
                password: password.trim()
            };

            try {
                const newUser  = new User(userData);
                await newUser.save();
                done(null); 
            } catch (e) {
                done(e);
            }
        });
    }

    login(): Strategy {
        return new Strategy({
            usernameField: "email",
            passwordField: "password",
            session: false,
            passReqToCallback: true
        }, async (req: Request, email: string, password: string, done: Function) => {
            const userData = {
                email: email.trim(),
                password: password.trim()
            };

            try {
                const user = await User.findOne({ email: userData.email });
                if (!user) {
                    throw "Incorrect email";
                }

                const isValidPassword: boolean = await user.comparePassword(userData.password);
                if (!isValidPassword) {
                    throw "Incorrect password";
                }

                done(null, user);
            } catch (e) {
                if (e === "Incorrect email" || e === "Incorrect password") {
                    done(null, false, { message: e });
                } else {
                    done(e);
                }
            }
        });
    }

    isAuthenticate(): JWTStrategy {
        return new JWTStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        }, async (payload, done) => {
            try {
                const user = await User.findById(payload._id);
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (e) {
                done(e);
            }
        });
    }
}

export default Auth;