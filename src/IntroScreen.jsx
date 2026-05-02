import { useEffect, useState } from "react";

function IntroScreen({ onDone, isDark }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const holdTimer = setTimeout(() => setLeaving(true), 2400);
    const doneTimer = setTimeout(() => onDone(), 3000);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  const appName = "FORECASTLY";

  return (
    <div className={`intro-screen ${leaving ? "intro-leave" : ""} ${isDark ? "dark" : "light"}`}>
    
      <div className="intro-grid" aria-hidden="true" />

      <div className="intro-content">
        
        <div className="intro-logo-wrap">
          <img
            src="/logoMain.png"
            alt=""
            className="intro-logo"
            aria-hidden="true"
          />
        </div>

        
        <h1 className="intro-title" aria-label="Forecastly">
          {appName.split("").map((char, i) => (
            <span
              key={i}
              className="intro-char"
              style={{ animationDelay: `${0.7 + i * 0.07}s` }}
            >
              {char}
            </span>
          ))}
        </h1>

        
        <p className="intro-tagline">
          <span className="intro-tagline-inner">Your weather, beautifully told.</span>
        </p>

        <div className="intro-progress" aria-hidden="true">
          <div className="intro-progress-bar" />
        </div>
      </div>
    </div>
  );
}

export default IntroScreen;