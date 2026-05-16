"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* ─── Layer 1: Base Gradient ─── */}
      <div className="absolute inset-0 bg-gradient-to-br from-brs-900 via-brs-800 to-brs-700" />
      
      {/* ─── Layer 2: Animated Scientific Grid ─── */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 opacity-[0.04]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.04 }}
        transition={{ duration: 2 }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(218,241,222,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(218,241,222,0.4) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />
      </motion.div>

      {/* ─── Layer 3: Left & Right Side - Molecular Networks ─── */}
      {mounted && !isMobile && (
        <>
          <div className="absolute left-[5%] top-[15%] h-[70%] w-[40%] opacity-[0.15]">
            <MolecularNetwork />
          </div>
          <div className="absolute right-[5%] top-[15%] h-[70%] w-[40%] opacity-[0.15]">
            <MolecularNetwork />
          </div>
        </>
      )}

      {/* ─── Layer 4: Right Side - Floating Energy Orb ─── */}
      <div className="absolute right-[-5%] top-[5%] h-[800px] w-[800px]">
        {/* Atmosphere Glow */}
        <motion.div
          animate={{
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-brs-400 blur-[120px]"
        />

        {/* Floating Orb Core */}
        <motion.div
          animate={{
            y: [0, -40, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative h-full w-full flex items-center justify-center"
        >
          {/* Layered Gradients */}
          <div className="h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-brs-600/20 via-brs-400/10 to-transparent blur-[60px]" />
          <motion.div 
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute h-[250px] w-[250px] rounded-full bg-brs-400/20 blur-[30px]" 
          />
          
          {/* Rotating Rings (Optional Enhancement) */}
          {!isMobile && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute h-[500px] w-[500px] rounded-full border border-brs-400/10 border-dashed"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute h-[600px] w-[600px] rounded-full border border-brs-600/5"
              />
            </>
          )}
        </motion.div>
      </div>

      {/* ─── Layer 5: Circuit Lines (SVG) ─── */}
      <div className="absolute inset-0 opacity-[0.08]">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#DAF1DE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          
          {/* Animated Circuit Paths - More elegant geometry */}
          {!isMobile && (
            <>
              <CircuitPath d="M -50 150 L 250 150 L 350 250 L 600 250" delay={0} />
              <CircuitPath d="M 1300 150 L 1000 150 L 900 250 L 700 250" delay={2.5} />
              <CircuitPath d="M 150 750 L 450 750 L 550 650 L 900 650" delay={1.2} />
              <CircuitPath d="M 1200 650 L 1000 650 L 900 550 L 600 550" delay={3.8} />
            </>
          )}
          {isMobile && (
            <CircuitPath d="M -50 200 L 150 200 L 250 300 L 400 300" delay={0} />
          )}
        </svg>
      </div>

      {/* ─── Layer 6: Floating Molecular Particles ─── */}
      {mounted && (
        <>
          <Particles count={isMobile ? 8 : 20} />
        </>
      )}

      {/* ─── Layer 7: Final Depth Overlays ─── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(142,182,155,0.03)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(217,119,87,0.05)_0%,_transparent_60%)]" />
      
      {/* ─── Layer 8: Top Right Electric Shock Animation ─── */}
      {!isMobile && (
        <div className="absolute right-0 top-0 w-1/3 h-1/2 opacity-40">
          <LightningEffect />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brs-900/40 to-transparent" />
    </div>
  );
}

function LightningEffect() {
  const [bolts, setBolts] = useState<{ d: string; id: number }[]>([]);

  useEffect(() => {
    const generateBolts = () => {
      const newBolts = Array.from({ length: 3 }).map((_, i) => {
        let d = `M ${80 + Math.random() * 20} 0`;
        let curX = 80 + Math.random() * 20;
        let curY = 0;
        
        for (let j = 0; j < 5; j++) {
          curX += (Math.random() - 0.5) * 15;
          curY += 15 + Math.random() * 15;
          d += ` L ${curX} ${curY}`;
        }
        return { d, id: Date.now() + i };
      });
      setBolts(newBolts);
    };

    const interval = setInterval(generateBolts, 1500);
    generateBolts();
    return () => clearInterval(interval);
  }, []);

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <filter id="electric-glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {bolts.map((bolt) => (
        <motion.path
          key={bolt.id}
          d={bolt.d}
          fill="none"
          stroke="#4fd1c5"
          strokeWidth="0.5"
          filter="url(#electric-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 1],
            opacity: [0, 1, 0, 0.8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
            ease: "linear"
          }}
        />
      ))}
    </svg>
  );
}

function CircuitPath({ d, delay }: { d: string; delay: number }) {
  return (
    <g>
      {/* Static Base Line */}
      <path
        d={d}
        fill="none"
        stroke="#8EB69B"
        strokeWidth="1"
        strokeOpacity="0.15"
      />
      {/* Flowing Energy Pulse */}
      <motion.path
        d={d}
        fill="none"
        stroke="url(#circuit-grad)"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: [0, 0.4, 0.4],
          opacity: [0, 1, 0],
          pathOffset: [0, 0, 1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: delay,
          ease: "easeInOut",
        }}
      />
    </g>
  );
}

function MolecularNetwork() {
  const [nodes, setNodes] = useState<{ x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    setNodes(Array.from({ length: 8 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2
    })));
  }, []);

  if (nodes.length === 0) return null;

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      {/* Connections */}
      {nodes.map((node, i) => (
        nodes.slice(i + 1, i + 3).map((target, j) => (
          <motion.line
            key={`${i}-${j}`}
            x1={node.x}
            y1={node.y}
            x2={target.x}
            y2={target.y}
            stroke="#8EB69B"
            strokeWidth="0.2"
            strokeOpacity="0.3"
            animate={{
              strokeOpacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))
      ))}
      
      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.g
          key={i}
          animate={{
            x: [0, Math.random() * 2 - 1, 0],
            y: [0, Math.random() * 2 - 1, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.circle
            cx={node.x}
            cy={node.y}
            r={node.size / 2}
            fill="#DAF1DE"
            animate={{
              fillOpacity: [0.2, 0.6, 0.2],
              r: [node.size / 2, node.size / 2 + 0.5, node.size / 2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Subtle Glow */}
          <circle
            cx={node.x}
            cy={node.y}
            r={node.size * 2}
            fill="#8EB69B"
            fillOpacity="0.05"
          />
        </motion.g>
      ))}
    </svg>
  );
}

function Particles({ count }: { count: number }) {
  const [particles, setParticles] = useState<{ x: string; y: string; scale: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: count }).map(() => ({
      x: Math.random() * 100 + "%",
      y: Math.random() * 100 + "%",
      scale: Math.random() * 0.4 + 0.3,
      delay: Math.random() * 15,
      duration: Math.random() * 15 + 15
    })));
  }, [count]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-brs-100/30"
          initial={{
            x: p.x,
            y: p.y,
            scale: p.scale,
            opacity: 0,
          }}
          animate={{
            y: ["-5%", "105%"],
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
          style={{
            width: "3px",
            height: "3px",
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </div>
  );
}
