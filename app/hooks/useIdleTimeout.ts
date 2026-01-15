import { useEffect, useRef } from "react";

type IdleConfig = {
  idleTime: number;
  warningTime: number;
  onIdle: () => void;
  onWarning: () => void;
};

const EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
];

export function useIdleTimeout({
  idleTime,
  warningTime,
  onIdle,
  onWarning,
}: IdleConfig) {
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);

  const resetTimers = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);

    warningTimer.current = setTimeout(onWarning, warningTime);
    idleTimer.current = setTimeout(onIdle, idleTime);
  };

  useEffect(() => {
    EVENTS.forEach((event) =>
      window.addEventListener(event, resetTimers)
    );

    resetTimers(); // start timers

    return () => {
      EVENTS.forEach((event) =>
        window.removeEventListener(event, resetTimers)
      );
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, []);
}
