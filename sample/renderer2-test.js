#!/usr/bin/env node

"use strict" ;

var fs = require( 'fs' ) ;
var hyperPdf = require( '..' ) ;
var inspect = require( 'string-kit' ).inspect ;

var inspectOptions = {
	style: 'color' ,
	depth: 7 ,
	protoBlackList: new Set( [ hyperPdf.PdfDocument.prototype ] ) ,
	//propertyBlackList: new Set( [ "parent" ] )
} ;

function deb( obj ) {
	process.stdout.write( inspect( inspectOptions , obj ) + '\n' ) ;
}

//var renderer = new hyperPdf.PdfRenderer2() ;

var pdfDoc = new hyperPdf.PdfDocument() ;
var block = new hyperPdf.FlowBlock( pdfDoc , {
	width: 300 ,
	height: 300 ,
//	align: 'topLeft' ,
//	align: 'topRight' ,
	align: 'top' ,
} ) ;

var text ;
//text = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?" ;
text = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium" ;
text = "Sed ut abcdefghijklmnopqrstuvwxyzperspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium" ;
//text = "Sed ut perspiciatis unde omnis iste" ;
//text = "bob bill jack joe john jacky" ;
//text = "bob" ;

block.appendText( text , { font: "Helvetica" , fontSize: 36 } ) ;

deb( block ) ;

block.render() ;

pdfDoc.pdfKitDoc.pipe( fs.createWriteStream( 'test.pdf' ) ) ;
pdfDoc.pdfKitDoc.end() ;

