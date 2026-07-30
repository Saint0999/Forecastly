import { useEffect, useState } from "react";

function IntroScreen({ onDone, isDark }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const holdTimer = setTimeout(() => setLeaving(true), 1500);
    const doneTimer = setTimeout(() => onDone(), 2100);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className={`intro-screen ${leaving ? "intro-leave" : ""} ${isDark ? "dark" : "light"}`}>
      <div className="intro-content">
        <img src="/logoMain.png" alt="" className="intro-logo" aria-hidden="true" />
        <h1 className="intro-title">Forecastly</h1>
      </div>
    </div>
  );
}

export default IntroScreen;
