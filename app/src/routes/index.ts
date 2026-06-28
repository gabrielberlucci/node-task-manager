import { Router } from 'express';
import { cpuRouter } from './cpu.route';

const routes: Router = Router();

routes.use('/api/v1/cpu', cpuRouter);

export { routes };
