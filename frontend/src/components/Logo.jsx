import React from "react";

// AEGIS shield badge logo
export default function Logo({ className = "w-8 h-8" }) {
  return (
    <img
      src="/aegis/aegis-logo.png"
      alt="AEGIS shield"
      className={`${className} object-contain`}
    />
  );
}
