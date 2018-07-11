"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express = require("express");
const bodyParser = __importStar(require("body-parser"));
const passport = require("passport");
const mongoose = require("mongoose");
const jwt = __importStar(require("jsonwebtoken"));
const auth_1 = __importDefault(require("./Authentication/auth"));
class App {
    constructor() {
        this.app = express();
        this.auth = new auth_1.default();
        this.config();
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(passport.initialize());
        passport.use("signup", this.auth.signUp());
        passport.use("login", this.auth.login());
        passport.use("jwt", this.auth.isAuthenticate());
        this.connectDB();
        this.setupRoutes();
    }
    connectDB() {
        const mongodb_uri = process.env.MONGODB_URI || "";
        mongoose.connect(mongodb_uri, { useNewUrlParser: true });
    }
    setupRoutes() {
        this.app.get("/", (req, res) => {
            res.json({
                message: "Hello World"
            });
        });
        this.app.post("/signup", (req, res, next) => {
            passport.authenticate('signup', (err) => {
                if (err) {
                    return res.status(400).json(err);
                }
                res.json({
                    message: "Signup successful"
                });
            })(req, res, next);
        });
        this.app.post("/login", (req, res, next) => {
            passport.authenticate("login", (err, user, info) => {
                if (err) {
                    return res.status(400).json(err);
                }
                if (!user) {
                    return res.status(401).json({
                        message: info.message
                    });
                }
                const secret = process.env.JWT_SECRET || "";
                const token = jwt.sign({ _id: user._id }, secret, { expiresIn: "1d" });
                res.json({ token });
            })(req, res, next);
        });
        this.app.get("/protected", passport.authenticate("jwt", { session: false }), (req, res) => {
            res.json({
                message: "Protected route"
            });
        });
    }
}
exports.default = new App().app;
