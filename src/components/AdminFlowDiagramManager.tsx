import AppAPI from "@/api/admin/app/api";
import ScreenAPI from "@/api/admin/screen/api";
import { TAppRes } from "@/api/admin/app/type";
import { TScreenRes } from "@/api/admin/screen/type";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
  Controls,
  Edge,
  Handle,
  MarkerType,
  MiniMap,
  Node,
  NodeProps,
  NodeToolbar,
  NodeTypes,
  Position,
  ReactFlow,
  ReactFlowInstance,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  ChevronDown,
  Circle,
  Diamond,
  GitBranch,
  Loader2,
  Play,
  Plus,
  RotateCcw,
  Save,
  Square,
  Trash2,
  XCircle,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------
/**
 * DEV NOTE — Current persistence strategy & migration path to DB
 * ---------------------------------------------------------------
 * RIGHT NOW: Diagrams are stored in localStorage under the key
 *   `uxboard:flow_diagram_<appId>`
 *
 * Each saved value is a JSON object with the shape:
 *   {
 *     nodes: Node[],   // XYFlow Node — includes id, type, position, data
 *     edges: Edge[],   // XYFlow Edge — includes id, source, target, markerEnd, animated
 *   }
 *
 * TO MIGRATE TO DATABASE:
 * ---------------------------------------------------------------
 * Recommended MongoDB schema for a `flow_diagrams` collection:
 *
 *   {
 *     _id:       ObjectId,
 *     app:       ObjectId  // ref: App
 *     nodes:     Array<{
 *                  id:       string,
 *                  type:     'startNode' | 'endNode' | 'stepNode' | 'decisionNode' | 'screenNode',
 *                  position: { x: number, y: number },
 *                  data:     Record<string, unknown>  // label, description, image, screenId, …
 *                }>,
 *     edges:     Array<{
 *                  id:       string,
 *                  source:   string,
 *                  target:   string,
 *                  animated: boolean,
 *                  markerEnd?: { type: string }
 *                }>,
 *     createdBy: ObjectId   // ref: User (admin)
 *     updatedBy: ObjectId
 *     createdAt: Date
 *     updatedAt: Date
 *   }
 *
 * INDEX:  unique compound index on { app: 1 }  (one diagram per app).
 *
 * API endpoints needed:
 *   GET    /admin/flow-diagram/:appId   → load diagram (returns null if none)
 *   PUT    /admin/flow-diagram/:appId   → upsert full diagram (nodes + edges)
 *   DELETE /admin/flow-diagram/:appId   → delete diagram for an app
 *
 * FE changes required:
 *   1. Replace `loadDiagram()` with an axios GET call.
 *   2. Replace `saveDiagram()` with an axios PUT call (debounce or on-save-btn).
 *   3. Add a `hasDiagram` field to the GET /admin/apps list response (or derive
 *      it with a separate aggregation) so the dropdown badge stays accurate
 *      without fetching every diagram individually.
 * ---------------------------------------------------------------
 */
const STORAGE_KEY = (appId: string) => `uxboard:flow_diagram_${appId}`;

interface SavedDiagram {
  nodes: Node[];
  edges: Edge[];
}

/** Returns true when a saved diagram exists for this appId (localStorage). */
const hasDiagram = (appId: string): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY(appId)) !== null;
  } catch {
    return false;
  }
};

