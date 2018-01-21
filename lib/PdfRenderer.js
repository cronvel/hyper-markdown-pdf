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



var standardPageSizes = require( './standardPageSizes.js' ) ;
var standardFonts = require( './standardFonts.js' ) ;
var defaultStyles = require( './defaultStyles.js' ) ;

var fs = require( 'fs' ) ;
var PdfDocument = require( 'pdfkit' ) ;



function PdfRenderer( options = {} ) {
	this.htmlDoc = options.htmlDoc ;
	this.layout = options.layout || "portrait" ;

	this.pageSize = options.pageSize || "A4" ;

	if ( ! Array.isArray( this.pageSize ) ) {
		if ( typeof this.pageSize !== 'string' || ! standardPageSizes[ this.pageSize ] ) {
			throw new Error( "Unknown page format '" + this.pageSize + "'." ) ;
		}

		this.pageSize = standardPageSizes[ this.pageSize ] ;
	}

	this.styles = Object.assign( {} , defaultStyles ) ;

	if ( options.styles ) {
		Object.assign( this.styles , options.styles ) ;
	}
}

module.exports = PdfRenderer ;



PdfRenderer.prototype.render = function render( htmlDoc ) {
	htmlDoc = htmlDoc || this.htmlDoc ;

	var runtime = {
		pdfRenderer: this ,
		htmlDoc: htmlDoc ,
		pdfDoc: null ,
		fonts: standardFonts ,	// <-- TEMP!
		currentStyle: {} ,
		textAttributes: null ,
		styleStack: [ this.styles.root ] ,
		inline: false ,
		hasContent: false ,
		pageHasContent: false ,
		pendingPdfCommands: [] ,
		marginTop: 0 ,
		marginBottom: 0 ,
		paddingLeft: 0 ,
		paddingRight: 0
	} ;

	this.init( runtime ) ;

	renderNodes( runtime , htmlDoc.nodes ) ;

	// Finalize: exec pending pdf command
	flushPendingPdfCommands( runtime ) ;

	runtime.pdfDoc.end() ;
} ;



PdfRenderer.prototype.init = function init( runtime ) {
	runtime.pdfDoc = new PdfDocument( {
		//autoFirstPage: false ,
		layout: this.layout ,
		size: this.pageSize ,
		//margin: 50 ,	// equal margin

		// Printers require a minimum of 36 (1/2 inch)
		// For books, it's usually good to have a "gutter" (inside margin) of 72 (1 inch).
		// The lib should support that, one day.
		margins: {
			top: 50 ,
			bottom: 50 ,
			left: 50 ,
			right: 50
		}
	} ) ;

	runtime.pdfDoc.on( 'pageAdded' , () => {
		onPageAdded( runtime ) ;
	} ) ;

	runtime.pdfDoc.pipe( fs.createWriteStream( 'test.pdf' ) ) ;
} ;



function renderNodes( runtime , nodes ) {

	nodes.forEach( node => {
		var fn = renderers[ node.type ] || renderers.default ;
		fn( runtime , node ) ;
	} ) ;
}



function renderTextStyle( runtime , style ) {
	var fontName , font ;

	if ( style === runtime.currentStyle ) { return ; }

	// Compute the font-ref: a built-in font string or a fs path to a font
	fontName = style.font || 'default' ;
	font = runtime.fonts[ fontName ] || runtime.fonts.default ;

	if ( style.bold ) {
		if ( style.italic ) {
			style.fontRef = font.boldItalic || font.bold || font.italic || font.normal ;
		}
		else {
			style.fontRef = font.bold || font.normal ;
		}
	}
	else if ( style.italic ) {
		style.fontRef = font.italic || font.normal ;
	}
	else {
		style.fontRef = font.normal ;
	}

	if ( style.fontRef !== runtime.currentStyle.fontRef ) {
		console.log( 'set fontRef to:' , style.fontRef ) ;
		runtime.pdfDoc.font( style.fontRef ) ;
	}

	if ( style.fontSize && style.fontSize !== runtime.currentStyle.fontSize ) {
		runtime.pdfDoc.fontSize( style.fontSize ) ;
	}

	// Text is rendered as a sort of SVG, it needs SVG styling
	renderSvgStyle( runtime , style , true ) ;

	runtime.currentStyle = style ;
}



