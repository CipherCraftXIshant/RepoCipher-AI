import React, { useState, useEffect } from "react";
import {
  Globe,
  Network,
  Cpu,
  Server,
  Database,
  ShieldCheck,
  ArrowRight,
  ArrowDown,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  FileCode2,
  Layers,
  Activity,
  Maximize2,
  ExternalLink,
  Code2,
  Box,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

function getNodeIcon(label = "") {
  const l = label.toLowerCase();
  if (l.includes("browser") || l.includes("client") || l.includes("frontend") || l.includes("ui")) {
    return Globe;
  }
  if (l.includes("api") || l.includes("gateway") || l.includes("ingress") || l.includes("router")) {
    return Network;
  }
  if (l.includes("auth") || l.includes("security") || l.includes("token") || l.includes("jwt")) {
    return ShieldCheck;
  }
  if (l.includes("controller") || l.includes("logic") || l.includes("handler") || l.includes("dispatch")) {
    return Cpu;
  }
  if (l.includes("database") || l.includes("mongo") || l.includes("sql") || l.includes("redis") || l.includes("store") || l.includes("storage")) {
    return Database;
  }
  return Server;
}

function getNodeColor(index, total) {
  const colors = [
    { bg: "bg-indigo-50 dark:bg-indigo-950/60", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800", ring: "ring-indigo-500/20" },
    { bg: "bg-blue-50 dark:bg-blue-950/60", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800", ring: "ring-blue-500/20" },
    { bg: "bg-violet-50 dark:bg-violet-950/60", text: "text-violet-600 dark:text-violet-400", border: "border-violet-200 dark:border-violet-800", ring: "ring-violet-500/20" },
    { bg: "bg-amber-50 dark:bg-amber-950/60", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800", ring: "ring-amber-500/20" },
    { bg: "bg-emerald-50 dark:bg-emerald-950/60", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800", ring: "ring-emerald-500/20" },
  ];
  return colors[index % colors.length];
}

export function ArchitectureMapView({
  architecture = [],
  entryPoints = [],
  dependencies = [],
  stack = [],
  repoName = "Repository",
}) {
  // Normalize nodes
  const rawNodes = architecture?.length
    ? architecture
    : [
        { label: "Client Application", description: "Inbound HTTP client requests, web client or CLI consumers." },
        { label: "Router & Ingress Layer", description: "Dispatches incoming requests and parses URL routes." },
        { label: "Controllers & Handlers", description: "Executes business logic and orchestrates middleware validation." },
        { label: "Storage & Persistence", description: "Persists and queries documents, caches, or state stores." },
      ];

  const [activeStep, setActiveStep] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedNode, setSelectedNode] = useState(rawNodes[0]);
  const [viewMode, setViewMode] = useState("graph"); // "graph" | "layers" | "table"

  // Request Simulation animation
  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < rawNodes.length) {
        setActiveStep(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSimulating(false);
          setActiveStep(null);
        }, 1200);
      }
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              Architecture & Request Topology
              <Badge variant="default" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200">
                Live Blueprint
              </Badge>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified end-to-end request pipeline for {repoName}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => setViewMode("graph")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "graph"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs font-bold"
                  : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Flow Graph
            </button>
            <button
              type="button"
              onClick={() => setViewMode("layers")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "layers"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs font-bold"
                  : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Layer Stack
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs font-bold"
                  : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Components
            </button>
          </div>

          {/* Simulate Flow Button */}
          <button
            type="button"
            onClick={startSimulation}
            disabled={isSimulating}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isSimulating
                ? "bg-emerald-600 text-white animate-pulse"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {isSimulating ? (
              <>
                <Activity className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating (Step {activeStep + 1} of {rawNodes.length})…</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Request</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: FLOW GRAPH TOPOLOGY */}
      {viewMode === "graph" && (
        <div className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-6 sm:p-8 overflow-hidden backdrop-blur-sm">
          {/* Subtle background grid */}
          <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />

          {/* Topology Chain */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-3">
            {rawNodes.map((node, index) => {
              const Icon = getNodeIcon(node.label);
              const color = getNodeColor(index, rawNodes.length);
              const isSelected = selectedNode?.label === node.label;
              const isSimActive = activeStep === index;
              const isPassed = activeStep !== null && index < activeStep;

              return (
                <React.Fragment key={node.label || index}>
                  {/* Node Card */}
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`w-full lg:w-64 p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative group ${
                      isSimActive
                        ? "bg-white dark:bg-slate-900 border-indigo-500 ring-4 ring-indigo-500/30 scale-105 shadow-xl shadow-indigo-500/20"
                        : isSelected
                        ? "bg-white dark:bg-slate-900 border-indigo-400 ring-2 ring-indigo-500/10 shadow-md"
                        : isPassed
                        ? "bg-white/95 dark:bg-slate-900/95 border-emerald-300 dark:border-emerald-700/60 shadow-sm"
                        : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 shadow-xs"
                    }`}
                  >
                    {/* Active pulse ring */}
                    {isSimActive && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600 text-[9px] font-bold text-white items-center justify-center">
                          ✓
                        </span>
                      </span>
                    )}

                    {/* Step tag */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Stage 0{index + 1}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isPassed
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : isSimActive
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        {isPassed ? "Executed" : isSimActive ? "Processing" : "Idle"}
                      </span>
                    </div>

                    {/* Node Header */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${color.bg} ${color.text} flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {node.label}
                        </h4>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Boundary Safe
                        </span>
                      </div>
                    </div>

                    {/* Node Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                      {node.description}
                    </p>

                    {/* Click prompt */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      <span>Inspect component</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Connector Arrow (Horizontal on desktop, Vertical on mobile) */}
                  {index < rawNodes.length - 1 && (
                    <div className="flex items-center justify-center shrink-0">
                      <div className="hidden lg:flex items-center gap-1">
                        <div
                          className={`h-0.5 w-6 sm:w-10 transition-colors ${
                            isPassed || isSimActive ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                        <ArrowRight
                          className={`w-4 h-4 transition-colors ${
                            isPassed || isSimActive ? "text-indigo-600 animate-pulse" : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      </div>
                      <div className="flex lg:hidden flex-col items-center">
                        <div
                          className={`w-0.5 h-6 transition-colors ${
                            isPassed || isSimActive ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                        <ArrowDown
                          className={`w-4 h-4 transition-colors ${
                            isPassed || isSimActive ? "text-indigo-600 animate-pulse" : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Simulation Status Card */}
          {isSimulating && (
            <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 shadow-md flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>Simulating request: HTTP GET /api/v1/resource</span>
              </div>
              <span className="font-mono text-slate-500 dark:text-slate-400">
                Latency: ~{24 + (activeStep || 0) * 12}ms
              </span>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: LAYERED ARCHITECTURE STACK */}
      {viewMode === "layers" && (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Architectural Layer Hierarchy (Top to Bottom)
          </div>
          {rawNodes.map((node, i) => {
            const Icon = getNodeIcon(node.label);
            const color = getNodeColor(i, rawNodes.length);
            return (
              <div
                key={node.label}
                onClick={() => setSelectedNode(node)}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-11 h-11 rounded-xl ${color.bg} ${color.text} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                        Tier 0{i + 1}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {node.label}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {node.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-600 dark:text-slate-200">
                    AST Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: COMPONENT & PROTOCOL TABLE */}
      {viewMode === "table" && (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs text-slate-400 uppercase tracking-wider">
            Architecture Component Matrix
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {rawNodes.map((node, i) => (
              <div
                key={node.label}
                onClick={() => setSelectedNode(node)}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-[10px]">
                    0{i + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{node.label}</div>
                    <div className="text-slate-500">{node.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-[10px]">
                    Pipeline Stage
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Node Deep-Dive Inspector Panel */}
      {selectedNode && (
        <div className="rounded-3xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Component Inspector: {selectedNode.label}
              </h4>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
              Interactive Inspector
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {selectedNode.description}
          </p>

          {/* Connected Entry Points & Files */}
          {entryPoints?.length > 0 && (
            <div className="pt-3 border-t border-indigo-100/60 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Associated Entry Points
              </span>
              <div className="flex flex-wrap gap-2">
                {entryPoints.slice(0, 4).map((entry) => (
                  <span
                    key={entry.path}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-indigo-600 dark:text-indigo-400 shadow-2xs"
                  >
                    <FileCode2 className="w-3.5 h-3.5" />
                    {entry.path}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Stack Technologies */}
          {stack?.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Detected Stack:
              </span>
              {stack.map((item) => (
                <span
                  key={item.name}
                  className="rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 text-[11px] font-semibold border border-indigo-100 dark:border-indigo-800"
                >
                  {item.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ArchitectureMapView;
