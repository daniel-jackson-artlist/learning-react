import { motion } from "framer-motion";

export const CurveInConnector = ({ isActive = false }) => (
  <svg
    width="32"
    height="64"
    viewBox="0 0 32 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 2C16 38.5806 16 46.7096 30 46.7096"
      stroke="rgb(63,63,63)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {isActive && (
      <motion.path
        d="M16 2C16 38.5806 16 46.7096 30 46.7096"
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
