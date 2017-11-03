import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
// import EftouchFormView from './ui/eftouchformview';
import buildModelConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildmodelconverter';
import buildViewConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildviewconverter';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/picker.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';
import EftouchEngine from './eftouchengine';
import ViewAttributeElement from '@ckeditor/ckeditor5-engine/src/view/attributeelement';
import ViewEmptyElement from '@ckeditor/ckeditor5-engine/src/view/emptyelement';
import ViewText from '@ckeditor/ckeditor5-engine/src/view/text';
import ViewContainerElement from '@ckeditor/ckeditor5-engine/src/view/containerelement';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils'

const EFTOUCH = 'eftouch';

/**
 * The image plugin.
 *
 * Uses the {@link module:image/image/imageengine~ImageEngine}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class Eftouch extends Plugin {

  /**
   * @inheritDoc
   */
  static get requires() {
    return [ EftouchEngine, Widget ];
  }

  static get pluginName() {
    return 'Eftouch';
  }

  init() {
    console.log("Eftouch plugin")
    const editor = this.editor;
    const doc = editor.document;
    const viewDocument = editor.editing.view;
    const schema = doc.schema;
    const data = editor.data;
    const editing = editor.editing;
    const t = editor.t;

    schema.registerItem( 'eftouch' );
    schema.allow( { name: 'eftouch', inside: '$root' } );
    // schema.allow( { name: '$block', inside: 'eftouch' } );
    // schema.allow( { name: 'image', inside: 'eftouch' } );
    schema.objects.add( 'eftouch' );

    const command = editor.commands.get( 'eftouch' );
    const keystroke = 'CTRL+E';

    // Add eftouch button to feature components.
    editor.ui.componentFactory.add( 'eftouch', locale => {
      const view = new ButtonView( locale );

      view.set( {
        label: t( 'Eftouch' ),
        icon: imageIcon,
        keystroke,
        tooltip: true
      } );

      view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

      // Execute command.
      this.listenTo( view, 'execute', () => {
        const imageUrl = prompt( 'Sound URL' );
        const modelItem = data.item;
        // editor.data.addProp()

        // const blocks = Array.from( doc.selection.getSelectedBlocks() )
        //   // .filter( block => checkCanBecomeListItem( block, document.schema ) );
        // const batch = doc.batch();
        //
        // for ( const element of blocks.reverse() ) {
        //   console.log("element.name: " + element.name)
        //   batch.setAttribute(element, 'imageUrl', imageUrl)
        //     // .rename(element, 'eftouch');
        // }
        // const imageUrl = "hey"
        const attrs = { 'intro-src': imageUrl, class: 'image'}
        // const element = new ViewContainerElement( 'eftouch', attrs );
        // const element = new ViewAttributeElement( 'eftouch', attrs );
        // const element = new ViewAttributeElement( 'figure', attrs, new ViewEmptyElement( 'img' ) );
        const element = new ViewContainerElement( 'figure', { class: 'eftouch' }, new ViewText( 'widget' ) );

        // Build converter from model to view for data and editing pipelines.
        // buildModelConverter().for( data.modelToView, editing.modelToView )
        buildModelConverter().for( editing.modelToView )
          .fromAttribute( EFTOUCH )
          // .toElement( 'eftouch' );
          // .toElement( element );
          // .toElement( 'blockquote' );
          .toElement( () => {
            return toWidget( element );
          });

        // Build converter from view to model for data pipeline.
        // .fromElement( 'eftouch' )
        // .toAttribute( EFTOUCH, true );
        buildViewConverter().for( data.viewToModel )
          .fromElement( 'figure' )
          .toElement( () => new ModelElement( 'eftouch' ) );
        editor.execute( 'eftouch' )
      } );

      return view;
    } );
  }


  /**
   * Helper method for initializing a button and linking it with an appropriate command.
   *
   * @private
   * @param {String} commandName The name of the command.
   * @param {Object} label The button label.
   * @param {String} icon The source of the icon.
   */
  _addButton( commandName, label, icon ) {
    const editor = this.editor;
    const command = editor.commands.get( commandName );

    editor.ui.componentFactory.add( commandName, locale => {
      const buttonView = new ButtonView( locale );

      buttonView.set( {
        label,
        icon,
        tooltip: true
      } );

      // Bind button model to command.
      buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

      // Execute command.
      this.listenTo( buttonView, 'execute', () => editor.execute( commandName ) );

      return buttonView;
    } );
  }

  //
  // _createForm() {
  //   const editor = this.editor;
  //   const formView = new LinkFormView( editor.locale );
  //   const linkCommand = editor.commands.get( 'link' );
  //   const unlinkCommand = editor.commands.get( 'unlink' );
  //
  //   formView.urlInputView.bind( 'value' ).to( linkCommand, 'value' );
  //
  //   // Form elements should be read-only when corresponding commands are disabled.
  //   formView.urlInputView.bind( 'isReadOnly' ).to( linkCommand, 'isEnabled', value => !value );
  //   formView.saveButtonView.bind( 'isEnabled' ).to( linkCommand );
  //   formView.unlinkButtonView.bind( 'isEnabled' ).to( unlinkCommand );
  //
  //   // Execute link command after clicking on formView `Save` button.
  //   this.listenTo( formView, 'submit', () => {
  //     editor.execute( 'link', formView.urlInputView.inputView.element.value );
  //     this._hidePanel( true );
  //   } );
  //
  //   // Execute unlink command after clicking on formView `Unlink` button.
  //   this.listenTo( formView, 'unlink', () => {
  //     editor.execute( 'unlink' );
  //     this._hidePanel( true );
  //   } );
  //
  //   // Hide the panel after clicking on formView `Cancel` button.
  //   this.listenTo( formView, 'cancel', () => this._hidePanel( true ) );
  //
  //   // Close the panel on esc key press when the form has focus.
  //   formView.keystrokes.set( 'Esc', ( data, cancel ) => {
  //     this._hidePanel( true );
  //     cancel();
  //   } );
  //
  //   return formView;
  // }

}