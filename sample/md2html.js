#!/usr/bin/env node

"use strict" ;

var fs = require( 'fs' ) ;
var hyperMarkdown = require( 'hyper-markdown' ) ;
var mdCode = fs.readFileSync( 'test.md' , 'utf8' ) ;
var htmlCode = hyperMarkdown( mdCode ) ;
fs.writeFileSync( 'test.html' , htmlCode , 'utf8' ) ;

