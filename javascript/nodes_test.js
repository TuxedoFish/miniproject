//get the canvas for drawing on:
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
	
//get a range of colours using a predefined set:
var color = d3.scaleOrdinal(d3.schemeCategory20);

//the distance between links
var d = 200;

//defines a force simulation in which there are 3 forces:
//one which acts to center objects, one which is caused by the links,  one caused
//by other objects
var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink().id(function(d) { return d.id; })
		.distance(d));	
		
//grabs json data with an error catch
d3.json("../json/data.json", function(error, graph) {
  if (error) throw error;
  
  //size scale factor
  var sf = 10;
  
  //select g and create a set of links as classes using the data provided and then
  //change the stroke width
  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
  
  //trying to find the html concerning positions of links so i could transform the positions of the links so reversed ones wouldnt overlap 
  //console.log(link._groups[0][0]);
  //var element = 0;
  //var html = link._groups[0][element];
  
  //select g and create a set of nodes as classes using the data provided and 
  //define the shape variables then set the functions up that will describe the drag behaviour
  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("rect")
    .data(graph.nodes)
    .enter().append("rect")
      .attr("width", function(d) { return d.width*sf; })
	  .attr("height", function(d) { return d.height*sf; })
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
		  
  //append a title to each of the nodes
  node.append("title")
	.text(function(d) { return d.id; });

  var reversed = getReversed(graph.links);
	
  //set the simulation nodes and start the simulation with timings defined by 
  //the library to call a function 'ticked'
  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  //set simulation force 'link' as having links defined in the json data
  simulation.force("link")
      .links(graph.links);
	  
  //every internal tick in the library will call this function which 
  //takes a given link and node and updates the positions of the objects
  function ticked() {
    
	link 
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })

    node
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
  }
  });

//all the relevant functions for defining how the dragging work
function dragstarted(d) {
  //delay the simulation by 0.3s
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  //set the new positions of the node to the position given by the mouse
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

  
