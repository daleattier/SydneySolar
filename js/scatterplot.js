// ###############################################################################################################################################
//	scatterplot.js
//  Dale Harris
//  April 2017
//  
//  Description:
//	This code will setup the scatterplot. 
//
//
//
//  
//
//
// ###############################################################################################################################################
function actionsFromDispatch(dispatch) {
	return {
		ingestData(data, numericColumns, ordinalColumns) {
			dispatch({
				type: 'INGEST_DATA',
				data,
				numericColumns,
				ordinalColumns,
			});
		},
		setX(column) {
			dispatch({
				type: 'SET_X',
				column
			});
		},
		setY(column) {
			dispatch({
				type: 'SET_Y',
				column
			});
		},
		setColor(column) {
			dispatch({
				type: 'SET_COLOR',
				column
			});
		},
		setRadius(column) {
			dispatch({
				type: 'SET_RADIUS',
				column
			});
		},
	};
}
/* Suburb Info */
var occ_desc = d3.select("#occ_details").append("div").attr("class", "occ_details");

function occ_details(occdata) {
	
	console.log(occdata);
	var desc_html = "<p></p><p class='map_info'> The suburb of " + occdata.Suburb + " is located within the " + occdata.District +
		" district \
					.</p> <p class='map_info'>" + occdata.Suburb + " has " + occdata['Solar Units'] +
		" solar panel units installed with an \
					average output of " + formatDecimal(occdata['Average Kwh']) + " kwh and a total output of " +
		formatDecimal(occdata['Total Kwh']) + " kw <\p> \
					<p class='map_info'> With a total population of " + occdata['Total Population'] +
		", " + occdata.Suburb + " has " + formatDecimal(occdata['Solar units per 1000 pop']) + " \
					units installed per 1000 people. </p>";
	occ_desc.html(desc_html);
}
/* Legend */
var c10 = d3.scaleOrdinal(d3.schemeCategory10)
var districts = ['Central & Inner Metropolitan', 'Western Suburbs', 'Gladesville-Ryde-Eastwood', 'Macarthur Region', 'North Shore',
	'Northern Beaches', 'Outer Western Suburbs', 'Parramatta-Hills District', 'South Western Suburbs', 'St George & Sutherland Shire'
]
var svgleg = d3.select("#leg").append("svg").attr("width", 200).attr("height", 200);
var eleg = svgleg.selectAll("circle").data(d3.range(10)).enter()
var circleg = eleg.append("circle").attr("r", 5).attr("cx", 25).attr("cy", d3.scaleLinear().domain([-1, 10]).range([0, 200])).attr("fill",
	c10)
