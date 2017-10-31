/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module list/listcommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import Position from '@ckeditor/ckeditor5-engine/src/model/position';
import first from '@ckeditor/ckeditor5-utils/src/first';

/**
 * The list command. It is used by the {@link module:list/list~List list feature}.
 *
 * @extends module:core/command~Command
 */
export default class ListCommand extends Command {
  /**
   * Creates an instance of the command.
   *
   * @param {module:core/editor/editor~Editor} editor The editor instance.
   * @param {'numbered'|'bulleted'} type List type that will be handled by this command.
   */
  constructor( editor, type ) {
    super( editor );

    /**
     * The type of the list created by the command.
     *
     * @readonly
     * @member {'numbered'|'bulleted'}
     */
    this.type = type == 'bulleted' ? 'bulleted' : 'numbered';

    /**
     * A flag indicating whether the command is active, which means that the selection starts in a list of the same type.
     *
     * @observable
     * @readonly
     * @member {Boolean} #value
     */
  }

  /**
   * @inheritDoc
   */
  refresh() {
    this.value = this._getValue();
    this.isEnabled = this._checkEnabled();
  }

  /**
   * Executes the command.
   *
   * @protected
   * @param {Object} [options] Options for the executed command.
   * @param {module:engine/model/batch~Batch} [options.batch] A batch to collect all the change steps.
   * A new batch will be created if this option is not set.
   */
  execute( options = {} ) {
    console.log("create that thing, hippie.")
    const imageUrl = prompt( 'Image URL' );
    const document = this.editor.document;
    const blocks = Array.from( document.selection.getSelectedBlocks() )
      .filter( block => checkCanBecomeListItem( block, document.schema ) );

    // Whether we are turning off some items.
    const turnOff = this.value === true;
    // If we are turning off items, we are going to rename them to paragraphs.

    document.enqueueChanges( () => {
      const batch = options.batch || document.batch();

      // For each block element that was in the selection, we will either: turn it to list item,
      // turn it to paragraph, or change it's type. Or leave it as it is.
      // Do it in reverse as there might be multiple blocks (same as with changing indents).
      for ( const element of blocks.reverse() ) {
        if ( turnOff && element.name == 'listItem' ) {
          // We are turning off and the element is a `listItem` - it should be converted to `paragraph`.
          // List item specific attributes are removed by post fixer.
          batch.rename( element, 'paragraph' );
        } else if ( !turnOff && element.name != 'listItem' ) {
          // We are turning on and the element is not a `listItem` - it should be converted to `listItem`.
          // The order of operations is important to keep model in correct state.
          // batch.setAttribute( element, 'type', this.type ).setAttribute( element, 'indent', 0 ).rename( element, 'listItem' );
          batch.setAttribute( element, 'type', this.type ).setAttribute( element, 'indent', 0 ).setAttribute( element, 'imageUrl', imageUrl ).rename( element, 'listItem' );
        } else if ( !turnOff && element.name == 'listItem' && element.getAttribute( 'type' ) != this.type ) {
          // We are turning on and the element is a `listItem` but has different type - change it's type and
          // type of it's all siblings that have same indent.
          batch.setAttribute( element, 'type', this.type );
        }
      }
    } );
  }

  /**
   * Checks the command's {@link #value}.
   *
   * @private
   * @returns {Boolean} The current value.
   */
  _getValue() {
    // Check whether closest `listItem` ancestor of the position has a correct type.
    const listItem = first( this.editor.document.selection.getSelectedBlocks() );

    return !!listItem && listItem.is( 'listItem' ) && listItem.getAttribute( 'type' ) == this.type;
  }

  /**
   * Checks whether the command can be enabled in the current context.
   *
   * @private
   * @returns {Boolean} Whether the command should be enabled.
   */
  _checkEnabled() {
    // If command value is true it means that we are in list item, so the command should be enabled.
    if ( this.value ) {
      return true;
    }

    const selection = this.editor.document.selection;
    const schema = this.editor.document.schema;

    const firstBlock = first( selection.getSelectedBlocks() );

    if ( !firstBlock ) {
      return false;
    }

    // Otherwise, check if list item can be inserted at the position start.
    return checkCanBecomeListItem( firstBlock, schema );
  }
}


// Checks whether the given block can be replaced by a listItem.
//
// @private
// @param {module:engine/model/element~Element} block A block to be tested.
// @param {module:engine/model/schema~Schema} schema The schema of the document.
// @returns {Boolean}
function checkCanBecomeListItem( block, schema ) {
  return schema.check( {
    name: 'listItem',
    attributes: [ 'type', 'indent' ],
    inside: Position.createBefore( block )
  } );
}