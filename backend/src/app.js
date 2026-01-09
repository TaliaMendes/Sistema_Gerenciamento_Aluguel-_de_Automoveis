import 'dotenv/config';
import express from 'express';

import { initModels } from './models/initModels.js'
import veiculoRoutes from './routes/Veiculo.routes.js';
import usuarioRoutes from './routes/Usuario.routes.js';

const app = express();
app.use(express.json());

initModels();
console.log('Banco inicializado e tabelas criadas.');

//Rotas 
app.use(veiculoRoutes);
app.use(usuarioRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));