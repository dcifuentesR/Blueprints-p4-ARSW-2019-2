/**
 * 
 */

apimock = (function() {
	var mockdata = [];

	mockdata["Satan"] = [ {
		"author" : "Satan",
		"points" : [ {
			"x" : 666,
			"y" : 666
		}, {
			"x" : 69,
			"y" : 420
		} ],
		"name" : "Blueprint666"
	}, {
		"author" : "Satan",
		"points" : [ {
			"x" : 10,
			"y" : 30
		}, {
			"x" : 10,
			"y" : 100
		} ],
		"name" : "SampleBPrint"
	}, {
		"author" : "Satan",
		"points" : [ {
			"x" : 120,
			"y" : 140
		}, {
			"x" : 90,
			"y" : 115
		}, {
			"x" : 105,
			"y" : 13
		} ],
		"name" : "Mariai's BPrint"
	} ];
	mockdata["SampleAuthor"] = [ {
		"author" : "SampleAuthor",
		"points" : [ {
			"x" : 140,
			"y" : 140
		}, {
			"x" : 115,
			"y" : 115
		} ],
		"name" : "SampleBPrint"
	} ]

	return {
		getBlueprintsByAuthor : function(author, callback) {
			/*
			 * if(connectionError){ return callback(new Error("Connection
			 * Error")) }
			 */
			return callback(null, mockdata[author]);

		},
		getBlueprintByNameAndAuthor:function(author,bprintName,callback){
			return callback(null,mockdata[author].find(bprint => bprint.name===bprintName));
		}
	}
})();