class node {
	constructor(reversed, source, target) {
		this.reversed = reversed;
		this.source = source;
		this.target = target;
	}
}

//function which makes a boolean array of which links are the reverse of another
function getReversed(d) {
	var points = new Array(d.length); 
	
	var reverse = false;
	
	//searches if d[i]'s source is d[j]'s target and vice versa
	for(var i=0; i<points.length; i++) {
		for(var j=i; j<points.length; j++) {
			if(d[i].source == d[j].target &&
			   d[j].source == d[i].target) {
					reverse = true;
			}
		}
		points[i] = new node(reverse, d[i].source.id, d[i].target.id);
		reverse=false;
	}
}  