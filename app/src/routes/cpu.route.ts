import {
  cpuController,
  cpuUsageController,
  cpuUptimeController,
  cpuProcessesTotalController,
} from '@/controllers';
import { Router } from 'express';

const cpuRouter: Router = Router();

cpuRouter.get('/static-info', cpuController);
cpuRouter.get('/uptime', cpuUptimeController);
cpuRouter.get('/usage', cpuUsageController);
cpuRouter.get('/total-processes', cpuProcessesTotalController);

export { cpuRouter };
