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
                },
                {
                    opcode: 'getCount',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'graph.getCount',
                        default: 'Graph Count',
                        description: 'Gets the number of items stored in the graph'
                    })
                },
                {
                    opcode: 'getAll',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'graph.getAll',
                        default: 'Graph Nodes',
                        description: 'Gets a list of all nodes stored in the graph'
                    })
                },
                {
                    opcode: 'connectedTo',
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: 'graph.connectedTo',
                        default: 'Is there an edge between [NODE1] and [NODE2]',
                        description: 'Checks to see if two nodes are connected'
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
                    opcode: 'allFrom',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'graph.allFrom',
                        default: 'Get the number of edges originating from [NODE]',
                        description: 'Retrieves the number of edges originating from a node'
                    }),
                    arguments: {
                        NODE: {
                            type: ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'getNodeByIndex',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'graph.getNodeByIndex',
                        default: 'Get node by index [INDEX]',
                        description: 'Retrieves a node using an index value'
                    }),
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER
                        }
                    }
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

    getCount () {
        return Object.keys(this._graph).length;
    }

    getAll () {
        return Object.keys(this._graph).join(', ');
    }

    connectedTo (args) {
        if (this._graph[args.NODE1]) {
            let node = this._graph[args.NODE1];
            while (node && node.data !== args.NODE2) {
                node = node.next;
            }
            if (node) {
                return true;
            }
        }
        return false;
    }

    allFrom (args) {
        let count = 0;
        let node = this._graph[args.NODE];
        while (node) {
            count++;
            node = node.next;
        }
        return count;
    }

    getNodeByIndex (args) {
        const graphArray = Object.keys(this._graph);
        return graphArray[args.INDEX];
    }

}

module.exports = Scratch3Graph;
