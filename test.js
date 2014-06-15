var GraphJS = require('./graph');
var _ = require('underscore');

exports.setUp = function (done) {
	this.graph = new GraphJS([
		{ id: 1, data: 'a', link: [2, 4] },
		{ id: 2, data: 'b', link: [1, { id: 3, weight: 5 }] },
		{ id: 3, data: 'c', link: 1 },
		{ id: 4, data: 'd' }
	]);
	done();
};

exports.construction = function (test) {

	test.strictEqual(this.graph.graph.data, 'a', 'a');

	test.strictEqual(this.graph.graph.links[0].ref.data, 'b', 'a.b');

	test.strictEqual(
		this.graph.graph.links[0].ref.links[0].ref.data,
		'a', 'a.b.a'
	);

	test.strictEqual(
		this.graph.graph.links[0].ref.links[1].ref.data,
		'c', 'a.b.c'
	);

	test.strictEqual(
		this.graph.graph.links[0].ref.links[1].weight, 5,
		'a.b.a.c (weight)'
	);

	test.strictEqual(
		this.graph.graph.links[0].ref.links[1].ref.links[0].ref.data,
		'a', 'a.b.a.c.a'
	);

	test.deepEqual(
		Object.keys(this.graph.referenceDictionary),
		['1', '2', '3', '4'],
		'referenceList has elements'
	);

	test.strictEqual(this.graph.referenceDictionary['1'], this.graph.graph, 'referenceList 0');

	test.strictEqual(
		this.graph.referenceDictionary['2'],
		this.graph.graph.links[0].ref,
		'referenceList 1'
	);

	test.strictEqual(
		this.graph.referenceDictionary['3'],
		this.graph.graph.links[0].ref.links[1].ref,
		'referenceList 2'
	);

	test.done();
};

exports.depthFirstSearch = function (test) {
	test.strictEqual(this.graph.depthFirstSearch(function (node) {
		return node.data === 'a';
	}).data, 'a', 'found a');

	// test twice to test idempotence
	test.strictEqual(this.graph.depthFirstSearch(function (node) {
		return node.data === 'a';
	}).data, 'a', 'found a again');

	test.strictEqual(this.graph.depthFirstSearch(function (node) {
		return node.data === 'b';
	}).data, 'b', 'found b');

	test.strictEqual(this.graph.depthFirstSearch(function (node) {
		return node.data === 'c';
	}).data, 'c', 'found c');

	test.strictEqual(this.graph.depthFirstSearch(function (node) {
		return node.data === 'wrong';
	}), null, 'returns null if no match');

	test.done();
};

exports.get = function (test) {
	test.strictEqual(this.graph.get(1).data, 'a', 'found 1');
	test.strictEqual(this.graph.get(2).data, 'b', 'found 2');
	test.strictEqual(this.graph.get('3').data, 'c', 'found 3 (string)');
	test.strictEqual(this.graph.get(3).data, 'c', 'found 3');
	test.strictEqual(this.graph.get(1234), null, 'returns null if no match');
	test.done();
};

exports.getStronglyConnectedComponents = function (test) {
	test.deepEqual(this.graph.getStronglyConnectedComponents(), [[4], [3, 2, 1]]);
	// testing twice to ensure idempotence
	test.deepEqual(this.graph.getStronglyConnectedComponents(), [[4], [3, 2, 1]]);
	test.done();
};

exports.hasCycles = function (test) {
	test.strictEqual(this.graph.hasCycles(), true);
	// testing idempotence
	test.strictEqual(this.graph.hasCycles(), true);
	test.strictEqual(new GraphJS([
		{ id: 1, data: 'a', link: 2 },
		{ id: 2, data: 'b' }
	]).hasCycles(), false);
	test.done();
};

exports.isTree = function (test) {
	test.strictEqual(this.graph.isTree(), false, 'test 1');
	// testing idempotence.
	test.strictEqual(this.graph.isTree(), false, 'test 1.a');
	test.strictEqual(new GraphJS([
		{ id: 1, data: 'a', link: [2, 3] },
		{ id: 2, data: 'b', link: 4 },
		{ id: 3, data: 'c' },
		{ id: 4, data: 'd' }
	]).isTree(), true, 'test 2');
	test.strictEqual(new GraphJS([
		{ id: 1, data: 'a', link: [2, 3] },
		{ id: 2, data: 'b', link: 3 },
		{ id: 3, data: 'c' }
	]).isTree(), false, 'test 3');
	test.done();
};