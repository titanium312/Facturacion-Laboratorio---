import { Router, Request, Response } from 'express';
import { generarHistoriaClinica } from './controller/ConsultaIdAdmision';
import { ConsultaIdHistoria } from './controller/historia'; // <-- Importa el nuevo controlador

const admisionRouter = Router();

// Ruta para obtener ID de Admisión
admisionRouter.post('/generarHistoriaClinica', generarHistoriaClinica);

// Ruta para obtener ID de Historia Clínica (nuevo)
admisionRouter.post('/ConsultaIdHistoria', ConsultaIdHistoria);

// Ruta de prueba
admisionRouter.get('/temp', (req: Request, res: Response) => {
  res.json({ ok: true, message: 'Ruta de prueba funcionando' });
});

export default admisionRouter;