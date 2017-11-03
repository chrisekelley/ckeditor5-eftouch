import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
// import List from '@ckeditor/ckeditor5-list/src/list';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import htmlIcon from '@ckeditor/ckeditor5-core/theme/icons/source.svg';

// import Eftouch from './src/eftouch.js'
import EftouchWidget from './src/eftouchwidget.js'
// import TangyClassicEditor from './src/tangyeditor.js'

class InsertImage extends Plugin {
  init() {
    console.log("hey there babe ")
    const editor = this.editor;

    editor.ui.componentFactory.add( 'insertImage', locale => {
      const view = new ButtonView( locale );

      view.set( {
        label: 'Insert image',
        icon: imageIcon,
        tooltip: true
      } );

      view.on( 'execute', () => {
        // const imageUrl = prompt( 'Image URL' );
        // const imageUrl = 'https://i.pinimg.com/736x/85/b4/cf/85b4cf112cf40c191ca5676b726fc410--cute-fluffy-kittens-cute-baby-cats.jpg';
        const imageUrl = 'babycat.jpg';

        editor.document.enqueueChanges( () => {

          const imageElement = new ModelElement( 'image', {
            src: imageUrl
          } );
          editor.data.insertContent( imageElement, editor.document.selection );

          // const tangyElement = new ModelElement( 'eftouch', {
          //   src: imageUrl
          // } );
          // editor.data.insertContent( tangyElement, editor.document.selection );

        } );
      } );

      return view;
    } );
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
    // plugins: [ Essentials, Paragraph, Bold, Italic, Image, InsertImage, ImageCaption, Eftouch, List ],
    // plugins: [ Essentials, Paragraph, Bold, Italic, Image, InsertImage, ImageToolbar, ImageCaption, BlockQuote, Eftouch, EftouchWidget ],
    plugins: [ Essentials, Paragraph, Bold, Italic, Image, InsertImage, ImageToolbar, ImageCaption, BlockQuote, EftouchWidget ],
    // toolbar: [ 'bold', 'italic', 'insertImage', 'insertEftouch' ]
    // toolbar: [ 'bold', 'italic', 'insertImage', 'eftouch', 'showHtml', 'imageTextAlternative', 'blockQuote', 'acasi'  ],
    toolbar: [ 'bold', 'italic', 'insertImage', 'showHtml', 'imageTextAlternative', 'blockQuote', 'insertAcasi'  ],
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