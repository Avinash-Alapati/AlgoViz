# Algorithm Visualizer

An interactive web application to visualize common algorithms including sorting, searching, graph traversals, and pathfinding. Watch algorithms come to life with step-by-step animations!

## Features

### 🔢 Sorting Algorithms
- Bubble Sort
- Quick Sort
- Merge Sort
- Heap Sort
- Insertion Sort
- Selection Sort

### 🔍 Searching Algorithms
- Linear Search
- Binary Search
- Jump Search
- Interpolation Search

### 🕸️ Graph Algorithms
- Breadth-First Search (BFS)
- Depth-First Search (DFS)
- Dijkstra's Algorithm
- Prim's MST (structure ready)
- Kruskal's MST (structure ready)

### 🗺️ Pathfinding Algorithms
- A* Search
- Greedy Best-First Search
- Breadth-First Search
- Depth-First Search

## Interactive Controls

- ▶️ **Play/Pause/Step** - Control animation flow
- ⚡ **Speed Adjustment** - Adjust visualization speed (1-100%)
- 🔄 **Reset** - Reset visualization to initial state
- 🎲 **Random Generation** - Generate random datasets
- ✏️ **Custom Input** - Input your own data
- 🧱 **Wall Creation** - Draw walls for pathfinding (click on grid cells)
- 🌀 **Maze Generation** - Auto-generate random mazes

## Tech Stack

- **Frontend**: React 19
- **UI Components**: Shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v7

## Installation

1. **Clone The Repo**
```bash
git clone https://github.com/Avinash-Alapati/AlgoViz.git
cd frontend
```

2. **Install dependencies**
```bash
yarn install
# or
npm install
```

3. **Start the development server**
```bash
yarn start
# or
npm start
```

4. **Open your browser**
```
http://localhost:3000
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx                    # Landing page
│   │   ├── SortingVisualizer.jsx       # Sorting algorithms
│   │   ├── SearchingVisualizer.jsx     # Searching algorithms
│   │   ├── GraphVisualizer.jsx         # Graph algorithms
│   │   └── PathfindingVisualizer.jsx   # Pathfinding algorithms
│   ├── components/
│   │   └── ui/                          # Shadcn UI components
│   ├── utils/
│   │   └── mock.js                      # Algorithm implementations
│   ├── hooks/
│   │   └── use-toast.js                 # Toast notifications
│   ├── App.js                           # Main app component
│   └── index.js                         # Entry point
├── public/
├── package.json
├── tailwind.config.js
└── craco.config.js
```

## How to Use

### Sorting Visualizer
1. Select an algorithm from the dropdown
2. Adjust array size (10-100 elements)
3. Click "Start" to begin visualization
4. Use "Step" for manual progression
5. Input custom arrays: `45, 23, 67, 12, 89`

### Searching Visualizer
1. Select a search algorithm
2. Enter a target value (1-100)
3. Click "Start Search"
4. Watch the algorithm find the target
5. Binary/Jump/Interpolation searches auto-sort the array

### Graph Visualizer
1. Choose algorithm (BFS, DFS, Dijkstra)
2. Select start node
3. Click "Start" to visualize traversal
4. Generate new random graphs with "New Graph"

### Pathfinding Visualizer
1. Select pathfinding algorithm
2. Click "Set Start" and click a cell to place start
3. Click "Set End" and click a cell to place end
4. Click cells to create walls
5. Use "Generate Maze" for random maze
6. Click "Find Path" to start visualization

## Color Coding

### Sorting
- **Teal**: Unsorted elements
- **Orange**: Currently comparing
- **Green**: Sorted elements

### Searching
- **Gray**: Unchecked elements
- **Teal**: Search range
- **Orange**: Currently checking
- **Green**: Found element

### Graph
- **Gray**: Unvisited nodes
- **Blue**: Start node
- **Orange**: Currently processing
- **Teal**: Visited nodes

### Pathfinding
- **White**: Empty cell
- **Green**: Start position
- **Red**: End position
- **Dark Gray**: Walls
- **Light Teal**: Visited cells
- **Orange**: Current cell
- **Blue**: Final path

## Performance Metrics

The app displays real-time metrics:
- **Comparisons**: Number of element comparisons
- **Swaps**: Number of element swaps (sorting)
- **Visited Nodes/Cells**: Exploration count
- **Path Length**: Shortest path length found

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Algorithm Complexity Reference

| Algorithm | Best Case | Average Case | Worst Case |
|-----------|-----------|--------------|------------|
| Bubble Sort | O(n) | O(n²) | O(n²) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) |
| Insertion Sort | O(n) | O(n²) | O(n²) |
| Selection Sort | O(n²) | O(n²) | O(n²) |
| Linear Search | O(1) | O(n) | O(n) |
| Binary Search | O(1) | O(log n) | O(log n) |
| BFS/DFS | - | O(V + E) | O(V + E) |
| Dijkstra | - | O(V²) | O(V²) |
| A* | - | O(b^d) | O(b^d) |

## Notes

- All algorithms run entirely in the browser (no backend required)
- Animations are CPU-intensive; reduce speed for better performance on slower devices
- For large arrays (>100 elements), consider using faster algorithms like Quick Sort or Merge Sort

---

**Enjoy learning algorithms visually! 🎓✨**
