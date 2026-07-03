export interface CpuStaticData {
  cpuModel: string | null;
  cpuBaseSpeed: number | string | null;
  numberOfLogicalProcessors: number | null;
  InstalledSize: number | string | null;
  L2CacheSize: number | string | null;
  L3CacheSize: number | string | null;
  NumberOfEnabledCore: number | null;
  VirtualizationFirmwareEnabled: boolean | null;
}
