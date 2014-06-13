#GraphJS

Create a new graph from a list
```javascript
var graph = new GraphJS([
    { id: 1, data: 'a', link: 2 },
    { id: 2, data: 'b', link: [1, { id: 3, weight: 5 }] },
    { id: 3, data: 'c', link: 1 }
]);
```

##Methods

###get
returns reference to node with the given id.
```javascript
graph.get(1);
```

###depthFirstSearch
returns reference to first node satisfying the callback
```javascript
graph.depthFirstSearch(function (node) {
	return node.data === 'a';
});
```