"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const user_1 = require("../Models/user");
class Auth {
    signUp() {
        return new passport_local_1.Strategy({
            usernameField: "email",
            passwordField: "password",
            session: false,
            passReqToCallback: true
        }, (req, email, password, done) => __awaiter(this, void 0, void 0, function* () {
            const userData = {
                email: email.trim(),
                password: password.trim()
            };
            try {
                const newUser = new user_1.User(userData);
                yield newUser.save();
                done(null);
            }
            catch (e) {
                done(e);
            }
        }));
    }
    login() {
        return new passport_local_1.Strategy({
            usernameField: "email",
            passwordField: "password",
            session: false,
            passReqToCallback: true
        }, (req, email, password, done) => __awaiter(this, void 0, void 0, function* () {
            const userData = {
                email: email.trim(),
                password: password.trim()
            };
            try {
                const user = yield user_1.User.findOne({ email: userData.email });
                if (!user) {
                    throw "Incorrect email";
                }
                const isValidPassword = yield user.comparePassword(userData.password);
                if (!isValidPassword) {
                    throw "Incorrect password";
                }
                done(null, user);
            }
            catch (e) {
                if (e === "Incorrect email" || e === "Incorrect password") {
                    done(null, false, { message: e });
                }
                else {
                    done(e);
                }
            }
        }));
    }
    isAuthenticate() {
        return new passport_jwt_1.Strategy({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "secret"
        }, (payload, done) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(payload.sub);
                if (user) {
                    done(null, user);
                }
                else {
                    done(null, false);
                }
            }
            catch (e) {
                done(e);
            }
        }));
    }
}
exports.default = Auth;
