import {
  getCpuUptime,
  getCpuUsage,
  getCpuTotalProcesses,
  getMemoryInformation,
} from '@/services';
import type { Request, Response } from 'express';

export const getSysInfoStreamController = async (
  req: Request,
  res: Response,
) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(`data: Connected to server\n\n`);

  let isClientConnected = true;

  req.on('close', () => {
    isClientConnected = false;
    res.end();
  });

  while (isClientConnected) {
    const cpuLoad = await getCpuUsage();
    const memory = getMemoryInformation();
    const processesInfo = await getCpuTotalProcesses();
    const sysUptime = getCpuUptime();

    const payload = {
      cpu: cpuLoad,
      memory: memory,
      processes: processesInfo,
      uptime: sysUptime,
    };

    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }
};
