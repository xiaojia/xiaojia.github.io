/*
 * diff-list
 *
 * name: xiaojia
 * date: 16/3/23
 */

Simple.Module({
    name: 'simple:core/template/virtual-dom/diff/list'
}, function (require, module, exports) {

    "use strict";

    var utils = require('../utils/main');
    var patch = require('../patch/main');

    var diff = function (oldList, newList) {

        var oldMap = makeKeyIndexAndFree(oldList);
        var newMap = makeKeyIndexAndFree(newList);

        var newFree = newMap.free;

        var oldKeyIndex = oldMap.keyIndex;
        var newKeyIndex = newMap.keyIndex;

        var moves = [];

        var children = [];
        var i = 0;
        var item;
        var itemKey;
        var freeIndex = 0;
        var simulateListItem;

        while (i < oldList.length) {

            item = oldList[i];
            itemKey = utils.getItemKey(item);

            if (itemKey) {
                if (!newKeyIndex.hasOwnProperty(itemKey)) {
                    children.push(null);
                } else {
                    var newItemIndex = newKeyIndex[itemKey];
                    children.push(newList[newItemIndex]);
                }
            } else {
                var freeItem = newFree[freeIndex++];
                children.push(freeItem || null);
            }

            i++;

        }

        var simulateList = children.slice(0);

        i = 0;

        while (i < simulateList.length) {
            simulateListItem = simulateList[i];
            if (simulateListItem === null) {
                remove(i);
                removeSimulate(i);
            } else {
                i++;
            }
        }

        var j = i = 0;

        while (i < newList.length) {

            item = newList[i];
            itemKey = utils.getItemKey(item);

            var simulateItem = simulateList[j];
            var simulateItemKey = utils.getItemKey(simulateItem);

            if (simulateItem) {
                if (itemKey === simulateItemKey) {
                    j++;
                } else {
                    if (!oldKeyIndex.hasOwnProperty(itemKey)) {
                        insert(i, item);
                    } else {
                        var nextItemKey = utils.getItemKey(simulateList[j + 1]);
                        if (nextItemKey === itemKey) {
                            remove(i, item);
                            removeSimulate(j);
                            j++;
                        } else {
                            insert(i, item);
                        }
                    }
                }
            } else {
                insert(i, item);
            }

            i++;

        }

        function remove(index, item) {
            var move = {index: index, item: item, type: patch.REMOVE};
            moves.push(move);
        }

        function insert(index, item) {
            var move = {index: index, item: item, type: patch.INSERT};
            moves.push(move);
        }

        function removeSimulate(index) {
            simulateList.splice(index, 1);
        }

        return {
            moves: moves,
            children: children
        }

    };

    var makeKeyIndexAndFree = function (list) {
        var keyIndex = {};
        var free = [];
        for (var i = 0, len = list.length; i < len; i++) {
            var item = list[i];
            var itemKey = utils.getItemKey(item);
            if (itemKey) {
                keyIndex[itemKey] = i;
            } else {
                free.push(item);
            }
        }
        return {
            keyIndex: keyIndex,
            free: free
        }
    };

    exports.makeKeyIndexAndFree = makeKeyIndexAndFree;
    exports.diff = diff;

});