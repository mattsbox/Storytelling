/**
 * svganimations2.js v1.0.0
 * http://www.codrops.com
 *
 * the svg path animation is based on http://24ways.org/2013/animating-vectors-with-svg/ by Brian Suda (@briansuda)
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
window.Seward.drawsvg=(function(id,frames) {

	'use strict';
	window.requestAnimFrame = function(){
		return (
			window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback){
				window.setTimeout(callback, 1000 / 60);
			}
		);
	}();

	window.cancelAnimFrame = function(){
		return (
			window.cancelAnimationFrame       || 
			window.webkitCancelAnimationFrame || 
			window.mozCancelAnimationFrame    || 
			window.oCancelAnimationFrame      || 
			window.msCancelAnimationFrame     || 
			function(id){
				window.clearTimeout(id);
			}
		);
	}();
	var svgs = Array.prototype.slice.call($("sew-obj[sew-id=\""+id+"\"] svg")),
		hidden = Array.prototype.slice.call($("sew-obj[sew-id=\""+id+"\"] .hide")),
		current_frame = 0,
		total_frames = frames,
		handle = 0;
	function draw() {
		var progress = current_frame/total_frames;
    
		if (progress > 1) {
			window.cancelAnimFrame(handle);
			showPage();
		} else {
			current_frame++;
			for(var j=0; j<Seward.svgpaths[id].length;j++){
				Seward.svgpaths[id][j].style.strokeDashoffset = Math.floor(Seward.svglengths[id][j] * (1 - progress));
			}
			handle = window.requestAnimFrame(draw);
		}
	}
	function showPage() {
		svgs.forEach( function( el, i ) {
			el.setAttribute( 'class', el.getAttribute('class') + ' hide' );
		} );
		hidden.forEach( function( el, i ) {
			classie.remove( el, 'hide' );
			classie.add( el, 'show' );
		} );
	}
	draw();
});
