import type { Request, Response } from 'express';

export const cpuController = async (req: Request, res: Response) => {
  res.status(200).send({
    message: 'Hello, world!',
  });
};
