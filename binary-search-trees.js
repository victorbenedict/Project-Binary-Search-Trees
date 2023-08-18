const cl = console.log
const ct = console.table

// Visualize the tree structure using console.log
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

// Build a Node class / factory. It should have an attribute for the data it stores as well as its left and right children.
class Node { 
  constructor(data, left = null, right = null) {
    this.data = data
    this.left = left
    this.right = right
  }
}

// Build a Tree class / factory which accepts an array when initialized. The Tree class should have a root attribute which uses the return value of buildTree which you’ll write next.
class Tree {
  constructor(array){
    this.root = this.buildTree([...new Set(array.sort((a, b) => (a -b)))])
    this.arrContainer = []
  }
  
  // Write a buildTree function which takes an array of data (e.g. [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]) and turns it into a balanced binary tree full of Node objects appropriately placed (don’t forget to sort and remove duplicates!). The buildTree function should return the level-0 root node.

  buildTree(arr) {
    if (arr.length === 0) {
      return null
    }

    const middleIndex = Math.floor(arr.length / 2)
    const middleValue = arr[middleIndex]
    const leftArray = arr.slice(0, middleIndex)
    const rightArray = arr.slice(middleIndex + 1)
    const leftSubtree = this.buildTree(leftArray)
    const rightSubtree = this.buildTree(rightArray)

    const node = new Node(middleValue)
    node.left = leftSubtree
    node.right = rightSubtree
    return node
  }

  // Write an insert and delete functions which accepts a value to insert/delete (you’ll have to deal with several cases for delete such as when a node has children or not).

  insert(value) {
    this.root = this.insertRecursion(value, this.root)
  }

  insertRecursion(value, node = this.root) {
    if (node === null) {
      node = new Node(value)
      return node
    }
    
    if (value < node.data) {
      node.left = this.insertRecursion(value, node.left) 
    } else if (value > node.data){
      node.right = this.insertRecursion(value, node.right) 
    }
    return node
  }

  delete(value) {
    this.root = this.deleteRecursion(value, this.root)
  }
  /* Given a binary search tree and a key, this function
   deletes the key and returns the new root */
  deleteRecursion(value, node = this.root) {
   // Base case
    if (node === null) {
      return node
    }
    // Recursive calls for ancestors of
    // node to be deleted
    if (value < node.data) {
      node.left = this.deleteRecursion(value, node.left)
      return node
    } else if (value > node.data) {
      node.right = this.deleteRecursion(value, node.right)
      return node
    } else {
      if (node.left === null) {
          return node.right;
      } else if (node.right === null) {
          return node.left;
      }
      // Node with two children: Get the inorder successor (smallest in the right subtree)
      const minValue = this.findMinValue(node.right);
      node.data = minValue;
      node.right = this.deleteRecursion(minValue, node.right);
    }
  return node;
  }



  find(value) {
    return this.findRecursion(value, this.root)
  }

  findRecursion(value, node = this.root) {
    if (value == node.data) {
      return node
    }
    if (value < node.data) {
      return this.findRecursion(value, node.left)
    } else if (value > node.data) {
      return this.findRecursion(value, node.right)
    }
    return null
  }

  // Write a levelOrder function which accepts another function as a parameter. levelOrder should traverse the tree in breadth-first level order and provide each node as the argument to the provided function.

  toArray(value, arr) {
    arr.push(value)
  }

  levelOrder(func = this.toArray) {
    this.arrContainer = []
    return this.levelOrderIteration(func, this.root)
  }

  levelOrderIteration(func, node = this.root) {
    if (node === null) {
      return
    }
    const queueArr = []

    queueArr.push(node)
    while (queueArr.length > 0) {
      const currentNode = queueArr[0]
      func(currentNode.data, this.arrContainer)
      if (currentNode.left !== null) {
        queueArr.push(currentNode.left)  
      }
      if (currentNode.right !== null) {
        queueArr.push(currentNode.right)  
      }
      queueArr.shift()
    }
    return this.arrContainer
  }

  // Write inorder, preorder, and postorder functions that accept a function parameter. Each of these functions should traverse the tree in their respective depth-first order and yield each node to the provided function given as an argument. The functions should return an array of values if no function is given.
  inorder(func = this.toArray) {
    this.arrContainer = []
    return this.inorderRecursion(func, this.root)
  }

  inorderRecursion(func, node = this.root) {
    if (node === null) {
      return
    }
    this.inorderRecursion(func, node.left)
    func(node.data, this.arrContainer)
    this.inorderRecursion(func, node.right)
    return this.arrContainer
  }

