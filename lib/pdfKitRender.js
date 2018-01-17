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



var fs = require( 'fs' ) ;
var PdfDocument = require( 'pdfkit' ) ;



// Should exist on all linux system
var defaultFonts = {
	DejaVu: {
		normal: '/usr/share/fonts/dejavu/DejaVuSans.ttf' ,
		bold: '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf' ,
		italics: '/usr/share/fonts/dejavu/DejaVuSans-Oblique.ttf' ,
		bolditalics: '/usr/share/fonts/dejavu/DejaVuSans-BoldOblique.ttf'
	}
} ;



function render( htmlDoc ) {
	var runtime = {
		htmlDoc: htmlDoc ,
		pdfDoc: null ,
		depth: 0 ,
		ancestors: [] ,
		currentStyle: null ,
		styleStack: [ htmlDoc.styles.defaultStyle ]
	} ;
	
	init( runtime ) ;
	
	renderParts( runtime , htmlDoc.parts ) ;
	
	runtime.pdfDoc.end() ;
}

module.exports = render ;



function init( runtime ) {
	runtime.pdfDoc = new PdfDocument( {
		//autoFirstPage: false ,
		layout: runtime.htmlDoc.layout ,
		//margin: 50 ,	// equal margin
		
		// Printers require a minimum of 36 (1/2 inch)
		// For books, it's usually good to have a "gutter" (inside margin) of 72 (1 inch).
		// The lib should support that, one day.
		margins: {
			top: 50 ,
			bottom: 50 ,
			left: 50 ,
			right: 50
		}
	} ) ;
	
	/*
	runtime.defaultPageOptions = {
		layout: htmlDoc.layout ,
		//margin: 50 ,
		margins: {
			top: 50 ,
			bottom: 50 ,
			left: 72 ,
			right: 72
		}
	} ;
	*/
	
	runtime.pdfDoc.pipe( fs.createWriteStream( 'test.pdf' ) ) ;
	
}



function renderParts( runtime , parts ) {

	parts.forEach( part => {
		var fn = renderers[ part.type ] || renderers.default ;
		//runtime.ancestors[ runtime.depth ] = part ;
		fn( runtime , part ) ;
	} ) ;
}



function setStyle( runtime , style ) {
	if ( style === runtime.currentStyle ) { return ; }
}



function createStyle( style , inherit ) {
	return Object.assign( Object.create( inherit ) , style ) ;
}



var renderers = {} ;



renderers.string = ( runtime , part ) => {
	var style = runtime.styleStack[ runtime.styleStack.length - 1 ] ;
	
	runtime.pdfDoc.text( part.content ) ;
} ;



renderers.i =
renderers.em = ( runtime , tag ) => {
	
	return {
		style: 'italic' ,
		text: renderParts( runtime , tag.subParts )
	} ;
} ;



renderers.b ;
renderers.strong = ( runtime , tag ) => {
	return {
		style: 'bold' ,
		text: renderParts( runtime , tag.subParts )
	} ;
} ;



renderers.h1 = ( runtime , tag ) => {
	return {
		style: 'h1' ,
		text: renderParts( runtime , tag.subParts )
	} ;
} ;



renderers.h2 = ( runtime , tag ) => {
	return {
		style: 'h2' ,
		text: renderParts( runtime , tag.subParts )
	} ;
} ;



renderers.h3 = ( runtime , tag ) => {
	return {
		style: 'h3' ,
		text: renderParts( runtime , tag.subParts )
	} ;
} ;



renderers.h4 = ( runtime , tag ) => {
	return {
		style: 'h4' ,
		text: renderParts( runtime , tag.subParts )
	} ;
} ;



renderers.h5 = ( runtime , tag ) => {
	return {
		style: 'h5' ,
		text: renderParts( runtime , tag.subParts )
	} ;
} ;



renderers.h6 = ( runtime , tag ) => {
	return {
		style: 'h6' ,
		text: renderParts( runtime , tag.subParts )
	} ;
} ;



// Unknown tag... return nothing or render its content?
renderers.default = ( runtime , tag ) => {
	console.error( 'Unsupported tag' , tag.type ) ;

	//return '' ;
	return {
		text: renderParts( runtime , tag.subParts )
	} ;
} ;


