#!/usr/bin/env node

"use strict" ;

var fs = require( 'fs' ) ;
var htmlToPdf = require( '..' ) ;
var inspect = require( 'string-kit' ).inspect ;

var inspectOptions = {
	style: 'color' ,
	depth: 7 ,
	protoBlackList: new Set( [ htmlToPdf.PdfDocument.prototype ] ) ,
	propertyBlackList: new Set( [ "parent" ] )
} ;

function deb( obj ) {
	process.stdout.write( inspect( inspectOptions , obj ) + '\n' ) ;
}

//var renderer = new htmlToPdf.PdfRenderer2() ;

var pdfDoc = new htmlToPdf.PdfDocument() ;
var block = new htmlToPdf.BlockOfLines( pdfDoc , { width: 150 , height: 300 } ) ;

block.appendText( "bob bill jack" , { font: "Helvetica" , fontSize: 36 } ) ;

deb( block ) ;

block.render() ;

pdfDoc.pdfKitDoc.pipe( fs.createWriteStream( 'test.pdf' ) ) ;
pdfDoc.pdfKitDoc.end() ;

