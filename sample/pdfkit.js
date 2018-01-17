#!/usr/bin/env node

var fs = require( 'fs' ) ;
var HtmlToPdf = require( '..' ) ;


var raw = "<h1>Title</h1><p>normal <u>underline</u> normal</p><u>underline 2</u>" ;
var raw = "Some text, <u>some underline test</u>" ;
var htmlDoc = HtmlToPdf.parse( raw ) ;

console.log( htmlDoc.parts ) ;
console.log() ;
//console.log( htmlDoc.parts[1].subParts ) ;
console.log() ;

/*
var pdfDocDef = htmlDoc.renderPdfDef() ;
console.log( pdfDocDef ) ;
console.log() ;
*/


htmlDoc.pdfKitRender() ;

