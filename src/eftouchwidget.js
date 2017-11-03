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
    schema.allow( { name: '$inline', inside: '$root' } );
    schema.allow( { name: '$inline', inside: 'acasi' } );
    schema.objects.add( 'acasi' );


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
          const widgetElement = new ModelElement('figure', { class: 'fancy-widget' },imageElement)
          editor.data.insertContent( widgetElement, editor.document.selection );
        } );
      });
      return view;
    });
  }

}
