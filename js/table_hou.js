// ###############################################################################################################################################
//	table_hou.js
//  Dale Harris
//  April 2017
//  
//  Description:
//	This code will setup the table.
//
//
//
//  
//
//
// ###############################################################################################################################################
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

var formatDecimal = d3.format(".2f");

var table = d3.select("#table-location").append("table").attr("class", "table table-condensed table-striped"),
	thead = table.append("thead"),
	tbody = table.append("tbody");

	var act_desc = d3.select("#act_details").append("div").attr("class", "act_details");

function act_details(data) {
	var desc_html = "<p></p> <h2> " + data.Suburb + " </h2> <p class='map_info'>" + data.Suburb + " has " + data.num_units +
		" solar panel units installed with an average output of " + formatDecimal(data.Average_KW) + " kwh and a total output of " +
		formatDecimal(data.total_KW) + " kw <\p> <p class='map_info'> With a total population of " + data.Population + ", " + data.Suburb +
		" has " + formatDecimal(data.Unit_per_1000) + " units installed per 1000 people. </p>";
	act_desc.html(desc_html);

}
d3.csv("data/suburbs.csv", function(error, data) {

	// Get every column value
	var columns = Object.keys(data[0]).filter(function(d) {
		return ((d != "Year"));
	});
	
	var header = thead.append("tr").selectAll("th").data(columns).enter().append("th").text(function(d) {
		return d;
	}).on("click", function(d) {
		if (d == "Suburb") {
			rows.sort(function(a, b) {
				if (a[d] < b[d]) {
					return -1;
				}
				if (a[d] > b[d]) {
					return 1;
				} else {
					return 0;
				}
			});
		} else if (d.split(" ")[0] == "Percent") {
			rows.sort(function(a, b) {
				return +b[d].split("%")[0] - +a[d].split("%")[0];
			});
		} else {
			rows.sort(function(a, b) {
				return b[d] - a[d];
			})
		}
	});
	var rows = tbody.selectAll("tr").data(data).enter().append("tr").on("click", function(d) {
		console.log("Start change suburb " + subval);
		act_details(d);
		subval = d.Suburb;
		cleaning_up();
		setup_pie();
		draw();
	}).on("mouseover", function(d) {
		d3.select(this).style("background-color", "orange");
	}).on("mouseout", function(d) {
		d3.select(this).style("background-color", "transparent");
	});
	var cells = rows.selectAll("td").data(function(row) {
		return columns.map(function(d, i) {
			if (isNumeric(row[d])) {
				return {
					i: d,
					value: formatDecimal(row[d])
				};
			} else {
				return {
					i: d,
					value: row[d]
				};
			}
		});
	}).enter().append("td").html(function(d) {
		return d.value;
	});
});