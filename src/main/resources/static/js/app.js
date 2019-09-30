/**
 * 
 */

var app =(function(){
	
	var selectedAuthor;
	var selectedAuthorBlueprints;
	var selectedBlueprint;
	var canvas;
	return {
		init:function(){
			canvas=document.getElementById("canvas"),ctx=canvas.getContext("2d");
			if(window.PointerEvent){
				canvas.addEventListener("pointerdown",function(event){
				console.log(selectedBlueprint.name);
					selectedBlueprint["points"].push({x:event.pageX-canvas.getBoundingClientRect().left,y:event.pageY-canvas.getBoundingClientRect().top});
					//------------------THIS SHOULD BE CHANGED-------------------------
					ctx.beginPath();
					ctx.clearRect(0,0,canvas.width,canvas.height);
					ctx.moveTo(selectedBlueprint.points[1].x,selectedBlueprint.points[1].y);
					selectedBlueprint["points"].forEach(function(currentPoint){					
						ctx.lineTo(currentPoint.x,currentPoint.y);
					});
					ctx.stroke();
					//------------------THIS SHOULD BE CHANGED-------------------------
				});
			}
		},
		
		selectAuthor:function(author){
			apiclient.getBlueprintsByAuthor(author,function(error,blueprints){
				if(error){
					return console.log("hubo un error");
				}else{
					
						selectedAuthor = author;
						selectedAuthorBlueprints = blueprints;
					
				}
			})
		},
		selectBlueprint:function(bprintName){
			selectedBlueprint =selectedAuthorBlueprints.find(bprint => bprint.name===bprintName);
		},
		drawBlueprint:function(author,bprintName){
			app.selectBlueprint(bprintName);
			apiclient.getBlueprintByNameAndAuthor(author,bprintName,function(error,blueprint){
				if(error){
					return console.log("hubo un error")
				}else{
				console.log(bprintName);
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
			console.log(selectedAuthor);
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
				btn.onclick = () => app.drawBlueprint(selectedAuthor,currentBPrint.name);
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
		},
		
		saveAndUpdateBPrint:function(){
			console.log(selectedAuthorBlueprints);
			return $.ajax({
				url: "/blueprints/"+selectedBlueprint.author,
				type: "PUT",
				data: JSON.stringify(selectedAuthorBlueprints),
				contentType: "application/json"
				
			}).then(app.updateBlueprintList(selectedBlueprint.author));
		}
		
		
	}
})();