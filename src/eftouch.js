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
    return [ EftouchEngine ];
  }

  static get pluginName() {
    return 'Eftouch';
  }

  init() {
    console.log("Eftouch plugin")
    const editor = this.editor;
    const doc = editor.document;
    const viewDocument = editor.editing.view;
    const schema = document.schema;
    const data = editor.data;
    const editing = editor.editing;
    const t = editor.t;

    // // Schema.
    // doc.schema.registerItem( 'eftouch', '$block' );
    // doc.schema.objects.add( 'eftouch' );
    // // doc.schema.registerItem( 'paragraph', '$block' );
    // // doc.schema.registerItem( 'inline', '$inline' );
    // doc.schema.objects.add( 'inline' );
    // doc.schema.registerItem( 'nested' );
    // doc.schema.limits.add( 'nested' );
    // doc.schema.allow( { name: '$inline', inside: 'nested' } );
    // doc.schema.allow( { name: 'nested', inside: 'eftouch' } );
    // doc.schema.registerItem( 'editable' );
    // doc.schema.allow( { name: '$inline', inside: 'editable' } );
    // doc.schema.allow( { name: 'editable', inside: 'eftouch' } );
    // doc.schema.allow( { name: 'editable', inside: '$root' } );
    //
    // // // Image feature.
    // // // doc.schema.registerItem( 'image' );
    // doc.schema.allow( { name: 'image', inside: '$root' } );
    // doc.schema.objects.add( 'image' );
    // //
    // // // Block-quote feature.
    // doc.schema.registerItem( 'blockQuote' );
    // doc.schema.allow( { name: 'blockQuote', inside: '$root' } );
    // doc.schema.allow( { name: '$block', inside: 'blockQuote' } );
    // //
    // // // Div element which helps nesting elements.
    // doc.schema.registerItem( 'div' );
    // doc.schema.allow( { name: 'div', inside: 'blockQuote' } );
    // doc.schema.allow( { name: 'div', inside: 'div' } );
    // doc.schema.allow( { name: 'paragraph', inside: 'div' } );
    //
    // buildModelConverter().for( editor.editing.modelToView )
    //   .fromElement( 'paragraph' )
    //   .toElement( 'p' );
    //
    // buildModelConverter().for( editor.editing.modelToView )
    //   .fromElement( 'eftouch' )
    //   .toElement( () => {
    //     const b = new AttributeContainer( 'b' );
    //     const div = new ViewContainer( 'div', null, b );
    //
    //     return toWidget( div, { label: 'element label' } );
    //   } );
    //
    // buildModelConverter().for( editor.editing.modelToView )
    //   .fromElement( 'inline' )
    //   .toElement( 'figure' );
    //
    // buildModelConverter().for( editor.editing.modelToView )
    //   .fromElement( 'nested' )
    //   .toElement( () => new ViewEditable( 'figcaption', { contenteditable: true } ) );
    //
    // buildModelConverter().for( editor.editing.modelToView )
    //   .fromElement( 'editable' )
    //   .toElement( () => new ViewEditable( 'figcaption', { contenteditable: true } ) );
    //
    // buildModelConverter().for( editor.editing.modelToView )
    //   .fromElement( 'image' )
    //   .toElement( 'img' );
    //
    // buildModelConverter().for( editor.editing.modelToView )
    //   .fromElement( 'blockQuote' )
    //   .toElement( 'blockquote' );
    //
    // buildModelConverter().for( editor.editing.modelToView )
    //   .fromElement( 'div' )
    //   .toElement( 'div' );

    this._addButton( 'insertEftouch', t( 'Eftouch' ), imageIcon );

    // Overwrite default Enter key behavior.
    // If Enter key is pressed with selection collapsed in empty list item, outdent it instead of breaking it.
    this.listenTo( this.editor.editing.view, 'enter', ( evt, data ) => {
      const doc = this.editor.document;
      const positionParent = doc.selection.getLastPosition().parent;

      if ( doc.selection.isCollapsed && positionParent.name == 'listItem' && positionParent.isEmpty ) {
        this.editor.execute( 'outdentList' );

        data.preventDefault();
        evt.stop();
      }
    } );

    // const getCommandExecuter = commandName => {
    //   return ( data, cancel ) => {
    //     const command = this.editor.commands.get( commandName );
    //
    //     if ( command.isEnabled ) {
    //       this.editor.execute( commandName );
    //       cancel();
    //     }
    //   };
    // };
    //
    // this.editor.keystrokes.set( 'Tab', getCommandExecuter( 'indentList' ) );
    // this.editor.keystrokes.set( 'Shift+Tab', getCommandExecuter( 'outdentList' ) );

    // editor.ui.componentFactory.add( 'insertEftouch', locale => {
    //   const view = new ButtonView( locale );
    //
    //   view.set( {
    //     label: 'EFTouch',
    //     icon: imageIcon,
    //     tooltip: true
    //   } );
    //
    //   view.on( 'execute', () => {
    //     const introSrc = prompt( 'Path to Intro mp3:' );
    //
    //     editor.document.enqueueChanges( () => {
    //
    //       // const imageElement = new ModelElement( 'image', {
    //       //   src: imageUrl
    //       // } );
    //       // editor.data.insertContent( imageElement, editor.document.selection );
    //
    //       const tangyElement = new ModelElement( 'eftouch', {
    //         introSrc: introSrc
    //       } );
    //       editor.data.insertContent( tangyElement, editor.document.selection );
    //
    //       let htmlText = Tangy.editor.getData();
    //       console.log("tangyElement: " + htmlText)
    //       console.log("tangyElement ")
    //
    //     } );
    //   } );
    //
    //   return view;
    // } );

    // editor.editing.view.addObserver( ClickObserver );
    //
    // /**
    //  * The form view displayed inside the balloon.
    //  *
    //  * @member {module:link/ui/linkformview~LinkFormView}
    //  */
    // this.formView = this._createForm();
    //
    // /**
    //  * The contextual balloon plugin instance.
    //  *
    //  * @private
    //  * @member {module:ui/panel/balloon/contextualballoon~ContextualBalloon}
    //  */
    // this._balloon = editor.plugins.get( ContextualBalloon );
    //
    // // Create toolbar buttons.
    // this._createToolbarLinkButton();
    //
    // // Attach lifecycle actions to the the balloon.
    // this._attachActions();
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