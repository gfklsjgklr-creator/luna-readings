"use client";

import { useEffect, useState } from "react";

interface Star {
  id: number;
  left: string;
  top: string;
  duration: string;
  delay: string;
  large: boolean;
}

export function Starfield() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generated: Star[] = [];
    for (let i = 0; i < 80; i++) {
      generated.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: `${2 + Math.random() * 4}s`,
        delay: `${Math.random() * 5}s`,
        large: Math.random() > 0.85,
      });
    }
    setStars(generated);
  }, []);

  return (
    <div className="starfield">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star ${star.large ? "large" : ""}`}
          style={{
            left: star.left,
            top: star.top,
            ["--duration" as string]: star.duration,
            ["--delay" as string]: star.delay,
          }}
        />
      ))}
    </div>
  );
}
