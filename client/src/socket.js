import { io } from "socket.io-client";

export const socket = io({ autoConnect: false });

export function subscribeToJob(jobId, onProgress) {
  if (!socket.connected) socket.connect();

  const handleProgress = (event) => {
    if (event.jobId === jobId) onProgress(event);
  };

  socket.on("analysis:progress", handleProgress);
  socket.emit("subscribe", jobId);

  return () => {
    socket.off("analysis:progress", handleProgress);
  };
}
