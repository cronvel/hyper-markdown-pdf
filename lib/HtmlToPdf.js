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



const NO_SUBPARTS = [] ;
function noop() {}



function HtmlDoc( options = {} ) {
	this.id = options.id ;
	this.parts = null ;

	if ( this.id && this.lib ) {
		this.lib.add( this ) ;
	}
}

module.exports = HtmlDoc ;



/*
	Renderer
*/



HtmlDoc.prototype.render = function render( ctx ) {
	return renderParts( this , this.parts , createScope( ctx , null ) ) ;
} ;



HtmlDoc.render = function( str , ctx , options ) {
	return HtmlDoc.parse( str , options ).render( ctx ) ;
} ;



function renderParts( template , parts , ctx , joint = '' , fromParentCtx ) {

	var newCtx = ctx ;

	if ( ctx ) {
		if ( Array.isArray( ctx ) ) {
			return ctx.map( subCtx => {
				newCtx = createScope( subCtx , fromParentCtx || ctx ) ;
				return parts.map( part => renderers[ part.type ]( template , part , newCtx ) ).join( '' ) ;
			} ).join( joint ) ;
		}

		if ( fromParentCtx && typeof ctx === 'object' ) {
			newCtx = createScope( ctx , fromParentCtx ) ;
		}

		return parts.map( part => renderers[ part.type ]( template , part , newCtx ) ).join( '' ) ;
	}

	return '' ;
}



function createScope( ctx , parentCtx ) {
	var rootCtx ;

	if ( parentCtx ) {
		rootCtx = parentCtx[''] || parentCtx ;
	}
	else if ( parentCtx === null ) {
		// If the second arg is null, then we want to recreate a top-level scope
		rootCtx = ctx ;
	}
	else {
		rootCtx = ctx[''] || ctx ;
	}

	return Object.create( ctx , {
		'': { value: rootCtx }
	} ) ;
}



var renderers = {} ;



//renderers.string = ( template , part ) => part.content ;

renderers.string = ( template , part , ctx ) => {
	return template.babel.format( part.content , ctx ) ;
} ;



renderers.let = ( template , tag , ctx ) => {
	ctx[ tag.var ] = Dynamic.getFinalValue( tag.expression , ctx ) ;
	return '' ;
} ;



var tags = {} ;



tags.let = ( tag , arg , runtime ) => {
	parseAssignmentArgumentSyntax( tag , arg ) ;
} ;



/*
	Parser
*/



HtmlDoc.parse = function parse( str , options ) {

	var template = new HtmlDoc( options ) ;

	var runtime = {
		i: 0 ,
		template: template ,
		depth: 0 ,
		ancestors: []
	} ;

	if ( typeof str !== 'string' ) {
		if ( str && typeof str === 'object' ) { str = str.toString() ; }
		else { throw new TypeError( "Argument #0 should be a string or an object with a .toString() method" ) ; }
	}

	template.parts = parseParts( str , runtime ) ;

	return template ;
} ;



function parseParts( str , runtime ) {

	var part , parts = [] ;

	while ( runtime.i < str.length ) {

		if ( str[ runtime.i ] === '<' ) {

			runtime.i ++ ;

			part = parseTag( str , runtime ) ;

			// If false, this is the end of this level, if null, do not add any tag
			if ( ! part ) { break ; }
			else if ( ! part.noop ) { parts.push( part ) ; }
		}
		else {
			parts.push( parseString( str , runtime ) ) ;
		}
	}

	return parts ;
}



function parseString( str , runtime ) {

	var c , content = '' ;

	while ( runtime.i < str.length ) {
		c = str[ runtime.i ] ;

		if ( c === '<' ) {
			break ;
		}
		else if ( c === '&' ) {
			content += parseHtmlEntity( str , runtime ) ;
		}
		else {
			content += parseRawString( str , runtime ) ;
		}
	}

	return { type: 'string' , content: content } ;
}



function parseRawString( str , runtime ) {
	var c , start = runtime.i ;

	for ( ; runtime.i < str.length ; runtime.i ++ ) {
		c = str[ runtime.i ] ;

		if ( c === '<' && || c === '&' ) {
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
	var arg , tag = {} , closingTag , selfClosing ;
	//var lastTag = runtime.ancestors[ runtime.depth ] ;

	if ( str[ runtime.i ] === '/' ) {
		runtime.i ++ ;
		closingTag = true ;
	}

	tag.type = parseTagName( str , runtime ) ;

	[ arg , selfClosing ] = parseTagArg( str , runtime ) ;	// it eats the final > too
	
	if ( closingTag ) {
		return false ;
	}

	if ( tags[ tag.type ] ) {
		tags[ tag.type ]( tag , arg , runtime ) ;
	}
	else {
		throw new SyntaxError( "Unknown '" + tag.type + "' tag." ) ;
		//tag.arg = arg ;
	}

	runtime.ancestors[ runtime.depth ] = tag ;

	if ( selfClosing ) {
		tag.subParts = NO_SUBPARTS ;
	}
	else {
		runtime.depth ++ ;
		tag.subParts = parseParts( str , runtime ) ;
		runtime.depth -- ;
	}

	return tag ;
}



function parseTagName( str , runtime ) {
	var c , start = runtime.i ;

	for ( ; runtime.i < str.length ; runtime.i ++ ) {
		c = str.charCodeAt( runtime.i ) ;

		if ( c < 0x61 || c > 0x7a ) {
			break ;
		}
	}

	return str.slice( start , runtime.i ) ;
}



function parseTagArg( str , runtime ) {
	var c , arg = '' , selfClosing = false ;

	while ( runtime.i < str.length ) {
		c = str[ runtime.i ] ;

		if ( c === '/' && str[ runtime.i + 1 ] === '>' ) {
			selfClosing = true ;
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

	return [ arg.trim() , selfClosing ] ;
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



function parseSkipSpace( str , runtime ) {
	while ( runtime.i < str.length && str[ runtime.i ] === ' ' ) { runtime.i ++ ; }
}


