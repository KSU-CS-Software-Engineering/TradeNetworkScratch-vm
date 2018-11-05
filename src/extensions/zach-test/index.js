const formatMessage = require('format-message');
const nets = require('nets');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const MathUtil = require('../../util/math-util');
const Clone = require('../../util/clone');
const log = require('../../util/log');

/**
 * Icon svg to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjIgKDY3MTQ1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5FeHRlbnNpb25zL1NvZnR3YXJlL1RleHQtdG8tU3BlZWNoLU1lbnU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iRXh0ZW5zaW9ucy9Tb2Z0d2FyZS9UZXh0LXRvLVNwZWVjaC1NZW51IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0idGV4dDJzcGVlY2giIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIuMDAwMDAwLCAyLjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik01Ljc1LDguODM0NjcxNzMgQzUuNzUsOC4zMjY5NjM0NCA1LjAwMzAwNzI3LDguMDQyMjEzNzEgNC41NTYyODAxMiw4LjQ0NDE0OTk5IEwzLjIwNjI4MDEyLDkuNTI1MzU3MDIgQzIuNjk2NzMzNzgsOS45MzM0NDk2OCAyLjAzNzQ4Njc1LDEwLjE2NTg3ODggMS4zNSwxMC4xNjU4Nzg4IEwxLjE1LDEwLjE2NTg3ODggQzAuNjMyNTk2MTY1LDEwLjE2NTg3ODggMC4yNSwxMC41MTA2MDAyIDAuMjUsMTAuOTUyMDM1NSBMMC4yNSwxMy4wNjkzOTkzIEMwLjI1LDEzLjUxMDgzNDYgMC42MzI1OTYxNjUsMTMuODU1NTU2IDEuMTUsMTMuODU1NTU2IEwxLjM1LDEzLjg1NTU1NiBDMi4wNzg3Nzg0MSwxMy44NTU1NTYgMi43MjY4NjE2MSwxNC4wNjY3NjM2IDMuMjU5ODYwNDksMTQuNDk5IEw0LjU1OTIwMTQ3LDE1LjU3OTY2MDggQzUuMDEzMDkyNzYsMTUuOTU0NTM5NiA1Ljc1LDE1LjY3MzYzNDQgNS43NSwxNS4xNDE3MTI4IEw1Ljc1LDguODM0NjcxNzMgWiIgaWQ9InNwZWFrZXIiIHN0cm9rZS1vcGFjaXR5PSIwLjE1IiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSIjNEQ0RDREIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC43MDQ4MzEzLDggQzkuNzkwNjc0NjgsOS4xMzExNDg0NyA4LjMwNjYxODQsOS43MTQyODU3MSA3LjgzMzMzMzMzLDkuNzE0Mjg1NzEgQzcuODMzMzMzMzMsOS43MTQyODU3MSA3LjUsOS43MTQyODU3MSA3LjUsOS4zODA5NTIzOCBDNy41LDkuMDg1MjI2ODQgOC4wNjIyMDE2OCw4LjkwMTk0MTY0IDguMTg5MDYwNjcsNy41Njc1NDA1OCBDNi44ODk5Njk5MSw2LjkwNjc5MDA1IDYsNS41NTczMjY4MyA2LDQgQzYsMS43OTA4NjEgNy43OTA4NjEsNC4wNTgxMjI1MWUtMTYgMTAsMCBMMTIsMCBDMTQuMjA5MTM5LC00LjA1ODEyMjUxZS0xNiAxNiwxLjc5MDg2MSAxNiw0IEMxNiw2LjIwOTEzOSAxNC4yMDkxMzksOCAxMiw4IEwxMC43MDQ4MzEzLDggWiIgaWQ9InNwZWVjaCIgZmlsbD0iIzBFQkQ4QyI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjIgKDY3MTQ1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5FeHRlbnNpb25zL1NvZnR3YXJlL1RleHQtdG8tU3BlZWNoLUJsb2NrPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IkV4dGVuc2lvbnMvU29mdHdhcmUvVGV4dC10by1TcGVlY2gtQmxvY2siIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1vcGFjaXR5PSIwLjE1Ij4KICAgICAgICA8ZyBpZD0idGV4dDJzcGVlY2giIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQuMDAwMDAwLCA0LjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSIjMDAwMDAwIj4KICAgICAgICAgICAgPHBhdGggZD0iTTExLjUsMTcuNjY5MzQzNSBDMTEuNSwxNi42NTM5MjY5IDEwLjAwNjAxNDUsMTYuMDg0NDI3NCA5LjExMjU2MDI0LDE2Ljg4ODMgTDYuNDEyNTYwMjQsMTkuMDUwNzE0IEM1LjM5MzQ2NzU1LDE5Ljg2Njg5OTQgNC4wNzQ5NzM1MSwyMC4zMzE3NTc1IDIuNywyMC4zMzE3NTc1IEwyLjMsMjAuMzMxNzU3NSBDMS4yNjUxOTIzMywyMC4zMzE3NTc1IDAuNSwyMS4wMjEyMDAzIDAuNSwyMS45MDQwNzEgTDAuNSwyNi4xMzg3OTg2IEMwLjUsMjcuMDIxNjY5MyAxLjI2NTE5MjMzLDI3LjcxMTExMiAyLjMsMjcuNzExMTEyIEwyLjcsMjcuNzExMTEyIEM0LjE1NzU1NjgyLDI3LjcxMTExMiA1LjQ1MzcyMzIyLDI4LjEzMzUyNzEgNi41MTk3MjA5OCwyOC45OTggTDkuMTE4NDAyOTMsMzEuMTU5MzIxNiBDMTAuMDI2MTg1NSwzMS45MDkwNzkzIDExLjUsMzEuMzQ3MjY4OSAxMS41LDMwLjI4MzQyNTUgTDExLjUsMTcuNjY5MzQzNSBaIiBpZD0ic3BlYWtlciIgZmlsbD0iIzRENEQ0RCI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNMjEuNjQzNjA2NiwxNi41IEMxOS45NzcwMDk5LDE4LjQzNzAyMzQgMTcuMTA1MDI3NSwxOS45Mjg1NzE0IDE1LjY2NjY2NjcsMTkuOTI4NTcxNCBDMTUuNTEyNjM5NywxOS45Mjg1NzE0IDE1LjMxNjYyOTIsMTkuODk1OTAzIDE1LjEwOTcyNjUsMTkuNzkyNDUxNyBDMTQuNzM3NjAzOSwxOS42MDYzOTA0IDE0LjUsMTkuMjQ5OTg0NiAxNC41LDE4Ljc2MTkwNDggQzE0LjUsMTguNjU2ODA0MSAxNC41MTcwNTU1LDE4LjU1NDUwNzYgMTQuNTQ5NDQ2NywxOC40NTQwODQ0IEMxNC42MjU3NTQ1LDE4LjIxNzUwNjMgMTUuMTczNTcyMSwxNy40Njc1MzEgMTUuMjc3MjA3MSwxNy4yODA5ODgxIEMxNS41NDYzNTI2LDE2Ljc5NjUyNjEgMTUuNzM5MDI1LDE2LjIwNjM1NjEgMTUuODQzMjg5MSwxNS40MTYwMDM0IEMxMy4xODk3MDA1LDEzLjkyNjgzNjkgMTEuNSwxMS4xMTM5NjY4IDExLjUsOCBDMTEuNSwzLjMwNTU3OTYzIDE1LjMwNTU3OTYsLTAuNSAyMCwtMC41IEwyNCwtMC41IEMyOC42OTQ0MjA0LC0wLjUgMzIuNSwzLjMwNTU3OTYzIDMyLjUsOCBDMzIuNSwxMi42OTQ0MjA0IDI4LjY5NDQyMDQsMTYuNSAyNCwxNi41IEwyMS42NDM2MDY2LDE2LjUgWiIgaWQ9InNwZWVjaCIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';

/**
 * An id for one of the voices.
 */
