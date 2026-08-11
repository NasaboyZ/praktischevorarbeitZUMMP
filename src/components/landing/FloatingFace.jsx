import { motion } from 'motion/react';

// A single glowing mood face, absolutely centered on {top,left} and bobbing gently.
export default function FloatingFace({ src, alt, top, left, size, delay = 0, duration = 4.5 }) {
  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ top, left, width: size, height: size }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="h-full w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.10)]"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
}
