// graph.js
// https://github.com/DubFriend/graph.js
(function () {
	'use strict';

	var _ = _;

	var mapListToGraph = function (list) {

		var mapNode = function (node) {
			var mapLink = function (link) {
				return _.isObject(link) ? link : {
					id: link, weight: undefined
				};
			};

			return {
				id: node.id,
				data: node.data,
				preLinks: _.isArray(node.link) ?
					_.map(node.link, mapLink) :
					node.link === undefined ? [] : [mapLink(node.link)],
				links: []
			};
		};

		var getPreLinkByID = function (preLinks, id) {
			var index = _.indexOf(_.pluck(preLinks, 'id'), id);
			return index === -1 ? null : preLinks[index];
		};

		list = _.map(list, mapNode);

		var graph = list.shift();


		var referenceDictionary = {};
		referenceDictionary[graph.id] = graph;

		_.each(list || [], function (node) {

			_.each(referenceDictionary, function (reference) {
				var link = getPreLinkByID(reference.preLinks, node.id);
				if(link) {
					reference.links.push({
						ref: node,
						weight: link.weight
					});
				}

				link = getPreLinkByID(node.preLinks, reference.id);
				if(link) {
					node.links.push({
						ref: reference,
						weight: link.weight
					});
				}
			});

			referenceDictionary[node.id] = node;
		});

		_.each(referenceDictionary, function (reference) {
			delete reference.preLinks;
		});

		return {
			graph: graph,
			referenceDictionary: referenceDictionary
		};
	};

	var GraphJS = function (list) {
		var results = mapListToGraph(list);
		this.graph = results.graph;
		this.referenceDictionary = results.referenceDictionary;
	};

	if(typeof exports !== 'undefined') {
		module.exports = GraphJS;
		_ = require('underscore');
	}
	else {
		this.GraphJS = GraphJS;
	}

	var depthFirstSearch = function (node, isMatch, allreadyVisited) {
		allreadyVisited = allreadyVisited || function () {};
		node.discovered = true;
		if(isMatch(node)) {
			return node;
		}

		return _.reduce(node.links, function (acc, link) {
			if(!link.ref.discovered) {
				return acc || depthFirstSearch(link.ref, isMatch, allreadyVisited);
			}
			else {
				allreadyVisited(node);
			}
			return acc || null;
		}, null);
	};

	GraphJS.prototype.depthFirstSearch = function (isMatch, allreadyVisited) {
		var results = depthFirstSearch(this.graph, isMatch, allreadyVisited);

		// cleanup
		_.each(this.referenceDictionary, function (reference) {
			delete reference.discovered;
		});

		return results;
	};

	GraphJS.prototype.get = function (id) {
		return this.referenceDictionary[id] || null;
	};

	// http://en.wikipedia.org/wiki/Tarjan's_strongly_connected_components_algorithm
	GraphJS.prototype.getStronglyConnectedComponents = function () {
		var index = 0;
		var components = [];
		var stack = [];

		var strongConnect = function (node) {
			var tempComponentNode;
			var component = [];

			node.index = index;
			node.lowLink = index;
			index += 1;
			stack.push(node);

			_.each(node.links, function (link) {
				if(link.ref.index === undefined) {
					strongConnect(link.ref);
					node.lowLink = Math.min(node.lowLink, link.ref.lowLink);
				}
				else if(_.indexOf(_.pluck(stack, 'id'), link.ref.id) !== -1) {
					node.lowLink = Math.min(node.lowLink, link.ref.lowLink);
				}
			});

			if(node.lowLink === node.index) {
				do {
					tempComponentNode = stack.pop();
					component.push(tempComponentNode.id);
				} while(node.id !== tempComponentNode.id);
				components.push(component);
			}
		};

		_.each(this.referenceDictionary, function (node) {
			if(node.index === undefined) {
				strongConnect(node);
			}
		});

		// cleanup
		_.each(this.referenceDictionary, function (node) {
			delete node.index;
			delete node.lowLink;
		});

		return components;
	};

	GraphJS.prototype.hasCycles = function () {
		return _.filter(this.getStronglyConnectedComponents(), function(comp) {
			return comp.length > 1;
		}).length > 0 ? true : false;
	};

	GraphJS.prototype.isForest = function () {
		var numberOfVertices = Object.keys(this.referenceDictionary).length;

		var numberOfEdges = _.reduce(
			this.referenceDictionary,
			function (acc, node) {
				return acc + node.links.length;
			},
			0
		);

		return numberOfEdges === numberOfVertices - 1 && !this.hasCycles();
	};

	GraphJS.prototype.isConnected = function () {
		var isConnected = true;
		depthFirstSearch(this.graph, function () { return false; });
		_.each(this.referenceDictionary, function (node) {
			if(!node.discovered) {
				isConnected = false;
			}
			// cleanup
			delete node.discovered;
		});
		return isConnected;
	};

	GraphJS.prototype.isTree = function () {
		return this.isForest() && this.isConnected();
	};

}).call(this);