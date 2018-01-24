#!/usr/bin/env node

"use strict" ;

var fs = require( 'fs' ) ;
var htmlToPdf = require( '..' ) ;
var hyperMarkdown = require( 'hyper-markdown' ) ;
var marked = require( 'marked' ) ;
var inspect = require( 'string-kit' ).inspect ;



var mdCode = fs.readFileSync( 'test.md' , 'utf8' ) ;
var htmlCode = hyperMarkdown( mdCode ) ;
//console.log( htmlCode ) ; process.exit() ;
//var htmlCode = marked( mdCode ) ;
var htmlDoc = htmlToPdf.HtmlDoc.parse( htmlCode ) ;

//console.log( htmlDoc.parts ) ;
//console.log( inspect( { depth: 10 , style: 'color' } , htmlDoc.nodes ) ) ;
console.log() ;
//return ;

/*
var pdfDocDef = htmlDoc.renderPdfDef() ;
console.log( pdfDocDef ) ;
console.log() ;
*/


var pdfRenderer = new htmlToPdf.PdfRenderer() ;
pdfRenderer.render( htmlDoc ) ;

