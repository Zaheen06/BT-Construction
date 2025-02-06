class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
    }
}

let root = null;
let canvas = document.getElementById('treeCanvas');
let ctx = canvas.getContext('2d');
const nodeRadius = 20;

document.getElementById('constructionType').addEventListener('change', function(e) {
    const label = document.getElementById('firstTraversalLabel');
    const input = document.getElementById('firstTraversal');
    const example = input.nextElementSibling;
    
    if (e.target.value === 'preorder') {
        label.textContent = 'Preorder Traversal:';
        input.placeholder = 'Enter values separated by commas (e.g., 1,2,4,5,3)';
        example.textContent = 'Example: 1,2,4,5,3';
    } else {
        label.textContent = 'Postorder Traversal:';
        input.placeholder = 'Enter values separated by commas (e.g., 4,5,2,3,1)';
        example.textContent = 'Example: 4,5,2,3,1';
    }
});

function initCanvas() {
    canvas.width = Math.max(window.innerWidth - 100, 300);
    canvas.height = 400;
    drawTree();
}

window.addEventListener('resize', initCanvas);
initCanvas();

function validateInput(input) {
    return input.trim().split(',').every(val => !isNaN(val.trim()));
}

function clearTree() {
    root = null;
    document.getElementById('firstTraversal').value = '';
    document.getElementById('inorderTraversal').value = '';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function constructTree() {
    const firstTraversal = document.getElementById('firstTraversal').value.trim();
    const inorderTraversal = document.getElementById('inorderTraversal').value.trim();
    const constructionType = document.getElementById('constructionType').value;

    if (!validateInput(firstTraversal) || !validateInput(inorderTraversal)) {
        alert('Please enter valid numbers separated by commas');
        return;
    }

    const first = firstTraversal.split(',').map(x => Number(x.trim()));
    const inorder = inorderTraversal.split(',').map(x => Number(x.trim()));

    if (first.length !== inorder.length) {
        alert('Both traversals must have the same number of nodes');
        return;
    }

    try {
        if (constructionType === 'preorder') {
            root = buildFromPreIn(first, inorder);
        } else {
            root = buildFromPostIn(first, inorder);
        }
        drawTree();
    } catch (error) {
        alert('Invalid traversal sequences');
    }
}

function buildFromPreIn(preorder, inorder) {
    if (!preorder.length || !inorder.length) return null;

    const rootVal = preorder[0];
    const root = new Node(rootVal);
    
    const rootIndex = inorder.indexOf(rootVal);
    
    const leftInorder = inorder.slice(0, rootIndex);
    const rightInorder = inorder.slice(rootIndex + 1);
    
    const leftPreorder = preorder.slice(1, leftInorder.length + 1);
    const rightPreorder = preorder.slice(leftInorder.length + 1);
    
    root.left = buildFromPreIn(leftPreorder, leftInorder);
    root.right = buildFromPreIn(rightPreorder, rightInorder);
    
    return root;
}

function buildFromPostIn(postorder, inorder) {
    if (!postorder.length || !inorder.length) return null;

    const rootVal = postorder[postorder.length - 1];
    const root = new Node(rootVal);
    
    const rootIndex = inorder.indexOf(rootVal);
    
    const leftInorder = inorder.slice(0, rootIndex);
    const rightInorder = inorder.slice(rootIndex + 1);
    
    const leftPostorder = postorder.slice(0, leftInorder.length);
    const rightPostorder = postorder.slice(leftInorder.length, -1);
    
    root.left = buildFromPostIn(leftPostorder, leftInorder);
    root.right = buildFromPostIn(rightPostorder, rightInorder);
    
    return root;
}

function calculatePositions(node, level = 0, position = 0, positions = new Map()) {
    if (!node) return;

    const key = `${level}-${position}`;
    const spacing = canvas.width / Math.pow(2, level + 1);
    
    node.x = spacing + position * spacing * 2;
    node.y = level * 70 + 50;

    positions.set(key, node);

    calculatePositions(node.left, level + 1, position * 2, positions);
    calculatePositions(node.right, level + 1, position * 2 + 1, positions);
}

function drawTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!root) return;

    calculatePositions(root);
    drawNode(root);
}

function drawNode(node) {
    if (!node) return;

    if (node.left) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.left.x, node.left.y);
        ctx.strokeStyle = '#666';
        ctx.stroke();
        drawNode(node.left);
    }

    if (node.right) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.right.x, node.right.y);
        ctx.strokeStyle = '#666';
        ctx.stroke();
        drawNode(node.right);
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.strokeStyle = '#2980b9';
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '14px Arial';
    ctx.fillText(node.value, node.x, node.y);
}
