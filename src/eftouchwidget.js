/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global console, window, document */

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Enter from '@ckeditor/ckeditor5-enter/src/enter';
import Typing from '@ckeditor/ckeditor5-typing/src/typing';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Undo from '@ckeditor/ckeditor5-undo/src/undo';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import List from '@ckeditor/ckeditor5-list/src/list';
import global from '@ckeditor/ckeditor5-utils/src/dom/global';
import buildModelConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildmodelconverter';
import buildViewConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildviewconverter';
import ModelRange from '@ckeditor/ckeditor5-engine/src/model/range';
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import ViewContainerElement from '@ckeditor/ckeditor5-engine/src/view/containerelement';
import ViewText from '@ckeditor/ckeditor5-engine/src/view/text';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

import Eftouch from './eftouch.js'
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/picker.svg';
import htmlIcon from '@ckeditor/ckeditor5-core/theme/icons/source.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import AttributeCommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand';

const ACASI = 'acasi';

export default class EftouchWidget extends Plugin {
  static get requires() {
    return [ Widget ];
  }



  init() {
    const editor = this.editor;
    const doc = editor.document;
    const schema = doc.schema;
    const data = editor.data;
    const editing = editor.editing;
    const t = editor.t;

    // Configure schema.
    schema.registerItem( 'acasi' );
    schema.allow( { name: 'acasi', inside: '$root' } );
    schema.allow( { name: '$text', inside: '$root' } );
    // schema.allow( { name: 'div', inside: '$root' } );
    schema.allow( { name: '$block', inside: 'acasi' } );
    schema.allow( { name: 'image', inside: 'acasi' } );
    schema.allow( { name: '$text', inside: 'acasi' } );
    schema.allow( { name: 'paragraph', inside: 'acasi' } );
    schema.allow( { name: 'paragraph', inside: 'figure' } );
    schema.allow( { name: '$text', inside: 'figure' } );
    // schema.allow( { name: 'div', inside: 'acasi' } );
    schema.objects.add( 'acasi' );
    schema.objects.add( '$text' );
    schema.objects.add( 'image' );
    // schema.objects.add( 'paragraph' );
    // schema.objects.add( 'div' );

    // Build converter from model to view for editing pipeline.
    buildModelConverter().for( data.modelToView, editing.modelToView )
      .fromElement( 'acasi' )
      .toElement( () => {
        const widgetElement = new ViewContainerElement( 'figure', { class: 'fancy-widget', contenteditable: 'true' }, new ViewText( 'ACASI' ) );
        const widget = toWidget( widgetElement );
        widget.setAttribute( 'contenteditable', true );
        return widget;
      } );

    // Build converter from view element to model element for data pipeline.
    buildViewConverter().for( data.viewToModel )
      .fromElement( 'acasi' )
      .toElement( () => new ModelElement( 'acasi' ) );

    // editor.commands.add( ACASI, new AttributeCommand( editor, ACASI ) );
    // const command = editor.commands.get( 'acasi' );

    // Add acasi button to feature components.
    editor.ui.componentFactory.add( 'insertAcasi', locale => {
      const view = new ButtonView(locale);
      view.set({
        label: t('Acasi'),
        icon: imageIcon,
        tooltip: true
      });
      // view.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

      // Execute command.
      view.on( 'execute', () => {
      // this.listenTo( view, 'execute', () => {
        const imageUrl = prompt( 'Sound URL' );

        editor.document.enqueueChanges( () => {
          const imageUrl = 'babycat.jpg';
          const imageElement = new ModelElement( 'image', {
            src: imageUrl
          } );
          // editor.data.insertContent( imageElement, editor.document.selection );
          // const figureElement = new ModelElement( 'figure', { class: 'fancy-widget' }, new ViewText( 'ACASI' ) );
          // const figureElement = new ModelElement( 'figure', { class: 'fancy-widget' });
          // const figureElement = new ModelElement( 'div', { data: 'ACASI'});
          // const figureElement = new ModelElement( 'paragraph', { data: 'ACASI'}, new Text( 'foo' ) );
          // const figureElement = new ModelElement( 'paragraph', { data: 'ACASI'},  new ModelElement( 'text') );
          // const figureElement = new ModelElement( 'div', { data: 'ACASI'}, imageElement );
          // const figureElement = new ModelElement( 'div', { 'class': 'editor', 'contentEditable': 'true' } );
          // const widgetElement = new ViewContainerElement( 'figure', { class: 'fancy-widget' }, new ViewText( 'ACASI' ) );
          // const widgetElement = new ModelElement( 'figure', { class: 'fancy-widget' }, new ViewText( 'ACASI' ) );

          // const widget =  toWidget( widgetElement );
          // editor.data.insertContent( figureElement, editor.document.selection );
          // const widgetElement = new ViewContainerElement( 'figure', { class: 'widget' }, new ViewText( 'ACASI' ) );
          const widgetElement = new ModelElement('acasi', { class: 'fancy-widget' },imageElement)
          editor.data.insertContent( widgetElement, editor.document.selection );



          // editor.execute( 'acasi' )

          // const tangyElement = new ModelElement( 'eftouch', {
          //   src: imageUrl
          // } );
          // editor.data.insertContent( tangyElement, editor.document.selection );

        } );
      });
      return view;
    });
  }

}

