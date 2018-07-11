import { Router, Request, Response } from 'express';

class SecureRoutes {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes(): void {
        this.router.get("/", (req: Request, res: Response) => {
            res.json({
                message: "This route is secure"
            });
        });
    }
}

export default new SecureRoutes().router;