eleg.append("text").attr("dx", 40).attr("dy", d3.scaleLinear().domain([-1, 10]).range([5, 205])).attr("class", "legend_text").text(function(
	i) {
	return districts[i]
});
/* global d3 */
const axis = ((() => {
	const axisLocal = d3.local();
	return d3.component('g').create(function(selection, d) {
		axisLocal.set(selection.node(), d3[`axis${d.type}`]());
		selection.attr('opacity', 0).call(axisLocal.get(selection.node()).scale(d.scale).ticks(d.ticks || 10)).transition('opacity').duration(
			2000).attr('opacity', 0.8);
	}).render(function(selection, d) {
		selection.attr('transform', `translate(${[
          d.translateX || 0,
          d.translateY || 0,
        ]})`).transition(
			'ticks').duration(3000).call(axisLocal.get(selection.node()));
	});
})());
/* global d3 */
function loadData(actions) {
	const numericColumns = ['Total Kwh', 'Solar Units', 'Average Kwh', 'Units per Dwelling', 'Units per Km', 'Population Density',
		'Solar units per 1000 pop', 'Dwellings per Km', 'Male Population', 'Female Population', 'Total Population', 'Dwellings', 'Median Age',
		'Monthly Mortgage', 'Median Personal Income', 'Median Rent', 'Family Income', 'Ave Persons per Bedroom', 'Median Household Income',
		'Average Household Size', 'Managers', 'Professionals', 'Tech or Trade', 'Community Personal', 'Clerical or Admin', 'Salesperson',
		'Machinery Operators', 'Labourers',
	];
	
	const ordinalColumns = [
		//  'Postcode',
		'District',
		// 'Suburb',
	];
	setTimeout(() => { // Show off the spinner for a few seconds ;)
		d3.csv('data/occupations.csv', type, (data) => {
			console.log(data)
			actions.ingestData(data, numericColumns, ordinalColumns);
		});
	}, 2000);

	function type(d) {
		return numericColumns.reduce((d, column) => {
			d[column] = +d[column];
			return d;
		}, d);
	}
}
/* global d3 spinner scatterplot tooltip window document */
// Quick fix for resizing some things for mobile-ish viewers
// vanilla JS window width and height
// https://gist.github.com/joshcarr/2f861bd37c3d0df40b30
const wV = window;
const dV = document;
const eV = dV.documentElement;
const gV = dV.getElementsByTagName('OccGraph')[0];
const xV = wV.innerWidth || eV.clientWidth || gV.clientWidth;
const yV = wV.innerHeight || eV.clientHeight || gV.clientHeight;
// Quick fix for resizing some things for mobile-ish viewers
const mobileScreen = (xV < 500);
// This component manages an svg element, and
// either displays a spinner or text,
// depending on the value of the `loading` state.
const svg = d3.component('svg').render(function(selection, d) {
	const svgSelection = selection.attr('width', d.width).attr('height', d.height).call(spinner, !d.loading ? [] : {
		x: d.width / 2,
		y: d.height / 2,
		speed: 0.2,
	});
	const tipCallbacks = tooltip(svgSelection, d);
	svgSelection.call(scatterplot, d.loading ? [] : d, tipCallbacks);
});
const label = d3.component('label', 'col-sm-2 col-form-label').render(function(selection, d) {
	selection.text(d);
});
const option = d3.component('option').render(function(selection, d) {
	selection.text(d);
});
const select = d3.component('select', 'form-control').render(function(selection, d) {
	selection.call(option, d.columns).property('value', d.value).on('change', function() {
		d.action(this.value);
	});
});
const rowComponent = d3.component('div', 'row');
const colSm10 = d3.component('div', 'col-sm-10');
const menu = d3.component('div', 'col-sm-4').render(function(selection, d) {
	const row = rowComponent(selection).call(label, d.label);
	colSm10(row).call(select, d);
});
const menus = d3.component('div', 'container-fluid').create(function(selection) {
	selection.style('opacity', 0);
}).render(function(selection, d) {
	rowComponent(selection).call(menu, [{
			label: 'X - Axis',
			value: d.x,
			action: d.setX,
			columns: d.numericColumns,
		}, {
			label: 'Y - Axis',
			value: d.y,
			action: d.setY,
			columns: d.numericColumns,
		},
		{
			label: 'Radius',
			value: d.radius,
			action: d.setRadius,
			columns: d.numericColumns,
		},
	], d);
	if (!d.loading && selection.style('opacity') === '0') {
		selection.transition().duration(2000).style('opacity', 1);
	}
});
const app = d3.component('div').render(function(selection, d) {
	selection.call(svg, d).call(menus, d);
});

