const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

// eslint-disable-next-line max-len
const blockIconURI = 'https://unixtitan.net/images/dictionary-clipart-svg.png';


class Scratch3Dictionary {
    static get EXTENSION_ID() {
        return 'dictionray';
    }

    constructor() {

        this._dictionary = {};
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'dictionary',
            name: formatMessage({
                id: 'dictionary.categoryName',
                default: 'Dictionary',
                description: 'Label for the dictionary extension category'
            }),
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'insert',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'dictionary.insert',
                        default: 'Add [KEY], [VALUE] to the dictionary',
                        description: 'Inserts a key value pair into the dictionary'
                    }),
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING
                        },
                        VALUE: {
                            type: ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'lookUp',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'dictionary.lookUp',
                        default: 'Look up value with key [KEY]',
                        description: 'reports a dictionary entry'
                    }),
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'clearDictionary',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'dictionary.clear',
                        default: 'Clear the dictionary',
                        description: 'clears the dictionary'
                    })
                },
				{
					opcode: 'getDictCount',
					blockType: BlockType.REPORTER,
					text: formatMessage({
						id: 'dictionary.getCount',
						default: 'Dictionary count',
						description: 'Gets the number of key value paiirs in the dictionary'
					})
				}
            ]
        };
    }

    insert (args) {
        this._dictionary[args.KEY] = args.VALUE;
    }

    lookUp (args) {
        if (this._dictionary[args.KEY]) {
            return this._dictionary[args.KEY];
        }
    }

    clearDictionary () {
        this._dictionary = {};
	}
	
	getDictCount () {
		return Object.keys(this._dictionary).length;
	}
}

module.exports = Scratch3Dictionary;
