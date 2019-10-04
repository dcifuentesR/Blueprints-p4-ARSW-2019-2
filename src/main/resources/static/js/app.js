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
				var point = {x:event.pageX-canvas.getBoundingClientRect().left,y:event.pageY-canvas.getBoundingClientRect().top-window.scrollY};
					selectedBlueprint["points"].push(point);
					
					console.log("new point at: "+ JSON.stringify(point));
					// ------------------THIS SHOULD BE
					// CHANGED-------------------------
					ctx.beginPath();
					ctx.clearRect(0,0,canvas.width,canvas.height);
					ctx.moveTo(selectedBlueprint.points[1].x,selectedBlueprint.points[1].y);
					selectedBlueprint["points"].forEach(function(currentPoint){					
						ctx.lineTo(currentPoint.x,currentPoint.y);
					});
					ctx.stroke();
					// ------------------THIS SHOULD BE
					// CHANGED-------------------------
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
			app.drawBlueprint(selectedAuthor,selectedBlueprint.name);
		},
		drawBlueprint:function(author,bprintName){
			apiclient.getBlueprintByNameAndAuthor(author,bprintName,function(error,blueprint){
				if(error){
					return console.log("hubo un error")
				}else{
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
			var authorPoints=0;
			var bprintTable =$("#bprintBody");
			bprintTable.empty();
			this.selectAuthor(author);
			// -------------------MAP TO OBJECT--------------------
			reducedBPrintList=selectedAuthorBlueprints.map(function(currentBPrint){
				var bprints={};
				bprints["name"]=currentBPrint.name;
				bprints["points"]=currentBPrint.points.length;
				authorPoints+=currentBPrint.points.length;
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
				btn.onclick = () => app.selectBlueprint(currentBPrint.name);
				btn.innerHTML = "Open";
				td.appendChild(btn);
				
			});
			
			bprintTable.append();
			document.getElementById("labelUserPoints").innerHTML = authorPoints;
		},
		
		saveAndUpdateBPrint:function(){
			return $.ajax({
				url: "/blueprints/"+selectedBlueprint.author+'/'+selectedBlueprint.name,
				type: 'PUT',
				data: JSON.stringify(selectedBlueprint),
				contentType: "application/json"
				
			})
			.then(app.updateBlueprintList(selectedBlueprint.author))
			.then(app.drawBlueprint(selectedAuthor,selectedBlueprint.name));
		},
		
		createBlueprint:function(){
			ctx.clearRect(0,0,canvas.width,canvas.height);
			var bprintName = prompt("Please enter the name of the blueprint");
			
			selectedBlueprint={author:selectedAuthor,points:[],name:bprintName}
			return $.ajax({
				url: "/blueprints/",
				type: 'POST',
				data: JSON.stringify(selectedBlueprint),
				contentType:"application/json"
			})
			.then(app.updateBlueprintList(selectedBlueprint.author))
			.then(app.drawBlueprint(selectedAuthor,selectedBlueprint.name));
			
		},
		
		deleteBlueprint:function(){
			ctx.clearRect(0,0,canvas.width,canvas.height);
			return $.ajax({
				url: "/blueprints/"+selectedAuthor+"/"+selectedBlueprint.name,
				type:'DELETE',
				contentType:"application/json"
			})
			.then(function(){
				selectedBlueprint=null;
				app.updateBlueprintList(selectedAuthor);
			});
		}
		
		
	}
})();