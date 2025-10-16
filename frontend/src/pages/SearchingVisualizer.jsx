import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Play, Pause, RotateCcw, Search as SearchIcon, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';
import { searchingAlgorithms, generateRandomArray } from '../utils/mock';

const SearchingVisualizer = () => {
  const navigate = useNavigate();
  const [array, setArray] = useState([]);
  const [displayArray, setDisplayArray] = useState([]);
  const [arraySize, setArraySize] = useState(30);
  const [algorithm, setAlgorithm] = useState('linear');
  const [target, setTarget] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [comparisons, setComparisons] = useState(0);
  const [currentChecking, setCurrentChecking] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [searchRange, setSearchRange] = useState([]);
  const animationRef = useRef(null);
  const stepsRef = useRef([]);

  const algorithms = [
    { value: 'linear', label: 'Linear Search', complexity: 'O(n)', requiresSorted: false },
    { value: 'binary', label: 'Binary Search', complexity: 'O(log n)', requiresSorted: true },
    { value: 'jump', label: 'Jump Search', complexity: 'O(√n)', requiresSorted: true },
    { value: 'interpolation', label: 'Interpolation Search', complexity: 'O(log log n)', requiresSorted: true }
  ];

  useEffect(() => {
    generateNewArray();
  }, [arraySize]);

  const generateNewArray = () => {
    const newArray = generateRandomArray(arraySize, 1, 100);
    setArray(newArray);
    setDisplayArray(newArray);
    resetVisualization();
  };

  const resetVisualization = () => {
    setIsPlaying(false);
    setComparisons(0);
    setCurrentChecking(-1);
    setFoundIndex(-1);
    setSearchRange([]);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const startSearching = () => {
    const targetNum = parseInt(target);
    if (isNaN(targetNum) || targetNum < 1 || targetNum > 100) {
      toast({ title: 'Invalid Target', description: 'Please enter a number between 1 and 100' });
      return;
    }

    resetVisualization();
    const result = searchingAlgorithms[algorithm](array, targetNum);
    
    if (result.array) {
      setDisplayArray(result.array);
    }
    
    stepsRef.current = result.steps;
    setIsPlaying(true);
    animateSteps(0, result.steps, result.found, result.comparisons);
  };

  const animateSteps = (stepIndex, steps, finalFound, totalComps) => {
    if (stepIndex >= steps.length) {
      setIsPlaying(false);
      setComparisons(totalComps);
      if (finalFound !== -1) {
        setFoundIndex(finalFound);
        toast({ title: 'Found!', description: `Target found at index ${finalFound}` });
      } else {
        toast({ title: 'Not Found', description: 'Target not found in array' });
      }
      return;
    }

    const step = steps[stepIndex];
    setCurrentChecking(step.checking);
    setComparisons(step.comparisons);
    if (step.range) setSearchRange(step.range);
    if (step.found !== -1) setFoundIndex(step.found);

    animationRef.current = setTimeout(() => {
      animateSteps(stepIndex + 1, steps, finalFound, totalComps);
    }, 1000 - speed * 10);
  };

  const pauseSearching = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const getBarColor = (index) => {
    if (index === foundIndex) return 'bg-green-500';
    if (index === currentChecking) return 'bg-orange-500';
    if (searchRange.length === 2 && index >= searchRange[0] && index <= searchRange[1]) return 'bg-teal-300';
    return 'bg-slate-300';
  };

  const selectedAlgo = algorithms.find(a => a.value === algorithm);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <Home className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <SearchIcon className="w-6 h-6 text-teal-600" />
                <h1 className="text-xl font-bold text-slate-800">Searching Algorithms</h1>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
              {selectedAlgo?.complexity}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Control Panel */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              {selectedAlgo?.requiresSorted && (
                <p className="text-xs text-amber-600">* Array will be sorted</p>
              )}
            </div>

            {/* Target Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Target Value
              </label>
              <Input
                type="number"
                placeholder="Enter target (1-100)"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                min={1}
                max={100}
                disabled={isPlaying}
              />
            </div>

            {/* Array Size */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Array Size: {arraySize}</label>
              <Slider
                value={[arraySize]}
                onValueChange={(val) => setArraySize(val[0])}
                min={10}
                max={50}
                step={5}
                disabled={isPlaying}
              />
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
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-teal-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Comparisons</p>
              <p className="text-2xl font-bold text-teal-600">{comparisons}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Current Index</p>
              <p className="text-2xl font-bold text-orange-600">{currentChecking === -1 ? '-' : currentChecking}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Found At</p>
              <p className="text-2xl font-bold text-green-600">{foundIndex === -1 ? 'Not Found' : foundIndex}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={isPlaying ? pauseSearching : startSearching}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
              disabled={!target}
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Start Search'}
            </Button>
            <Button onClick={generateNewArray} disabled={isPlaying} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              New Array
            </Button>
          </div>
        </Card>

        {/* Visualization Area */}
        <Card className="p-6 shadow-lg bg-white">
          <div className="flex flex-wrap gap-2 justify-center">
            {displayArray.map((value, idx) => (
              <div
                key={idx}
                className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 ${getBarColor(idx)} ${
                  idx === currentChecking ? 'scale-110 shadow-lg' : ''
                } ${
                  idx === foundIndex ? 'scale-125 shadow-2xl' : ''
                }`}
              >
                <span className={idx === foundIndex || idx === currentChecking ? 'text-white' : 'text-slate-700'}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-300 rounded"></div>
              <span className="text-slate-600">Unchecked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-teal-300 rounded"></div>
              <span className="text-slate-600">Search Range</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-slate-600">Checking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-slate-600">Found</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SearchingVisualizer;
