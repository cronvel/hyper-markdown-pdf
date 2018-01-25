/*
	Hyper Markdown PDF

	Copyright (c) 2018 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



function Box( ctx , options ) {
	if ( ctx instanceof Box ) {
		this.parent = ctx ;
		this.pdfDoc = ctx.pdfDoc ;
	}
	else {
		this.parent = null ;
		this.pdfDoc = ctx ;
	}
	
	this.x = options.x || 0 ;
	this.y = options.y || 0 ;
	this.width = options.width || Infinity ;
	this.height = options.height || Infinity ;
}

module.exports = Box ;



// Return absolute coordinates
Box.prototype.getAbsolute = function getAbsolute() {
	if ( ! this.parent ) { return { x: this.x , y: this.y } ; }
	
	var parentAbsolute = this.parent.getAbsolute() ;
	parentAbsolute.x += this.x ;
	parentAbsolute.y += this.y ;
	
	return parentAbsolute ;
} ;

