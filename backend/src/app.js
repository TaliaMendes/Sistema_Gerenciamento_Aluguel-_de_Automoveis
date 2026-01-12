import 'dotenv/config';
import express from 'express';

import { initModels } from './models/initModels.js'
import veiculoRoutes from './routes/Veiculo.routes.js';
import usuarioRoutes from './routes/Usuario.routes.js';
import reservasRoutes from './routes/Reserva.routes.js';
import multasRoutes from './routes/Multa.routes.js';

const app = express();
app.use(express.json());

initModels();
console.log('Banco inicializado e tabelas criadas.');

//Rotas 
app.use(veiculoRoutes);
app.use(usuarioRoutes);
app.use(reservasRoutes);
app.use(multasRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));