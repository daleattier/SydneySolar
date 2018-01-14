// ###############################################################################################################################################
//	map.js
//  Dale Harris
//  April 2017
//  
//  Description:
//	This code will setup the map. It is dependant on D3v4, d3-legend.js
//
//
//
//  
//
//
// ###############################################################################################################################################

$(function() {
	console.log("Start")
	var color_domain = [5, 10, 15, 20, 30, 100]  //Values for map and Legend.
	var linear = d3.scaleLinear().domain(color_domain).range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]); //Colours for map and Legend.
	d3.select(window).on("resize", throttle);
	var zoom = d3.zoom().scaleExtent([1, 9]).on("zoom", move);
	var c = document.getElementById('map');
	var width = c.offsetWidth;
	var height = Math.min(width / 1.6, 1100);
	
	//offsets for tooltips
	var offsetL = c.offsetLeft + 20;
	var offsetT = c.offsetTop + 10;
	var topo_nsw, topo_metro, projection, path, map_svg, g;
	
	var graticule = d3.geoGraticule();
	var map_tooltip = d3.select("#map").append("div").attr("class", "Maptooltip hidden");
	var map_desc = d3.select("#map_details").append("div").attr("class", "map_details");
	setup(width, height);

	function map_details(mapdata) {
		var mouse = d3.mouse(map_svg.node()).map(function(d) {
			return parseInt(d);
		});
		var desc_html = "<p></p><p class='map_info'> The suburb of " + mapdata.properties.Suburb + " is located within the " + mapdata.properties
			.District + " district.</p> <p class='map_info'>" + mapdata.properties.Suburb + " has " + mapdata.properties.num_units +
			" solar panel units installed with an average output of " + formatDecimal(mapdata.properties.Ave_kwh) +
			" kwh and a total output of " + formatDecimal(mapdata.properties.Total_kwh) +
			" kw <\p> <p class='map_info'> With a total population of " + mapdata.properties.Tot_P_P + ", " + mapdata.properties.Suburb +
			" has " + formatDecimal(mapdata.properties.u_pk) + " units installed per 1000 people. </p>";
		map_desc.html(desc_html);
		
	}

	function setup(width, height) {
		projection = d3.geoMercator().rotate([-151, 0]).center([0, -34]).scale(Math.min(height * 30, width * 30)).translate([width / 2, height /
			2
		]).precision(0.1);
		path = d3.geoPath().projection(projection);
		map_svg = d3.select("#map").append("svg").attr("width", width).attr("height", height).attr("Left", 50).call(zoom).append("g");
		map_svg.append("path").attr("d", path);
		g = map_svg.append("g")
	}
	d3.json("data/NSW.json", function(error, data) {
		var nsw = topojson.feature(data, data.objects.NSW).features;
		topo_nsw = nsw;
		d3.json("data/SydneyMetro.json", function(error, data) {
			var metro = topojson.feature(data, data.objects.SydneyMetro).features;
			topo_metro = metro;
			draw()
		});
	});

	function map_handleMouseOver() {
		var mouse = d3.mouse(map_svg.node()).map(function(d) {
			return parseInt(d);
		});
		map_tooltip.classed("hidden", false).attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px").html(this.__data__
			.properties.Suburb + "<br/> " + formatDecimal(this.__data__.properties.u_pk));
		map_details(this.__data__);
	}

	function map_handleMouseOut() {
		map_tooltip.classed("hidden", true);
	}


	function draw() {
		console.log(topo_nsw)
		
		g.selectAll(".nsw").data(topo_nsw).enter().append("path").attr("class", "nsw").attr("d", path).attr("id", function(d, i) {
			return d.id;
		});
		
		g.selectAll(".metro").data(topo_metro).enter().append("path").attr("class", "metro").attr("d", path).attr("title", function(d, i) {
			return d.properties.Suburb;
		}).attr("id", function(d, i) {
			return d.id;
		}).style("fill", function(d) {
			return linear(d.properties.u_pk);
		}).style("opacity", 0.8).on("mouseover", map_handleMouseOver).on("mouseout", map_handleMouseOut);
		//Adding legend for our Choropleth
		//https://github.com/susielu/d3-legend
		map_svg.append("g").attr("class", "legendLinear").attr("transform", "translate(20,20)");
		var legendLinear = d3.legendColor().shapeWidth(30).cells(10).orient('horizontal').title("Solar installations per 1000 population.").scale(
			linear);
		map_svg.select(".legendLinear").call(legendLinear);
	}

	function redraw() {
		width = c.offsetWidth;
		height = Math.min(width / 1.2, 1100);
		d3.select('svg').remove();
		setup(width, height);
		draw();
	}

	function move() {
		var t = [d3.event.transform.x, d3.event.transform.y];
		var s = d3.event.transform.k;
		zscale = s;
		var h = height / 4;
		t[0] = Math.min(
			(width / height) * (s - 1), Math.max(width * (1 - s), t[0]));
		t[1] = Math.min(h * (s - 1) + h * s, Math.max(height * (1 - s) - h * s, t[1]));
		g.attr("transform", "translate(" + t + ")scale(" + s + ")");
		//adjust the country hover stroke width based on zoom level
		d3.selectAll(".nsw").style("stroke-width", 0.75 / s);
		d3.selectAll(".metro").style("stroke-width", 0.75 / s);
	}
	var throttleTimer;

	function throttle() {
		window.clearTimeout(throttleTimer);
		throttleTimer = window.setTimeout(function() {
			redraw();
		}, 200);
	}
})