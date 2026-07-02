export interface CpuStaticData {
  cpuModel: string | null;
  cpuBaseSpeed: number | string | null;
  numberOfLogicalProcessors: number | null;
  L2CacheSize: number | string | null;
  L3CacheSize: number | string | null;
  NumberOfEnabledCore: number | null;
  VirtualizationFirmwareEnabled: boolean | null;
}
