import { Injectable } from '@angular/core';
import { Algorithm } from '../models/algorithm';

@Injectable({
    providedIn: 'root',
})
export class AlgorithmService {
    private algorithms: Algorithm[] = [
        {
            name: 'bubble-sort',
            category: 'DSA',
            description: 'A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
            keyProperties: {
                bestCase: 'O(n)',
                averageCase: 'O(n^2)',
                worstCase: 'O(n^2)',
                spaceComplexity: 'O(1)',
            },
            runtime: {
                cpp: 15,
                python: 25,
                javascript: 20,
            },
            steps: [
                '1. Start from the first element of the array and compare adjacent elements.',
                '2. If the adjacent elements are in the wrong order, swap them.',
                '3. Repeat this process for each element in the array.',
                '4. Each iteration through the array moves the largest unsorted element to its correct position.',
                '5. Continue making passes through the array until no more swaps are made in a pass.'
            ],
            code: {
                cpp: `#include <iostream>
      using namespace std;
      
      void bubbleSort(int arr[], int n) {
          for (int i = 0; i < n - 1; i++) {
              for (int j = 0; j < n - i - 1; j++) {
                  if (arr[j] > arr[j + 1]) {
                      swap(arr[j], arr[j + 1]);
                  }
              }
          }
      }`,
                python: `def bubble_sort(arr):
          n = len(arr)
          for i in range(n):
              for j in range(0, n-i-1):
                  if arr[j] > arr[j+1]:
                      arr[j], arr[j+1] = arr[j+1], arr[j]`,
                javascript: `function bubbleSort(arr) {
          let n = arr.length;
          for (let i = 0; i < n - 1; i++) {
              for (let j = 0; j < n - i - 1; j++) {
                  if (arr[j] > arr[j + 1]) {
                      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                  }
              }
          }
          return arr;
      }`,
            },
            deltaLine: {
                cpp: 2,
                python: 0,
                javascript: 0,
            },
            prosAndCons: {
                pros: [
                    'Simple to implement and easy to understand.',
                    'In-place sorting, so no extra memory is required.',
                    'Stable algorithm, meaning equal elements retain their original relative order.'
                ],
                cons: [
                    'Inefficient for large lists due to its O(n^2) time complexity.',
                    'Does not adapt well to partially sorted arrays, as it still makes multiple passes through the entire array.'
                ],
            },
        },

        {
            name: 'selection-sort',
            category: 'DSA',
            description: 'An in-place, comparison-based sorting algorithm that is not stable but simple to implement.',
            keyProperties: {
                bestCase: 'O(n^2)',
                averageCase: 'O(n^2)',
                worstCase: 'O(n^2)',
                spaceComplexity: 'O(1)',

            },
            runtime: {
                cpp: 2,
                python: 4,
                javascript: 3,
            },
            steps: [
                '1. Go through the array to find the minimum value in the unsorted section.',
                '2. Swap this minimum value with the first element of the unsorted section.',
                '3. Repeat the process for each position in the array until the entire array is sorted.'
            ],
            code: {
                cpp: `#include <iostream>
      using namespace std;
      
      void selectionSort(int arr[], int n) {
          for (int i = 0; i < n - 1; i++) {
              int minIdx = i;
              for (int j = i + 1; j < n; j++) {
                  if (arr[j] < arr[minIdx]) {
                      minIdx = j;
                  }
              }
              swap(arr[minIdx], arr[i]);
          }
      }`,
                python: `def selection_sort(arr):
          n = len(arr)
          for i in range(n):
              min_idx = i
              for j in range(i + 1, n):
                  if arr[j] < arr[min_idx]:
                      min_idx = j
              arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
                javascript: `function selectionSort(arr) {
          let n = arr.length;
          for (let i = 0; i < n - 1; i++) {
              let minIdx = i;
              for (let j = i + 1; j < n; j++) {
                  if (arr[j] < arr[minIdx]) {
                      minIdx = j;
                  }
              }
              [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          }
          return arr;
      }`
            },
            deltaLine: {
                cpp: 2,         // Difference in lines compared to insertion sort, used for tracking edits.
                python: 0,      // Difference in lines compared to insertion sort, used for tracking edits.
                javascript: 0   // Difference in lines compared to insertion sort, used for tracking edits.
            },
            prosAndCons: {
                pros: [
                    'Simple and easy to understand.',
                    'In-place sorting, so it does not require extra memory.'
                ],
                cons: [
                    'Inefficient on large lists, with time complexity of O(n^2).',
                    'Does not adapt well to partially sorted arrays.'
                ]
            }
        },

        {
            name: 'insertion-sort',
            category: 'DSA',
            description: 'An efficient algorithm for sorting a small number of elements, where elements are gradually inserted into their correct position.',
            keyProperties: {
                bestCase: 'O(n)',
                averageCase: 'O(n^2)',
                worstCase: 'O(n^2)',
                spaceComplexity: 'O(1)',
            },
            runtime: {
                cpp: 10,
                python: 15,
                javascript: 12,
            },
            steps: [
                '1. Start at the second element of the array.',
                '2. Compare the current element with the elements before it.',
                '3. If the current element is smaller, move the larger elements one position to the right.',
                '4. Insert the current element into its correct position.',
                '5. Repeat this process for all remaining elements in the array.'
            ],
            code: {
                cpp: `#include <iostream>
      using namespace std;
      
      void insertionSort(int arr[], int n) {
          for (int i = 1; i < n; i++) {
              int key = arr[i];
              int j = i - 1;
              while (j >= 0 && arr[j] > key) {
                  arr[j + 1] = arr[j];
                  j--;
              }
              arr[j + 1] = key;
          }
      }`,
                python: `def insertion_sort(arr):
          for i in range(1, len(arr)):
              key = arr[i]
              j = i - 1
              while j >= 0 and arr[j] > key:
                  arr[j + 1] = arr[j]
                  j -= 1
              arr[j + 1] = key`,
                javascript: `function insertionSort(arr) {
          for (let i = 1; i < arr.length; i++) {
              let key = arr[i];
              let j = i - 1;
              while (j >= 0 && arr[j] > key) {
                  arr[j + 1] = arr[j];
                  j--;
              }
              arr[j + 1] = key;
          }
          return arr;
      }`,
            },
            deltaLine: {
                cpp: 2,
                python: 0,
                javascript: 0,
            },
            prosAndCons: {
                pros: [
                    'Simple and easy to implement.',
                    'Efficient for small datasets or nearly sorted data.',
                    'In-place sorting, requires no additional memory.'
                ],
                cons: [
                    'Inefficient for large datasets with O(n^2) time complexity.',
                    'Not suitable for large unsorted datasets.'
                ],
            },
        },
        {
            name: 'quick-sort',
            category: 'DSA',
            description: 'A highly efficient sorting algorithm using the divide and conquer principle.',
            keyProperties: {
                bestCase: 'O(n log n)',
                averageCase: 'O(n log n)',
                worstCase: 'O(n^2)',
                spaceComplexity: 'O(log n)',
            },
            steps: [
                '1. Choose a pivot element from the array.',
                '2. Partition the array into two subarrays: one with elements smaller than the pivot, and the other with elements greater than the pivot.',
                '3. Recursively apply the same process to the two subarrays.',
                '4. Continue until the base case is reached, where the subarrays have one or zero elements.'
            ],
            runtime: {
                cpp: 1,
                python: 2,
                javascript: 1.5,
            },
            code: {
                cpp: `#include <iostream>
      using namespace std;
      
      int partition(int arr[], int low, int high) {
          int pivot = arr[high];
          int i = (low - 1);
          for (int j = low; j < high; j++) {
              if (arr[j] < pivot) {
                  i++;
                  swap(arr[i], arr[j]);
              }
          }
          swap(arr[i + 1], arr[high]);
          return (i + 1);
      }
      
      void quickSort(int arr[], int low, int high) {
          if (low < high) {
              int pi = partition(arr, low, high);
              quickSort(arr, low, pi - 1);
              quickSort(arr, pi + 1, high);
          }
      }`,
                python: `def partition(arr, low, high):
          pivot = arr[high]
          i = low - 1
          for j in range(low, high):
              if arr[j] < pivot:
                  i += 1
                  arr[i], arr[j] = arr[j], arr[i]
          arr[i + 1], arr[high] = arr[high], arr[i + 1]
          return i + 1
      
      def quick_sort(arr, low, high):
          if low < high:
              pi = partition(arr, low, high)
              quick_sort(arr, low, pi - 1)
              quick_sort(arr, pi + 1, high)`,
                javascript: `function partition(arr, low, high) {
          let pivot = arr[high];
          let i = low - 1;
          for (let j = low; j < high; j++) {
              if (arr[j] < pivot) {
                  i++;
                  [arr[i], arr[j]] = [arr[j], arr[i]];
              }
          }
          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          return i + 1;
      }
      
      function quickSort(arr, low, high) {
          if (low < high) {
              let pi = partition(arr, low, high);
              quickSort(arr, low, pi - 1);
              quickSort(arr, pi + 1, high);
          }
      }`,
            },
            deltaLine: {
                cpp: 2,
                python: 0,
                javascript: 0,
            },
            
            prosAndCons: {
                pros: [
                    'Efficient for large datasets with O(n log n) time complexity on average.',
                    'In-place sorting, requires only a small, constant amount of additional space.',
                    'Divide and conquer method leads to better performance on large arrays.'
                ],
                cons: [
                    'Worst-case time complexity is O(n^2), which happens when the pivot selection is poor (e.g., always picking the smallest or largest element).',
                    'Not a stable algorithm, which means equal elements may change their relative order.',
                ],
            },
        },
        {
            name: 'binary-search',
            category: 'DSA',
            description: 'A highly efficient algorithm for finding an element in a sorted array by repeatedly dividing the search interval in half.',
            keyProperties: {
                bestCase: 'O(1)',
                averageCase: 'O(log n)',
                worstCase: 'O(log n)',
                spaceComplexity: 'O(1)',
            },
            runtime: {
                cpp: 1,
                python: 1.5,
                javascript: 1.2,
            },
            steps: [
                '1. Start with two pointers: one at the beginning and one at the end of the array.',
                '2. Find the middle element of the array.',
                '3. If the middle element matches the target, return its position.',
                '4. If the middle element is greater than the target, narrow the search to the left subarray.',
                '5. If the middle element is less than the target, narrow the search to the right subarray.',
                '6. Repeat steps 2-5 until the element is found or the subarray becomes empty.'
            ],
            code: {
                cpp: `#include <iostream>
        using namespace std;
        
        int binarySearch(int arr[], int size, int target) {
            int low = 0, high = size - 1;
            while (low <= high) {
                int mid = low + (high - low) / 2;
                if (arr[mid] == target)
                    return mid;
                else if (arr[mid] < target)
                    low = mid + 1;
                else
                    high = mid - 1;
            }
            return -1; // Element not found
        }`,
                python: `def binary_search(arr, target):
            low, high = 0, len(arr) - 1
            while low <= high:
                mid = (low + high) // 2
                if arr[mid] == target:
                    return mid
                elif arr[mid] < target:
                    low = mid + 1
                else:
                    high = mid - 1
            return -1 # Element not found`,
                javascript: `function binarySearch(arr, target) {
            let low = 0, high = arr.length - 1;
            while (low <= high) {
                let mid = Math.floor(low + (high - low) / 2);
                if (arr[mid] === target) {
                    return mid;
                } else if (arr[mid] < target) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            return -1; // Element not found
        }`,
            },
            deltaLine: {
                cpp: 1,
                python: 1,
                javascript: 1,
            },
            prosAndCons: {
                pros: [
                    'Highly efficient for sorted arrays with O(log n) time complexity.',
                    'Simple to implement and widely used in real-world applications.',
                    'In-place algorithm with minimal memory usage.'
                ],
                cons: [
                    'Only works on sorted arrays, requiring an additional sorting step if data is unsorted.',
                    'Not suitable for dynamic datasets as the array must be re-sorted after each update.'
                ],
            },
        },
        {
            name: 'simple-constraint',
            category: 'constraint',
            description: 'This example demonstrates a simple constraint where the "ball" cannot move beyond a certain distance from the mouse pointer.',
            steps: [
                '1. Start with two pointers: one at the beginning and one at the end of the array.',
                '2. Find the middle element of the array.',
                '3. If the middle element matches the target, return its position.',
                '4. If the middle element is greater than the target, narrow the search to the left subarray.',
                '5. If the middle element is less than the target, narrow the search to the right subarray.',
                '6. Repeat steps 2-5 until the element is found or the subarray becomes empty.'
            ],
            code: {
                cpp: `#include <cmath>

struct Point {
    double x, y;
};

Point constrainDistance(const Point& point, const Point& anchor, double distance) {
    // Subtract the anchor from the point
    double dx = point.x - anchor.x;
    double dy = point.y - anchor.y;
    
    // Normalize the vector (dx, dy)
    double magnitude = std::sqrt(dx * dx + dy * dy);
    double normalizedX = dx / magnitude;
    double normalizedY = dy / magnitude;
    
    // Scale the normalized vector by the distance and add to the anchor
    Point constrainedPoint = {
        normalizedX * distance + anchor.x,
        normalizedY * distance + anchor.y
    };
    
    return constrainedPoint;
}
`,
                python: `def constrain_distance(point, anchor, distance):
    # Subtract the anchor from the point
    dx, dy = point[0] - anchor[0], point[1] - anchor[1]
    
    # Normalize the vector (dx, dy)
    magnitude = (dx**2 + dy**2)**0.5
    normalized = (dx / magnitude, dy / magnitude)
    
    # Scale the normalized vector by the distance and add to the anchor
    constrained_point = (normalized[0] * distance + anchor[0], normalized[1] * distance + anchor[1])
    
    return constrained_point
`,
                javascript: `function constrainDistance(point, anchor, distance) {
  // Subtract the anchor from the point
  let dx = point.x - anchor.x;
  let dy = point.y - anchor.y;

  // Normalize the vector (dx, dy)
  let magnitude = Math.sqrt(dx * dx + dy * dy);
  let normalized = { x: dx / magnitude, y: dy / magnitude };

  // Scale the normalized vector by the distance and add to the anchor
  return {
    x: normalized.x * distance + anchor.x,
    y: normalized.y * distance + anchor.y
  };
}
`,
            },
            deltaLine: {
                cpp: 1,
                python: 1,
                javascript: 1,
            },
            prosAndCons: {
                pros: [
                    'Highly efficient for sorted arrays with O(log n) time complexity.',
                    'Simple to implement and widely used in real-world applications.',
                    'In-place algorithm with minimal memory usage.'
                ],
                cons: [
                    'Only works on sorted arrays, requiring an additional sorting step if data is unsorted.',
                    'Not suitable for dynamic datasets as the array must be re-sorted after each update.'
                ],
            },
        }
    ];

    getAlgorithms(): Algorithm[] {
        return this.algorithms;
    }

    getAllAlgorithmNames(): string[] {
        return this.algorithms.map((algo) => algo.name);
    }

    getAlgorithmNamesByCategory(category: string): string[] {
        
        return this.algorithms.filter((algo) => algo.category === category).map((algo) => algo.name);
    }

    getAlgorithmByName(name: string): Algorithm | undefined {
        return this.algorithms.find(
            (algo) => algo.name.toLowerCase() === name.toLowerCase()
        );
    }
}
