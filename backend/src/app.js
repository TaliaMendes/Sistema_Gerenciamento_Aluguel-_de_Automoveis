import 'dotenv/config';
import express from 'express';

import { initModels } from './models/initModels.js'

const app = express();
app.use(express.json());

initModels();
console.log('Banco inicializado e tabelas criadas.');

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));