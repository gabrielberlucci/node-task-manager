import { getSysInfoStreamController } from '@/controllers';
import { Router } from 'express';

const sysStreamRouter: Router = Router();

sysStreamRouter.get('/stream', getSysInfoStreamController);

export { sysStreamRouter };
