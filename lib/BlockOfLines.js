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



var Box = require( './Box.js' ) ;
var InlineBlock = require( './InlineBlock.js' ) ;
var Line = require( './Line.js' ) ;



function BlockOfLines( pdfDoc , options ) {
	Box.call( this , pdfDoc , options ) ;
	this.currentLine = null ;
	this.lines = [] ;
}

BlockOfLines.prototype = Object.create( Box.prototype ) ;
BlockOfLines.prototype.constructor = BlockOfLines ;

module.exports = BlockOfLines ;



BlockOfLines.prototype.appendText = function appendText( text , attr ) {
	var font , inLineText , inLineTextWidth , textHeight , fontSpaceWidth , remainingWidth , index , lastIndex , continueIndex ;
	
	if ( ! text.length ) { return ; }
	
	if ( ! this.currentLine ) {
		this.newLine() ;
	}
	
	font = this.pdfDoc.getFont( attr.font ) ;
	textHeight = font.lineHeight( attr.fontSize , true ) ;	// include the line gap
	inLineText = text ;
	lastIndex = index = text.length ;
	remainingWidth = this.currentLine.width - this.currentLine.contentWidth ;
	inLineTextWidth = font.widthOfString( inLineText , attr.fontSize ) ;
	
	while ( index > 0 && inLineTextWidth > remainingWidth ) {
		lastIndex = index ;
		index = text.lastIndexOf( ' ' , lastIndex ) ;
		continueIndex = index + 1 ;
		inLineText = text.slice( 0 , index ) ;
		inLineTextWidth = font.widthOfString( inLineText , attr.fontSize ) ;
	}
	
	if ( index === text.length ) {
		// Great, there is enough room for this whole text, add it!
		this.appendTextToLine( text , attr , inLineTextWidth , textHeight ) ;
		return ;
	}
	
	if ( index <= 0 ) {
		// There is no room for a single word, if the current line has some content, retry on a new line
		if ( this.currentLine.inlineBlocks.length ) {
			this.currentLine = null ;
			this.appendText( text , attr ) ;
			return ;
		}
		
		// The line was empty but the word was still too big? Cut letter by letter...
		index = lastIndex ;
		
		while ( index > 0 && inLineTextWidth > remainingWidth ) {
			index -- ;
			continueIndex = index ;
			inLineText = text.slice( 0 , index ) ;
			inLineTextWidth = font.widthOfString( inLineText , attr.fontSize ) ;
		}
		
		if ( index <= 0 ) {
			// Still no room? then do nothing
			console.log( 'No room' ) ;
			return ;
		}
	}
	
	// Add the current text fragment
	this.appendTextToLine( inLineText , attr , inLineTextWidth , textHeight ) ;
	
	// Then call .appendText() again for the remaining text...
	this.currentLine = null ;
	this.appendText( text.slice( continueIndex ) , attr ) ;
} ;



BlockOfLines.prototype.newLine = function newLine() {
	this.currentLine = new Line( this.pdfDoc , { width: this.width } ) ;
	this.lines.push( this.currentLine ) ;
} ;



BlockOfLines.prototype.appendTextToLine = function appendTextToLine( text , attr , textWidth , textHeight ) {
	var inlineBlock = new InlineBlock( this.pdfDoc , {
		width: textWidth ,
		height: textHeight ,
		contentType: 'text' ,
		content: [ text , attr ]
	} ) ;
	
	this.currentLine.appendInlineBlock( inlineBlock ) ;
} ;



BlockOfLines.prototype.render = function render() {
	this.lines.forEach( line => line.render() ) ;
} ;

