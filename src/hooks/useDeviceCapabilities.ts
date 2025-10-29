import { useEffect, useState } from 'react';

interface NetworkInfo {
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
  downlink: number;
  saveData: boolean;
}

interface DeviceInfo {
  isLowEnd: boolean;
  cores: number;
  memory?: number;
  connectionType: string;
  downloadSpeed: number;
}

export const useDeviceCapabilities = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isLowEnd: false,
    cores: navigator.hardwareConcurrency || 4,
    connectionType: '4g',
    downloadSpeed: 10
  });

  useEffect(() => {
    // Get network information
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    const effectiveType = connection?.effectiveType || '4g';
    const downlink = connection?.downlink || 10; // Mbps
    const saveData = connection?.saveData || false;

    // Get device memory (if available)
    const deviceMemory = (navigator as any).deviceMemory; // In GB

    // Determine if device is low-end
    const isLowEnd = 
      effectiveType === '2g' || 
      effectiveType === 'slow-2g' ||
      saveData ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
      (deviceMemory && deviceMemory <= 2);

    setDeviceInfo({
      isLowEnd,
      cores: navigator.hardwareConcurrency || 4,
      memory: deviceMemory,
      connectionType: effectiveType,
      downloadSpeed: downlink
    });

    // Listen for connection changes
    if (connection) {
      const handleChange = () => {
        setDeviceInfo(prev => ({
          ...prev,
          connectionType: connection.effectiveType || '4g',
          downloadSpeed: connection.downlink || 10,
          isLowEnd: 
            connection.effectiveType === '2g' || 
            connection.effectiveType === 'slow-2g' ||
            connection.saveData ||
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
        }));
      };

      connection.addEventListener('change', handleChange);
      return () => connection.removeEventListener('change', handleChange);
    }
  }, []);

  return deviceInfo;
};

export const useVideoLoadTime = () => {
  const [loadTimes, setLoadTimes] = useState<number[]>([]);
  const [averageLoadTime, setAverageLoadTime] = useState<number>(0);

  const recordLoadTime = (timeMs: number) => {
    setLoadTimes(prev => {
      const updated = [...prev, timeMs].slice(-10); // Keep last 10 measurements
      const avg = updated.reduce((a, b) => a + b, 0) / updated.length;
      setAverageLoadTime(avg);
      return updated;
    });
  };

  return {
    recordLoadTime,
    averageLoadTime,
    lastLoadTime: loadTimes[loadTimes.length - 1] || 0
  };
};
