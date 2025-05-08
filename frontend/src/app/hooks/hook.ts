import { useState, useRef, useEffect, useCallback } from "react";

 // Add this new hook at the top of your component
export const useTimer = (isActive: boolean) => {
    const [duration, setDuration] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
  
    useEffect(() => {
      if (isActive) {
        timerRef.current = setInterval(() => {
          setDuration(prev => prev + 1);
        }, 1000);
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
  
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }, [isActive]);
  
    const reset = useCallback(() => {
      setDuration(0);
    }, []);
  
    return { duration, reset };
  };