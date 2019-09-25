/**
 * 
 */
var apiclient = (function(){
	
	
	return {
		
		getBlueprintsByAuthor : function(author, callback) {
			jQuery.ajax({
                url: "http://localhost:8080/blueprints/"+author,
                success: function (result) {
                    callback(null,result);
                },
                async: false
            });
//			$.get("http://localhost:8080/blueprints/"+author,function(data){
//				callback(null,data);
//			})

		},
		getBlueprintByNameAndAuthor:function(author,bprintName,callback){
			jQuery.ajax({
                url:"http://localhost:8080/blueprints/"+author+"/"+bprintName,
                success: function (result) {
                    callback(null,result);
                },
                async: false
            });
//			var blueprint = $.get("http://localhost:8080/blueprints/"+author+"/"+bprintName,function(data){
//				return data;
//			})
//			return callback(null,blueprint);
		}
	}
})();