const loadDiagram = (appId: string): SavedDiagram | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(appId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveDiagram = (appId: string, nodes: Node[], edges: Edge[]) => {
  localStorage.setItem(STORAGE_KEY(appId), JSON.stringify({ nodes, edges }));
};

// ---------------------------------------------------------------------------
// Default diagram template
// ---------------------------------------------------------------------------
const defaultNodes = (appName: string): Node[] => [
  {
    id: "start",
    type: "startNode",
    position: { x: 300, y: 50 },
    data: { label: "App Launch" },
  },
  {
    id: "home",
    type: "stepNode",
    position: { x: 300, y: 180 },
    data: { label: `${appName} Home`, description: "" },
  },
];

const defaultEdges: Edge[] = [
  {
    id: "e-start-home",
    source: "start",
    target: "home",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

// ---------------------------------------------------------------------------
// Shared delete toolbar
// ---------------------------------------------------------------------------
function DeleteToolbar({ id }: { id: string }) {
  const { deleteElements } = useReactFlow();
  return (
    <NodeToolbar isVisible position={Position.Top} align="end">
      <button
        title="Delete node"
        onClick={() => deleteElements({ nodes: [{ id }] })}
        className="flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-semibold shadow-md transition-colors"
      >
        <Trash2 className="w-3 h-3" />
        Delete
      </button>
    </NodeToolbar>
  );
}

// ---------------------------------------------------------------------------
// Custom Node components
// ---------------------------------------------------------------------------
function StartNode({ id, data, selected }: NodeProps) {
  return (
    <>
      {selected && <DeleteToolbar id={id} />}
      <div className="flex items-center justify-center px-5 py-2 bg-emerald-500 text-white rounded-full shadow-md text-sm font-semibold min-w-[120px]">
        <Handle type="source" position={Position.Top} id="top" className="!bg-emerald-700" />
        <Handle type="source" position={Position.Left} id="left" className="!bg-emerald-700" />
        <Play className="w-3 h-3 mr-1.5" />
        {data.label as string}
        <Handle type="source" position={Position.Right} id="right" className="!bg-emerald-700" />
        <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-emerald-700" />
      </div>
    </>
  );
}

function EndNode({ id, data, selected }: NodeProps) {
  return (
    <>
      {selected && <DeleteToolbar id={id} />}
      <div className="flex items-center justify-center px-5 py-2 bg-rose-500 text-white rounded-full shadow-md text-sm font-semibold min-w-[120px]">
        <Handle type="target" position={Position.Top} id="top" className="!bg-rose-700" />
        <Handle type="target" position={Position.Left} id="left" className="!bg-rose-700" />
        <XCircle className="w-3 h-3 mr-1.5" />
        {data.label as string}
        <Handle type="target" position={Position.Right} id="right" className="!bg-rose-700" />
        <Handle type="target" position={Position.Bottom} id="bottom" className="!bg-rose-700" />
      </div>
    </>
  );
}

function StepNode({ id, data, selected }: NodeProps) {
  return (
    <>
      {selected && <DeleteToolbar id={id} />}
      <div
        className={`px-4 py-3 bg-white border-2 rounded-lg shadow-sm min-w-[150px] transition-colors ${
          selected ? "border-blue-500" : "border-gray-200"
        }`}
      >
        <Handle type="target" position={Position.Top} id="top" className="!bg-blue-400" />
        <Handle type="target" position={Position.Left} id="left" className="!bg-blue-400" />
        <div className="text-sm font-semibold text-gray-800">{data.label as string}</div>
        {(data.description as string) && (
          <div className="text-xs text-gray-500 mt-1">{data.description as string}</div>
        )}
        <Handle type="source" position={Position.Right} id="right" className="!bg-blue-400" />
        <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-blue-400" />
      </div>
    </>
  );
}

function DecisionNode({ id, data, selected }: NodeProps) {
  return (
    <>
      {selected && <DeleteToolbar id={id} />}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 160, height: 80 }}
      >
        <Handle type="target" position={Position.Top} id="top" className="!bg-amber-400" />
        <Handle type="target" position={Position.Left} id="left" className="!bg-amber-400" />
        <svg
          width="160"
          height="80"
          viewBox="0 0 160 80"
          className="absolute inset-0"
        >
          <polygon
            points="80,4 156,40 80,76 4,40"
            fill="white"
            stroke={selected ? "#3b82f6" : "#d97706"}
            strokeWidth="2"
          />
        </svg>
        <span className="relative z-10 text-xs font-semibold text-gray-800 text-center px-6 leading-tight">
          {data.label as string}
        </span>
        <Handle type="source" position={Position.Right} id="right" className="!bg-amber-400" />
        <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-amber-400" />
      </div>
    </>
  );
}

function ScreenNode({ id, data, selected }: NodeProps) {
  return (
    <>
      {selected && <DeleteToolbar id={id} />}
      <div
        className={`bg-white border-2 rounded-xl shadow-md overflow-hidden w-[120px] transition-colors ${
          selected ? "border-purple-500" : "border-gray-200"
        }`}
      >
        <Handle type="target" position={Position.Top} id="top" className="!bg-purple-400" />
        <Handle type="target" position={Position.Left} id="left" className="!bg-purple-400" />
        <div className="aspect-[9/16] overflow-hidden bg-gray-100">
          {(data.image as string) ? (
            <img
              src={data.image as string}
              alt={data.label as string}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
              No preview
            </div>
          )}
        </div>
        <div className="p-2 bg-white">
          <p className="text-xs font-medium text-gray-700 truncate">{data.label as string}</p>
          {(data.category as string) && (
            <p className="text-[10px] text-gray-400 truncate">{data.category as string}</p>
          )}
        </div>
        <Handle type="source" position={Position.Right} id="right" className="!bg-purple-400" />
        <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-purple-400" />
      </div>
    </>
  );
}

const nodeTypes: NodeTypes = {
  startNode: StartNode,
  endNode: EndNode,
  stepNode: StepNode,
  decisionNode: DecisionNode,
  screenNode: ScreenNode,
};

// ---------------------------------------------------------------------------
// Node type selector palette
// ---------------------------------------------------------------------------
interface NodePaletteItem {
  type: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const nodePalette: NodePaletteItem[] = [
  { type: "stepNode", label: "Step", icon: <Square className="w-4 h-4" />, color: "bg-blue-50 border-blue-200 text-blue-700" },
  { type: "decisionNode", label: "Decision", icon: <Diamond className="w-4 h-4" />, color: "bg-amber-50 border-amber-200 text-amber-700" },
  { type: "startNode", label: "Start", icon: <Play className="w-4 h-4" />, color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { type: "endNode", label: "End", icon: <Circle className="w-4 h-4" />, color: "bg-rose-50 border-rose-200 text-rose-700" },
];

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function AdminFlowDiagramManager() {
  const { toast } = useToast();

  // App selector state
  const [apps, setApps] = useState<TAppRes[]>([]);
  const [selectedApp, setSelectedApp] = useState<TAppRes | null>(null);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appDropdownOpen, setAppDropdownOpen] = useState(false);
  const [appSearch, setAppSearch] = useState("");

  // Tracks which app IDs have a saved diagram in localStorage.
  // DEV NOTE: Replace with a Set returned from the server (e.g. GET /admin/flow-diagram/exists)
  //           once persistence moves to DB.
  const [diagramExists, setDiagramExists] = useState<Set<string>>(new Set());

  // Screens panel state
  const [screens, setScreens] = useState<TScreenRes[]>([]);
  const [loadingScreens, setLoadingScreens] = useState(false);
  const [screenSearch, setScreenSearch] = useState("");

  // Node editing state
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Load apps on mount
  useEffect(() => {
    AppAPI.getAll()
      .then((res) => {
        const list: TAppRes[] = res.data ?? [];
        setApps(list);
        // DEV NOTE: When DB is ready, replace this with a single API call:
        //   GET /admin/flow-diagram/exists  → returns string[] of appIds that have a diagram.
        //   Then: setDiagramExists(new Set(res.data.appIds));
        const existing = new Set(list.map((a) => a._id).filter((id) => hasDiagram(id)));
        setDiagramExists(existing);
      })
      .catch(() => setApps([]))
      .finally(() => setLoadingApps(false));
  }, []);

  // Load screens when app changes, and load saved diagram
  useEffect(() => {
    if (!selectedApp) return;

    // Load saved diagram or create default
    const saved = loadDiagram(selectedApp._id);
    if (saved) {
      setNodes(saved.nodes);
      setEdges(saved.edges);
    } else {
      setNodes(defaultNodes(selectedApp.name));
      setEdges(defaultEdges);
    }

    // Load screens for this app
    setLoadingScreens(true);
    ScreenAPI.getAll({ app: selectedApp._id })
      .then((res) => setScreens(res.data ?? []))
      .catch(() => setScreens([]))
      .finally(() => setLoadingScreens(false));
  }, [selectedApp]);

  // Clear selected node when nodes change
  useEffect(() => {
    if (selectedNode) {
      const found = nodes.find((n) => n.id === selectedNode.id);
      if (!found) setSelectedNode(null);
    }
  }, [nodes]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          { ...params, animated: false, markerEnd: { type: MarkerType.ArrowClosed } },
          eds
        )
      ),
    []
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setEditLabel((node.data.label as string) ?? "");
    setEditDescription((node.data.description as string) ?? "");
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Save node label edits back to the graph
  const applyNodeEdit = () => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? { ...n, data: { ...n.data, label: editLabel, description: editDescription } }
          : n
      )
    );
    setSelectedNode((prev) =>
      prev ? { ...prev, data: { ...prev.data, label: editLabel, description: editDescription } } : null
    );
  };

  // Delete selected node
  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
    );
    setSelectedNode(null);
  };

  // Add a blank node of a given type
  const addNode = (type: string) => {
    const id = `node_${Date.now()}`;
    const viewport = rfInstance?.getViewport() ?? { x: 0, y: 0, zoom: 1 };
    const wrapperRect = reactFlowWrapper.current?.getBoundingClientRect();
    const centerX = wrapperRect ? (wrapperRect.width / 2 - viewport.x) / viewport.zoom : 300;
    const centerY = wrapperRect ? (wrapperRect.height / 2 - viewport.y) / viewport.zoom : 200;

    const newNode: Node = {
      id,
      type,
      position: { x: centerX - 75, y: centerY - 40 },
      data: {
        label: type === "startNode" ? "Start" : type === "endNode" ? "End" : type === "decisionNode" ? "Decision?" : "New Step",
        description: "",
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Add a screen from the left panel as a ScreenNode
  const addScreenNode = (screen: TScreenRes) => {
    const id = `screen_${screen._id}`;
    if (nodes.find((n) => n.id === id)) {
      toast({ title: "Already on canvas", description: `"${screen.name}" is already in the diagram.` });
      return;
    }
    const viewport = rfInstance?.getViewport() ?? { x: 0, y: 0, zoom: 1 };
    const wrapperRect = reactFlowWrapper.current?.getBoundingClientRect();
    const centerX = wrapperRect ? (wrapperRect.width / 2 - viewport.x) / viewport.zoom : 300;
    const centerY = wrapperRect ? (wrapperRect.height / 2 - viewport.y) / viewport.zoom : 200;

    const newNode: Node = {
      id,
      type: "screenNode",
      position: { x: centerX - 60, y: centerY - 100 },
      data: {
        label: screen.name,
        image: screen.image,
        category: screen.category ?? "",
        screenId: screen._id,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Save to localStorage
  const handleSave = () => {
    if (!selectedApp) return;
    saveDiagram(selectedApp._id, nodes, edges);
    // Keep the indicator in sync after saving
    setDiagramExists((prev) => new Set([...prev, selectedApp._id]));
    toast({ title: "Saved!", description: `Flow diagram for "${selectedApp.name}" has been saved.` });
  };

  // Clear canvas
  const handleClear = () => {
    if (!selectedApp) return;
    setNodes(defaultNodes(selectedApp.name));
    setEdges(defaultEdges);
    setSelectedNode(null);
    toast({ title: "Canvas reset", description: "Diagram has been reset to default." });
  };

  const filteredApps = apps.filter((a) =>
    a.name.toLowerCase().includes(appSearch.toLowerCase())
  );
  const filteredScreens = screens.filter((s) =>
    s.name.toLowerCase().includes(screenSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen" style={{ height: "calc(100vh - 140px)" }}>
      {/* ── Top toolbar ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pb-4 flex-wrap">
        {/* App Selector */}
        <div className="relative">
          <button
            onClick={() => setAppDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 min-w-[220px] text-left"
          >
            {loadingApps ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            ) : (
              <GitBranch className="w-4 h-4 text-blue-500" />
            )}
            <span className="text-sm font-medium flex-1 truncate">
              {selectedApp ? selectedApp.name : "Select App…"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {appDropdownOpen && (
            <div className="absolute z-50 top-full mt-1 left-0 w-72 bg-white border rounded-xl shadow-xl">
              <div className="p-2 border-b">
                <input
                  className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Search apps…"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  autoFocus
                />
              </div>
              <ul className="max-h-64 overflow-y-auto py-1">
                {filteredApps.length === 0 && (
                  <li className="px-4 py-3 text-sm text-gray-400 text-center">No apps found</li>
                )}
                {filteredApps.map((app) => {
                  const exists = diagramExists.has(app._id);
                  return (
                  <li key={app._id}>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-50 text-left"
                      onClick={() => {
                        setSelectedApp(app);
                        setAppDropdownOpen(false);
                        setAppSearch("");
                        setSelectedNode(null);
                      }}
                    >
                      {app.iconUrl && (
                        <img src={app.iconUrl} alt="" className="w-6 h-6 rounded object-cover" />
                      )}
                      <span className="truncate flex-1">{app.name}</span>
                      {exists ? (
                        <span
                          title="Diagram saved"
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold shrink-0"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                          Saved
                        </span>
                      ) : (
                        <span
                          title="No diagram yet"
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-semibold shrink-0"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" />
                          New
                        </span>
                      )}
                    </button>
                  </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Node palette */}
        {selectedApp && (
          <div className="flex items-center gap-2 flex-wrap">
            {nodePalette.map((item) => (
              <button
                key={item.type}
                title={`Add ${item.label} node`}
                onClick={() => addNode(item.type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg ${item.color} hover:opacity-80 transition-opacity`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Save / Clear */}
        {selectedApp && (
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={handleClear}>
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1.5" />
              Save Diagram
            </Button>
          </div>
        )}
      </div>

      {/* ── Main body ────────────────────────────────────────────────────── */}
      {!selectedApp ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <GitBranch className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-400">Select an app to get started</h3>
          <p className="text-sm text-gray-400 mt-1">
            Choose an app from the dropdown above to build its user flow diagram.
          </p>
        </div>
      ) : (
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* ── Left: Screen library ───────────────────────────────────── */}
          <div className="w-56 flex-none flex flex-col bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="px-3 py-2.5 border-b bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                App Screens
              </p>
              <input
                className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Search screens…"
                value={screenSearch}
                onChange={(e) => setScreenSearch(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto py-2 px-2 space-y-2">
              {loadingScreens && (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              )}
              {!loadingScreens && filteredScreens.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No screens found</p>
              )}
              {filteredScreens.map((screen) => (
                <button
                  key={screen._id}
                  title={`Add "${screen.name}" to diagram`}
                  onClick={() => addScreenNode(screen)}
                  className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 text-left transition-colors"
                >
                  <div className="w-9 h-16 flex-none rounded overflow-hidden bg-gray-100">
                    {screen.image ? (
                      <img
                        src={screen.image}
                        alt={screen.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-700 leading-snug line-clamp-2">
                      {screen.name}
                    </p>
                    {screen.category && (
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">{screen.category}</p>
                    )}
                  </div>
                  <Plus className="w-3.5 h-3.5 text-gray-300 flex-none ml-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Center: Flow canvas ─────────────────────────────────────── */}
          <div className="flex-1 rounded-xl overflow-hidden border shadow-sm" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onInit={setRfInstance}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              deleteKeyCode="Delete"
              style={{ background: "#f8fafc" }}
            >
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#d1d5db" />
              <Controls />
              <MiniMap
                nodeStrokeColor="#94a3b8"
                nodeColor="#e2e8f0"
                maskColor="rgba(248,250,252,0.7)"
              />
            </ReactFlow>
          </div>

          {/* ── Right: Node editor ─────────────────────────────────────── */}
          <div className="w-60 flex-none bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {selectedNode ? "Edit Node" : "Properties"}
              </p>
            </div>

            {!selectedNode ? (
              <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                <p className="text-sm text-gray-400">Click a node on the canvas to edit its properties.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                  <input
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyNodeEdit()}
                  />
                </div>

                {(selectedNode.type === "stepNode" || selectedNode.type === "decisionNode") && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <textarea
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <Button size="sm" className="w-full" onClick={applyNodeEdit}>
                    Apply Changes
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-rose-600 border-rose-200 hover:bg-rose-50"
                    onClick={deleteSelectedNode}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Delete Node
                  </Button>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-[10px] text-gray-400">
                    Node type: <span className="font-mono">{selectedNode.type}</span>
                  </p>
                  <p className="text-[10px] text-gray-400">
                    ID: <span className="font-mono text-[9px]">{selectedNode.id}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
