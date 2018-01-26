#!/usr/bin/env node
/*
	Hyper PDF
	
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
var hyperPdf = require( '..' ) ;



var raw ;

raw = "<h1>Title</h1>\n\n\nSome normal text, <u>some underline text,</u> <i>some italic text,</i>some normal text again..." ;

//*
raw += " and again...".repeat( 10 ) ;
raw += "<i>" + " and again...".repeat( 10 ) + "</i>" ;
raw += "<h1>Another section</h1>" ;
raw += "Blah" + " blah".repeat( 20 ) + "." ;
raw += "<h1>Another section</h1>" ;
raw += "Blah" + " blah".repeat( 20 ) + "." ;
raw += "<h1>Another section</h1>" ;
raw += "Blah" + " blah".repeat( 20 ) + "." ;
raw += "<h1>Another section</h1>" ;
raw += "Blah" + " blah".repeat( 20 ) + "." ;
raw += "<h1>Another section</h1>" ;
raw += "Blah" + " blah".repeat( 20 ) + "." ;
//*/

var htmlDoc = hyperPdf.HtmlDoc.parse( raw ) ;

console.log( htmlDoc.nodes ) ;
console.log() ;
//console.log( htmlDoc.parts[1].subParts ) ;
console.log() ;

/*
var pdfDocDef = htmlDoc.renderPdfDef() ;
console.log( pdfDocDef ) ;
console.log() ;
*/


var pdfRenderer = new hyperPdf.PdfRenderer() ;
pdfRenderer.render( htmlDoc ) ;

