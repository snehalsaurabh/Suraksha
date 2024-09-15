import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const FollowerPointerCard = ({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string | React.ReactNode;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setIsInside(true);
  const handleMouseLeave = () => setIsInside(false);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative", className)}
      style={{ cursor: "none" }}
    >
      <AnimatePresence>
        {isInside && (
          <FollowPointer x={mousePosition.x} y={mousePosition.y} title={title} />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

export const FollowPointer = ({
  x,
  y,
  title,
}: {
  x: number;
  y: number;
  title?: string | React.ReactNode;
}) => {
  const colors = [
    "var(--white)",
  ];

  return (
    <motion.div
      className="pointer-events-none absolute z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
      style={{
        left: x,
        top: y,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="4" cy="4" r="4" fill="white" />
      </svg>
      <motion.div
        className="absolute left-4 top-4 px-2 py-1 bg-neutral-800 text-white text-xs whitespace-nowrap rounded-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        style={{
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        }}
      >
        {title || "William Shakespeare"}
      </motion.div>
    </motion.div>
  );
};