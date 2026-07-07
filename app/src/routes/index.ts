import { Router } from 'express';
import { cpuRouter } from './cpu.route';
import { memoryRouter } from './memory.route';

const routes: Router = Router();

routes.use('/api/v1/cpu', cpuRouter);
routes.use('/api/v1/memory', memoryRouter);

export { routes };
