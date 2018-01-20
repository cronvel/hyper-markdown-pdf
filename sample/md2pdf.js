#!/usr/bin/env node

var fs = require( 'fs' ) ;
var HtmlToPdf = require( '..' ) ;
var hyperMarkdown = require( 'hyper-markdown' ) ;



var mdCode = fs.readFileSync( 'test.md' , 'utf8' ) ;
var htmlCode = hyperMarkdown( mdCode ) ;
console.log( htmlCode ) ;
var htmlDoc = HtmlToPdf.parse( htmlCode ) ;

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

