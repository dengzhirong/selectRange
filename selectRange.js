/**
* 光标位置组件
* ## selectRange对象的方法：
*   （1）selectRange.of(ele)   [创建光标位置获取的新对象]
           参数：
                ele  {{JavaScript DOM}}  光标所在的元素，原生JavaScript DOM

*   （2）selectRange.getCurPos()   [获取当前坐标位置]

*   （3）selectRange.setCurPos(pos)   [设置当前光标位置]
           参数：
                pos  {{Int}}  当前光标位置

*   （4）selectRange.getSelectText()   [获取选中文字]

*   （5）selectRange.setSelectText(startPos, endPos)   [选中特定范围的文本（只限于textarea和input）]
*           参数：
                startPos  {{Int}}  起始位置
                endPos  {{Int}}  终点位置

*   （6）selectRange.insertAfterText(value)   [在光标后插入文本]
*           参数：
                value  {{String}}  要插入的文本
* 
*
* ## 使用实例：
*       selectRange.of(EleDom).getCurPos(); // 获取当前坐标位置
*       selectRange.of(EleDom).setCurPos(pos); // 设置当前光标位置为pos
*       selectRange.of(EleDom).getSelectText(); // 获取选中文字
*       selectRange.of(EleDom).setSelectText(startPos, endPos); // 选中startPos到endPos范围的文本
*       selectRange.of(EleDom).insertAfterText(value); // 在光标后插入值为value的文本
*/

var selectRange = function(ele){
    this.__element = ele;
};
// 创建光标位置获取的新对象
selectRange.of = function(ele){
    if(ele) {
        return new selectRange(ele);
    } else {
        return {};
    }
};

selectRange.prototype = {
    constructor:selectRange,
    // 获取当前坐标位置
    getCurPos: function() {
        var _this = this,
            textDom = _this.__element;
        // 获取光标位置
        var cursorPos = 0;
        if (document.selection) {
            // IE Support
            textDom.focus();
            var selectRange = document.selection.createRange();
            selectRange.moveStart ('character', -textDom.value.length);
            cursorPos = selectRange.text.length;
        }else if (textDom.selectionStart || textDom.selectionStart == '0') {
            // Firefox support
            cursorPos = textDom.selectionStart;
        }
        return cursorPos;
    },

    /**
    * 设置当前光标位置
    * 参数：
    *     pos  [Int]  当前光标位置
    */
    setCurPos: function(pos) {
        var _this = this,
            textDom = _this.__element;
        if(textDom.setSelectionRange) {
            // IE Support
            textDom.focus();
            textDom.setSelectionRange(pos, pos);
        }else if (textDom.createTextRange) {
            // Firefox support
            var range = textDom.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    },

    // 获取选中文字
    getSelectText: function() {
        var _this = this,
            textDom = _this.__element,
            userSelection,
            text = "";
        if (window.getSelection) {
            // Firefox support
            userSelection = window.getSelection();
        } else if (document.selection) {
            // IE Support
            userSelection = document.selection.createRange();
        }
        if (!(text = userSelection.text)) {
            text = userSelection;
        }
        return text;
    },

    /**
    * 选中特定范围的文本（只限于textarea和input）
    * 参数：
    *     startPos  [Int]  起始位置
    *     endPos  [Int]  终点位置
    */
    setSelectText: function(startPos, endPos) {
        var _this = this,
            textDom = _this.__element,
            startPos = parseInt(startPos),
            endPos = parseInt(endPos),
            textLength = textDom.value.length;
        if(textLength){
            if(!startPos){
                startPos = 0;
            }
            if(!endPos){
                endPos = textLength;
            }
            if(startPos > textLength){
                startPos = textLength;
            }
            if(endPos > textLength){
                endPos = textLength;
            }
            if(startPos < 0){
                startPos = textLength + startPos;
            }
            if(endPos < 0){
                endPos = textLength + endPos;
            }
            if(textDom.createTextRange){
                // IE Support
                var range = textDom.createTextRange();
                range.moveStart("character",-textLength);
                range.moveEnd("character",-textLength);
                range.moveStart("character", startPos);
                range.moveEnd("character",endPos);
                range.select();
            }else{
                // Firefox support
                textDom.setSelectionRange(startPos, endPos);
                textDom.focus();
            }
        }
    },

    /**
    * 在光标后插入文本
    * 参数：
    *     value  [String]  要插入的文本
    */
    insertAfterText: function(value) {
        var _this = this,
            textDom = _this.__element,
            selectRange;
        if (document.selection) {
            // IE Support
            textDom.focus();
            selectRange = document.selection.createRange();
            selectRange.text = value;
            textDom.focus();
        }else if (textDom.selectionStart || textDom.selectionStart == '0') {
            // Firefox support
            var startPos = textDom.selectionStart;
            var endPos = textDom.selectionEnd;
            var scrollTop = textDom.scrollTop;
            textDom.value = textDom.value.substring(0, startPos) + value + textDom.value.substring(endPos, textDom.value.length);
            textDom.focus();
            textDom.selectionStart = startPos + value.length;
            textDom.selectionEnd = startPos + value.length;
            textDom.scrollTop = scrollTop;
        }
        else {
            textDom.value += value;
            textDom.focus();
        }
    }
};