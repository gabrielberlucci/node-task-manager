import type { Request, Response } from 'express';

export const validateErrors = (error: Error, _req: Request, res: Response) => {
  console.log(error);
};
