import { useState } from "react";

export default function ToggleSwitch() {
  const [on, setOn] = useState(true);

  return (
    <div
      onClick={() => setOn(!on)}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        background: on ? "#1aa79c" : "#ccc",
        cursor: "pointer",
        position: "relative",
        transition: "0.2s"
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          background: "white",
          borderRadius: "50%",
          position: "absolute",
          top: "2px",
          left: on ? "22px" : "2px",
          transition: "0.2s"
        }}
      />
    </div>
  );
}
