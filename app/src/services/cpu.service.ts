import { HardwareInfoError, ProcessesInfoError } from '@/errors';
import { promisify } from 'node:util';
import os from 'node:os';
import child_process from 'node:child_process';
import { CpuStaticData } from '@/types';
import { setTimeout } from 'node:timers/promises';
import { getCpuTimes } from '@/utils';
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
  const command = `powershell.exe -NoProfile -Command "$proc = Get-CimInstance -ClassName Win32_Processor | Select L2CacheSize,L3CacheSize,NumberOfEnabledCore,VirtualizationFirmwareEnabled; $cache = Get-CimInstance -ClassName Win32_CacheMemory | Where-Object {$_.level -eq 3} | Select -First 1 InstalledSize; $combined = [PSCustomObject]@{ L2CacheSize = $proc.L2CacheSize; L3CacheSize = $proc.L3CacheSize; NumberOfEnabledCore = $proc.NumberOfEnabledCore; VirtualizationFirmwareEnabled = $proc.VirtualizationFirmwareEnabled; InstalledSize = $cache.InstalledSize }; $combined | ConvertTo-Json"`;

  const { stdout, stderr } = await exec(command);

  if (stderr) {
    console.log(stderr);
    throw new HardwareInfoError('Error while executing Get-CimInstance');
  }

  const parsed = JSON.parse(stdout) as Partial<CpuStaticData>;

  const cpuStaticInfo: CpuStaticData = {
    ...parsed,
    numberOfLogicalProcessors,
    cpuBaseSpeed: `${Number(cpuBaseSpeed) / 1000} Ghz`,
    L1CacheSize: `${Number(parsed.InstalledSize ?? 0)} KB`,
    L2CacheSize: `${Number(parsed.L2CacheSize ?? 0) / KB} MB`,
    L3CacheSize: `${Number(parsed.L3CacheSize ?? 0) / KB} MB`,
  } as CpuStaticData;

  cachedCpuStaticInfo = cpuStaticInfo;

  return cachedCpuStaticInfo;
};

export const getCpuUptime = () => {
  let ut_sec = os.uptime();
  let ut_min = ut_sec / 60;
  let ut_hour = ut_min / 60;

  ut_sec = Math.floor(ut_sec);
  ut_min = Math.floor(ut_min);
  ut_hour = Math.floor(ut_hour);

  ut_hour = ut_hour % 60;
  ut_min = ut_min % 60;
  ut_sec = ut_sec % 60;

  const timeData = {
    hour: ut_hour,
    minutes: ut_min,
    seconds: ut_sec,
  };

  return timeData;
};

export const getCpuUsage = async () => {
  const {
    totalCpuTime: firstCpuTime,
    totalActiveCpuTime: firstTotalActiveCpuTime,
  } = getCpuTimes();

  await setTimeout(1000);

  const {
    totalCpuTime: secondCpuTime,
    totalActiveCpuTime: secondTotalActiveCpuTime,
  } = getCpuTimes();

  const totalDelta = secondCpuTime - firstCpuTime;
  const activeDelta = secondTotalActiveCpuTime - firstTotalActiveCpuTime;

  const total = `${((activeDelta / totalDelta) * 100).toFixed(2)}%`;

  return total;
};

export const getCpuTotalProcesses = async () => {
  const exec = promisify(child_process.exec);
  const command = `powershell.exe -NoProfile -Command "$procs = Get-Process; [PSCustomObject]@{TotalProcesses = $procs.Count; TotalThreads = ($procs | Select-Object -ExpandProperty Threads).Count; TotalHandles = ($procs | Measure-Object -Property Handles -Sum).Sum} | ConvertTo-Json"`;

  const { stdout, stderr } = await exec(command);

  if (stderr) {
    throw new ProcessesInfoError('Error while fetching processes');
  }

  const parsed = JSON.parse(stdout);

  return parsed;
};
