import { io } from "socket.io-client";
import type { AnalysisStatus } from "./types";

export interface AnalysisProgressEvent {
  jobId: string;
  status: AnalysisStatus;
}

export const socket = io({ autoConnect: false });

export function subscribeToJob(jobId: string, onProgress: (event: AnalysisProgressEvent) => void) {
  if (!socket.connected) socket.connect();

  const handleProgress = (event: AnalysisProgressEvent) => {
    if (event.jobId === jobId) onProgress(event);
  };

  socket.on("analysis:progress", handleProgress);
  socket.emit("subscribe", jobId);

  return () => {
    socket.off("analysis:progress", handleProgress);
  };
}
