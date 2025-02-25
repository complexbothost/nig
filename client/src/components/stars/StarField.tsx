import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  alpha: number;
  fadeStart: number;
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

    const createStar = (): Star => ({
      x: Math.random() * canvas.width,
      y: 0,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 1,
      color: `hsl(${Math.random() * 60 + 260}, 80%, 70%)`,
      alpha: 1,
      fadeStart: 0,
    });

    const initStars = () => {
      starsRef.current = Array.from({ length: 100 }, createStar);
    };

    const updateStar = (star: Star) => {
      star.y += star.speed;
      
      // Check if star is near cursor (within 100px radius)
      const dx = star.x - mouseRef.current.x;
      const dy = star.y - mouseRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        // Change color based on proximity
        star.color = `hsl(${Math.random() * 360}, 80%, 70%)`;
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
