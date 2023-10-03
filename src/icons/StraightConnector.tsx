import { motion } from "framer-motion";

export const StraightConnector = ({ isActive = false }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="15.5"
      y1="2"
      x2="15.5"
      y2="30"
      stroke="rgb(63,63, 63)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {isActive && (
      <motion.line
        x1="15.5"
        y1="2"
        x2="15.5"
        y2="30"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }}
      />
    )}
  </svg>
);
