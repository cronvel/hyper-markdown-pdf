/*
	Meta PDF

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



/*
	PDF Kit Abstraction Layer
*/



var PdfKitDocument = require( 'pdfkit' ) ;



function PdfDocument() {
	this.pdfKitDoc = new PdfKitDocument() ;
}

module.exports = PdfDocument ;



// Simple getters
PdfDocument.prototype.getCurrentFont = function getCurrentFont() { return this.pdfKitDoc._font ; } ;
PdfDocument.prototype.getCurrentPage = function getCurrentPage() { return this.pdfKitDoc.page ; } ;

// Simple setters
PdfDocument.prototype.setFont = function setFont( src , family , size ) { this.pdfKitDoc.font( src , family , size ) ; } ;



// Get a font without setting it
PdfDocument.prototype.getFont = function getFont( src , family ) {
	var font , fontBackup = this.pdfKitDoc._font ;
	this.pdfKitDoc.font( src , family ) ;
	font = this.pdfKitDoc._font ;
	this.pdfKitDoc._font = fontBackup ;
	return font ;
} ;



PdfDocument.prototype.text = function text( data ) {
	console.log( "Rendering text:" , data ) ;
	data.lineBreak = false ;	// Disable line-breaking: we manage that all by ourselves
	this.pdfKitDoc.font( data.font ) ;
	this.pdfKitDoc.fontSize( data.fontSize ) ;
	this.pdfKitDoc.text( data.text , data.x , data.y , data ) ;
} ;

