const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

// eslint-disable-next-line max-len
const blockIconURI = 'https://unixtitan.net/images/dictionary-clipart-svg.png';

class LinkedListNode {
    constructor (data, weight = 0) {
        this.data = data;
        this.weight = weight;
        this.next = null;
    }
}

class Scratch3Graph {
    constructor () {
        this._graph = {}; // gonna be dictionary of linked list nodes
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'graph',
            name: formatMessage({
                id: 'graph.categoryname',
                default: 'Graph',
                description: 'Label for the graph extension category'
            }),
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'insertNode',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'graph.insertNode',
                        default: 'Add node [NODE] to the graph',
                        description: 'Adds a node to the graph'
                    }),
                    arguments: {
                        NODE: {
                            type: ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'insertEdge',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'graph.insertEdge',
                        default: 'Add edge from [NODE1] to [NODE2] with weight [WEIGHT]',
                        description: 'adds an edge with the specified end points and weight'
                    }),
                    arguments: {
                        NODE1: {
                            type: ArgumentType.STRING
                        },
                        NODE2: {
                            type: ArgumentType.STRING
                        },
                        WEIGHT: {
                            type: ArgumentType.NUMBER
                        }
                    }
                },
                {
                    opcode: 'getEdgeWeight',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'graph.getEdgeWeight',
                        default: 'Get weight of edge between [NODE1] and [NODE2]',
                        description: 'Reports the edge weight of an edge between specified nodes'
                    }),
                    arguments: {
                        NODE1: {
                            type: ArgumentType.STRING
                        },
                        NODE2: {
                            type: ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'clearGraph',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'graph.clearGraph',
                        default: 'Cear the graph',
                        description: 'Clears the graph'
                    })
                }
            ]
        };
    }

    _addEdge (node1, node2, weight) {
        const node = new LinkedListNode(node2, weight);
        node.next = this._graph[node1].next;
        this._graph[node1].next = node; // the ol' switcheroo
    }

    insertNode (args) {
        this._graph[args.NODE] = new LinkedListNode(args.NODE); // lil bit o' repetitive data but...
    }

    insertEdge (args) {
        if (this._graph[args.NODE1] && this._graph[args.NODE2]) {
            this._addEdge(args.NODE1, args.NODE2, args.WEIGHT);
            this._addEdge(args.NODE2, args.NODE1, args.WEIGHT);
        }
    }

    getEdgeWeight (args) {
        if (this._graph[args.NODE1] && this._graph[args.NODE2]) {
            let node = this._graph[args.NODE1];
            while (node && node.data !== args.NODE2) {// loop until correct node is found or nothing is
                node = node.next;
            }
            if (node) {
                return node.weight;
            }
        }
        return null;
    }

    clearGraph () {
        this._graph = [];
    }

}

module.exports = Scratch3Graph;
