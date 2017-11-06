import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import htmlIcon from '@ckeditor/ckeditor5-core/theme/icons/source.svg';
import EftouchWidget from './src/eftouchwidget.js'

class InsertImage extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add( 'showHtml', locale => {
      const view = new ButtonView( locale );

      view.set( {
        label: 'Dump html',
        icon: htmlIcon,
        tooltip: true
      } );

      view.on( 'execute', () => {
        editor.document.enqueueChanges( () => {
          let htmlText = Tangy.editor.getData();
          console.log("html output: " + htmlText)
        } );
      } );

      return view;
    } );
  }
}

ClassicEditor
  .create( document.querySelector( '#editor' ), {
    plugins: [ Essentials, Paragraph, Bold, Italic, Image, InsertImage, ImageToolbar, ImageCaption, BlockQuote, EftouchWidget ],
    toolbar: [ 'bold', 'italic', 'blockQuote', 'showHtml', 'insertAcasi']  ,
    image: {
      toolbar: [ 'imageTextAlternative' ]
    }
  } )
  .then( editor => {
    console.log( 'Editor was initialized', editor );
    if (typeof Tangy == 'undefined') {
      window.Tangy = new Object()
      window.Tangy.editor = editor
    } else {
      window.Tangy.editor = editor
    }
  } )
  .catch( error => {
    console.error( error.stack );
  } );