function renderSvgStyle( runtime , style , slave ) {
	var fillColor , currentFillColor , strokeColor , currentStrokeColor ;

	if ( style === runtime.currentStyle ) { return ; }

	fillColor = style.fillColor || style.color || 'black' ;
	currentFillColor = runtime.currentStyle.fillColor || runtime.currentStyle.color || 'black' ;
	strokeColor = style.strokeColor || style.color || 'black' ;
	currentStrokeColor = runtime.currentStyle.strokeColor || runtime.currentStyle.color || 'black' ;

	if ( fillColor !== currentFillColor ) {
		runtime.pdfDoc.fill( fillColor ) ;
	}

	if ( strokeColor !== currentStrokeColor ) {
		runtime.pdfDoc.stroke( strokeColor ) ;
	}

	if ( ! slave ) {
		runtime.currentStyle = style ;
	}
}



// It delays most pdf commands to get more context
function renderPdf( runtime , data ) {
	prepareRenderPdf( runtime , data ) ;
	runtime.pendingPdfCommands.push( data ) ;
}



function prepareRenderPdf( runtime , data ) {
	switch ( data.type ) {
		case 'text' :
			if ( runtime.inline ) {
				if ( runtime.pendingPdfCommands.length ) {
					runtime.pendingPdfCommands[ runtime.pendingPdfCommands.length - 1 ].continued = true ;
					data.continuing = true ;
				}
			}
			else {
				data.newBlock = true ;
				data.marginTop = runtime.marginTop ;
				data.marginBottom = runtime.marginBottom ;
				runtime.marginTop = runtime.marginBottom = 0 ;
			}

			runtime.inline = true ;
			flushPendingPdfCommands( runtime ) ;
			break ;
	}
}



function flushPendingPdfCommands( runtime ) {
	runtime.pendingPdfCommands.forEach( data => renderPdfNow( runtime , data ) ) ;
	runtime.pendingPdfCommands.length = 0 ;
}



function renderPdfNow( runtime , data ) {
	var page = runtime.pdfDoc.page ;

	switch ( data.type ) {
		case 'text' :
			console.log( "style: " , data.style ) ;

			var maxY , pageBreakBefore ,
				attr = new TextAttributes( data.style , data.continued ) ,
				lineHeight = runtime.pdfDoc._font.lineHeight( data.style.fontSize , true ) ;

			console.log( "before:" , runtime.pdfDoc.y , "lineHeight:" , lineHeight ) ;

			if ( data.newBlock ) {

				if ( ! runtime.pageHasContent ) {
					runtime.pdfDoc.y += data.style.leadingMarginTop !== undefined ? data.style.leadingMarginTop : data.marginTop ;
					pageBreakBefore = false ;
				}
				else if ( data.style.pageBreakBefore ) {
					pageBreakBefore = true ;
				}
				else {
					runtime.pdfDoc.y += Math.max( data.marginBottom , data.marginTop ) ;
					maxY = page.height - page.margins.bottom - lineHeight ;

					if ( data.style.unorphanHeight || data.style.unorphanHeight === 0 ) {
						// Here we assume that the block after a notOrphan block has:
						// * a marginTop lesser than the current marginBottom
						// * a lineHeight lesser than the current lineHeight
						maxY -= data.style.marginBottom ;
						maxY -= lineHeight ;
						maxY -= data.style.unorphanHeight ;
					}

					console.log( "\n>>> New block" , runtime.pdfDoc.y , maxY , "<<<\n" ) ;

					if ( runtime.pdfDoc.y > maxY ) {
						pageBreakBefore = true ;
					}
				}

				if ( pageBreakBefore ) {
					console.log( "\n>>> Block needs/require a new page <<<\n" ) ;
					runtime.pdfDoc.addPage() ;

					// Don't forget to add the current marginTop
					runtime.pdfDoc.y += data.style.leadingMarginTop !== undefined ? data.style.leadingMarginTop : data.marginTop ;
					console.log( "after new page:" , runtime.pdfDoc.y ) ;
				}

				// Now set up the width and left/right margin/padding
				attr.width = page.width - page.margins.left - page.margins.right - runtime.paddingLeft ;
				runtime.pdfDoc.x = page.margins.left + runtime.paddingLeft ;
				console.log( "\n\n     >>> has paddingLeft:" , runtime.paddingLeft , "<<<\n\n" ) ;
			}

			renderTextStyle( runtime , data.style ) ;
			runtime.pdfDoc.text( data.text , attr ) ;
			runtime.hasContent = runtime.pageHasContent = true ;
			console.log( "after:" , runtime.pdfDoc.y ) ;
			break ;
	}
}



function onPageAdded( runtime ) {
	runtime.pageHasContent = false ;
}



function createStyle( style , inherit ) {
	return Object.assign( {} , inherit , style || {} ) ;
}



