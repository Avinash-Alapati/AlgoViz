import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Search, Network, Map } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const Home = () => {
  const navigate = useNavigate();

  const algorithmCategories = [
    {
      title: 'Sorting Algorithms',
      description: 'Visualize how different sorting algorithms organize data',
      icon: BarChart3,
      path: '/sorting',
      gradient: 'from-orange-400 to-orange-600',
      algorithms: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Heap Sort', 'Insertion Sort', 'Selection Sort'],
      complexity: 'O(n²) to O(n log n)'
    },
    {
      title: 'Searching Algorithms',
      description: 'Watch how algorithms find elements in datasets',
      icon: Search,
      path: '/searching',
      gradient: 'from-teal-400 to-teal-600',
      algorithms: ['Linear Search', 'Binary Search', 'Jump Search', 'Interpolation Search'],
      complexity: 'O(n) to O(log n)'
    },
    {
      title: 'Graph Algorithms',
      description: 'Explore graph traversals and shortest path algorithms',
      icon: Network,
      path: '/graph',
      gradient: 'from-blue-400 to-blue-600',
      algorithms: ['BFS', 'DFS', 'Dijkstra', 'Bellman-Ford', 'Prim\'s', 'Kruskal\'s'],
      complexity: 'O(V + E) to O(V²)'
    },
    {
      title: 'Pathfinding Algorithms',
      description: 'Visualize pathfinding in 2D grids and mazes',
      icon: Map,
      path: '/pathfinding',
      gradient: 'from-green-400 to-green-600',
      algorithms: ['A* Search', 'Greedy Best-First', 'Breadth-First', 'Depth-First'],
      complexity: 'O(b^d) heuristic-based'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-teal-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
                AlgoViz
              </h1>
            </div>
            <Badge variant="secondary" className="text-sm">Interactive Learning</Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
          <h2 className="text-5xl font-bold text-slate-800 leading-tight">
            Learn Algorithms Through
            <span className="bg-gradient-to-r from-orange-500 to-teal-500 bg-clip-text text-transparent"> Visualization</span>
          </h2>
          <p className="text-xl text-slate-600">
            Watch algorithms come to life with step-by-step animations. Compare performance, understand complexity, and master data structures.
          </p>
        </div>

        {/* Algorithm Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {algorithmCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <Card 
                key={idx} 
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-slate-300 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${category.gradient}`}></div>
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs font-mono">
                      {category.complexity}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">{category.title}</CardTitle>
                    <CardDescription className="text-base">{category.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {category.algorithms.map((algo, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {algo}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    onClick={() => navigate(category.path)}
                    className={`w-full bg-gradient-to-r ${category.gradient} hover:opacity-90 transition-opacity text-white font-semibold shadow-lg`}
                  >
                    Start Visualizing
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-slate-800">Interactive Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-lg text-slate-700">Step-by-Step Control</h4>
              <p className="text-slate-600 text-sm">Play, pause, and step through each iteration manually</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center">
                <Network className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="font-semibold text-lg text-slate-700">Speed Adjustment</h4>
              <p className="text-slate-600 text-sm">Control animation speed from slow to super fast</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-lg text-slate-700">Custom & Random Data</h4>
              <p className="text-slate-600 text-sm">Input your own data or generate random datasets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-6 py-8 text-center text-slate-600">
          <p>Built with React & FastAPI • Learn DSA Interactively</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
