import { motion } from "framer-motion";

export const CurveOutConnector = ({ isActive = false }) => (
  <svg
    width="64"
    height="32"
    viewBox="0 0 64 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M46 2C46 9.32308 41.1754 15.7846 32.2154 15.7846C21.8769 15.7846 18 21.8154 18 30"
      stroke="rgb(63,63,63)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {isActive && (
      <motion.path
        d="M46 2C46 9.32308 41.1754 15.7846 32.2154 15.7846C21.8769 15.7846 18 21.8154 18 30"
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
