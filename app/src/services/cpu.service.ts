import os from 'node:os';

export const getCpuInfo = async () => {
  const cpus = await os.cpus();

  return cpus;
};
