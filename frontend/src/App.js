import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SortingVisualizer from './pages/SortingVisualizer';
import SearchingVisualizer from './pages/SearchingVisualizer';
import GraphVisualizer from './pages/GraphVisualizer';
import PathfindingVisualizer from './pages/PathfindingVisualizer';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sorting" element={<SortingVisualizer />} />
          <Route path="/searching" element={<SearchingVisualizer />} />
          <Route path="/graph" element={<GraphVisualizer />} />
          <Route path="/pathfinding" element={<PathfindingVisualizer />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
