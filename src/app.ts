import * as dotenv from "dotenv";
dotenv.config();
import express = require("express");
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import passport = require("passport");
import mongoose = require('mongoose');
import * as jwt from 'jsonwebtoken';

import secureRoutes from './Routes/secure'; 
import Auth from './Authentication/auth';

class App {
    app: express.Application;
    private auth: Auth;

    constructor() {
        this.app = express();
        this.auth = new Auth();
        this.config();
    }

    config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(passport.initialize());
        passport.use("signup", this.auth.signUp());
        passport.use("login", this.auth.login());
        passport.use("jwt", this.auth.isAuthenticate());
        this.connectDB();
        this.setupRoutes();
    }

    connectDB(): void {
        const mongodb_uri: string = process.env.MONGODB_URI || "";
        mongoose.connect(mongodb_uri, { useNewUrlParser: true });
    }

    setupRoutes(): void {
        this.app.get("/", (req: Request, res: Response) => {
            res.json({
                message: "Hello World"
            });
        });
        this.app.post("/signup", (req: Request, res: Response, next: NextFunction) => {
            passport.authenticate('signup', (err) => {
                if (err) {
                    return res.status(400).json(err);
                }
        
                res.json({
                    message: "Signup successful"
                });
            })(req, res, next);
        });
        
        this.app.post("/login", (req: Request, res: Response, next: NextFunction) => {
            passport.authenticate("login", (err, user, info) => {
                if (err) {
                    return res.status(400).json(err);
                }
                if (!user) {
                    return res.status(401).json({
                        message: info.message
                    });
                } 
                const secret: string = process.env.JWT_SECRET || "";
                const token: string = jwt.sign({ _id: user._id}, secret, { expiresIn: "1d" });

                res.json({ token });
            })(req, res, next);
        });

        this.app.get("/protected", passport.authenticate("jwt", { session: false }), (req: Request, res: Response) => {
            res.json({
                message: "This is protected"
            });
        });
    }
}

export default new App().app;