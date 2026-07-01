import { getStaticCpuInfo } from '@/services';
import type { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export const cpuController = async (_req: Request, res: Response) => {
  const data = await getStaticCpuInfo();

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Static CPU info fetched with success',
    data: data,
  });
};
