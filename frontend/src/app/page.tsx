'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowRight, Globe, Layers, Zap, Activity, Leaf, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function Home() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const floatingVariants: Variants = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const rotatingVariants: Variants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  const pulseVariants: Variants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative overflow-hidden bg-black"
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
      >
        <source src="/landing_page.mp4" type="video/mp4" />
      </video>

      {/* Animated Background Gradients */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-[-20%] left-[-20%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2"
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
          }}
          animate={{
            y: [`${particle.y}%`, `${particle.y - 100}%`],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute pointer-events-none"
        >
          <div
            className="bg-emerald-400/40 rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        </motion.div>
      ))}

      {/* Floating Corner Elements */}
      <motion.div
        variants={floatingVariants}
        animate="float"
        className="absolute top-10 right-20 text-emerald-400/30 pointer-events-none"
      >
        <Leaf size={60} />
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="float"
        transition={{ delay: 1.5 }}
        className="absolute bottom-32 left-10 text-blue-400/30 pointer-events-none"
      >
        <Activity size={50} />
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="float"
        transition={{ delay: 3 }}
        className="absolute top-1/3 left-1/4 text-cyan-400/20 pointer-events-none"
      >
        <TrendingUp size={40} />
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl z-10 relative"
      >
        {/* Brand Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6"
        >

        </motion.div>

        <motion.div variants={itemVariants} className="relative mb-8">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent drop-shadow-sm"
            style={{ backgroundSize: '200% 200%' }}
          >
            Trace Your <br />
            <motion.span
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"
              style={{ backgroundSize: '200% 200%' }}
            >
              Carbon Legacy
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          The ultimate platform to track, analyze, and visualize your emissions across{' '}
          <motion.span
            className="text-white font-semibold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scope 1, 2, and 3
          </motion.span>
          {' '}with precision.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <span className="relative flex items-center gap-2">
                Launch Dashboard
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/upload"
              className="px-8 py-4 bg-white/5 hover:bg-white/15 text-white border border-white/20 hover:border-white/40 rounded-full font-bold text-lg transition-all hover:shadow-lg hover:shadow-white/10 backdrop-blur-md w-full sm:w-auto text-center"
            >
              Upload Data
            </Link>
          </motion.div>
        </motion.div>

        {/* Enhanced Feature Grid */}
        <motion.div
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          <FeatureCard
            icon={<Zap className="text-amber-400" size={28} />}
            title="Real-time Analytics"
            desc="Instant emission calculations powered by AI."
            index={0}
          />
          <FeatureCard
            icon={<Layers className="text-blue-400" size={28} />}
            title="Full Scope Coverage"
            desc="Track Scope 1, 2, and 3 seamlessly."
            index={1}
          />
          <FeatureCard
            icon={<Globe className="text-emerald-400" size={28} />}
            title="Global Impact"
            desc="Join the movement towards a net-zero future."
            index={2}
          />
        </motion.div>

        {/* Stats Section */}

      </motion.div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  index,
}: {
  icon: any;
  title: string;
  desc: string;
  index: number;
}) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: index * 0.15 },
    },
  };

  const hoverVariants = {
    hover: {
      y: -5,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      initial="hidden"
      animate="visible"
      className="relative group"
    >
      <motion.div variants={hoverVariants} className="h-full">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all backdrop-blur-md h-full hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 relative overflow-hidden">
          {/* Animated background on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          <div className="relative z-10">
            <motion.div
              className="mb-4 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            >
              {icon}
            </motion.div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
              {title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
              {desc}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatItem({
  number,
  label,
  delay,
}: {
  number: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          delay,
          repeat: Infinity,
        }}
        className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
      >
        {number}
      </motion.div>
      <p className="text-slate-400 text-sm mt-2">{label}</p>
    </motion.div>
  );
}