/**
 * Converts given {@link module:engine/view/element~Element} to widget in following way:
 * * sets `contenteditable` attribute to `true`,
 * * adds custom `getFillerOffset` method returning `null`,
 * * adds `ck-widget` CSS class,
 * * adds custom property allowing to recognize widget elements by using {@link ~isWidget},
 * * implements `addHighlight` and `removeHighlight` custom properties to handle view highlight on widgets.
 *
 * @param {module:engine/view/element~Element} element
 * @param {Object} [options={}]
 * @param {String|Function} [options.label] Element's label provided to {@link ~setLabel} function. It can be passed as
 * a plain string or a function returning a string.
 * @returns {module:engine/view/element~Element} Returns same element.
 */
export function toAcasiWidget( element, options = {} ) {
  element.setAttribute( 'contenteditable', true );
  // element.getFillerOffset = getFillerOffset;
  element.getFillerOffset = null;
  element.addClass( WIDGET_CLASS_NAME );
  element.setCustomProperty( widgetSymbol, true );

  if ( options.label ) {
    setLabel( element, options.label );
  }

  setHighlightHandling(
    element,
    ( element, descriptor ) => element.addClass( ...normalizeToArray( descriptor.class ) ),
    ( element, descriptor ) => element.removeClass( ...normalizeToArray( descriptor.class ) )
  );

  return element;

  // Normalizes CSS class in descriptor that can be provided in form of an array or a string.
  function normalizeToArray( classes ) {
    return Array.isArray( classes ) ? classes : [ classes ];
  }
}

// ClassicEditor.create( global.document.querySelector( '#editor2' ), {
//   plugins: [ Enter, Typing, Paragraph, Undo, Heading, Bold, Italic, List, EftouchWidget ],
//   toolbar: [ 'headings', 'undo', 'redo', 'bold', 'italic', 'numberedList', 'bulletedList', 'eftouch', 'showCode' ]
// } )
//   .then( editor => {
//     window.editor = editor;
//     if (typeof Tangy == 'undefined') {
//       window.Tangy = new Object()
//       window.Tangy.editor = editor
//     } else {
//       window.Tangy.editor = editor
//     }
//
//     buildModelConverter()
//       .for( editor.editing.modelToView )
//       .fromMarker( 'marker' )
//       .toHighlight( data => ( { class: 'highlight-' + data.markerName.split( ':' )[ 1 ] } ) );
//
//     document.getElementById( 'add-marker-yellow' ).addEventListener( 'mousedown', evt => {
//       addMarker( editor, 'yellow' );
//       evt.preventDefault();
//     } );
//
//     document.getElementById( 'add-marker-blue' ).addEventListener( 'mousedown', evt => {
//       addMarker( editor, 'blue' );
//       evt.preventDefault();
//     } );
//
//     document.getElementById( 'add-marker-red' ).addEventListener( 'mousedown', evt => {
//       addMarker( editor, 'red' );
//       evt.preventDefault();
//     } );
//
//     document.getElementById( 'remove-marker-yellow' ).addEventListener( 'mousedown', evt => {
//       removeMarker( editor, 'yellow' );
//       evt.preventDefault();
//     } );
//
//     document.getElementById( 'remove-marker-blue' ).addEventListener( 'mousedown', evt => {
//       removeMarker( editor, 'blue' );
//       evt.preventDefault();
//     } );
//
//     document.getElementById( 'remove-marker-red' ).addEventListener( 'mousedown', evt => {
//       removeMarker( editor, 'red' );
//       evt.preventDefault();
//     } );
//
//     document.getElementById( 'remove-markers' ).addEventListener( 'mousedown', evt => {
//       const markers = editor.document.markers;
//
//       editor.document.enqueueChanges( () => {
//         for ( const marker of markers ) {
//           markers.remove( marker );
//         }
//       } );
//
//       evt.preventDefault();
//     } );
//   } )
//   .catch( err => {
//     console.error( err.stack );
//   } );
//
// function addMarker( editor, color ) {
//   const model = editor.document;
//
//   editor.document.enqueueChanges( () => {
//     const range = ModelRange.createFromRange( model.selection.getFirstRange() );
//     model.markers.set( 'marker:' + color, range );
//   } );
// }
//
// function removeMarker( editor, color ) {
//   const model = editor.document;
//
//   editor.document.enqueueChanges( () => {
//     model.markers.remove( 'marker:' + color );
//   } );
// }