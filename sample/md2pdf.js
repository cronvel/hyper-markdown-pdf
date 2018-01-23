#!/usr/bin/env node

"use strict" ;

var fs = require( 'fs' ) ;
var htmlToPdf = require( '..' ) ;
var hyperMarkdown = require( 'hyper-markdown' ) ;
var marked = require( 'marked' ) ;
var inspect = require( 'string-kit' ).inspect ;



var mdCode = fs.readFileSync( 'test.md' , 'utf8' ) ;

mdCode = `
There is something wrong with hyper-markdown list...
* item #1
  mkjsfmlkj lmksdjf lkjsd flkj
  lskdjqflm j
* item #2
* item #3
    * subitem #1
    * subitem #2
    * subitem #3
* item #4
    * subitem #1
    * subitem #2
` ;

var htmlCode = hyperMarkdown( mdCode ) ;
//var htmlCode = marked( mdCode ) ;
console.log( htmlCode ) ;
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

