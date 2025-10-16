import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Play, Pause, RotateCcw, ChevronRight, BarChart3, Zap, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';
import { sortingAlgorithms, generateRandomArray } from '../utils/mock';

const SortingVisualizer = () => {
  const navigate = useNavigate();
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(50);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedBars, setHighlightedBars] = useState([]);
  const [sortedBars, setSortedBars] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const animationRef = useRef(null);
  const stepsRef = useRef([]);

  const algorithms = [
    { value: 'bubble', label: 'Bubble Sort', complexity: 'O(n²)' },
    { value: 'quick', label: 'Quick Sort', complexity: 'O(n log n)' },
    { value: 'merge', label: 'Merge Sort', complexity: 'O(n log n)' },
    { value: 'heap', label: 'Heap Sort', complexity: 'O(n log n)' },
    { value: 'insertion', label: 'Insertion Sort', complexity: 'O(n²)' },
    { value: 'selection', label: 'Selection Sort', complexity: 'O(n²)' }
  ];

  useEffect(() => {
    generateNewArray();
  }, [arraySize]);

  const generateNewArray = () => {
    const newArray = generateRandomArray(arraySize, 5, 500);
    setArray(newArray);
    resetVisualization();
  };

  const resetVisualization = () => {
    setIsPlaying(false);
    setComparisons(0);
    setSwaps(0);
    setCurrentStep(0);
    setHighlightedBars([]);
    setSortedBars([]);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const handleCustomInput = () => {
    try {
      const numbers = customInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n >= 1 && n <= 500);
      if (numbers.length === 0) {
        toast({ title: 'Invalid Input', description: 'Please enter valid numbers (1-500) separated by commas' });
        return;
      }
      setArray(numbers);
      setArraySize(numbers.length);
      resetVisualization();
      toast({ title: 'Success', description: `Array created with ${numbers.length} elements` });
    } catch (error) {
      toast({ title: 'Error', description: 'Invalid input format' });
    }
  };

  const startSorting = () => {
    if (isPlaying) return;
    resetVisualization();
    const { steps, comparisons: totalComps, swaps: totalSwaps } = sortingAlgorithms[algorithm](array);
    stepsRef.current = steps;
    setIsPlaying(true);
    animateSteps(0, steps, totalComps, totalSwaps);
  };

  const animateSteps = (stepIndex, steps, totalComps, totalSwaps) => {
    if (stepIndex >= steps.length) {
      setIsPlaying(false);
      setSortedBars(array.map((_, i) => i));
      setComparisons(totalComps);
      setSwaps(totalSwaps);
      return;
    }

    const step = steps[stepIndex];
    setArray([...step.array]);
    setHighlightedBars(step.comparing || []);
    if (step.sorted) setSortedBars(step.sorted);
    setCurrentStep(stepIndex + 1);
    setComparisons(step.comparisons || 0);
    setSwaps(step.swaps || 0);

    animationRef.current = setTimeout(() => {
      animateSteps(stepIndex + 1, steps, totalComps, totalSwaps);
    }, 1000 - speed * 10);
  };

  const pauseSorting = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const stepForward = () => {
    if (isPlaying || currentStep >= stepsRef.current.length) return;
    const step = stepsRef.current[currentStep];
    setArray([...step.array]);
    setHighlightedBars(step.comparing || []);
    if (step.sorted) setSortedBars(step.sorted);
    setCurrentStep(currentStep + 1);
    setComparisons(step.comparisons || 0);
    setSwaps(step.swaps || 0);
  };

  const getBarColor = (index) => {
    if (sortedBars.includes(index)) return 'bg-green-500';
    if (highlightedBars.includes(index)) return 'bg-orange-500';
    return 'bg-teal-400';
  };

  const maxValue = Math.max(...array);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <Home className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-orange-600" />
                <h1 className="text-xl font-bold text-slate-800">Sorting Algorithms</h1>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-orange-500 to-teal-500 text-white">
              {algorithms.find(a => a.value === algorithm)?.complexity}
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
            </div>

            {/* Array Size */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Array Size: {arraySize}</label>
              <Slider
                value={[arraySize]}
                onValueChange={(val) => setArraySize(val[0])}
                min={10}
                max={100}
                step={5}
                disabled={isPlaying}
              />
            </div>

            {/* Speed Control */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Speed: {speed}%
              </label>
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
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-slate-600">Comparisons</p>
                  <p className="text-lg font-bold text-orange-600">{comparisons}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-600">Swaps</p>
                  <p className="text-lg font-bold text-teal-600">{swaps}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Input */}
          <div className="mt-6 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Custom Array (comma-separated, 1-500)</label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 45, 23, 67, 12, 89"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                disabled={isPlaying}
              />
              <Button onClick={handleCustomInput} disabled={isPlaying} variant="outline">
                Apply
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={isPlaying ? pauseSorting : startSorting}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={stepForward} disabled={isPlaying} variant="outline">
              <ChevronRight className="w-4 h-4 mr-2" />
              Step
            </Button>
            <Button onClick={generateNewArray} disabled={isPlaying} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </Card>

        {/* Visualization Area */}
        <Card className="p-6 shadow-lg bg-white">
          <div className="flex items-end justify-center gap-1 h-96">
            {array.map((value, idx) => (
              <div
                key={idx}
                className={`transition-all duration-200 ${getBarColor(idx)} rounded-t-sm relative group`}
                style={{
                  height: `${(value / maxValue) * 100}%`,
                  width: `${Math.max(100 / array.length - 1, 3)}%`
                }}
              >
                {array.length <= 20 && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-700">
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-teal-400 rounded"></div>
              <span className="text-slate-600">Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-slate-600">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-slate-600">Sorted</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SortingVisualizer;
