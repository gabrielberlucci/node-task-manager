import { cpuController } from '@/controllers';
import { Router } from 'express';

const cpuRouter: Router = Router();

cpuRouter.get('/', cpuController);

export { cpuRouter };
