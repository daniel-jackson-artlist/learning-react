import React, { createContext, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/prism.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";

import {
  motion,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";

export const SpotlightContext = React.createContext({
  x: 0,
  setX: () => {},
  y: 0,
  setY: () => {},
  width: 0,
  setWidth: () => {},
  height: 0,
  setHeight: () => {},
  isSpotlightVisible: false,
  setIsSpotlightVisible: () => {},
});

const SpotlightProvider = ({ children }) => {
  const x = useSpring(0, { stiffness: 500, damping: 50 });
  const y = useSpring(0, { stiffness: 500, damping: 50 });
  const width = useSpring(0, { stiffness: 500, damping: 50 });
  const height = useSpring(0, { stiffness: 500, damping: 50 });
  const opacity = useSpring(0);

  const [isVisible, setIsVisible] = React.useState(false);

  const blurRadius = useTransform(opacity, [0, 0.3], [0, 3]);
  const backdropFilter = useMotionTemplate`blur(${blurRadius}px)`;
  const backgroundColor = useMotionTemplate`rgba(0, 0, 0, ${opacity})`;

  useEffect(() => {
    if (isVisible) {
      opacity.set(0.3);
    } else {
      opacity.set(0);
    }
  }, [isVisible]);

  return (
    <SpotlightContext.Provider
      value={{
        x,
        y,
        width,
        height,
        setIsVisible,
      }}
    >
      {children}
      <motion.div
        style={{
          position: "fixed",
          pointerEvents: "none",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor,
          "--squircle-smooth": 2,
          "--squircle-radius": 32,
          "--squircle-width": width,
          "--squircle-x": x,
          "--squircle-y": y,
          "--squircle-height": height,

          WebkitMaskImage:
            "linear-gradient(to right, black, black) ,paint(squircle)",
          WebkitMaskComposite: "xor",
          backdropFilter,
        }}
      />
    </SpotlightContext.Provider>
  );
};

export const CodeLinesContext = createContext({
  lineStart: null,
  lineEnd: null,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SpotlightProvider>
      <App />
    </SpotlightProvider>
  </React.StrictMode>,
);
