import app from "./app";

const port: number | string = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is listening at ${port}`));