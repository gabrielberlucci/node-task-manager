import { Router } from 'express';
import { cpuRouter } from './cpu.route';
import { memoryRouter } from './memory.route';
import { sysStreamRouter } from './stream.system.route';

const routes: Router = Router();

routes.use('/api/v1/cpu', cpuRouter);
routes.use('/api/v1/memory', memoryRouter);
routes.use('/api/v1/system', sysStreamRouter);

export { routes };
