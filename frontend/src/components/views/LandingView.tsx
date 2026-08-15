import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface LandingViewProps {
  onLaunch: () => void;
}

// 3D Brutalist Shape
const BrutalistShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[2.0, 0.5, 64, 12]} />
      <meshBasicMaterial color="#000000" wireframe={true} wireframeLinewidth={2} />
    </mesh>
  );
};

export const LandingView = ({ onLaunch }: LandingViewProps) => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 10 } }
  };

  return (
    <div className="min-h-screen w-full bg-surface-paper flex flex-col font-body-md selection:bg-primary selection:text-on-primary overflow-x-hidden">
      {/* Vertical Edge Header */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="fixed top-0 left-0 bottom-0 w-12 md:w-16 bg-primary z-30 flex flex-col items-center justify-between py-6"
      >
        <div className="w-8 h-8 md:w-10 md:h-10 bg-surface-paper text-primary flex items-center justify-center border-hard shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span className="font-label-bold text-sm md:text-base uppercase">NR</span>
        </div>
        <div className="flex-1 flex items-center justify-center min-h-0">
          <span className="text-on-primary font-headline-sm uppercase tracking-[0.4em] whitespace-nowrap text-xs md:text-sm" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            Neo-RAG Architecture V2.0
          </span>
        </div>
        <div className="w-3 h-3 md:w-4 md:h-4 bg-tertiary-orange animate-pulse border-hard shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
      </motion.div>
      {/* Hero Section */}
      <main className="flex-1 flex flex-col-reverse md:flex-row items-center justify-between p-6 md:p-12 pl-16 md:pl-24 relative overflow-x-hidden bg-surface gap-8">

        <motion.div
          className="flex flex-col items-start z-10 w-full md:w-1/2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-block bg-surface-dim border-hard px-4 py-1 mb-6 transform -rotate-2">
            <span className="font-label-bold text-label-bold uppercase text-primary">v2.0 Architecture</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="font-headline-lg text-headline-lg uppercase text-primary mb-6 leading-none tracking-tighter" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
            Speak.<br />Retrieve.<br />
            <span className="text-primary bg-tertiary-orange px-4 inline-block transform rotate-1 mt-2">Generate.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12">
            The ultimate neo-brutalist dashboard for Voice-Enabled Retrieval Augmented Generation. Built for speed, precision, and unapologetic aesthetics.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-16 md:mb-24">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLaunch}
              className="bg-tertiary-orange text-primary border-hard shadow-hard-lg py-4 px-12 font-headline-sm text-headline-sm uppercase hover:bg-primary hover:text-tertiary-orange transition-colors cursor-pointer flex items-center gap-4 group"
            >
              Enter the Matrix
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </motion.button>
            <motion.a
              href="https://github.com/atharva081106/Voice-Enabled_RAG" 
              target="_blank" 
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-surface-paper text-primary border-hard shadow-hard-lg py-4 px-8 font-headline-sm text-headline-sm uppercase hover:bg-surface-dim transition-colors cursor-pointer flex items-center gap-4 group"
            >
              <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="w-6 h-6 invert" />
              GitHub
            </motion.a>
          </motion.div>
        </motion.div>

        {/* 3D Canvas */}
        <div className="w-full md:w-1/2 h-[300px] md:h-[500px] z-0 flex items-center justify-center opacity-80 cursor-pointer">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <BrutalistShape />
          </Canvas>
        </div>
      </main>

      {/* Feature Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full border-t-hard grid grid-cols-1 md:grid-cols-3 bg-surface-paper z-10 relative pl-12 md:pl-16"
      >
        <motion.div whileHover={{ y: -10 }} className="p-8 md:p-12 border-b-hard md:border-b-0 md:border-r-hard flex flex-col gap-4 bg-surface-paper transition-colors group cursor-pointer">
          <div className="w-16 h-16 bg-tertiary-orange border-hard flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">mic</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm uppercase text-primary">Voice-First</h2>
          <p className="font-body-md text-on-surface-variant">Instant dictation and transcription powered by blazing-fast local models.</p>
        </motion.div>

        <motion.div whileHover={{ y: -10 }} className="p-8 md:p-12 border-b-hard md:border-b-0 md:border-r-hard flex flex-col gap-4 bg-surface-paper transition-colors group cursor-pointer">
          <div className="w-16 h-16 bg-primary border-hard flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-3xl">database</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm uppercase text-primary">Vector Grounding</h2>
          <p className="font-body-md text-on-surface-variant">Semantic retrieval utilizing Qdrant to ensure zero hallucinations in output.</p>
        </motion.div>

        <motion.div whileHover={{ y: -10 }} className="p-8 md:p-12 flex flex-col gap-4 bg-surface-paper transition-colors group cursor-pointer">
          <div className="w-16 h-16 bg-tertiary-orange border-hard flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">bolt</span>
          </div>
          <h2 className="font-headline-sm text-headline-sm uppercase text-primary">LLM Synthesis</h2>
          <p className="font-body-md text-on-surface-variant">Intelligent agent pipelines synthesize multiple sources into clear, actionable answers.</p>
        </motion.div>
      </motion.section>

      {/* Brutalist Footer */}
      <footer className="w-full border-t-hard bg-primary text-on-primary z-10 relative pl-12 md:pl-16">
        <div className="grid grid-cols-1 md:grid-cols-3 border-b-hard">
          <div className="p-6 border-b-hard md:border-b-0 md:border-r-hard flex flex-col justify-center">
            <h3 className="font-headline-sm text-headline-sm uppercase mb-2">Neo-RAG</h3>
            <p className="font-body-sm opacity-80">Empowering human-machine interaction through semantic grounding.</p>
          </div>
          <div className="p-6 border-b-hard md:border-b-0 md:border-r-hard flex flex-col justify-center">
            <h4 className="font-label-bold uppercase text-tertiary-orange mb-2">Resources</h4>
            <a href="#" className="font-body-sm hover:underline mb-1">Documentation</a>
            <a href="#" className="font-body-sm hover:underline mb-1">Architecture</a>
            <a href="https://github.com/atharva081106/Voice-Enabled_RAG" className="font-body-sm hover:underline">GitHub Repository</a>
          </div>
          <div className="p-6 flex flex-col justify-center">
            <h4 className="font-label-bold uppercase text-tertiary-teal mb-2">System Status</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-tertiary-teal border-hard animate-pulse"></div>
              <span className="font-body-sm">All Systems Operational</span>
            </div>
            <div className="mt-4">
              <button onClick={onLaunch} className="bg-surface-paper text-primary border-hard px-4 py-1 font-label-bold uppercase hover:bg-tertiary-orange hover:text-primary transition-colors">Launch</button>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-black">
          <span className="font-label-bold text-label-bold uppercase text-xs">&copy; 2026 NEO-RAG Initiative.</span>
          <span className="font-body-sm text-xs opacity-50 uppercase">Brutalist Design System Enabled</span>
        </div>
      </footer>
    </div>
  );
};
