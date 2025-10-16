// Mock data and algorithm implementations

export const generateRandomArray = (size, min = 5, max = 500) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

// Sorting Algorithm Implementations
export const sortingAlgorithms = {
  bubble: (arr) => {
    const array = [...arr];
    const steps = [];
    let comparisons = 0;
    let swaps = 0;
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          comparisons,
          swaps
        });

        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          swaps++;
          steps.push({
            array: [...array],
            comparing: [j, j + 1],
            comparisons,
            swaps
          });
        }
      }
      steps.push({
        array: [...array],
        comparing: [],
        sorted: Array.from({ length: n - i }, (_, idx) => n - 1 - idx),
        comparisons,
        swaps
      });
    }

    return { steps, comparisons, swaps };
  },

  selection: (arr) => {
    const array = [...arr];
    const steps = [];
    let comparisons = 0;
    let swaps = 0;
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        comparisons++;
        steps.push({
          array: [...array],
          comparing: [minIdx, j],
          comparisons,
          swaps
        });
        if (array[j] < array[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        [array[i], array[minIdx]] = [array[minIdx], array[i]];
        swaps++;
        steps.push({
          array: [...array],
          comparing: [i, minIdx],
          comparisons,
          swaps
        });
      }
      steps.push({
        array: [...array],
        comparing: [],
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
        comparisons,
        swaps
      });
    }

    return { steps, comparisons, swaps };
  },

  insertion: (arr) => {
    const array = [...arr];
    const steps = [];
    let comparisons = 0;
    let swaps = 0;
    const n = array.length;

    for (let i = 1; i < n; i++) {
      let key = array[i];
      let j = i - 1;

      while (j >= 0 && array[j] > key) {
        comparisons++;
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          comparisons,
          swaps
        });
        array[j + 1] = array[j];
        swaps++;
        j--;
      }
      if (j >= 0) comparisons++;
      array[j + 1] = key;
      steps.push({
        array: [...array],
        comparing: [],
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
        comparisons,
        swaps
      });
    }

    return { steps, comparisons, swaps };
  },

  merge: (arr) => {
    const steps = [];
    let comparisons = 0;
    let swaps = 0;

    const merge = (array, left, mid, right) => {
      const leftArr = array.slice(left, mid + 1);
      const rightArr = array.slice(mid + 1, right + 1);
      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length) {
        comparisons++;
        steps.push({
          array: [...array],
          comparing: [left + i, mid + 1 + j],
          comparisons,
          swaps
        });

        if (leftArr[i] <= rightArr[j]) {
          array[k] = leftArr[i];
          i++;
        } else {
          array[k] = rightArr[j];
          j++;
        }
        swaps++;
        k++;
      }

      while (i < leftArr.length) {
        array[k] = leftArr[i];
        i++;
        k++;
        swaps++;
      }

      while (j < rightArr.length) {
        array[k] = rightArr[j];
        j++;
        k++;
        swaps++;
      }
    };

    const mergeSort = (array, left, right) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        mergeSort(array, left, mid);
        mergeSort(array, mid + 1, right);
        merge(array, left, mid, right);
      }
    };

    const array = [...arr];
    mergeSort(array, 0, array.length - 1);
    return { steps, comparisons, swaps };
  },

  quick: (arr) => {
    const steps = [];
    let comparisons = 0;
    let swaps = 0;

    const partition = (array, low, high) => {
      const pivot = array[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        comparisons++;
        steps.push({
          array: [...array],
          comparing: [j, high],
          comparisons,
          swaps
        });

        if (array[j] < pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
          swaps++;
          steps.push({
            array: [...array],
            comparing: [i, j],
            comparisons,
            swaps
          });
        }
      }

      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      swaps++;
      steps.push({
        array: [...array],
        comparing: [i + 1, high],
        comparisons,
        swaps
      });

      return i + 1;
    };

    const quickSort = (array, low, high) => {
      if (low < high) {
        const pi = partition(array, low, high);
        quickSort(array, low, pi - 1);
        quickSort(array, pi + 1, high);
      }
    };

    const array = [...arr];
    quickSort(array, 0, array.length - 1);
    return { steps, comparisons, swaps };
  },

  heap: (arr) => {
    const steps = [];
    let comparisons = 0;
    let swaps = 0;

    const heapify = (array, n, i) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n) {
        comparisons++;
        steps.push({
          array: [...array],
          comparing: [left, largest],
          comparisons,
          swaps
        });
        if (array[left] > array[largest]) {
          largest = left;
        }
      }

      if (right < n) {
        comparisons++;
        steps.push({
          array: [...array],
          comparing: [right, largest],
          comparisons,
          swaps
        });
        if (array[right] > array[largest]) {
          largest = right;
        }
      }

      if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        swaps++;
        steps.push({
          array: [...array],
          comparing: [i, largest],
          comparisons,
          swaps
        });
        heapify(array, n, largest);
      }
    };

    const array = [...arr];
    const n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(array, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      [array[0], array[i]] = [array[i], array[0]];
      swaps++;
      steps.push({
        array: [...array],
        comparing: [0, i],
        sorted: Array.from({ length: n - i }, (_, idx) => n - 1 - idx),
        comparisons,
        swaps
      });
      heapify(array, i, 0);
    }

    return { steps, comparisons, swaps };
  }
};

