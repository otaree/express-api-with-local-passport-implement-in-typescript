"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class SecureRoutes {
    constructor() {
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        this.router.get("/", (req, res) => {
            return res.json({
                message: "This route is secure"
            });
        });
    }
}
exports.default = new SecureRoutes().router;
