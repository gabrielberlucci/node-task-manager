import { cpuController } from '@/controllers';
import { cpuUptimeController } from '@/controllers/cpu.controller';
import { Router } from 'express';

const cpuRouter: Router = Router();

cpuRouter.get('/static-info', cpuController);
cpuRouter.get('/uptime', cpuUptimeController);

export { cpuRouter };