// Searching Algorithm Implementations
export const searchingAlgorithms = {
  linear: (arr, target) => {
    const steps = [];
    let comparisons = 0;

    for (let i = 0; i < arr.length; i++) {
      comparisons++;
      steps.push({
        checking: i,
        comparisons,
        found: arr[i] === target ? i : -1
      });
      if (arr[i] === target) {
        return { steps, found: i, comparisons };
      }
    }

    return { steps, found: -1, comparisons };
  },

  binary: (arr, target) => {
    const sortedArr = [...arr].sort((a, b) => a - b);
    const steps = [];
    let comparisons = 0;
    let left = 0;
    let right = sortedArr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      comparisons++;
      steps.push({
        checking: mid,
        range: [left, right],
        comparisons,
        found: sortedArr[mid] === target ? mid : -1
      });

      if (sortedArr[mid] === target) {
        return { steps, found: mid, comparisons, array: sortedArr };
      } else if (sortedArr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return { steps, found: -1, comparisons, array: sortedArr };
  },

  jump: (arr, target) => {
    const sortedArr = [...arr].sort((a, b) => a - b);
    const steps = [];
    let comparisons = 0;
    const n = sortedArr.length;
    const jump = Math.floor(Math.sqrt(n));
    let prev = 0;

    while (sortedArr[Math.min(jump, n) - 1] < target) {
      comparisons++;
      steps.push({
        checking: Math.min(jump, n) - 1,
        comparisons,
        found: -1
      });
      prev = jump;
      jump += Math.floor(Math.sqrt(n));
      if (prev >= n) {
        return { steps, found: -1, comparisons, array: sortedArr };
      }
    }

    while (sortedArr[prev] < target) {
      comparisons++;
      steps.push({
        checking: prev,
        comparisons,
        found: -1
      });
      prev++;
      if (prev === Math.min(jump, n)) {
        return { steps, found: -1, comparisons, array: sortedArr };
      }
    }

    comparisons++;
    steps.push({
      checking: prev,
      comparisons,
      found: sortedArr[prev] === target ? prev : -1
    });

    if (sortedArr[prev] === target) {
      return { steps, found: prev, comparisons, array: sortedArr };
    }

    return { steps, found: -1, comparisons, array: sortedArr };
  },

  interpolation: (arr, target) => {
    const sortedArr = [...arr].sort((a, b) => a - b);
    const steps = [];
    let comparisons = 0;
    let low = 0;
    let high = sortedArr.length - 1;

    while (low <= high && target >= sortedArr[low] && target <= sortedArr[high]) {
      if (low === high) {
        comparisons++;
        steps.push({
          checking: low,
          comparisons,
          found: sortedArr[low] === target ? low : -1
        });
        if (sortedArr[low] === target) {
          return { steps, found: low, comparisons, array: sortedArr };
        }
        return { steps, found: -1, comparisons, array: sortedArr };
      }

      const pos = low + Math.floor(
        ((target - sortedArr[low]) * (high - low)) / (sortedArr[high] - sortedArr[low])
      );

      comparisons++;
      steps.push({
        checking: pos,
        range: [low, high],
        comparisons,
        found: sortedArr[pos] === target ? pos : -1
      });

      if (sortedArr[pos] === target) {
        return { steps, found: pos, comparisons, array: sortedArr };
      }

      if (sortedArr[pos] < target) {
        low = pos + 1;
      } else {
        high = pos - 1;
      }
    }

    return { steps, found: -1, comparisons, array: sortedArr };
  }
};
