#!/usr/bin/env node

var pdfMake = require( 'pdfmake' ) ;
var HtmlToPdf = require( '..' ) ;


var raw = "normal <i>italic</i> normal" ;
var htmlDoc = HtmlToPdf.parse( raw ) ;

console.log( htmlDoc.parts ) ;
console.log() ;
console.log( htmlDoc.parts[1].subParts ) ;
console.log() ;

var output = htmlDoc.render() ;
console.log( output ) ;
console.log() ;


var pdfDoc = {
	styles: HtmlToPdf.defaultStyles ,
	content: output
} ;

console.log( pdfDoc ) ;
console.log() ;



// pdfmake things

var fonts = {
	Roboto: {
		normal: './fonts/Roboto-Regular.ttf',
		bold: './fonts/Roboto-Medium.ttf',
		italics: './fonts/Roboto-Italic.ttf',
		bolditalics: './fonts/Roboto-Italic.ttf'
	}
};

var PdfPrinter = require('pdfmake/src/printer');
var printer = new PdfPrinter(fonts);

var pdfDoc = printer.createPdfKitDocument( pdfDoc );
pdfDoc.pipe(fs.createWriteStream('test.pdf')).on('finish',function(){
    //success
});
pdfDoc.end();





