import { HardwareInfoError } from '@/errors';
import { promisify } from 'node:util';
import os from 'node:os';
import child_process from 'node:child_process';
import { CpuStaticData } from '@/types';

const KB = 1024;

let cachedCpuStaticInfo: CpuStaticData | null = null;

export const getStaticCpuInfo = async () => {
  const exec = promisify(child_process.exec);

  const cpus = os.cpus();

  if (cpus.length === 0) {
    throw new HardwareInfoError('Error while fetching CPU cores.');
  }

  const [firstCpu] = cpus;
  const cpuModel = firstCpu.model.trim();

  if (!cpuModel) throw new HardwareInfoError('Error while fetching CPU model.');

  if (!firstCpu.speed)
    throw new HardwareInfoError('Error while fetching CPU base clock speed.');

  const numberOfLogicalProcessors = cpus.length;
  const cpuBaseSpeed = `${firstCpu.speed / 1000} Ghz`;

  if (cachedCpuStaticInfo === null) {
    const command = `powershell.exe -NoProfile -Command "Get-CimInstance -ClassName Win32_Processor | Select L2CacheSize,L3CacheSize,NumberOfEnabledCore,VirtualizationFirmwareEnabled | ConvertTo-Json"`;

    const { stdout, stderr } = await exec(command);

    if (stderr) {
      console.log(stderr);
      throw new HardwareInfoError('Error while executing Get-CimInstance');
    }

    cachedCpuStaticInfo = JSON.parse(stdout);

    if (cachedCpuStaticInfo?.L2CacheSize) {
      cachedCpuStaticInfo.L2CacheSize = cachedCpuStaticInfo.L2CacheSize / KB;
    }

    if (cachedCpuStaticInfo?.L3CacheSize) {
      cachedCpuStaticInfo.L3CacheSize = cachedCpuStaticInfo.L3CacheSize / KB;
    }
  }

  const numberOfCores = cachedCpuStaticInfo?.NumberOfEnabledCore;
  const virtualizationEnabled =
    cachedCpuStaticInfo?.VirtualizationFirmwareEnabled;
  const l2CacheSize = `${cachedCpuStaticInfo?.L2CacheSize} MB`;
  const l3CacheSize = `${cachedCpuStaticInfo?.L3CacheSize} MB`;

  return {
    numberOfLogicalProcessors,
    numberOfCores,
    cpuModel,
    cpuBaseSpeed,
    virtualizationEnabled,
    l2CacheSize,
    l3CacheSize,
  };
};
