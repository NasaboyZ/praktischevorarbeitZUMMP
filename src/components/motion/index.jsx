import { motion, useInView, AnimatePresence } from 'motion/react';
import { useRef, useState, memo } from 'react';
import React from 'react';

// ── InView ─────────────────────────────────────────────────────────────────
// Triggers animation variants when element scrolls into viewport.
export function InView({
  children,
  variants,
  transition,
  viewOptions = { once: true, margin: '0px 0px -80px 0px' },
  style,
  className,
  as = 'div',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewOptions);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);

  const defaultVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  const MotionEl = motion[as];

  return (
    <MotionEl
      ref={ref}
      initial="hidden"
      animate={isInView || hasBeenSeen ? 'visible' : 'hidden'}
      onAnimationComplete={() => { if (isInView) setHasBeenSeen(true); }}
      variants={variants ?? defaultVariants}
      transition={transition ?? { duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={style}
      className={className}
    >
      {children}
    </MotionEl>
  );
}

// ── AnimatedGroup ──────────────────────────────────────────────────────────
// Wraps children in staggered motion animations with preset or custom variants.
const GROUP_PRESETS = {
  fade: {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.10 } } },
    item:      { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  },
  slide: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.10 } } },
    item:      { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16,1,0.3,1] } } },
  },
  'blur-slide': {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } },
    item:      { hidden: { opacity: 0, y: 20, filter: 'blur(6px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16,1,0.3,1] } } },
  },
  zoom: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
    item:      { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } } },
  },
  bounce: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.10 } } },
    item:      { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 12 } } },
  },
};

export function AnimatedGroup({ children, preset = 'fade', variants, style, className }) {
  const { container, item } = variants ?? GROUP_PRESETS[preset] ?? GROUP_PRESETS.fade;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      style={style}
      className={className}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── TextEffect ─────────────────────────────────────────────────────────────
// Animates text per word with stagger effects.
const TEXT_PRESETS = {
  blur: {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } },
    item:      { hidden: { opacity: 0, filter: 'blur(12px)' }, visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.35 } } },
  },
  'fade-in-blur': {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } },
    item:      { hidden: { opacity: 0, y: 16, filter: 'blur(10px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.38, ease: [0.16,1,0.3,1] } } },
  },
  slide: {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } },
    item:      { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.40, ease: [0.16,1,0.3,1] } } },
  },
  fade: {
    container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } },
    item:      { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.35 } } },
  },
};

const srOnly = {
  position: 'absolute', width: 1, height: 1,
  padding: 0, margin: -1, overflow: 'hidden',
  clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
};

const WordSegment = memo(({ segment, variants }) => (
  <motion.span
    aria-hidden="true"
    variants={variants}
    style={{ display: 'inline-block', whiteSpace: 'pre' }}
  >
    {segment}
  </motion.span>
));
WordSegment.displayName = 'WordSegment';

export function TextEffect({
  children,
  preset = 'fade-in-blur',
  as = 'p',
  style,
  delay = 0,
  speedReveal = 1,
  trigger = true,
  variants,
}) {
  const segments = children.split(/(\s+)/);
  const MotionTag = motion[as];

  const base = variants ?? TEXT_PRESETS[preset] ?? TEXT_PRESETS.fade;

  const containerVariants = {
    hidden: base.container.hidden ?? { opacity: 0 },
    visible: {
      ...base.container.visible,
      transition: {
        ...(base.container.visible?.transition ?? {}),
        staggerChildren: (base.container.visible?.transition?.staggerChildren ?? 0.06) / speedReveal,
        delayChildren: delay,
      },
    },
  };

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <MotionTag
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          style={style}
        >
          <span style={srOnly}>{children}</span>
          {segments.map((segment, i) => (
            <WordSegment key={i} segment={segment} variants={base.item} />
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  );
}
