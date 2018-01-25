#!/usr/bin/env node

"use strict" ;

var fs = require( 'fs' ) ;
var PdfDocument = require( 'pdfkit' ) ;


var pdfDoc = new PdfDocument() ;

pdfDoc.text( "bob" , -5 , -5 ) ;






pdfDoc.pipe( fs.createWriteStream( 'test.pdf' ) ) ;
pdfDoc.end() ;