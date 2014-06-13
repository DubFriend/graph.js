var GraphJS = require('./graph');
var _ = require('underscore');

exports.construction = function (test) {
	var graph = new GraphJS([
		{ id: 1, data: 'a', link: 2 },
		{ id: 2, data: 'b', link: [1, { id: 3, weight: 5 }] },
		{ id: 3, data: 'c', link: 1 }
	]);

	test.strictEqual(graph.graph.data, 'a', 'a');
	test.strictEqual(graph.graph.links[0].ref.data, 'b', 'a.b');
	test.strictEqual(graph.graph.links[0].ref.links[0].ref.data, 'a', 'a.b.a');
	test.strictEqual(graph.graph.links[0].ref.links[1].ref.data, 'c', 'a.b.a.c');
	test.strictEqual(graph.graph.links[0].ref.links[1].weight, 5, 'a.b.a.c (weight)');
	test.strictEqual(graph.graph.links[0].ref.links[1].ref.links[0].ref.data, 'a', 'a.b.a.c.a');
	test.deepEqual(_.pluck(graph.referenceList, 'data'), ['a', 'b', 'c'], 'referenceList has elements');
	test.strictEqual(graph.referenceList[0], graph.graph, 'referenceList 0');
	test.strictEqual(graph.referenceList[1], graph.graph.links[0].ref, 'referenceList 1');
	test.strictEqual(graph.referenceList[2], graph.graph.links[0].ref.links[1].ref, 'referenceList 2');
	test.done();
};