  preorder(func = this.toArray) {
    this.arrContainer = []
    return this.preorderRecursion(func, this.root)
  }

  preorderRecursion(func, node = this.root) {
    if (node === null) {
      return
    }
    func(node.data, this.arrContainer)
    this.preorderRecursion(func, node.left)
    this.preorderRecursion(func, node.right)
    return this.arrContainer
  }

  postorder(func = this.toArray) {
    this.arrContainer = []
    return this.postorderRecursion(func, this.root)
  } 

  postorderRecursion(func, node = this.root) {
    if (node === null) {
      return
    }
    this.postorderRecursion(func, node.left)
    this.postorderRecursion(func, node.right)
    func(node.data, this.arrContainer)
    return this.arrContainer
  }

  // Write a height function which accepts a node and returns its height. Height is defined as the number of edges in longest path from a given node to a leaf node.
  height(node = this.root) {
    if (node == null) {
      return 0
    }
    const leftHeight = this.height(node.left)
    const rightHeight = this.height(node.right)
    return Math.max(leftHeight, rightHeight) + 1
  }

  // Write a depth function which accepts a node and returns its depth. Depth is defined as the number of edges in path from a given node to the tree’s root node.
  depth(nodeValue, node = this.root) {
    if (nodeValue.data === node.data) {
      return 0
    }
   
    if (nodeValue.data < node.data) {
      return this.depth(nodeValue, node.left) + 1
      }
     if (nodeValue.data > node.data) {
      return this.depth(nodeValue, node.right) + 1
     }
  }

  // Write a isBalanced function which checks if the tree is balanced. A balanced tree is one where the difference between heights of left subtree and right subtree of every node is not more than 1.
  isBalanced(node = this.root) {
    const leftSubtree = this.height(node.left) 
    const rightSubtree = this.height(node.right) 
    const difference = Math.abs(leftSubtree - rightSubtree)
    return difference <= 1
  }

  // Write a rebalance function which rebalances an unbalanced tree. Tip: You’ll want to use a traversal method to provide a new array to the buildTree function.
  rebalance() {
    if (!this.isBalanced()) {
    const tempArr = this.inorder()
    tempArr.forEach(element => {
      this.delete(element)
    });
    this.root = this.buildTree(tempArr)
    }
  }
}

function randomInitArray() {
  const minValue = 0;
  const maxValue = 99;
  const randomArrayLen = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
  const randomArr = []
  for (let index = 0; index < randomArrayLen; index++) {
    const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    randomArr.push(randomValue)
  }
  return randomArr
}

function unbalanceTree(tree) {
  const minValue = 100;
  const maxValue = 200;
  const randomAdditions = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
  for (let index = 0; index < randomAdditions; index++) {
    const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    tree.insert(randomValue)
  }
}
// Write a simple driver script that does the following:
function driverScript(){
  // Create a binary search tree from an array of random numbers < 100. You can create a function that returns an array of random numbers every time you call it, if you wish.
  const arr = randomInitArray()
  const testTree = new Tree(arr)

  cl('Visualize tree:')
  prettyPrint(testTree.root)
  cl(`Is the tree balanced? ${testTree.isBalanced()}.`) //Confirm that the tree is balanced by calling isBalanced.
  cl('\nDisplay tree array in levelorder:') //Print out all elements in level, pre, post, and in order.
  ct(testTree.levelOrder()) 
  cl('\nDisplay tree array in preorder:')
  ct(testTree.preorder()) 
  cl('\nDisplay tree array in postorder:')
  ct(testTree.postorder()) 
  cl('\nDisplay tree array in inorder:')
  ct(testTree.inorder())
  cl('Call unbalance. Display unbalanced tree:')
  unbalanceTree(testTree)// Unbalance the tree by adding several numbers > 100.
  prettyPrint(testTree.root)
  if (!testTree.isBalanced()) {
    cl(`Is the tree unbalanced? ${!testTree.isBalanced()}.`)
    testTree.rebalance()
    cl('Call rebalance. Display balanced tree:') // Print out all elements in level, pre, post, and in order.
    prettyPrint(testTree.root)
    cl(`Is the tree balanced? ${testTree.isBalanced()}.`)
    cl('\nDisplay tree array in levelorder:')
    ct(testTree.levelOrder()) 
    cl('\nDisplay tree array in preorder:')
    ct(testTree.preorder()) 
    cl('\nDisplay tree array in postorder:')
    ct(testTree.postorder()) 
    cl('\nDisplay tree array in inorder:')
    ct(testTree.inorder())
  }
}

driverScript()


  