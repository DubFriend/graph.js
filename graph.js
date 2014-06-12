(function () {
	'use strict';

	var self = {},
		_ = _;

	if(module && module.exports) {
		module.exports = self;
		_ = require('underscore');
	}
	else {
		this.graphJS = self;
	}

	self.hasCycles = function (graph) {

	};

}).call(this);