const GOOD_ID = 'GOOD';

/**
 * An id for one of the voices. -
 */
const BAD_ID = 'BAD';

/**
 * An id for one of the voices.
 */
const NORMAL_ID = 'NORMAL';

/**
 * Class for the text2speech blocks.
 * @constructor
 */
class ZachTestBlocks {

    constructor (runtime) {
        this.runtime = runtime;
        this.currentStatus = NORMAL_ID;
    }

    get MENU_INFO () {
        return {
            [GOOD_ID]: {
                name: formatMessage({
                    id: 'test.good',
                    default: 'good',
                    description: 'Name for good.'
                })
            },
            [BAD_ID]: {
                name: formatMessage({
                    id: 'test.bad',
                    default: 'bad',
                    description: 'Name for bad.'
                })
            },
            [NORMAL_ID]: {
                name: formatMessage({
                    id: 'test.normal',
                    default: 'normal',
                    description: 'Name for normal.'
                })
            }
        };
    }

    get DEFAULT_INFO (){
        return 'normal';
    }

    /**
     * The key to load & store a target's text2speech state.
     * @return {string} The key.
     */
    static get STATE_KEY () {
        return 'Scratch.text2speech';
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'test',
            name: 'Test',
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [
                {
                    opcode: 'setStatus',
                    text: formatMessage({
                        id: 'test.setStatus',
                        default: 'Set status to [STATUS]',
                        description: 'Set the status.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        STATUS: {
                            type: ArgumentType.STRING,
                            menu: 'menu',
                            defaultValue: this.DEFAULT_INFO
                        }
                    }
                },
                {
                    opcode: 'getStatus',
                    text: 'Status',
                    blockType: BlockType.REPORTER
                }
            ],
            menus: {
                menu: this.getMenu()
            }
        };
    }

    setStatus (args){
        const status = args.STATUS;
        this.currentStatus = status;
    }

    getStatus (){
        return this.currentStatus;
    }
    /**
     * Get the menu of voices for the "set voice" block.
     * @return {array} the text and value for each menu item.
     */
    getMenu () {
        return Object.keys(this.MENU_INFO).map(menuID => ({
            text: this.MENU_INFO[menuID].name,
            value: menuID
        }));
    }
}
module.exports = ZachTestBlocks;
