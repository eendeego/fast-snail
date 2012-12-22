#!/usr/bin/env node-canvas
/*jslint indent: 2, node: true */
"use strict";

// microbenchmark stupid things and try take this into consideration:
// http://mrale.ph/blog/2012/12/15/microbenchmarks-fairy-tale.html

var util = require('util');
var Canvas = require('openvg-canvas');
var canvas = new Canvas(500, 400);
var ctx = canvas.getContext('2d');
var eu = require('openvg-canvas/examples/util');
var vg = require('openvg-canvas/node_modules/openvg');

var width = canvas.width;
var height = canvas.height;

var runs = 10000;
var i;
var time;
var color = new Float32Array([0, 0, 0, 1.0]);

ctx.fillStyle = 'black';
ctx.clearRect(0, 0, width, height);

ctx.strokeStyle = '#ff0000';
ctx.moveTo(100, 100);
ctx.lineTo(200, 100);
ctx.stroke();

canvas.vgSwapBuffers();

console.log('Testing strokeStyle - warming up - empty loop');

for (i = 0; i < runs; i++) {
  // Do nothing
}

console.log('Testing strokeStyle - warming up - setting strokeStyle');

for (i = 0; i < runs; i++) {
  ctx.strokeStyle = '#ff0000';
}

console.log('Testing strokeStyle - warming up - calling openvg directly');

var paint = vg.createPaint();
for (i = 0; i < runs; i++) {
  vg.setParameterFV(paint, vg.VGPaintParamType.VG_PAINT_COLOR, color);
}
vg.destroyPaint(paint);
console.log('Testing strokeStyle - timing');

time = Date.now();
for (i = 0; i < runs; i++) {
  // Do nothing
}
var loopDiff = Date.now() - time;

time = Date.now();
for (i = 0; i < runs; i++) {
  ctx.strokeStyle = '#ff0000';
}
var fullDiff = Date.now() - time;

var paint = vg.createPaint();
time = Date.now();
for (i = 0; i < runs; i++) {
  vg.setParameterFV(paint, vg.VGPaintParamType.VG_PAINT_COLOR, color);
}
var directDiff = Date.now() - time;
vg.destroyPaint(paint);

var setStrokeTime = (fullDiff - loopDiff) / runs;
var setPaintTime = (directDiff - loopDiff) / runs;

console.log('Setting the stroke style takes %d milliseconds',
             setStrokeTime);

console.log('Setting the paint color takes %d milliseconds',
             setPaintTime);

eu.handleTermination();
eu.waitForInput();