function reducer(state, action) {
	state = state || {
		width: 1100,
		height: 800 - 80,
		loading: true,
		margin: {
			top: 12,
			right: 12,
			bottom: 40,
			left: 50
		},
		x: 'Family Income',
		y: 'Solar units per 1000 pop',
		color: 'District',
		radius: 'Total Population',
	};
	switch (action.type) {
		case 'INGEST_DATA':
			return Object.assign({}, state, {
				loading: false,
				data: action.data,
				numericColumns: action.numericColumns,
				ordinalColumns: action.ordinalColumns,
			});
		case 'SET_X':
			return Object.assign({}, state, {
				x: action.column
			});
		case 'SET_Y':
			return Object.assign({}, state, {
				y: action.column
			});
		case 'SET_COLOR':
			return Object.assign({}, state, {
				color: action.column
			});
		case 'SET_RADIUS':
			return Object.assign({}, state, {
				radius: action.column
			});
		default:
			return state;
	}
}
/* global d3 axis mobileScreen */
// This component displays the visualization.
const scatterplot = ((() => {
	const xScale = d3.scaleLinear();
	const yScale = d3.scaleLinear();
	const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);
	// scale for the circle size
	const radiusScale = d3.scaleSqrt();
	const fillOpacityScale = d3.scaleThreshold();

	function render(selection, d) {
		const x = d.x;
		const y = d.y;
		const color = d.color;
		const radius = d.radius;
		const margin = d.margin;
		const innerWidth = d.width - margin.left - margin.right;
		const innerHeight = d.height - margin.top - margin.bottom;
		const minRadius = 1;
		const maxRadius = 12;
		xScale.domain(d3.extent(d.data, d => d[x])).range([0, innerWidth]);
		yScale.domain(d3.extent(d.data, d => d[y])).range([innerHeight, 0]);
		colorScale.domain(d3.extent(d.data, d => d[color]));
		radiusScale.range([mobileScreen ? 1 : 2, mobileScreen ? 10 : 16]).domain(d3.extent(d.data, d => d[radius]));
		// set the fill opacity
		// based on the cardinality of the data
		fillOpacityScale.domain([200, 300, 500]).range([0.7, 0.5, 0.3, 0.2]);
		selection.attr('transform', `translate(${margin.left},${margin.top})`).call(axis, [{
			type: 'Left',
			scale: yScale,
			translateX: -12,
		}, {
			type: 'Bottom',
			scale: xScale,
			translateY: innerHeight + 12,
			ticks: 20,
		}, ]);
		const renderData = d.data;
		const circles = selection.selectAll('.point').data(d.data);
		circles.exit().remove();
		circles.enter().append('circle').attr('class', 'point').attr('r', 0).attr('cx', (d.width / 2) - margin.left).attr('cy', (d.height / 2) -
				margin.top).merge(circles).on('mouseover', d.show)
			//.on('mouseover', )
			.on('mouseout', d.hide).on('click', function(d) {
				occ_details(d);
			}).transition().duration(2000).delay((d, i) => i * 5).attr('r', d => radiusScale(d[radius])).attr('cx', d => xScale(d[x])).attr('cy',
				d => yScale(d[y])).attr('color', d => colorScale(d[color])).style('fill-opacity', fillOpacityScale(renderData.length));
	}
	return d3.component('g').render(render);
})());
/* global d3 wheel */
// This component with a local timer makes the wheel spin.
const spinner = ((() => {
	const timer = d3.local();
	return d3.component('g').create(function(selection, d) {
		timer.set(selection.node(), d3.timer((elapsed) => {
			selection.call(wheel, elapsed * d.speed);
		}));
	}).render(function(selection, d) {
		selection.attr('transform', `translate(${d.x},${d.y})`);
	}).destroy(function(selection, d) {
		timer.get(selection.node()).stop();
		return selection.attr('fill-opacity', 1).transition().duration(3000).attr('transform', `translate(${d.x},${d.y}) scale(10)`).attr(
			'fill-opacity', 0);
	});
})());
/* global d3 */
// Use the d3-tip library for tooltips.
const tooltip = ((() => {
	const tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]);
	return (svgSelection, state) => {
		// Wish we could use D3 here for DOM manipulation..
		//occ_details(state)
		tip.html(d => [`<h4>${d.Suburb}</h4>`, `<div><strong>${state.x}: </strong>`, `<span>${d[state.x]}</span></div>`,
			`<div><strong>${state.y}: </strong>`, `<span>${d[state.y]}</span></div>`, `<div><strong>${state.color}: </strong>`,
			`<span>${d[state.color]}</span></div>`,
		].join(''));
		svgSelection.call(tip);
		return {
			show: tip.show,
			hide: tip.hide,
		};
	};
})());
/* global d3 */
// This stateless component renders a static "wheel" made of circles,
// and rotates it depending on the value of props.angle.
const wheel = d3.component('g').create(function(selection) {
	const minRadius = 4;
	const maxRadius = 10;
	const numDots = 10;
	const wheelRadius = 40;
	const rotation = 0;
	const rotationIncrement = 3;
	const radius = d3.scaleLinear().domain([0, numDots - 1]).range([maxRadius, minRadius]);
	const angle = d3.scaleLinear().domain([0, numDots]).range([0, Math.PI * 2]);
	selection.selectAll('circle').data(d3.range(numDots)).enter().append('circle').attr('cx', d => Math.sin(angle(d)) * wheelRadius).attr(
		'cy', d => Math.cos(angle(d)) * wheelRadius).attr('r', radius);
}).render(function(selection, d) {
	selection.attr('transform', `rotate(${d})`);
});