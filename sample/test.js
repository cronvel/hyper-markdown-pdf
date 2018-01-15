#!/usr/bin/env node

var fs = require( 'fs' ) ;
var HtmlToPdf = require( '..' ) ;


var raw = "<h1>Title</h1> normal <i>italic</i> normal" ;
var htmlDoc = HtmlToPdf.parse( raw ) ;

console.log( htmlDoc.parts ) ;
console.log() ;
console.log( htmlDoc.parts[1].subParts ) ;
console.log() ;

/*
var pdfDocDef = htmlDoc.renderPdfDef() ;
console.log( pdfDocDef ) ;
console.log() ;
*/


var pdfStream = htmlDoc.createPdfStream() ;

pdfStream.pipe( fs.createWriteStream( 'test.pdf' ) ).on( 'finish' , () => {
    //success
} ) ;

pdfStream.end() ;


