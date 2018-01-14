#!/usr/bin/env node

var pdfMake = require( 'pdfmake' ) ;
var htmlToPdf = require( '..' ) ;


var raw = "normal <i>italic</i> normal" ;
var htmlDoc = htmlToPdf.parse( raw ) ;

console.log( htmlDoc.parts ) ;
console.log() ;
console.log( htmlDoc.parts[1].subParts ) ;
console.log() ;

var output = htmlDoc.render() ;
console.log( output ) ;
console.log() ;


var pdfDoc = {
	content: null
} ;


