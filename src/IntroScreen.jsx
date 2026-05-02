import { useEffect, useState } from "react";

// Total sequence:
//  0.0s  — logo fades + scales in        (0.8s)
//  0.6s  — tagline chars stagger in      (each 0.06s apart × 10 chars = ~1.2s)
//  2.0s  — hold
//  2.4s  — whole screen fades out        (0.6s)
//  3.0s  — onDone() fires, component unmounts

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
      {/* Subtle animated grid lines for depth */}
      <div className="intro-grid" aria-hidden="true" />

      <div className="intro-content">
        {/* Logo */}
        <div className="intro-logo-wrap">
          <img
            src="/logoMain.png"
            alt=""
            className="intro-logo"
            aria-hidden="true"
          />
        </div>

        {/* App name — each letter animates in individually */}
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

        {/* Tagline */}
        <p className="intro-tagline">
          <span className="intro-tagline-inner">Your weather, beautifully told.</span>
        </p>

        {/* Bottom progress line */}
        <div className="intro-progress" aria-hidden="true">
          <div className="intro-progress-bar" />
        </div>
      </div>
    </div>
  );
}

export default IntroScreen;