import React, { useEffect, useRef, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

interface StardustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

interface ClickPulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const UniqueCursorEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // High-performance animation references
  const mousePos = useRef({ x: -200, y: -200 });
  const smoothPos = useRef({ x: -200, y: -200 });
  const prevPos = useRef({ x: -200, y: -200 });
  const velocity = useRef({ x: 0, y: 0, speed: 0, angle: 0 });
  const trail = useRef<TrailPoint[]>([]);
  const particles = useRef<StardustParticle[]>([]);
  const clickPulses = useRef<ClickPulse[]>([]);
  const isHovering = useRef(false);
  const isMouseDown = useRef(false);
  const animFrameId = useRef<number | null>(null);
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only activate for precise pointer devices (desktop mouse, trackpad)
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const colors = ['#38bdf8', '#818cf8', '#60a5fa', '#a78bfa', '#34d399'];

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (!isVisible) setIsVisible(true);

      const dx = x - mousePos.current.x;
      const dy = y - mousePos.current.y;
      const dist = Math.hypot(dx, dy);

      mousePos.current = { x, y };

      // Reset auto-hide idle timer
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      if (dist > 1) {
        const speed = Math.min(dist, 50);
        const angle = Math.atan2(dy, dx);
        velocity.current = { x: dx, y: dy, speed, angle };

        // Append to ribbon trail
        trail.current.push({ x, y, time: performance.now() });
        if (trail.current.length > 20) {
          trail.current.shift();
        }

        // Spawn delicate stardust sparks when moving fast enough
        if (speed > 4 && particles.current.length < 35) {
          const count = speed > 15 ? 2 : 1;
          for (let i = 0; i < count; i++) {
            const spreadAngle = angle + Math.PI + (Math.random() - 0.5) * 1.2;
            const pSpeed = Math.random() * 1.6 + 0.4;
            particles.current.push({
              x: x + (Math.random() - 0.5) * 8,
              y: y + (Math.random() - 0.5) * 8,
              vx: Math.cos(spreadAngle) * pSpeed,
              vy: Math.sin(spreadAngle) * pSpeed,
              size: Math.random() * 2.2 + 1,
              alpha: Math.random() * 0.5 + 0.4,
              decay: Math.random() * 0.025 + 0.02,
              color: colors[Math.floor(Math.random() * colors.length)]
            });
          }
        }
      }

      // Detect hover over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('select') ||
          target.closest('[role="button"]') ||
          target.closest('.cursor-pointer') ||
          window.getComputedStyle(target).cursor === 'pointer'
        );
        isHovering.current = interactive;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown.current = true;
      // Spawn expanding click ripple
      clickPulses.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 6,
        maxRadius: 42,
        alpha: 0.85
      });
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // 60FPS fluid render loop
    const render = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Smooth Spring Interpolation for outer halo
      const ease = isHovering.current ? 0.22 : 0.15;
      smoothPos.current.x += (mousePos.current.x - smoothPos.current.x) * ease;
      smoothPos.current.y += (mousePos.current.y - smoothPos.current.y) * ease;
      velocity.current.speed *= 0.91;

      // 2. Click Shockwave Ripples
      for (let i = clickPulses.current.length - 1; i >= 0; i--) {
        const pulse = clickPulses.current[i];
        pulse.radius += (pulse.maxRadius - pulse.radius) * 0.16 + 0.5;
        pulse.alpha -= 0.04;

        if (pulse.alpha <= 0 || pulse.radius >= pulse.maxRadius) {
          clickPulses.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${pulse.alpha})`;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }

      // 3. Stardust Floating Sparks
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.size *= 0.97;

        if (p.alpha <= 0 || p.size < 0.3) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      }

      // 4. Fluid Ribbon Trail (decay after 160ms)
      for (let i = trail.current.length - 1; i >= 0; i--) {
        if (now - trail.current[i].time > 160) {
          trail.current.splice(i, 1);
        }
      }

      const tLen = trail.current.length;
      if (tLen > 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < tLen; i++) {
          const p0 = trail.current[i - 1];
          const p1 = trail.current[i];
          const progress = i / tLen;

          const width = progress * 4.5 + 0.8;
          const alpha = progress * 0.35;

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineWidth = width;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 5;
          ctx.stroke();
        }

        ctx.restore();
      }

      // 5. Unique Velocity-Reactive Follower Ring (Dynamic Squash & Stretch)
      if (mousePos.current.x > 0 && mousePos.current.y > 0) {
        ctx.save();
        ctx.translate(smoothPos.current.x, smoothPos.current.y);

        if (velocity.current.speed > 1.5) {
          ctx.rotate(velocity.current.angle);
        }

        const baseRadius = isMouseDown.current ? 13 : isHovering.current ? 24 : 16;
        const stretch = Math.min(velocity.current.speed * 0.016, 0.45);
        const radiusX = baseRadius * (1 + stretch);
        const radiusY = baseRadius * (1 - stretch * 0.45);

        ctx.beginPath();
        ctx.ellipse(0, 0, Math.max(radiusX, 4), Math.max(radiusY, 4), 0, 0, Math.PI * 2);

        if (isHovering.current) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
          ctx.lineWidth = 1.8;
          ctx.fillStyle = 'rgba(56, 189, 248, 0.09)';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
          ctx.lineWidth = 1.2;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 4;
          ctx.stroke();
        }

        ctx.restore();

        // 6. Crisp Focal Core Dot (Zero-latency tracking with subtle cyan glow)
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          mousePos.current.x,
          mousePos.current.y,
          isMouseDown.current ? 3.5 : isHovering.current ? 3.2 : 2.5,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = isHovering.current ? 10 : 5;
        ctx.fill();
        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };
  }, [isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[99999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    />
  );
};
