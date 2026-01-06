// src/pages/History.jsx 
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ClockIcon, 
  DownloadIcon, 
  TrashIcon, 
  ChevronRightIcon,
  ArrowLeftIcon 
} from "../components/common/Icons";

export default function History() {
  const { sessionId } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      if (!sessionId) {
        setError("No session ID provided");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/${sessionId}`);
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistory(data.history || []);
      } catch (err) {
        console.error("History fetch error:", err);
        setError(err.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-emerald-200/50 border-t-emerald-600 rounded-full shadow-lg"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-slate-50 to-emerald-50">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-20">
          <Link 
            to="/dashboard"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold mb-6 text-lg transition-all duration-300 hover:scale-105"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            New Analysis
          </Link>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent mb-4 leading-tight">
            Analysis History
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Your previous code optimizations and carbon footprint reports
          </p>
        </div>

        {/* History Content */}
        <div className="space-y-8">
          {error ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-12 md:p-16 text-center text-orange-800 shadow-xl"
            >
              <div className="text-5xl mb-6">⚠️</div>
              <h3 className="text-3xl font-black mb-4">No History Found</h3>
              <p className="text-xl mb-8 max-w-md mx-auto">{error}</p>
              <Link 
                to="/dashboard"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-4 rounded-3xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-1"
              >
                Start New Analysis
              </Link>
            </motion.div>
          ) : history.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-slate-50 to-emerald-50 border-2 border-slate-200/50 rounded-3xl p-16 md:p-20 text-center shadow-2xl backdrop-blur-xl"
            >
              <ClockIcon className="w-24 h-24 text-slate-400 mx-auto mb-8 opacity-75" />
              <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">No analyses yet</h3>
              <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-lg mx-auto leading-relaxed">
                Run your first carbon audit to see optimization history here
              </p>
              <Link 
                to="/dashboard"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-12 py-5 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-2"
              >
                Start Carbon Audit →
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-200/50 shadow-2xl"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                      <ClockIcon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                        {history.length} Analyses
                      </h2>
                      <div className="text-lg text-slate-500">Latest first</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 text-center md:text-right">
                    Total optimizations completed
                  </div>
                </div>
              </motion.div>

              {/* History List */}
              <div className="grid gap-6">
                {history.map((item, index) => (
                  <motion.div
                    key={item._id || index}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.6 }}
                    className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-200/50 shadow-xl hover:shadow-2xl hover:border-emerald-300 hover:-translate-y-2 transition-all duration-400"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center shrink-0 mt-1">
                          <ClockIcon className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-xl md:text-2xl text-slate-900 group-hover:text-emerald-700 truncate mb-1">
                            {item.language?.toUpperCase() || "JS"} Analysis #{index + 1}
                          </div>
                          <div className="text-sm text-slate-500">
                            {new Date(item.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 lg:opacity-100 group-hover:opacity-100 transition-all lg:group-hover:translate-x-2">
                        <button 
                          className="p-3 hover:bg-slate-200/50 rounded-2xl transition-all duration-200 hover:scale-110"
                          title="Download Report"
                        >
                          <DownloadIcon className="w-5 h-5 text-slate-600" />
                        </button>
                        <button 
                          className="p-3 hover:bg-red-100 rounded-2xl transition-all duration-200 hover:scale-110"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200/50">
                        <div className="font-mono text-2xl font-black text-emerald-700 mb-1">
                          {item.fixedCode ? "✅ Fixed" : "⚠️ Pending"}
                        </div>
                        <div className="text-sm text-slate-600 uppercase tracking-wide font-medium">Status</div>
                      </div>
                      
                      {item.analysis && (
                        <>
                          <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200/50">
                            <div className="font-mono text-2xl font-black text-slate-900 mb-1">
                              {item.analysis.lines || 0}
                            </div>
                            <div className="text-sm text-slate-600 uppercase tracking-wide font-medium">Lines</div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200/50">
                            <div className="font-mono text-2xl font-black text-orange-600 mb-1">
                              {item.analysis.complexity || 0}
                            </div>
                            <div className="text-sm text-slate-600 uppercase tracking-wide font-medium">Complexity</div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-200/50 gap-4">
                      <div className="font-mono text-sm text-slate-500 bg-slate-100/80 px-4 py-2 rounded-2xl border border-slate-200/50">
                        Session: {item.sessionId?.slice(-8) || "N/A"}
                      </div>
                      <Link 
                        to={`/analyzer/${item.sessionId}`}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-2xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
                      >
                        View Details
                        <ChevronRightIcon className="w-5 h-5" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
