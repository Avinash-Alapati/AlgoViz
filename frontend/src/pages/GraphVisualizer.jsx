import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Play, Pause, RotateCcw, Network, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';

const GraphVisualizer = () => {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [algorithm, setAlgorithm] = useState('bfs');
  const [startNode, setStartNode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [currentNode, setCurrentNode] = useState(-1);
  const [pathDistance, setPathDistance] = useState({});
  const animationRef = useRef(null);

  const algorithms = [
    { value: 'bfs', label: 'Breadth-First Search', complexity: 'O(V + E)' },
    { value: 'dfs', label: 'Depth-First Search', complexity: 'O(V + E)' },
    { value: 'dijkstra', label: 'Dijkstra\'s Algorithm', complexity: 'O(V²)' },
    { value: 'prim', label: 'Prim\'s MST', complexity: 'O(V²)' },
    { value: 'kruskal', label: 'Kruskal\'s MST', complexity: 'O(E log V)' }
  ];

  useEffect(() => {
    generateRandomGraph();
  }, []);

  const generateRandomGraph = () => {
    const numNodes = 8;
    const newNodes = [];
    const newEdges = [];
    const centerX = 400;
    const centerY = 250;
    const radius = 180;

    // Create nodes in circular layout
    for (let i = 0; i < numNodes; i++) {
      const angle = (2 * Math.PI * i) / numNodes;
      newNodes.push({
        id: i,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    }

    // Create random edges
    const edgeSet = new Set();
    for (let i = 0; i < numNodes; i++) {
      const numConnections = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < numConnections; j++) {
        const target = Math.floor(Math.random() * numNodes);
        if (target !== i) {
          const edgeKey = `${Math.min(i, target)}-${Math.max(i, target)}`;
          if (!edgeSet.has(edgeKey)) {
            edgeSet.add(edgeKey);
            newEdges.push({
              from: i,
              to: target,
              weight: Math.floor(Math.random() * 15) + 1
            });
          }
        }
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
    resetVisualization();
  };

  const resetVisualization = () => {
    setIsPlaying(false);
    setVisitedNodes([]);
    setCurrentNode(-1);
    setPathDistance({});
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const runBFS = () => {
    const visited = new Set();
    const queue = [startNode];
    const steps = [];

    visited.add(startNode);
    steps.push({ node: startNode, visited: [startNode] });

    while (queue.length > 0) {
      const current = queue.shift();
      const neighbors = edges
        .filter(e => e.from === current || e.to === current)
        .map(e => e.from === current ? e.to : e.from)
        .filter(n => !visited.has(n));

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          steps.push({ node: neighbor, visited: Array.from(visited) });
        }
      }
    }

    return steps;
  };

  const runDFS = () => {
    const visited = new Set();
    const steps = [];

    const dfsRecursive = (node) => {
      visited.add(node);
      steps.push({ node, visited: Array.from(visited) });

      const neighbors = edges
        .filter(e => e.from === node || e.to === node)
        .map(e => e.from === node ? e.to : e.from)
        .filter(n => !visited.has(n));

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfsRecursive(neighbor);
        }
      }
    };

    dfsRecursive(startNode);
    return steps;
  };

  const runDijkstra = () => {
    const distances = {};
    const visited = new Set();
    const steps = [];

    nodes.forEach(node => {
      distances[node.id] = node.id === startNode ? 0 : Infinity;
    });

    for (let i = 0; i < nodes.length; i++) {
      let minNode = -1;
      let minDist = Infinity;

      for (const node of nodes) {
        if (!visited.has(node.id) && distances[node.id] < minDist) {
          minDist = distances[node.id];
          minNode = node.id;
        }
      }

      if (minNode === -1) break;

      visited.add(minNode);
      steps.push({ node: minNode, visited: Array.from(visited), distances: { ...distances } });

      const neighbors = edges.filter(e => e.from === minNode || e.to === minNode);
      for (const edge of neighbors) {
        const neighbor = edge.from === minNode ? edge.to : edge.from;
        const newDist = distances[minNode] + edge.weight;

        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
        }
      }
    }

    return steps;
  };

  const startVisualization = () => {
    resetVisualization();
    let steps = [];

    switch (algorithm) {
      case 'bfs':
        steps = runBFS();
        break;
      case 'dfs':
        steps = runDFS();
        break;
      case 'dijkstra':
        steps = runDijkstra();
        break;
      default:
        toast({ title: 'Coming Soon', description: 'This algorithm visualization is under development' });
        return;
    }

    setIsPlaying(true);
    animateSteps(0, steps);
  };

  const animateSteps = (stepIndex, steps) => {
    if (stepIndex >= steps.length) {
      setIsPlaying(false);
      setCurrentNode(-1);
      toast({ title: 'Complete', description: 'Graph traversal completed!' });
      return;
    }

    const step = steps[stepIndex];
    setCurrentNode(step.node);
    setVisitedNodes(step.visited);
    if (step.distances) setPathDistance(step.distances);

    animationRef.current = setTimeout(() => {
      animateSteps(stepIndex + 1, steps);
    }, 1000 - speed * 10);
  };

  const pauseVisualization = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const getNodeColor = (nodeId) => {
    if (nodeId === currentNode) return 'fill-orange-500 stroke-orange-600';
    if (visitedNodes.includes(nodeId)) return 'fill-teal-400 stroke-teal-600';
    if (nodeId === startNode) return 'fill-blue-500 stroke-blue-600';
    return 'fill-slate-200 stroke-slate-400';
  };

  const getEdgeColor = (edge) => {
    if (visitedNodes.includes(edge.from) && visitedNodes.includes(edge.to)) {
      return 'stroke-teal-400';
    }
    return 'stroke-slate-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <Home className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <Network className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-slate-800">Graph Algorithms</h1>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              {algorithms.find(a => a.value === algorithm)?.complexity}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Control Panel */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Algorithm Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Algorithm</label>
              <Select value={algorithm} onValueChange={(val) => { setAlgorithm(val); resetVisualization(); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {algorithms.map(algo => (
                    <SelectItem key={algo.value} value={algo.value}>
                      {algo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Node */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Start Node</label>
              <Select value={startNode.toString()} onValueChange={(val) => setStartNode(parseInt(val))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map(node => (
                    <SelectItem key={node.id} value={node.id.toString()}>
                      Node {node.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speed Control */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Speed: {speed}%</label>
              <Slider
                value={[speed]}
                onValueChange={(val) => setSpeed(val[0])}
                min={1}
                max={100}
                step={1}
              />
            </div>

            {/* Stats */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Visited Nodes</label>
              <p className="text-3xl font-bold text-blue-600">{visitedNodes.length}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={isPlaying ? pauseVisualization : startVisualization}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={generateRandomGraph} disabled={isPlaying} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              New Graph
            </Button>
          </div>
        </Card>

        {/* Visualization Area */}
        <Card className="p-6 shadow-lg bg-white">
          <svg width="800" height="500" className="mx-auto">
            {/* Draw edges */}
            {edges.map((edge, idx) => {
              const fromNode = nodes[edge.from];
              const toNode = nodes[edge.to];
              return (
                <g key={idx}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    className={`${getEdgeColor(edge)} transition-all duration-300`}
                    strokeWidth="3"
                  />
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2}
                    className="text-xs fill-slate-600 font-semibold"
                    textAnchor="middle"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Draw nodes */}
            {nodes.map(node => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="25"
                  className={`${getNodeColor(node.id)} transition-all duration-300 stroke-2`}
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  className="text-sm font-bold fill-slate-800"
                  textAnchor="middle"
                >
                  {node.id}
                </text>
                {algorithm === 'dijkstra' && pathDistance[node.id] !== undefined && pathDistance[node.id] !== Infinity && (
                  <text
                    x={node.x}
                    y={node.y - 35}
                    className="text-xs font-semibold fill-blue-600"
                    textAnchor="middle"
                  >
                    d: {pathDistance[node.id]}
                  </text>
                )}
              </g>
            ))}
          </svg>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-200 border-2 border-slate-400 rounded-full"></div>
              <span className="text-slate-600">Unvisited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 border-2 border-blue-600 rounded-full"></div>
              <span className="text-slate-600">Start Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 border-2 border-orange-600 rounded-full"></div>
              <span className="text-slate-600">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-teal-400 border-2 border-teal-600 rounded-full"></div>
              <span className="text-slate-600">Visited</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GraphVisualizer;
