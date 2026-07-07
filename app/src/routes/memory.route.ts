import { getMemoryInformationController } from '@/controllers';
import { Router } from 'express';

const memoryRouter: Router = Router();

memoryRouter.get('/info', getMemoryInformationController);

export { memoryRouter };
