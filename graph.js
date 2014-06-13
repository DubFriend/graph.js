(function () {
	'use strict';

	var _ = _;

	var mapListToGraph = function (list) {

		var mapNode = function (node) {
			var mapLink = function (link) {
				return _.isObject(link) ? link : { id: link, weight: undefined };
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

		// var isIDInPreLinks = function (preLinks, id) {
		// 	return _.indexOf(_.pluck(preLinks, 'id'), id) !== -1;
		// };

		var getPreLinkByID = function (preLinks, id) {
			var index = _.indexOf(_.pluck(preLinks, 'id'), id);
			return index === -1 ? null : preLinks[index];
		};

		list = _.map(list, mapNode);

		var graph = list.shift();

		var referenceList = [graph];

		_.each(list || [], function (node) {

			_.each(referenceList, function (reference) {
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

			referenceList.push(node);
		});

		_.each(referenceList, function (reference) {
			delete reference.preLinks;
		});

		return {
			graph: graph,
			referenceList: referenceList
		};
	};

	var GraphJS = function (list) {
		var results = mapListToGraph(list);
		this.graph = results.graph;
		this.referenceList = results.referenceList;
	};

	if(module && module.exports) {
		module.exports = GraphJS;
		_ = require('underscore');
	}
	else {
		this.GraphJS = GraphJS;
	}

	GraphJS.prototype.hasCycles = function () {

	};

}).call(this);