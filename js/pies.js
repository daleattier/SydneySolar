// ###############################################################################################################################################
//	pies.js
//  Dale Harris
//  April 2017
//  
//  Description:
//	This code will setup the Pie Charts and Histogram.
//
//
//
//  
//
//
// ###############################################################################################################################################
var piemargin = {
	top: 25,
	right: 10,
	bottom: 25,
	left: 10
}
var width = 400,
	height = 250,
	radius = 100,
	formatDecimal = d3.format(".2f"),
	subval = 'Blacktown',
	svg1, svg2, svg3, svg4, svg5;
var margin = {
		top: 20,
		right: 30,
		bottom: 30,
		left: 50
	},
	bar_width = 500 - margin.left - margin.right,
	bar_height = 550 - margin.top - margin.bottom;
var x = d3.scaleBand().range([0, bar_width]).padding(0.1);
var y = d3.scaleLinear().range([bar_height, 0]);
var arc = d3.arc().outerRadius(radius - 10).innerRadius(50);
var labelArc = d3.arc().outerRadius(radius - 40).innerRadius(radius - 40);
var pie = d3.pie().sort(null).value(function(d) {
	return d.value;
});

function cleaning_up() {
	d3.select("#dohnut1").select('svg').remove();
	d3.select("#dohnut2").select('svg').remove();
	d3.select("#dohnut3").select('svg').remove();
	d3.select("#dohnut4").select('svg').remove();
	d3.select("#barchart").select('svg').remove();
}

function setup_pie() {
	console.log("Setting up")
	svg1 = d3.select("#dohnut1").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(120," + (
		height + piemargin.top) / 2 + ")");
	svg2 = d3.select("#dohnut2").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(120," + (
		height + piemargin.top) / 2 + ")");
	svg3 = d3.select("#dohnut3").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(120," + (
		height + piemargin.top) / 2 + ")");
	svg4 = d3.select("#dohnut4").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(120," + (
		height + piemargin.top) / 2 + ")");
	svg5 = d3.select("#barchart").append("svg").attr("width", bar_width + margin.left + margin.right).attr("height", bar_height + margin.top +
		margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
};

setup_pie();

