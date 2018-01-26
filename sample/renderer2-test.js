#!/usr/bin/env node
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

var fs = require( 'fs' ) ;
var metaPdf = require( '..' ) ;
var elements = metaPdf.elements ;
var inspect = require( 'string-kit' ).inspect ;

var inspectOptions = {
	style: 'color' ,
	depth: 7 ,
	protoBlackList: new Set( [ metaPdf.PdfDocument.prototype ] ) ,
	//propertyBlackList: new Set( [ "parent" ] )
} ;

function deb( obj ) {
	process.stdout.write( inspect( inspectOptions , obj ) + '\n' ) ;
}

//var renderer = new metaPdf.PdfRenderer2() ;

var pdfDoc = new metaPdf.PdfDocument() ;
var block = new elements.FlowBlock( pdfDoc , {
	width: 300 ,
	height: 300 ,
	align: 'topLeft' ,
//	align: 'topRight' ,
//	align: 'top' ,
	justify: true
} ) ;

var text ;
//text = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? " ;
//text = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium" ;
text = "Sed ut abcdefghijklmnopqrstuvwxyzperspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium" ;
//text = "Sed ut perspiciatis unde omnis iste" ;
//text = "Bob Bill Jack Joe John Jacky. " ;
//text = "bob" ;

//text = text.repeat( 3 ) ;

for ( let i = 0 ; i < 8 ; i ++ ) {
	//block.appendText( text , { font: "Helvetica" , fontSize: 36 } ) ;
	block.appendText( '#' + i + ': ' + text , { font: i % 2 ? "Helvetica" : "Helvetica-Oblique" , fontSize: 10 + i } ) ;
}


deb( block ) ;

block.render() ;

//deb( block ) ;

pdfDoc.pdfKitDoc.pipe( fs.createWriteStream( 'test.pdf' ) ) ;
pdfDoc.pdfKitDoc.end() ;

