import { createServer } from "http";
import express from "express";
import 'dotenv/config'
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3000

app.use('/public', express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '/public/index.html'));
});

server.listen(PORT, () => {
    console.log("Running server at: https://localhost:" + PORT)
})