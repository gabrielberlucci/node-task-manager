import { getMemoryInformation } from '@/services';
import type { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export const getMemoryInformationController = async (
  _req: Request,
  res: Response,
) => {
  const data = getMemoryInformation();

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Memory information fetched with success.',
    data: data,
  });
};
