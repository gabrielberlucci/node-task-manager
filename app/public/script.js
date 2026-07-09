document.addEventListener("DOMContentLoaded", () => {
  const cpuUsageEl = document.getElementById("cpu-usage");
  const memoryUsageEl = document.getElementById("memory-usage");
  const memoryDetailsEl = document.getElementById("memory-details");
  const uptimeEl = document.getElementById("uptime");
  const totalProcessesEl = document.getElementById("total-processes");
  const processesBody = document.getElementById("processes-body");

  const formatUptime = (uptimeObj) => {
    const pad = (num) => String(num).padStart(2, "0");
    return `${pad(uptimeObj.hour)}:${pad(uptimeObj.minutes)}:${pad(uptimeObj.seconds)}`;
  };

  const formatBytesToMB = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2);
  };

  const connectStream = () => {
    // Connect to SSE stream
    const source = new EventSource("/api/v1/system/stream");

    source.onmessage = (event) => {
      if (event.data === "Connected to server") {
        console.log("Stream connected");
        return;
      }

      try {
        const data = JSON.parse(event.data);

        // Update CPU
        if (data.cpu) {
          cpuUsageEl.textContent = data.cpu;
        }

        // Update Memory
        if (data.memory) {
          memoryUsageEl.textContent = data.memory.usage;
          memoryDetailsEl.textContent = `${data.memory.free} livre de ${data.memory.total}`;
        }

        // Update Uptime
        if (data.uptime) {
          uptimeEl.textContent = formatUptime(data.uptime);
        }

        // Update Total Processes
        if (data.totalProcesses && data.totalProcesses.TotalProcesses) {
          totalProcessesEl.textContent = data.totalProcesses.TotalProcesses;
        }

        // Update Process List
        if (data.processes && Array.isArray(data.processes)) {
          // Update only if data exists to avoid flickering, but here we just re-render
          processesBody.innerHTML = "";
          data.processes.forEach((proc) => {
            const tr = document.createElement("tr");

            const tdId = document.createElement("td");
            tdId.textContent = proc.Id;

            const tdName = document.createElement("td");
            tdName.textContent = proc.ProcessName;

            const tdMem = document.createElement("td");
            tdMem.textContent = formatBytesToMB(proc.WS);

            tr.appendChild(tdId);
            tr.appendChild(tdName);
            tr.appendChild(tdMem);

            processesBody.appendChild(tr);
          });
        }
      } catch (error) {
        console.error("Error parsing stream data:", error);
      }
    };

    source.onerror = (error) => {
      console.error("EventSource failed:", error);
      source.close();
      // Try to reconnect after 5 seconds
      setTimeout(connectStream, 5000);
    };
  };

  const fetchCpuSpecs = async () => {
    try {
      const response = await fetch("/api/v1/cpu/static-info");
      const payload = await response.json();
      const data = payload.data || {};

      document.getElementById("cpu-name").textContent = data.cpuModel || "";

      document.getElementById("spec-cores").textContent =
        data.numberOfLogicalProcessors || "-";
      document.getElementById("spec-speed").textContent =
        data.cpuBaseSpeed || "-";
      document.getElementById("spec-l1").textContent = data.L1CacheSize || "-";
      document.getElementById("spec-l2").textContent = data.L2CacheSize || "-";
      document.getElementById("spec-l3").textContent = data.L3CacheSize || "-";

      const virt = data.VirtualizationFirmwareEnabled;
      document.getElementById("spec-virt").textContent =
        virt === true ? "Enabled" : virt === false ? "Disabled" : "-";
    } catch (error) {
      console.error("Error fetching CPU specs:", error);
    }
  };

  fetchCpuSpecs();
  connectStream();
});
