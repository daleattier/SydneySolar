(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-selection'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3));
}(this, (function (exports,d3Selection) { 'use strict';

// The name of the property used to store component instances on DOM nodes.
var instanceProperty = '__instance__';

// Sets the component instance property on the given DOM node.
function setInstance(node, value) {
  node[instanceProperty] = value;
}

// Gets the component instance property from the given DOM node.
var getInstance = function getInstance(node) {
  return node[instanceProperty];
};

// Computes the data to pass into the data join from component invocation arguments.
function dataArray(data, context) {
  data = Array.isArray(data) ? data : [data];
  return context ? data.map(function (d) {
    return Object.assign(Object.create(context), d);
  }) : data;
}

// Destroys a descendant component instance.
// Does not remove its DOM node, as one if its ancestors will be removed.
function destroyDescendant() {
  var instance = getInstance(this);
  if (instance) {
    var selection = instance.selection,
        datum = instance.datum,
        destroy = instance.destroy;

    destroy(selection, datum);
  }
}

// Destroys the component instance and its descendant component instances.
function destroyInstance() {
  var _getInstance = getInstance(this),
      selection = _getInstance.selection,
      datum = _getInstance.datum,
      destroy = _getInstance.destroy;

  selection.selectAll('*').each(destroyDescendant);
  var transition = destroy(selection, datum);
  (transition || selection).remove();
}

// No operation.
var noop = function noop() {
  return null;
};

// The component constructor, exposed as d3.component.
var component = function (tagName, className) {
  // Values set via setters.
  var create = noop;
  var render = noop;
  var destroy = noop;
  var key = null;

  // Checks if the given DOM node is managed by this component.
  function belongsToMe(node) {
    var instance = getInstance(node);
    return instance && instance.component === component;
  }

  // Returns DOM children managed by this component.
  function mine() {
    return Array.from(this.children).filter(belongsToMe);
  }

  // Creates a new component instance and stores it on the DOM node.
  function createInstance(datum) {
    var selection = d3Selection.select(this);
    setInstance(this, { component: component, selection: selection, destroy: destroy, datum: datum });
    create(selection, datum);
  }

  // Renders the component instance, and stores its datum for later use (in destroy).
  function renderInstance(datum) {
    var instance = getInstance(this);
    instance.datum = datum;
    render(instance.selection, datum);
  }

  // The returned component instance.
  function component(container, data, context) {
    var selection = container.nodeName ? d3Selection.select(container) : container;
    var instances = selection.selectAll(mine).data(dataArray(data, context), key);
    instances.exit().each(destroyInstance);
    return instances.enter().append(tagName).attr('class', className).each(createInstance).merge(instances).each(renderInstance);
  }

  // Chainable setters.
  component.render = function (_) {
    render = _;return component;
  };
  component.create = function (_) {
    create = _;return component;
  };
  component.destroy = function (_) {
    destroy = _;return component;
  };
  component.key = function (_) {
    key = _;return component;
  };

  return component;
};

exports.component = component;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=d3-component.js.map
