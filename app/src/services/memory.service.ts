import os from 'node:os';

export const getMemoryInformation = () => {
  const total = os.totalmem();
  const free = os.freemem();

  const totalFormated = `${(total / Math.pow(1024, 3)).toFixed(2)} GB`;
  const freeFormated = `${(free / Math.pow(1024, 3)).toFixed(2)} GB`;
  const usedmem = total - free;

  const usage = `${((usedmem / total) * 100).toFixed(2)}%`;

  const data = {
    total: totalFormated,
    free: freeFormated,
    usage: usage,
  };

  return data;
};
