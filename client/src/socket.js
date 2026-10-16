import { io } from "socket.io-client";

export const socket = io({ autoConnect: false });

export function subscribeToJob(jobId, accessToken, onProgress) {
  socket.auth = { token: accessToken };
  if (socket.connected) socket.disconnect();
  socket.connect();

  const handleProgress = (event) => {
    if (event.jobId === jobId) onProgress(event);
  };

  socket.on("analysis:progress", handleProgress);
  socket.emit("subscribe", jobId);

  return () => {
    socket.off("analysis:progress", handleProgress);
  };
}
