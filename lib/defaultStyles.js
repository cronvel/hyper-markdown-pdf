/*
	Hyper PDF

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



var styles = {
	page: {
		layout: "portrait" ,	// or "landscape"
		format: "A4" ,
		//width: 595.28 ,
		//height: 841.89 ,

		// Printers require a minimum of 36 (1/2 inch)
		// For books, it's usually good to have a "gutter" (inside margin) of 72 (1 inch).
		// One day, the lib should support gutter.
		marginTop: 50 ,
		marginBottom: 50 ,
		marginLeft: 50 ,
		marginRight: 50
	} ,
	root: {
		font: "Times-Roman" ,
		fontSize: 14
	} ,

	// Inline styles

	italic: {
		italic: true
	} ,
	underline: {
		underline: true
	} ,
	bold: {
		bold: true
	} ,
	link: {
		fillColor: '#505' ,
		underline: true
	} ,

	// Block styles

	paragraph: {
		align: 'justify' ,
		//indent: 20 ,
		fontSize: 14
	} ,
	heading1: {
		//pageBreakBefore: true ,
		unorphanHeight: 50 ,
		leadingMarginTop: 20 ,
		marginTop: 140 ,
		marginBottom: 50 ,

		fontSize: 28 ,
		bold: true ,
		underline: true ,
		fillColor: '#822'
		//stroke: true ,
		//strokeColor: '#bb0' ,
	} ,
	heading2: {
		unorphanHeight: 50 ,
		leadingMarginTop: 0 ,
		marginTop: 40 ,
		marginBottom: 20 ,

		fontSize: 24 ,
		bold: true
	} ,
	heading3: {
		fontSize: 22 ,
		bold: true
	} ,
	heading4: {
		fontSize: 20 ,
		bold: true
	} ,
	heading5: {
		fontSize: 18 ,
		bold: true
	} ,
	heading6: {
		fontSize: 16 ,
		bold: true
	} ,
	list: {
		leadingMarginTop: 0 ,
		marginTop: 14 ,
		marginBottom: 14 ,
		paddingLeft: 16
	} ,
	listItem: {
		leadingMarginTop: 0 ,
		marginTop: 0 ,
		marginBottom: 0 ,
		listItemPrefix: '• '	// a "bullet" character and non-breaking space
	} ,
	inlineImage: {
		maxHeightEm: 1.2 ,		// a factor of the current line height
		paddingLeft: 3 ,
		paddingRight: 3
	} ,
	blockImage: {
		paddingTop: 10 ,
		paddingBottom: 10 ,
		maxWidth: 150
	} ,
	leftFloatingImage: {
		paddingLeft: 5 ,
		paddingRight: 15 ,
		paddingTop: 5 ,
		paddingBottom: 10 ,
		maxWidth: 150
	} ,
	rightFloatingImage: {
		paddingLeft: 15 ,
		paddingRight: 5 ,
		paddingTop: 5 ,
		paddingBottom: 10 ,
		maxWidth: 150
	} ,
	caption: {
		captionMargin: 10 ,	// margin between image and caption
		maxHeight: 50 ,
		align: 'center' ,
		italic: true
	}
} ;

var defaultProperties = {
	marginLeft: 0 ,
	marginRight: 0 ,
	marginTop: 0 ,
	marginBottom: 0 ,
	paddingLeft: 0 ,
	paddingRight: 0 ,
	paddingTop: 0 ,
	paddingBottom: 0 ,
	maxWidth: Infinity ,
	maxHeight: Infinity
} ;

for ( let name in styles ) {
	styles[ name ] = Object.assign( {} , defaultProperties , styles[ name ] ) ;
}

module.exports = styles ;

