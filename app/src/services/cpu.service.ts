import { HardwareInfoError } from '@/errors';
import { promisify } from 'node:util';
import os from 'node:os';
import child_process from 'node:child_process';
import { CpuStaticData } from '@/types';

const KB = 1024;

let cachedCpuStaticInfo: CpuStaticData | null = null;

export const getStaticCpuInfo = async (): Promise<CpuStaticData | null> => {
  if (cachedCpuStaticInfo) return cachedCpuStaticInfo;

  const cpus = os.cpus();
  if (cpus.length === 0)
    throw new HardwareInfoError('Error while fetching CPU cores information.');

  /* total cpu array size */
  const numberOfLogicalProcessors = cpus.length;

  const [firstCpu] = cpus;

  const cpuBaseSpeed = firstCpu.speed;
  if (!cpuBaseSpeed)
    throw new HardwareInfoError('Error while fetching CPU base clock speed.');

  const cpuModel = firstCpu.model.trim();
  if (!cpuModel) throw new HardwareInfoError('Error while fetching CPU model.');

  const exec = promisify(child_process.exec);
  const command = `powershell.exe -NoProfile -Command "Get-CimInstance -ClassName Win32_Processor | Select L2CacheSize,L3CacheSize,NumberOfEnabledCore,VirtualizationFirmwareEnabled | ConvertTo-Json"`;

  const { stdout, stderr } = await exec(command);

  if (stderr) {
    console.log(stderr);
    throw new HardwareInfoError('Error while executing Get-CimInstance');
  }

  const parsed = JSON.parse(stdout) as Partial<CpuStaticData>;

  const cpuStaticInfo: CpuStaticData = {
    ...parsed,
    cpuModel,
    numberOfLogicalProcessors,
    cpuBaseSpeed: `${Number(cpuBaseSpeed) / 1000} Ghz`,
    L2CacheSize: `${Number(parsed.L2CacheSize ?? 0) / KB} MB`,
    L3CacheSize: `${Number(parsed.L3CacheSize ?? 0) / KB} MB`,
  } as CpuStaticData;

  cachedCpuStaticInfo = cpuStaticInfo;

  return cachedCpuStaticInfo;
};
