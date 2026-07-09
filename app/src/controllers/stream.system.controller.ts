import {
  getCpuUptime,
  getCpuUsage,
  getCpuTotalProcesses,
  getMemoryInformation,
  getTopProcesses,
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
    const sysUptime = getCpuUptime();

    const [totalProcesses, processes] = await Promise.all([
      getCpuTotalProcesses(),
      getTopProcesses(),
    ]);

    // const processesInfo = await getCpuTotalProcesses();
    // const processes = await getTopProcesses();

    const payload = {
      cpu: cpuLoad,
      memory: memory,
      totalProcesses: totalProcesses,
      uptime: sysUptime,
      processes: processes,
    };

    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }
};
