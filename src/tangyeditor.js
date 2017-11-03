/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals window, document */
/* eslint no-alert: 0 */

/* globals document, DOMParser */

// import BasicHtmlWriter from './basichtmlwriter';
// import DomConverter from '../view/domconverter';
// import { NBSP_FILLER } from '../view/filler';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

export default class TangyClassicEditor extends ClassicEditor {
  constructor( element, config ) {
    super( element, config );

    this.data.processor = new TangyDataProcessor();
  }
}

import ViewText from '@ckeditor/ckeditor5-engine/src/view/text';
import ViewElement from '@ckeditor/ckeditor5-engine/src/view/element';
import ViewDocumentFragment from '@ckeditor/ckeditor5-engine/src/view/documentfragment';
import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';

class TangyDataProcessor extends HtmlDataProcessor {

  toData( viewFragment ) {
    const json = [];

    for ( const child of viewFragment ) {
      const childJson = viewToJson( child );

      json.push( childJson );
    }

    return JSON.stringify( json );
  }

  // toView( jsonString ) {
  //   const jsonData = JSON.parse( jsonString );
  //   const viewFragment = new ViewDocumentFragment();
  //
  //   for ( const childJson of jsonData ) {
  //     const child = jsonToView( childJson );
  //
  //     viewFragment.appendChildren( child );
  //   }
  //
  //   return viewFragment;
  // }

  // /**
  //  * Converts provided HTML string to view tree.
  //  *
  //  * @param {String} data HTML string.
  //  * @returns {module:engine/view/node~Node|module:engine/view/documentfragment~DocumentFragment|null} Converted view element.
  //  */
  // toView( data ) {
  //   // Convert input HTML data to DOM DocumentFragment.
  //   const domFragment = this._toDom( data );
  //
  //   // Convert DOM DocumentFragment to view DocumentFragment.
  //   return this._domConverter.domToView( domFragment );
  // }
  //
  // /**
  //  * Converts HTML String to its DOM representation. Returns DocumentFragment, containing nodes parsed from
  //  * provided data.
  //  *
  //  * @private
  //  * @param {String} data
  //  * @returns {DocumentFragment}
  //  */
  // _toDom( data ) {
  //   const document = this._domParser.parseFromString( data, 'text/html' );
  //   const fragment = document.createDocumentFragment();
  //   const nodes = document.body.childNodes;
  //
  //   while ( nodes.length > 0 ) {
  //     fragment.appendChild( nodes[ 0 ] );
  //   }
  //
  //   return fragment;
  // }

}

function viewToJson( viewElement ) {
  const json = {};

  if ( viewElement.is( 'text' ) ) {
    json.text = viewElement.data;
  } else {
    json.name = viewElement.name;
    json.attributes = {};

    for ( const [ key, value ] of viewElement.getAttributes() ) {
      json.attributes[ key ] = value;
    }

    json.children = [];

    for ( const child of viewElement.getChildren() ) {
      json.children.push( viewToJson( child ) );
    }
  }

  return json;
}

function jsonToView( jsonObject ) {
  if ( jsonObject.text ) {
    return new ViewText( jsonObject.text );
  } else {
    const viewElement = new ViewElement( jsonObject.name, jsonObject.attributes );

    for ( const childJson of jsonObject.children ) {
      const viewChild = jsonToView( childJson );

      viewElement.appendChildren( viewChild );
    }

    return viewElement;
  }
}

// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import List from '@ckeditor/ckeditor5-list/src/list';
// import Heading from '@ckeditor/ckeditor5-heading/src/heading';
//
// JsonClassicEditor
//   .create( document.querySelector( '#editor' ), {
//     plugins: [ Essentials, Paragraph, Bold, Italic, List, Heading ],
//     toolbar: [ 'headings', 'bold', 'italic', 'bulletedList', 'numberedList', 'undo', 'redo' ]
//   } )
//   .then( editor => {
//     window.editor = editor;
//   } );
//
// function getEditorData() {
//   window.alert( window.editor.getData() );
// }
//
// document.getElementById( 'getDataBtn' ).onclick = getEditorData;