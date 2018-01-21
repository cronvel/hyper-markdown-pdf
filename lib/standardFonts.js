/*
	Hyper Markdown PDF

	Copyright (c) 2018 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



// Fonts that are included in the PDF format



var standardFonts = {
	Courier: {
		normal: 'Courier' ,
		bold: 'Courier-Bold' ,
		italic: 'Courier-Oblique' ,
		boldItalic: 'Courier-BoldOblique'
	} ,
	Helvetica: {
		normal: 'Helvetica' ,
		bold: 'Helvetica-Bold' ,
		italic: 'Helvetica-Oblique' ,
		boldItalic: 'Helvetica-BoldOblique'
	} ,
	'Symbol': {
		normal: 'Symbol' ,
		bold: 'Symbol' ,
		italic: 'Symbol' ,
		boldItalic: 'Symbol'
	} ,
	'Times-Roman': {
		normal: 'Times-Roman' ,
		bold: 'Times-Bold' ,
		italic: 'Times-Italic' ,
		boldItalic: 'Times-BoldItalic'
	} ,
	'ZapfDingbats': {
		normal: 'ZapfDingbats' ,
		bold: 'ZapfDingbats' ,
		italic: 'ZapfDingbats' ,
		boldItalic: 'ZapfDingbats'
	}
} ;

standardFonts.default = standardFonts['Times-Roman'] ;
standardFonts.TimesRoman = standardFonts['Times-Roman'] ;

module.exports = standardFonts ;


