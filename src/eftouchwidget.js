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
import ViewEmptyElement from '@ckeditor/ckeditor5-engine/src/view/emptyelement';
import { toImageWidget } from '@ckeditor/ckeditor5-image/src/image/utils';

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
    schema.allow( { name: 'acasi', attributes: [ 'intro-src' ], inside: '$root' } );
    schema.allow( { name: 'acasi', inside: '$root' } );
    schema.allow( { name: '$inline', inside: '$root' } );
    schema.allow( { name: '$inline', inside: 'acasi' } );
    schema.allow( { name: 'image', inside: 'acasi' } );
    schema.objects.add( 'acasi' );

    buildModelConverter().for( data.modelToView )
      .fromElement( 'acasi' )
      // .toElement( 'acasi');
      .toElement( () => {
        // return new ViewContainerElement( 'acasi', { class: 'acasi' }, [new ViewEmptyElement( 'img' ), new ViewEmptyElement( 'img' ), new ViewEmptyElement( 'img' ), new ViewEmptyElement( 'img' )] );
        return new ViewContainerElement( 'acasi' );
      })


    //  Build converter from model element to view element for editing view pipeline. This affects how this element is rendered in the editor.
    buildModelConverter().for( editing.modelToView )
      .fromElement( 'acasi' )
      .toElement( () => {
        // const imageContainer = createImageViewElement();
        const imageContainer1 = new ViewContainerElement( 'figure', { class: 'image' }, new ViewEmptyElement( 'img' ) );
        const imageContainer2 = new ViewContainerElement( 'figure', { class: 'image' }, new ViewEmptyElement( 'img' ) );
        const imageContainer3 = new ViewContainerElement( 'figure', { class: 'image' }, new ViewEmptyElement( 'img' ) );
        const imageContainer4 = new ViewContainerElement( 'figure', { class: 'image' }, new ViewEmptyElement( 'img' ) );
        // const imageContainer = new ViewContainerElement( 'figure', { class: 'image' }, [imageElement]);
        // const widgetElement = new ViewContainerElement( 'figure', { class: 'fancy-widget', contenteditable: 'true' }, [new ViewText( 'ACASI' )] );
        // const widgetContainer = new ViewContainerElement( 'figure', { class: 'fancy-widget', contenteditable: 'true' },
        const widgetContainer = new ViewContainerElement( 'figure', { contenteditable: 'true' },
          [toImageWidget(imageContainer1), toImageWidget(imageContainer2), toImageWidget(imageContainer3), toImageWidget(imageContainer4)] );
        const widget = toWidget( widgetContainer );
        widget.setAttribute( 'contenteditable', true );
        return widget;
      } );

    // Build converter from view element to model element for data pipeline.
    buildViewConverter().for( data.viewToModel )
      .fromElement( 'acasi' )
      .toElement( () => {
        const imageUrl = 'assets/babycat.jpg';
        const imageElement = new ModelElement( 'image', {
          src: imageUrl
        });
        new ModelElement( 'acasi' ), {'intro-src':'assets/sounds/5.mp3'}, [imageElement]
      });

    // Build converter for view img element to model image element.
    buildViewConverter().for( data.viewToModel )
      .from( { name: 'acasi', attribute: { 'intro-src': /./ } } )
      .toElement( viewImage => new ModelElement( 'image', { 'intro-src': viewImage.getAttribute( 'intro-src' ) } ) );

    // createImageAttributeConverter( [ editing.modelToView, data.modelToView ], 'src' );


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
          const imageElement1 = new ModelElement( 'image', { src: '../src/assets/once.png'});
          const imageElement2 = new ModelElement( 'image', { src: '../src/assets/few.png'});
          const imageElement3 = new ModelElement( 'image', { src: '../src/assets/many.png'});
          const imageElement4 = new ModelElement( 'image', { src: '../src/assets/never.png'});

          // // const widgetElement = new ModelElement('figure', { class: 'fancy-widget' },imageElement)
          // editor.data.insertContent( imageElement, editor.document.selection );
          const acasi = new ModelElement( 'acasi', {'intro-src':'assets/sounds/5.mp3'}, [imageElement1, imageElement2, imageElement3, imageElement4])
          // const acasi = new ModelElement( 'acasi', { src: imageUrl });
          editor.data.insertContent( acasi, editor.document.selection );
        } );
      });
      return view;
    });
  }

}
