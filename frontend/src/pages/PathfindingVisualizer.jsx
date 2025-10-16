import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Play, Pause, RotateCcw, Map, Eraser } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';

const GRID_ROWS = 20;
const GRID_COLS = 35;
const CELL_SIZE = 25;

const PathfindingVisualizer = () => {
  const navigate = useNavigate();
  const [grid, setGrid] = useState([]);
  const [algorithm, setAlgorithm] = useState('astar');
  const [startPos, setStartPos] = useState({ row: 5, col: 5 });
  const [endPos, setEndPos] = useState({ row: 15, col: 30 });
  const [isPlacing, setIsPlacing] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [visitedCells, setVisitedCells] = useState([]);
  const [pathCells, setPathCells] = useState([]);
  const [currentCell, setCurrentCell] = useState(null);
  const animationRef = useRef(null);

  const algorithms = [
    { value: 'astar', label: 'A* Search', complexity: 'O(b^d)' },
    { value: 'greedy', label: 'Greedy Best-First', complexity: 'O(b^d)' },
    { value: 'bfs', label: 'Breadth-First Search', complexity: 'O(V + E)' },
    { value: 'dfs', label: 'Depth-First Search', complexity: 'O(V + E)' }
  ];

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < GRID_COLS; col++) {
        currentRow.push({
          row,
          col,
          isWall: false
        });
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
    resetVisualization();
  };

  const resetVisualization = () => {
    setIsPlaying(false);
    setVisitedCells([]);
    setPathCells([]);
    setCurrentCell(null);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const clearWalls = () => {
    const newGrid = grid.map(row =>
      row.map(cell => ({ ...cell, isWall: false }))
    );
    setGrid(newGrid);
    resetVisualization();
  };

  const generateMaze = () => {
    const newGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        isWall: Math.random() < 0.25 &&
          !(cell.row === startPos.row && cell.col === startPos.col) &&
          !(cell.row === endPos.row && cell.col === endPos.col)
      }))
    );
    setGrid(newGrid);
    resetVisualization();
  };

  const handleCellClick = (row, col) => {
    if (isPlaying) return;

    if (isPlacing === 'start') {
      setStartPos({ row, col });
      setIsPlacing(null);
    } else if (isPlacing === 'end') {
      setEndPos({ row, col });
      setIsPlacing(null);
    } else {
      const newGrid = [...grid];
      if (!(row === startPos.row && col === startPos.col) &&
          !(row === endPos.row && col === endPos.col)) {
        newGrid[row][col].isWall = !newGrid[row][col].isWall;
        setGrid(newGrid);
      }
    }
  };

  const heuristic = (pos1, pos2) => {
    return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
  };

  const getNeighbors = (pos) => {
    const neighbors = [];
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    for (const [dr, dc] of directions) {
      const newRow = pos.row + dr;
      const newCol = pos.col + dc;

      if (newRow >= 0 && newRow < GRID_ROWS && newCol >= 0 && newCol < GRID_COLS) {
        if (!grid[newRow][newCol].isWall) {
          neighbors.push({ row: newRow, col: newCol });
        }
      }
    }

    return neighbors;
  };

  const runAStar = () => {
    const openSet = [startPos];
    const closedSet = new Set();
    const gScore = {};
    const fScore = {};
    const cameFrom = {};
    const steps = [];

    gScore[`${startPos.row},${startPos.col}`] = 0;
    fScore[`${startPos.row},${startPos.col}`] = heuristic(startPos, endPos);

    while (openSet.length > 0) {
      openSet.sort((a, b) => {
        const keyA = `${a.row},${a.col}`;
        const keyB = `${b.row},${b.col}`;
        return (fScore[keyA] || Infinity) - (fScore[keyB] || Infinity);
      });

      const current = openSet.shift();
      const currentKey = `${current.row},${current.col}`;

      steps.push({ current, visited: Array.from(closedSet).map(k => {
        const [r, c] = k.split(',').map(Number);
        return { row: r, col: c };
      }) });

      if (current.row === endPos.row && current.col === endPos.col) {
        const path = [];
        let temp = currentKey;
        while (temp) {
          const [r, c] = temp.split(',').map(Number);
          path.unshift({ row: r, col: c });
          temp = cameFrom[temp];
        }
        return { steps, path };
      }

      closedSet.add(currentKey);

      for (const neighbor of getNeighbors(current)) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (closedSet.has(neighborKey)) continue;

        const tentativeGScore = (gScore[currentKey] || 0) + 1;

        if (!openSet.find(n => n.row === neighbor.row && n.col === neighbor.col)) {
          openSet.push(neighbor);
        } else if (tentativeGScore >= (gScore[neighborKey] || Infinity)) {
          continue;
        }

        cameFrom[neighborKey] = currentKey;
        gScore[neighborKey] = tentativeGScore;
        fScore[neighborKey] = tentativeGScore + heuristic(neighbor, endPos);
      }
    }

    return { steps, path: [] };
  };

  const runBFS = () => {
    const queue = [startPos];
    const visited = new Set([`${startPos.row},${startPos.col}`]);
    const cameFrom = {};
    const steps = [];

    while (queue.length > 0) {
      const current = queue.shift();
      const currentKey = `${current.row},${current.col}`;

      steps.push({ current, visited: Array.from(visited).map(k => {
        const [r, c] = k.split(',').map(Number);
        return { row: r, col: c };
      }) });

      if (current.row === endPos.row && current.col === endPos.col) {
        const path = [];
        let temp = currentKey;
        while (temp) {
          const [r, c] = temp.split(',').map(Number);
          path.unshift({ row: r, col: c });
          temp = cameFrom[temp];
        }
        return { steps, path };
      }

      for (const neighbor of getNeighbors(current)) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(neighborKey)) {
          visited.add(neighborKey);
          cameFrom[neighborKey] = currentKey;
          queue.push(neighbor);
        }
      }
    }

    return { steps, path: [] };
  };

  const startPathfinding = () => {
    resetVisualization();
    let result;

    switch (algorithm) {
      case 'astar':
      case 'greedy':
        result = runAStar();
        break;
      case 'bfs':
        result = runBFS();
        break;
      default:
        toast({ title: 'Coming Soon', description: 'This algorithm is under development' });
        return;
    }

    setIsPlaying(true);
    animateSteps(0, result.steps, result.path);
  };

  const animateSteps = (stepIndex, steps, finalPath) => {
    if (stepIndex >= steps.length) {
      setIsPlaying(false);
      setCurrentCell(null);
      if (finalPath.length > 0) {
        setPathCells(finalPath);
        toast({ title: 'Path Found!', description: `Path length: ${finalPath.length} steps` });
      } else {
        toast({ title: 'No Path', description: 'No path found to the destination' });
      }
      return;
    }

    const step = steps[stepIndex];
    setCurrentCell(step.current);
    setVisitedCells(step.visited);

    animationRef.current = setTimeout(() => {
      animateSteps(stepIndex + 1, steps, finalPath);
    }, 1000 - speed * 10);
  };

  const pausePathfinding = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const getCellClass = (row, col) => {
    if (row === startPos.row && col === startPos.col) return 'bg-green-500';
    if (row === endPos.row && col === endPos.col) return 'bg-red-500';
    if (currentCell && row === currentCell.row && col === currentCell.col) return 'bg-orange-500';
    if (pathCells.find(p => p.row === row && p.col === col)) return 'bg-blue-400';
    if (visitedCells.find(v => v.row === row && v.col === col)) return 'bg-teal-200';
    if (grid[row] && grid[row][col] && grid[row][col].isWall) return 'bg-slate-700';
    return 'bg-white border border-slate-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <Home className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <Map className="w-6 h-6 text-green-600" />
                <h1 className="text-xl font-bold text-slate-800">Pathfinding Algorithms</h1>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              {algorithms.find(a => a.value === algorithm)?.complexity}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Control Panel */}
        <Card className="p-6 mb-6 shadow-lg">
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
              <label className="text-sm font-semibold text-slate-700">Visited Cells</label>
              <p className="text-3xl font-bold text-green-600">{visitedCells.length}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Path Length</label>
              <p className="text-3xl font-bold text-blue-600">{pathCells.length || '-'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              onClick={isPlaying ? pausePathfinding : startPathfinding}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Find Path'}
            </Button>
            <Button
              onClick={() => setIsPlacing('start')}
              disabled={isPlaying}
              variant={isPlacing === 'start' ? 'default' : 'outline'}
            >
              Set Start
            </Button>
            <Button
              onClick={() => setIsPlacing('end')}
              disabled={isPlaying}
              variant={isPlacing === 'end' ? 'default' : 'outline'}
            >
              Set End
            </Button>
            <Button onClick={generateMaze} disabled={isPlaying} variant="outline">
              Generate Maze
            </Button>
            <Button onClick={clearWalls} disabled={isPlaying} variant="outline">
              <Eraser className="w-4 h-4 mr-2" />
              Clear Walls
            </Button>
            <Button onClick={initializeGrid} disabled={isPlaying} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>
        </Card>

        {/* Grid Visualization */}
        <Card className="p-4 shadow-lg bg-white overflow-auto">
          <div className="inline-block">
            {grid.map((row, rowIdx) => (
              <div key={rowIdx} className="flex">
                {row.map((cell, colIdx) => (
                  <div
                    key={colIdx}
                    className={`transition-all duration-100 cursor-pointer hover:opacity-80 ${getCellClass(rowIdx, colIdx)}`}
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded"></div>
              <span className="text-slate-600">Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-500 rounded"></div>
              <span className="text-slate-600">End</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-slate-700 rounded"></div>
              <span className="text-slate-600">Wall</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-teal-200 rounded"></div>
              <span className="text-slate-600">Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-500 rounded"></div>
              <span className="text-slate-600">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-400 rounded"></div>
              <span className="text-slate-600">Path</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PathfindingVisualizer;
