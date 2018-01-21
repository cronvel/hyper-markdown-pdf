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



const NO_CHILD = [] ;
function noop() {}



/*
	* layout: either "portrait" or "landscape"
	* pageSize: either an array [width,height] in PDF point (72 dpi) or a standard format string like "A4"
*/
function HtmlDoc( options = {} ) {
	this.nodes = null ;
}

module.exports = HtmlDoc ;



/*
	Parser
*/



HtmlDoc.parse = function parse( str , options ) {

	var htmlDoc = new HtmlDoc( options ) ;

	var runtime = {
		i: 0 ,
		htmlDoc: htmlDoc ,
		depth: 0 ,
		ancestors: []
	} ;

	if ( typeof str !== 'string' ) {
		if ( str && typeof str === 'object' ) { str = str.toString() ; }
		else { throw new TypeError( "Argument #0 should be a string or an object with a .toString() method" ) ; }
	}

	htmlDoc.nodes = parseNodes( str , runtime ) ;

	return htmlDoc ;
} ;



function parseNodes( str , runtime ) {

	var node , nodes = [] ;

	while ( runtime.i < str.length ) {

		if ( str[ runtime.i ] === '<' ) {

			runtime.i ++ ;

			node = parseTag( str , runtime ) ;

			// If false, this is the end of this level, if null, do not add any tag
			if ( ! node ) { break ; }
			else if ( ! node.noop ) { nodes.push( node ) ; }
		}
		else {
			nodes.push( parseString( str , runtime ) ) ;
		}
	}

	return nodes ;
}



function parseString( str , runtime ) {

	var c , text = '' ;

	while ( runtime.i < str.length ) {
		c = str[ runtime.i ] ;

		if ( c === '<' ) {
			break ;
		}
		else if ( c === '&' ) {
			text += parseHtmlEntity( str , runtime ) ;
		}
		else {
			text += parseRawString( str , runtime ) ;
		}
	}

	return { type: 'text' , text: text } ;
}



function parseRawString( str , runtime ) {
	var c , start = runtime.i ;

	for ( ; runtime.i < str.length ; runtime.i ++ ) {
		c = str[ runtime.i ] ;

		if ( c === '<' || c === '&' ) {
			break ;
		}
	}

	return str.slice( start , runtime.i ) ;
}



function parseHtmlEntity( str , runtime ) {

	// TODO...

	runtime.i ++ ;
	return '' ;
}



function parseTag( str , runtime ) {
	var arg , isClosingTag , isSelfClosing ;

	var tag = {
		parent: runtime.depth ? runtime.ancestors[ runtime.depth - 1 ] : null ,
		previousSibling: runtime.ancestors[ runtime.depth ] || null ,
		nextSibling: null ,
		attributes: {} ,
		classes: []
	} ;

	if ( tag.previousSibling ) {
		tag.previousSibling.nextSibling = tag ;
	}

	if ( str[ runtime.i ] === '/' ) {
		runtime.i ++ ;
		isClosingTag = true ;
	}

	tag.type = parseTagName( str , runtime ) ;

	[ arg , isSelfClosing ] = parseTagArg( str , runtime ) ;	// it eats the final > too

	if ( arg ) {
		parseTagAttributes( tag , arg ) ;
	}

	if ( isClosingTag ) {
		return false ;
	}

	runtime.ancestors[ runtime.depth ] = tag ;

	if ( isSelfClosing ) {
		tag.children = NO_CHILD ;
	}
	else {
		runtime.depth ++ ;
		tag.children = parseNodes( str , runtime ) ;
		runtime.depth -- ;
	}

	return tag ;
}



function parseTagName( str , runtime ) {
	var c , start = runtime.i ;

	for ( ; runtime.i < str.length ; runtime.i ++ ) {
		c = str.charCodeAt( runtime.i ) ;

		if (
			( c < 0x41 || c > 0x5a ) &&	// uppercase letters
			( c < 0x61 || c > 0x7a ) &&	// lowercase letters
			( c < 0x30 || c > 0x39 )	// numbers
		) {
			break ;
		}
	}

	return str.slice( start , runtime.i ).toLowerCase() ;
}



function parseTagArg( str , runtime ) {
	var c , arg = '' , isSelfClosing = false ;

	while ( runtime.i < str.length ) {
		c = str[ runtime.i ] ;

		if ( c === '/' && str[ runtime.i + 1 ] === '>' ) {
			isSelfClosing = true ;
			runtime.i += 2 ;
			break ;
		}
		else if ( c === '>' ) {
			runtime.i ++ ;
			break ;
		}
		else {
			arg += parseRawArg( str , runtime ) ;
		}
	}

	return [ arg.trim() , isSelfClosing ] ;
}



function parseRawArg( str , runtime ) {
	var c , start = runtime.i ;

	for ( ; runtime.i < str.length ; runtime.i ++ ) {
		c = str[ runtime.i ] ;

		if ( c === '>' || ( c === '/' && str[ runtime.i + 1 ] === '>' ) ) {
			break ;
		}
	}

	return str.slice( start , runtime.i ) ;
}



var attrRegexp = /([0-9A-Za-z_-]+)="([^"<>]*)"/g ;



function parseTagAttributes( tag , str ) {
	var matches ;

	attrRegexp.lastIndex = 0 ;

	while ( ( matches = attrRegexp.exec( str ) ) !== null ) {
		tag.attributes[ matches[ 1 ] ] = matches[ 2 ] ;
	}

	if ( tag.attributes.class ) {
		tag.classes = tag.attributes.class.split( / +/g ) ;
	}
}



function parseSkipSpace( str , runtime ) {
	while ( runtime.i < str.length && str[ runtime.i ] === ' ' ) { runtime.i ++ ; }
}


