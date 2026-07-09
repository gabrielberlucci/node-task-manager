import { promisify } from 'node:util';
import { ProcessesInfoError } from '@/errors';

import child_process from 'node:child_process';

export const getTopProcesses = async () => {
  const exec = promisify(child_process.exec);

  const command = `powershell.exe -NoProfile -Command "Get-Process | Where-Object {$_.ProcessName -notin ('svchost', 'explorer', 'System', 'Idle', 'Registry', 'smss', 'csrss', 'wininit', 'services', 'lsass', 'fontdrvhost', 'dwm', 'taskhostw', 'ctfmon', 'conhost', 'SearchIndexer', 'ApplicationFrameHost')} |Sort-Object WS -Descending  | Select Id, ProcessName, WS -First 30 | ConvertTo-Json"`;

  const { stdout, stderr } = await exec(command);

  if (stderr) throw new ProcessesInfoError('Error while fetching processes');

  const parsed = JSON.parse(stdout);

  return parsed;
};
