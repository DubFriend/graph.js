#GraphJS

Create a new graph from a list
```javascript
var graph = new GraphJS([
    { id: 1, data: 'a', link: 2 },
    { id: 2, data: 'b', link: [1, { id: 3, weight: 5 }] },
    { id: 3, data: 'c', link: 1 }
]);
```