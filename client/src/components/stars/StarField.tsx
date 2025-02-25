import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  originalColor: string;
  alpha: number;
  fadeStart: number;
  hue: number; // Added to track current hue for smoother transitions
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStar = (): Star => {
      const originalColor = `hsl(${Math.random() * 60 + 260}, 80%, 70%)`; // Purple-ish color
      return {
        x: Math.random() * canvas.width,
        y: 0, // Always start from top
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 1,
        color: originalColor,
        originalColor,
        alpha: 1,
        fadeStart: 0,
        hue: 260 + Math.random() * 60, // Initialize with purple hue
      };
    };

    const initStars = () => {
      // Distribute stars vertically at start
      starsRef.current = Array.from({ length: 100 }, (_, i) => ({
        ...createStar(),
        y: -(Math.random() * canvas.height), // Start above screen, distributed vertically
      }));
    };

    const updateStar = (star: Star) => {
      star.y += star.speed;

      // Check if star is near cursor (within 50px radius)
      const dx = star.x - mouseRef.current.x;
      const dy = star.y - mouseRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 50) { // Changed from 100 to 50 for smaller radius
        // Gradually shift the hue
        const targetHue = (star.hue + 2) % 360; // Slower color change
        star.hue = targetHue;
        star.color = `hsl(${star.hue}, 80%, 70%)`;
      } else {
        // Gradually return to original color when outside radius
        const purpleHue = 260 + Math.random() * 60;
        star.hue = purpleHue;
        star.color = star.originalColor;
      }

      // Start fading when star reaches 90% of screen height
      if (star.y > canvas.height * 0.9 && !star.fadeStart) {
        star.fadeStart = performance.now();
      }

      // Handle fading
      if (star.fadeStart) {
        const fadeElapsed = performance.now() - star.fadeStart;
        if (fadeElapsed > 900) { // 0.9s stay
          star.alpha = Math.max(0, 1 - (fadeElapsed - 900) / 400); // 0.4s fade
        }
      }

      // Reset star when it's completely faded or off screen
      if (star.y > canvas.height || star.alpha <= 0) {
        Object.assign(star, createStar());
        star.fadeStart = 0;
        star.alpha = 1;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;

        // Draw star with glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = star.color;

        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow for next star
        ctx.shadowBlur = 0;
        updateStar(star);
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    resizeCanvas();
    initStars();
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}