function TextAttributes( style , continued ) {
	this.width = style.width || null ;
	this.height = style.height || null ;
	this.align = style.align || null ;
	this.lineBreak = style.lineBreak === undefined ? true : !! style.lineBreak ;
	this.underline = !! style.underline ;
	this.indent = style.indent || null ;
	this.fill = style.fill === undefined ? true : !! style.fill ;
	this.stroke = !! style.stroke ;
	this.link = style.link || null ;
	this.continued = !! continued ;
}



var renderers = {} ;



renderers._text = ( runtime , tag ) => {
	var style = runtime.styleStack[ runtime.styleStack.length - 1 ] ;

	renderPdf( runtime , {
		type: 'text' ,
		text: tag.text ,
		style: style
	} ) ;
} ;



var tagStyles = {
	i: "italic" ,
	em: "italic" ,
	b: "bold" ,
	strong: "bold" ,
	u: "underline" ,
	a: "link" ,
	p: "paragraph" ,
	h1: "heading1" ,
	h2: "heading2" ,
	h3: "heading3" ,
	h4: "heading4" ,
	h5: "heading5" ,
	h6: "heading6" ,
	ul: "list" ,
	li: "listItem"
} ;



function commonInlineStyleTag( runtime , tag , hooks ) {
	var styleName , bareStyle , style ;

	styleName = tagStyles[ tag.type ] || tag.type ;
	bareStyle = runtime.pdfRenderer.styles[ styleName ] || {} ;
	style = createStyle( bareStyle , runtime.styleStack[ runtime.styleStack.length - 1 ] ) ;

	runtime.styleStack.push( style ) ;

	if ( hooks && hooks.beforeInner ) {
		hooks.beforeInner( runtime , tag , style ) ;
	}

	renderNodes( runtime , tag.children ) ;

	if ( hooks && hooks.afterInner ) {
		hooks.afterInner( runtime , tag , style ) ;
	}

	runtime.styleStack.length -- ;
}



function commonBlockStyleTag( runtime , tag , hooks ) {
	var styleName , bareStyle , style ;

	styleName = tagStyles[ tag.type ] || tag.type ;
	bareStyle = runtime.pdfRenderer.styles[ styleName ] || {} ;
	style = createStyle( bareStyle , runtime.styleStack[ runtime.styleStack.length - 1 ] ) ;

	openBlock( runtime , tag , style ) ;

	// Should be done when entering a block element
	console.log( "not inline/continued" ) ;
	runtime.inline = false ;
	runtime.styleStack.push( style ) ;

	if ( hooks && hooks.beforeInner ) {
		hooks.beforeInner( runtime , tag , style ) ;
	}

	renderNodes( runtime , tag.children ) ;

	if ( hooks && hooks.afterInner ) {
		hooks.afterInner( runtime , tag , style ) ;
	}

	closeBlock( runtime , tag , style ) ;

	// Should be done when closing a block element too
	console.log( "not inline/continued" ) ;
	runtime.inline = false ;
	runtime.styleStack.length -- ;
}



function openBlock( runtime , tag , style ) {
	if ( style.marginTop > runtime.marginTop ) {
		runtime.marginTop = style.marginTop ;
	}

	// Add the padding
	if ( style.paddingLeft ) {
		runtime.paddingLeft += style.paddingLeft ;
	}
}



function closeBlock( runtime , tag , style ) {
	if ( style.marginBottom > runtime.marginBottom ) {
		runtime.marginBottom = style.marginBottom ;
	}

	// Remove the padding
	if ( style.paddingLeft ) {
		runtime.paddingLeft -= style.paddingLeft ;
	}
}



renderers.i =
renderers.em =
renderers.u =
renderers.b =
renderers.strong =
	commonInlineStyleTag ;



renderers.a = function listItem( runtime , tag ) {
	commonInlineStyleTag( runtime , tag , {

		beforeInner: ( runtime_ , tag_ , style ) => {
			if ( tag_.attributes.href ) {
				style.link = tag_.attributes.href ;
			}
		}
	} ) ;
} ;



renderers.p =
renderers.h1 =
renderers.h2 =
renderers.h3 =
renderers.h4 =
renderers.h5 =
renderers.h6 =
renderers.ul =
	commonBlockStyleTag ;



renderers.li = function listItem( runtime , tag ) {
	commonBlockStyleTag( runtime , tag , {

		beforeInner: ( runtime_ , tag_ , style ) => {
			if ( style.listItemPrefix ) {
				renderPdf( runtime , {
					type: 'text' ,
					text: style.listItemPrefix ,
					style: style
				} ) ;
			}
		}
	} ) ;
} ;



// Unknown tag... return nothing or render its content?
renderers.default = ( runtime , tag ) => {
	console.error( 'Unsupported tag' , tag.type ) ;

	//return '' ;
	return {
		text: renderNodes( runtime , tag.children )
	} ;
} ;


