var GraphJS = require('./graph');
var _ = require('underscore');

exports.setUp = function (done) {
	this.graph = new GraphJS([
		{ id: 1, data: 'a', link: 2 },
		{ id: 2, data: 'b', link: [1, { id: 3, weight: 5 }] },
		{ id: 3, data: 'c', link: 1 }
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
		'c', 'a.b.a.c'
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
		// _.pluck(this.graph.referenceList, 'data'),
		Object.keys(this.graph.referenceDictionary),
		['1', '2', '3'],
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
	}).data, 'a');

	test.strictEqual(this.graph.depthFirstSearch(function (node) {
		return node.data === 'b';
	}).data, 'b');

	test.strictEqual(this.graph.depthFirstSearch(function (node) {
		return node.data === 'c';
	}).data, 'c');

	test.strictEqual(this.graph.depthFirstSearch(function (node) {
		return node.data === 'wrong';
	}), null);

	test.done();
};

exports.find = function (test) {
	test.strictEqual(this.graph.find(1).data, 'a');
	test.strictEqual(this.graph.find(2).data, 'b');
	test.strictEqual(this.graph.find('3').data, 'c');
	test.strictEqual(this.graph.find(3).data, 'c');
	test.strictEqual(this.graph.find(4), null);
	test.done();
};