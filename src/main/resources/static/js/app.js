/**
 * 
 */

var app =(function(){
	
	var selectedAuthor;
	var selectedAuthorBlueprints;
	
	
	
	return {
		
		selectAuthor:function(author){
			apiclient.getBlueprintsByAuthor(author,function(error,blueprints){
				if(error){
					return console.log("hubo un error");
				}else{
					
						selectedAuthor = blueprints.author;
						selectedAuthorBlueprints = blueprints;
					
				}
			})
		},
		drawBlueprint:function(author,bprintName,canvas){
			apiclient.getBlueprintByNameAndAuthor(author,bprintName,function(error,blueprint){
				if(error){
					return console.log("hubo un error")
				}else{
				console.log(bprintName);
				var ctx = canvas.getContext("2d");
				ctx.beginPath();
				ctx.clearRect(0,0,canvas.width,canvas.height);
				ctx.moveTo(blueprint.points[1].x,blueprint.points[1].y);
				blueprint["points"].forEach(function(currentPoint){					
					ctx.lineTo(currentPoint.x,currentPoint.y);
				});
				ctx.stroke();
				}
			})
			
		},
		updateBlueprintList:function(author){
			var bprintTable =$("#bprintBody");
			console.log(author);
			bprintTable.empty();
			this.selectAuthor(author);
			console.log(typeof selectedAuthorBlueprints);
			// -------------------MAP TO OBJECT--------------------
			reducedBPrintList=selectedAuthorBlueprints.map(function(currentBPrint){
				var bprints={};
				bprints["name"]=currentBPrint.name;
				bprints["points"]=currentBPrint.points.length;
				return bprints;
				
			});
			// -------------------MAP TO TABLE----------------------
			reducedBPrintList.forEach(function(currentBPrint){
				var tr,td;
				
				bprintTable.append(tr = document.createElement("tr"));
				tr.appendChild(td =document.createElement("td"));
				td.innerHTML=currentBPrint.name;
				tr.appendChild(td = document.createElement("td"));
				td.innerHTML=currentBPrint.points;
				tr.appendChild(td = document.createElement("td"));
				var btn = document.createElement("button");
				btn.type = "button";
				btn.onclick = () => app.drawBlueprint(author,currentBPrint.name,document.getElementById("canvas"));
				btn.innerHTML = "Open";
				td.appendChild(btn);
				
// ("<tr>" +
// "<td>"+currentBPrint.name+"</td>" +
// "<td>"+currentBPrint.points+"</td>" +
// "<td>" +
// "<button type='button' " +
// "onClick=app.drawBlueprint("+author+"','"+currentBPrint.name + "')'>" +
// "Open" +
// "</button>" +
// "</td>" +
// "</tr>");
			});
			
			bprintTable.append();
		}
		
		
	}
})();