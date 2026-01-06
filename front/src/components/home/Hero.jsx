import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, useInView, useAnimationControls } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const controls = useAnimationControls();
  const [hasAnimated, setHasAnimated] = useState(false);

  // Typing animation state
  const [codeText, setCodeText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  const codeLines = [
    "// Before: 1.2kg CO₂",
    "const data = users.map(u => ({",
    "  ...u,",
    "  score: calculateComplexScore(u)",
    "})).filter(x => x.active)",
    "",
    "// After: 0.72kg CO₂ (40% ↓)",
    "const activeUsers = users",
    "  .filter(u => u.active)",
    "  .map(u => ({",
    "    ...u,",
    "    score: calculateOptimized(u)",
    "  }))"
  ];

  const fullCode = codeLines.join('\n');

  useEffect(() => {
    if (isInView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    }
  }, [isInView, controls, hasAnimated]);

  // Typing and deleting effect
  useEffect(() => {
    let currentIndex = 0;
    let isTyping = true;
    let timeoutId;

    const type = () => {
      if (isTyping) {
        // Typing mode
        if (currentIndex <= fullCode.length) {
          setCodeText(fullCode.slice(0, currentIndex));
          currentIndex++;
          timeoutId = setTimeout(type, window.innerWidth < 768 ? 30 : 40);
        } else {
          // Switch to deleting mode after a pause
          setIsTypingComplete(true);
          setTimeout(() => {
            isTyping = false;
            setIsDeleting(true);
            type();
          }, 2000); // Pause for 2 seconds after typing completes
        }
      } else {
        // Deleting mode
        if (currentIndex >= 0) {
          setCodeText(fullCode.slice(0, currentIndex));
          currentIndex--;
          timeoutId = setTimeout(type, window.innerWidth < 768 ? 20 : 25);
        } else {
          // Switch back to typing mode after a pause
          setIsTypingComplete(false);
          setTimeout(() => {
            isTyping = true;
            setIsDeleting(false);
            type();
          }, 1000); // Pause for 1 second before retyping
        }
      }
    };

    // Start typing after a short delay
    timeoutId = setTimeout(() => {
      type();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Animated Background - Reduced on mobile */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse md:block hidden" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-sky-400/10 rounded-full blur-3xl animate-pulse delay-1000 md:block hidden" />
        <div className="absolute top-1/4 -right-20 w-60 h-60 bg-emerald-500/3 rounded-full blur-2xl animate-pulse md:hidden block" />
        <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-gradient-to-r from-emerald-400/5 to-sky-400/5 rounded-full blur-2xl animate-pulse delay-1000 md:hidden block" />
      </div>

      <div className="min-h-screen lg:h-[calc(100vh-80px)] w-full relative flex lg:flex-row flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 px-4 md:px-6 lg:px-12 overflow-hidden pt-20 pb-12 lg:py-0">
        <div
          ref={ref}
          className="w-full max-w-6xl mx-auto h-full flex lg:flex-row flex-col lg:gap-16 gap-8 justify-center lg:items-start items-center"
        >
          {/* Left Column - Main Content */}
          <motion.div 
            className="lg:w-1/2 w-full flex flex-col justify-center lg:items-start items-center gap-4 md:gap-6 lg:gap-8 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {/* Premium Badge - Smaller on mobile */}
            <motion.div
              className="inline-flex items-center gap-2 md:gap-3 bg-white/90 px-4 md:px-8 py-2 md:py-4 rounded-2xl md:rounded-3xl border border-white/60 shadow-lg md:shadow-2xl backdrop-blur-xl md:backdrop-blur-2xl ring-1 ring-white/20"
              variants={itemVariants}
            >
              <motion.div 
                className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-full shadow-lg ring-1 md:ring-2 ring-white/50"
                animate={{ 
                  scale: [1, 1.25, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <span className="text-xs md:text-base font-bold text-slate-800 tracking-wider md:tracking-widest uppercase bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text">
                AI Code Optimization
              </span>
            </motion.div>

            {/* Hero Title - Responsive sizes */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.95] md:leading-[0.9] tracking-tight md:tracking-[-0.02em] bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 bg-clip-text text-transparent drop-shadow-lg md:drop-shadow-2xl">
                <span>AI-Optimized</span><br/>
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">Sustainable</span><br/>
                <span>Cloud Code</span>
              </h1>
            </motion.div>

            {/* Description - Responsive */}
            <motion.div className="space-y-3 md:space-y-4 max-w-lg w-full" variants={itemVariants}>
              <p className="text-lg md:text-xl lg:text-2xl font-medium text-slate-700 leading-relaxed drop-shadow-sm px-4 md:px-0">
                Reduce cloud emissions by up to{" "}
                <span className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">40%</span>{" "}
                with AI-driven code analysis.
              </p>
              <p className="text-base md:text-lg text-slate-600 font-light italic w-full bg-white/60 px-4 md:px-6 py-3 rounded-2xl backdrop-blur-xl border border-slate-200/50 shadow-lg mx-auto">
                Paste your code → AI analyzes → Optimized green code
              </p>
            </motion.div>

            {/* Buttons - Stack on mobile */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full max-w-md lg:max-w-lg"
              variants={itemVariants}
            >
              <Link
                to="/dashboard"
                className="flex-1 min-h-[60px] md:h-16 px-6 md:px-8 bg-gradient-to-r from-slate-900 to-black text-white font-bold text-base md:text-lg rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl hover:shadow-3xl border border-slate-900/20 hover:from-slate-800 hover:to-gray-900 transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 group"
              >
                <span>Start Carbon Audit</span>
                <svg 
                  className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/demo"
                className="flex-1 min-h-[60px] md:h-16 px-6 md:px-8 border-2 border-slate-200 hover:border-slate-300 bg-white/80 hover:bg-white text-slate-900 font-bold text-base md:text-lg rounded-2xl md:rounded-3xl hover:shadow-xl md:hover:shadow-2xl backdrop-blur-xl transition-all duration-300 flex items-center justify-center gap-2 md:gap-3"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Live Demo
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Elements */}
          <motion.div 
            className="lg:w-1/2 w-full flex flex-col lg:items-end items-center gap-6 md:gap-8 lg:gap-12 lg:mt-0 lg:pl-12"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {/* Typing Code Terminal - Modified for no scrollbar */}
            <motion.div
              className="w-full lg:w-[500px] bg-white/95 backdrop-blur-3xl rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 border border-white/70 shadow-xl md:shadow-3xl ring-1 md:ring-2 ring-white/40"
              variants={itemVariants}
            >
              <div className="bg-gradient-to-br from-slate-900/98 via-gray-900/95 to-slate-900/98 rounded-xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-xl md:shadow-3xl border border-slate-800/50 backdrop-blur-xl h-auto min-h-[300px] md:min-h-[320px] lg:min-h-[340px] flex flex-col relative overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6 pb-4 border-b border-slate-700/60 relative">
                  <div className="flex gap-2 md:gap-3 bg-slate-800/50 p-1.5 md:p-2 rounded-xl md:rounded-2xl backdrop-blur-sm">
                    <motion.div 
                      className="w-2 h-2 md:w-4 md:h-4 bg-gradient-to-r from-red-500/90 to-red-600/90 rounded-full shadow-lg ring-1 ring-white/30"
                      animate={{ scale: [1, 1.15, 1], y: [0, -1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-2 h-2 md:w-4 md:h-4 bg-gradient-to-r from-amber-500/90 to-amber-600/90 rounded-full shadow-lg ring-1 ring-white/30"
                      animate={{ scale: [1, 1.15, 1], y: [0, -1, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-2 h-2 md:w-4 md:h-4 bg-gradient-to-r from-emerald-500/90 to-emerald-600/90 rounded-full shadow-lg ring-1 ring-white/30"
                      animate={{ scale: [1, 1.15, 1], y: [0, -1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div className="ml-2 md:ml-4 flex-1">
                    <span className="text-xs md:text-base text-slate-300 font-mono tracking-wider md:tracking-widest bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text font-semibold">
                      carbon-optimized.js
                    </span>
                  </div>
                  {/* Animation status indicator */}
                  {!isTypingComplete && (
                    <motion.div 
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${isDeleting ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {isDeleting ? 'Deleting...' : 'Typing...'}
                    </motion.div>
                  )}
                </div>
                
                {/* Typing Code - Smaller font to fit without scrollbar */}
                <pre className="text-xs md:text-sm lg:text-base font-mono font-semibold text-emerald-400 leading-relaxed md:leading-[1.6] flex-1 relative pr-2 md:pr-4 tracking-tight overflow-hidden">
                  <code>{codeText}</code>
                  <motion.span 
                    className={`inline-block w-1 h-3 md:w-1.5 md:h-5 ml-0.5 align-middle bg-gradient-to-b from-emerald-400 to-teal-500 rounded shadow-lg ${cursorVisible ? 'inline-block' : 'hidden'}`}
                    animate={{ scaleY: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </pre>

                {/* Code glow effect */}
                <div className="absolute bottom-4 left-0 w-full h-px bg-gradient-to-r from-emerald-500/30 via-transparent to-teal-500/30" />
              </div>
            </motion.div>

            {/* Stats - Responsive grid */}
            <motion.div
              className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-8 w-full lg:w-auto backdrop-blur-sm"
              variants={itemVariants}
            >
              {[
                { num: "40%", label: "CO₂ Reduction", color: "from-emerald-500 to-teal-600" },
                { num: "2x", label: "Faster", color: "from-slate-600 to-slate-800" },
                { num: "99.9%", label: "Uptime", color: "from-sky-500 to-blue-600" }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center lg:text-right">
                  <div className={`text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 drop-shadow-lg`}>
                    {stat.num}
                  </div>
                  <div className="text-xs md:text-sm text-slate-600 uppercase tracking-wider font-bold bg-white/60 px-2 py-1 rounded-full backdrop-blur-xl shadow-lg">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Hero;