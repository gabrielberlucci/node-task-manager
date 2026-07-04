import os from 'node:os';

export const getCpuTimes = () => {
  const cpus = os.cpus();

  let totalCpuTime = 0;
  let totalActiveCpuTime = 0;

  cpus.forEach((cpu) => {
    totalCpuTime +=
      cpu.times.idle +
      cpu.times.irq +
      cpu.times.nice +
      cpu.times.sys +
      cpu.times.user;

    totalActiveCpuTime +=
      cpu.times.irq + cpu.times.nice + cpu.times.sys + cpu.times.user;
  });

  return { totalCpuTime, totalActiveCpuTime };
};
