export interface CpuStaticData {
  cpuModel: string | null;
  cpuBaseSpeed: number | null;
  numberOfLogicalProcessors: number | null;
  L2CacheSize: number | null;
  L3CacheSize: number | null;
  NumberOfEnabledCore: number | null;
  VirtualizationFirmwareEnabled: boolean | null;
}
