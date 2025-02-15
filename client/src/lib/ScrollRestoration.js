import { useEffect } from "react";

const ScrollRestoration = () => {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"; // Prevent automatic scroll reset
    }
  }, []);

  return null;
};

export default ScrollRestoration;
