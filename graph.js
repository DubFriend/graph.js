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

	if(module && module.exports) {
		module.exports = GraphJS;
		_ = require('underscore');
	}
	else {
		this.GraphJS = GraphJS;
	}

	GraphJS.prototype.depthFirstSearch = function (isMatch) {
		var depthFirstRecurse = function (node, id) {
			node.discovered = true;

			// if(node.id === id) {
			if(isMatch(node)) {
				return node;
			}

			return _.reduce(node.links, function (acc, link) {
				if(!link.ref.discovered) {
					return acc || depthFirstRecurse(link.ref, isMatch);
				}
				return acc || null;
			}, null);
		};

		var results = depthFirstRecurse(this.graph, isMatch);

		_.each(this.referenceDictionary, function (reference) {
			delete reference.discovered;
		});

		return results;
	};

	GraphJS.prototype.find = function (id) {
		return this.referenceDictionary[id] || null;
	};

	GraphJS.prototype.hasCycles = function () {

	};

}).call(this);