#GraphJS

Create a new directed graph from a list

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
var node = graph.get(1);
```

###depthFirstSearch
returns reference to first node satisfying the callback
```javascript
var node = graph.depthFirstSearch(function (node) {
	return node.data === 'a';
});
```

###getStronglyConnectedComponents
See [Tarjan's algorithm for strongly connected components](http://en.wikipedia.org/wiki/Tarjan's_strongly_connected_components_algorithm).
```javascript
var components = graph.getStronglyConnectedComponents();
```

###hasCycles
Tells you wether the graph has any cycles
```javascript
var doesGraphHaveCycles = graph.hasCycles();
```

###isForest
```javascript
var isGraphAForest = graph.isForest();
```

###isConnected
Are all vertices connected to each other in some way.
```javascript
var isGraphConnected = graph.isConnected();
```

###isTree
Is graph a connected forest.
```javascript
var isGraphATree = graph.isTree();
```