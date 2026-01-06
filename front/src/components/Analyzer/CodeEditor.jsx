// src/components/Analyzer/CodeEditor.jsx
import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { CheckIcon } from "../../components/common/Icons";

export default function CodeEditor({ value, onChange, className = "" }) {
  const [language, setLanguage] = useState("javascript");

  return (
    <div className={`w-full bg-slate-900/95 rounded-3xl border-2 border-slate-800/50 shadow-2xl overflow-hidden ${className}`}>
      {/* Editor Header */}
      <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-2 bg-slate-800/50 p-2 rounded-2xl">
            <div className="w-3 h-3 bg-red-500/80 rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-amber-500/80 rounded-full animate-pulse delay-100" />
            <div className="w-3 h-3 bg-emerald-500/80 rounded-full animate-pulse delay-200" />
          </div>
          <span className="text-sm font-mono text-slate-400 ml-3">code-editor.jsx</span>
        </div>
        
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-1.5 bg-slate-800/50 border border-slate-600 rounded-xl text-sm text-slate-300 focus:border-emerald-500 focus:outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      {/* Editable Code Area */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[400px] lg:h-[500px] p-6 text-base font-mono text-emerald-400 bg-transparent resize-none outline-none placeholder:text-slate-600/50 focus:placeholder-transparent"
          placeholder="// Paste your function here... Press Ctrl+V"
          spellCheck="false"
        />
        
        {/* Syntax Highlight Overlay */}
        <div className="absolute inset-0 pointer-events-none p-6">
          <Highlight theme={themes.vsDark} code={value} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className="h-[400px] lg:h-[500px] overflow-auto text-base font-mono text-emerald-400">
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line, key: i });
                  const { key, ...restLineProps } = lineProps;
                  
                  return (
                    <div key={key} {...restLineProps}>
                      {line.map((token, tokenKey) => {
                        const tokenProps = getTokenProps({ token, key: tokenKey });
                        const { key: tokenKeyProp, ...restTokenProps } = tokenProps;
                        
                        return (
                          <span key={tokenKeyProp} {...restTokenProps} />
                        );
                      })}
                    </div>
                  );
                })}
              </pre>
            )}
          </Highlight>
        </div>
      </div>
    </div>
  );
}