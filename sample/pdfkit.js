#!/usr/bin/env node

var fs = require( 'fs' ) ;
var HtmlToPdf = require( '..' ) ;



var raw ;

raw = "<h1>Title</h1>\n\n\nSome normal text, <u>some underline text,</u> <i>some italic text,</i>some normal text again..." ;

//*
raw += " and again...".repeat( 10 ) ;
raw += "<i>" + " and again...".repeat( 10 ) + "</i>" ;
raw += "<h1>Another section</h1>" ;
raw += "Blah" + " blah".repeat( 20 ) + "." ;
raw += "<h1>Another section</h1>" ;
raw += "Blah" + " blah".repeat( 20 ) + "." ;
raw += "<h1>Another section</h1>" ;
raw += "Blah" + " blah".repeat( 20 ) + "." ;
raw += "<h1>Another section</h1>" ;
raw += "Blah" + " blah".repeat( 20 ) + "." ;
raw += "<h1>Another section</h1>" ;
raw += "Blah" + " blah".repeat( 20 ) + "." ;
//*/

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