function draw() {
	console.log("Start Drawing ... ")
		/* ----------------- Male Domestic Work -----------------------------*/
	d3.csv("data/df_hou_act.csv", function(error, data) {
		data.forEach(function(d) {
			d["Male DUW < 5 hrs"] = +d["Male DUW < 5 hrs"];
			d["Male DUW 5-14 hrs"] = +d["Male DUW 5-14 hrs"];
			d["Male DUW 15-29 hrs"] = +d["Male DUW 15-29 hrs"];
			d["Male DUW > 30 hrs"] = +d["Male DUW > 30 hrs"];
		});
		var data = data.filter(function(d) {
			return d.Suburb == subval;
		});
	
		var long_data = [];
		data.forEach(function(row) {
			Object.keys(row).forEach(function(colname) {
				if (colname == "Male DUW < 5 hrs" || colname == "Male DUW 5-14 hrs" || colname == "Male DUW 15-29 hrs" || colname ==
					"Male DUW > 30 hrs") {
					if (isNumeric(row[colname])) {
						long_data.push({
							"name": colname,
							"value": row[colname]
						});
					}
				}
			});
		});
		var ordinal = d3.scaleOrdinal().range(["#ff0000", "#ff8000", "#ffff00", "#80ff00"]);
		
		var g = svg1.selectAll(".arc").data(pie(long_data)).enter().append("g").attr("class", "arc");
		g.append("path").attr("d", arc).style("fill", function(d) {
			return ordinal(d.data.name);
		});
		g.append("text").attr("transform", function(d) {
			return "translate(" + labelArc.centroid(d) + ")";
		}).text("Male Domestic Unpaid Work").style("font-family", "sans-serif").style("text-anchor", "middle").style("font-size", "20px").attr(
			"transform", "translate(100,-120)");
		g.append("text").attr("transform", function(d) {
			return "translate(" + labelArc.centroid(d) + ")";
		}).attr("dy", ".35em").text(function(d) {
			return d.data.value;
		});
		svg1.append("g").attr("class", "legendOrdinal").attr("transform", "translate(125,-80)");
		var legendOrdinal = d3.legendColor().shape("path", d3.symbol().type(d3.symbolSquare).size(150)()).shapePadding(5).cellFilter(function(d) {
			return d.label !== "e"
		}).scale(ordinal);
		svg1.select(".legendOrdinal").call(legendOrdinal);
	});
	/* ----------------- Female Domestic Work -----------------------------*/
	d3.csv("data/df_hou_act.csv", function(error, data) {
		data.forEach(function(d) {
			d["Female DUW < 5 hrs"] = +d["Female DUW < 5 hrs"];
			d["Female DUW 5-14 hrs"] = +d["Female DUW 5-14 hrs"];
			d["Female DUW 15-29 hrs"] = +d["Female DUW 15-29 hrs"];
			d["Female DUW > 30 hrs"] = +d["Female DUW > 30 hrs"];
		});
		var data = data.filter(function(d) {
			return d.Suburb == subval;
		});
		var long_data = [];
		data.forEach(function(row) {
			Object.keys(row).forEach(function(colname) {
				if (colname == "Female DUW < 5 hrs" || colname == "Female DUW 5-14 hrs" || colname == "Female DUW 15-29 hrs" || colname ==
					"Female DUW > 30 hrs") {
					if (isNumeric(row[colname])) {
						long_data.push({
							"name": colname,
							"value": row[colname]
						});
					}
				}
			});
		});
		var ordinal = d3.scaleOrdinal().range(["#ff0000", "#ff8000", "#ffff00", "#80ff00", "#00ff00"]);
		var g = svg2.selectAll(".arc").data(pie(long_data)).enter().append("g").attr("class", "arc");
		g.append("path").attr("d", arc).style("fill", function(d) {
			return ordinal(d.data.name);
		});
		g.append("text").attr("transform", function(d) {
			return "translate(" + labelArc.centroid(d) + ")";
		}).text("Female Domestic Unpaid Work").style("font-family", "sans-serif").style("text-anchor", "middle").style("font-size", "20px").attr(
			"transform", "translate(100,-120)");
		g.append("text").attr("transform", function(d) {
			return "translate(" + labelArc.centroid(d) + ")";
		}).attr("dy", ".35em").text(function(d) {
			return d.data.value;
		});
		svg2.append("g").attr("class", "legendOrdinal").attr("transform", "translate(125,-80)");
		var legendOrdinal = d3.legendColor().shape("path", d3.symbol().type(d3.symbolSquare).size(150)()).shapePadding(5).cellFilter(function(d) {
			return d.label !== "e"
		}).scale(ordinal);
		svg2.select(".legendOrdinal").call(legendOrdinal);
	});
	/* ----------------- Number of Bedrooms -----------------------------*/
	d3.csv("data/df_hou_act.csv", function(error, data) {
		data.forEach(function(d) {
			d["Bedrooms 0"] = +d["Bedrooms 0"];
			d["Bedrooms 1"] = +d["Bedrooms 1"];
			d["Bedrooms 2"] = +d["Bedrooms 2"];
			d["Bedrooms 3"] = +d["Bedrooms 3"];
			d["Bedrooms 4"] = +d["Bedrooms 4"];
			d["Bedrooms 5"] = +d["Bedrooms 5"];
			d["Bedrooms > 6"] = +d["Bedrooms > 6"];
		});
		var data = data.filter(function(d) {
			return d.Suburb == subval;
		});
		var long_data = [];
		data.forEach(function(row) {
			Object.keys(row).forEach(function(colname) {
				if (colname == "Bedrooms 0" || colname == "Bedrooms 1" || colname == "Bedrooms 2" || colname == "Bedrooms 3" || colname ==
					"Bedrooms 4" || colname == "Bedrooms 5" || colname == "Bedrooms > 6") {
					if (isNumeric(row[colname])) {
						long_data.push({
							"name": colname,
							"value": row[colname]
						});
					}
				}
			});
		});
		var ordinal = d3.scaleOrdinal().range(["#ff0000", "#ff8000", "#ffff00", "#80ff00", "#00ff00", "#00ff80", "#00bfff"]);
		var g = svg3.selectAll(".arc").data(pie(long_data)).enter().append("g").attr("class", "arc");
		g.append("path").attr("d", arc).style("fill", function(d) {
			return ordinal(d.data.name);
		});
		g.append("text").attr("transform", function(d) {
			return "translate(" + labelArc.centroid(d) + ")";
		}).text("Total Number of Bedrooms").style("font-family", "sans-serif").style("text-anchor", "middle").style("font-size", "20px").attr(
			"transform", "translate(100,-120)");
		g.append("text").attr("transform", function(d) {
			return "translate(" + labelArc.centroid(d) + ")";
		}).attr("dy", ".35em").text(function(d) {
			return d.data.value;
		});
		svg3.append("g").attr("class", "legendOrdinal").attr("transform", "translate(125,-80)");
		var legendOrdinal = d3.legendColor().shape("path", d3.symbol().type(d3.symbolSquare).size(150)()).shapePadding(5).cellFilter(function(d) {
			return d.label !== "e"
		}).scale(ordinal);
		svg3.select(".legendOrdinal").call(legendOrdinal);
	});
	/* ----------------- Number of Motor Vehicles -----------------------------*/
	d3.csv("data/df_hou_act.csv", function(error, data) {
		data.forEach(function(d) {
			d["Vehicles 0"] = +d["Vehicles 0"];
			d["Vehicles 1"] = +d["Vehicles 1"];
			d["Vehicles 2"] = +d["Vehicles 2"];
			d["Vehicles 3"] = +d["Vehicles 3"];
			d["Vehicles > 4"] = +d["Vehicles > 4"];
		});
		var data = data.filter(function(d) {
			return d.Suburb == subval;
		});
		var long_data = [];
		data.forEach(function(row) {
			Object.keys(row).forEach(function(colname) {
				if (colname == "Vehicles 0" || colname == "Vehicles 1" || colname == "Vehicles 2" || colname == "Vehicles 3" || colname ==
					"Vehicles > 4") {
					if (isNumeric(row[colname])) {
						long_data.push({
							"name": colname,
							"value": row[colname]
						});
					}
				}
			});
		});
		var ordinal = d3.scaleOrdinal().range(["#ff0000", "#ff8000", "#ffff00", "#80ff00", "#00ff00"]);
		var g = svg4.selectAll(".arc").data(pie(long_data)).enter().append("g").attr("class", "arc");
		g.append("path").attr("d", arc).style("fill", function(d) {
			return ordinal(d.data.name);
		});
		g.append("text").attr("transform", function(d) {
			return "translate(" + labelArc.centroid(d) + ")";
		}).text("Motor Vehicles per dwelling").style("font-family", "sans-serif").style("text-anchor", "middle").style("font-size", "20px").attr(
			"transform", "translate(100,-120)");
		g.append("text").attr("transform", function(d) {
			return "translate(" + labelArc.centroid(d) + ")";
		}).attr("dy", ".35em").text(function(d) {
			return d.data.value;
		});
		svg4.append("g").attr("class", "legendOrdinal").attr("transform", "translate(125,-80)");
		var legendOrdinal = d3.legendColor().shape("path", d3.symbol().type(d3.symbolSquare).size(150)()).shapePadding(5).cellFilter(function(d) {
			return d.label !== "e"
		}).scale(ordinal);
		svg4.select(".legendOrdinal").call(legendOrdinal);
	});
	/* ----------------- Bar Chart -----------------------------*/
	d3.csv("data/suburbs.csv", function(error, data) {
		data.forEach(function(d) {
			d.num_units = +d.num_units;
			d.total_KW = formatDecimal(d.total_KW);
			d.Average_KW = formatDecimal(d.Average_KW);
			d.Unit_per_1000 = formatDecimal(d.Unit_per_1000);
			d.Population = +d.Population
		});
		var data = data.filter(function(d) {
			return d.Suburb == subval;
		});
		nested = d3.nest().key(function(d) {
			return d.Suburb
		}).entries(data);
		
		var long_data = [];
		nested[0].values.forEach(function(row) {
				Object.keys(row).forEach(function(colname) {
					if (colname == "Suburb" || colname == "Value" || colname == "Postcode" || colname == "Population") {
						return
					}
					if (isNumeric(row[colname])) {
						long_data.push({
							"Name": colname,
							"Value": row[colname]
						});
					}
				});
			})
		
		x.domain(long_data.map(function(d) {
			return d.Name;
		}));
		y.domain([0, d3.max(long_data, function(d) {
			
			return d.Value;
		})]);
		
		svg5.selectAll(".bar").data(long_data).enter().append("rect").attr("class", "bar").attr("x", function(d) {
			return x(d.Name);
		}).attr("width", x.bandwidth()).attr("y", function(d) {
			return y(d.Value);
		}).attr("height", function(d) {
			return bar_height - y(d.Value);
		});
		svg5.selectAll("text").data(long_data).enter().append("text").text(function(d) {
				return d.Value;
			}).attr("text-anchor", "middle").attr("x", function(d) {
				return (x.bandwidth() / 2) + x(d.Name);
			}).attr("y", function(d) {
				return bar_height - 20;
			}).attr("font-family", "sans-serif").attr("font-size", "11px").attr("fill", "black")
			
			// add the x Axis
		svg5.append("g").attr("transform", "translate(0," + (bar_height) + ")").call(d3.axisBottom(x));
		// add the y Axis
		svg5.append("g").call(d3.axisLeft(y));
	});
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
draw()