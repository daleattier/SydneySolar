// ###############################################################################################################################################
//	sunburst.js
//  Dale Harris
//  April 2017
//  
//  Description:
//	This code will setup the sunburst diagram.
//
//
//
//  
//
//
// ###############################################################################################################################################
$(function() {
	var c = document.getElementById('sunburst');
	var width = c.offsetWidth;
	var height = Math.min(width / 1.8, 1100) //width / 2;
	radius = (Math.min(width, height) / 2) - 20;
	var formatNumber = d3.format(",d");
	var x = d3.scaleLinear().range([0, 2 * Math.PI]);
	var y = d3.scaleSqrt().range([0, radius]);
	var val = "Unit_per_1000"
	var color = d3.scaleOrdinal(d3.schemeCategory20);
	var partition = d3.partition();
	var arc = d3.arc().startAngle(function(d) {
		return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
	}).endAngle(function(d) {
		return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
	}).innerRadius(function(d) {
		return Math.max(0, y(d.y0));
	}).outerRadius(function(d) {
		return Math.max(0, y(d.y1));
	});
	
	function setup() {
		svg = d3.select("#sunburst").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" +
			width / 2 + "," + (height / 2) + ")");
	}
	d3.selectAll("input").on("change", function() {
		val = d3.select(this).property('value');
		d3.select("#sunburst").select('svg').remove();
		setup()
		draw(val);
	});
	var text,
		root,
		svg,
		mydata,
		path;

	var map_desc = d3.select("#sun_desc").append("div").attr("class", "sun_details");

	function sun_details(mapdata) {
		var desc_html
		if (mapdata.data.name == null) {
			desc_html = "<p></p><p class='map_info'> The suburb of " + mapdata.data.Suburb + " is located within the " + mapdata.data.District +
				" district.</p> <p class='map_info'>" + mapdata.data.Suburb + " has " + mapdata.data.num_units +
				" solar panel units installed with an a total output of " + formatDecimal(mapdata.data.total_KW) +
				" kw <\p> <p class='map_info'>  " + mapdata.data.Suburb + " has " + formatDecimal(mapdata.data.Unit_per_1000) +
				" units installed per 1000 people. </p>";
		} else {
			desc_html = "<p></p><p class='map_info'> The region of " + mapdata.data.name + " has a total of " + formatDecimal(mapdata.value) + " " +
				val;
		}
		map_desc.html(desc_html);
	}

	d3.csv("data/Power.csv", function(error, data) {
		if (error) throw error;

		function genJSON(csvData, groups) {
			var genGroups = function(data) {
				return _.map(data, function(element, index) {
					return {
						name: index,
						children: element
					};
				});
			};
			var nest = function(node, curIndex) {
				if (curIndex === 0) {
					node.children = genGroups(_.groupBy(csvData, groups[0]));
					_.each(node.children, function(child) {
						nest(child, curIndex + 1);
					});
				} else {
					if (curIndex < groups.length) {
						node.children = genGroups(_.groupBy(node.children, groups[curIndex]));
						_.each(node.children, function(child) {
							nest(child, curIndex + 1);
						});
					}
				}
				return node;
			};
			return nest({}, 0);
		}
		mydata = genJSON(data, ['District'])
		setup()
		draw('Unit_per_1000')
	});

	function draw(value) {
		root = d3.hierarchy(mydata);
		if (value == 'total_KW') {
			root.sum(function(d) {
				return d.total_KW;
			}).sort(function(a, b) {
				return b.height - a.height || b.value - a.value;
			});
		} else if (value == 'num_units') {
			root.sum(function(d) {
				return d.num_units;
			}).sort(function(a, b) {
				return b.height - a.height || b.value - a.value;
			});
		} else {
			root.sum(function(d) {
				return d.Unit_per_1000;
			}).sort(function(a, b) {
				return b.height - a.height || b.value - a.value;
			});
		}
		svg.selectAll("path").data(partition(root).descendants()).enter().append("g").attr("class", "node");
		path = svg.selectAll(".node").append("path").attr("d", arc).style("fill", function(d) {
			return color((d.children ? d : d.parent).data.name);
		}).on("click", click).append("title");
		text = svg.selectAll(".node").append("text").attr("transform", function(d) {
				return "rotate(" + computeTextRotation(d) + ")";
			}).attr("x", function(d) {
				return y(d.y0);
			}).attr("dx", "6") // margin
			.attr("dy", ".35em") // vertical-align
			.html(function(d) {
				if (d.data.name == null) {
					return d.data.name === "root" ? "" : d.data.Suburb
				} else {
					return d.data.name === "root" ? "" : d.data.name
				}
			});
	}

	function click(d) {
		//Hide text while Sunburst transitions
		text.transition().attr("opacity", 0);
		svg.transition().duration(750).tween("scale", function() {
			var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
				yd = d3.interpolate(y.domain(), [d.y0, 1]),
				yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
			return function(t) {
				x.domain(xd(t));
				y.domain(yd(t)).range(yr(t));
			};
		}).selectAll("path").attrTween("d", function(d) {
			return function() {
				return arc(d);
			};
		}).on("end", function(e, i) {
			// check if the animated element's data e lies within the visible angle span given in d
			if (e.x0 > (d.x0 - 1) && e.x0 < d.x1) {
				// get a selection of the associated text element
				var arcText = d3.select(this.parentNode).select("text");
				// fade in the text element and recalculate positions
				arcText.transition().duration(750).attr("opacity", 1).attr("class", "visible").attr("transform", function() {
					return "rotate(" + computeTextRotation(e) + ")"
				}).attr("x", function(d) {
					return y(d.y0);
				}).text(function(d) {
					if (d.data.name == null) {
						return d.data.name === "root" ? "" : d.data.Suburb
					} else {
						return d.data.name === "root" ? "" : d.data.name
					}
				});
			}
		});
		sun_details(this.__data__);
	}

	function computeTextRotation(d) {
		return (x((d.x0 + d.x1) / 2) - Math.PI / 2) / Math.PI * 180;
	}
	d3.select(self.frameElement).style("height", height + "px");
});