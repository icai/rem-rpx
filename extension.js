// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var convert = require('./convert');

var actionmap = {
  'px': {
    cmd: 'remrpx.convert',
    remto: convert.remtopx,
    torem: convert.pxtorem,
  },
  'rpx': {
    cmd: 'remrpx.convertr',
    remto: convert.remtorpx,
    torem: convert.rpxtorem
  }
}

var useAc = function(name, action) {
  return actionmap[name][action];
}


const hasBlock = function(text) {
  return text.includes('{') && text.includes('}')
}

const wrapBlock = function(text) {
  return '.OO___OO{'+ text + '}'
}

const filterBlock = function(isfilter, text) {
  if(isfilter) {
    return text
      .replace(/\.OO___OO\s*\{\n/, '')
      .replace(/(\n)*\}(\n)*/, '');
  } else {
    return text;
  }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  ['px', 'rpx'].forEach((item) => {
    var disposable = vscode.commands.registerTextEditorCommand(useAc(item, 'cmd'), function (textEditor, textEditorEdit) {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const config = vscode.workspace.getConfiguration('remrpx');
      const selection = textEditor.selection;
      let text = textEditor.document.getText(selection);
      const isPX = text.includes(item);
      const isREM = text.includes('rem');
      let hasblock = hasBlock(text);
      if(!hasblock) {
        text = wrapBlock(text);
      }
      if (isPX) {
        const newText = filterBlock(!hasblock, useAc(item, 'torem')(text, {size: config.get('remEqual')}));
        textEditorEdit.replace(selection, newText);
      } else if (isREM) {
        const newText = filterBlock(!hasblock, useAc(item, 'remto')(text, {size: config.get('remEqual')}));
        textEditorEdit.replace(selection, newText);
      }
    });
    context.subscriptions.push(disposable);
  })
}
exports.activate = activate;
function deactivate() {

}
exports.deactivate = deactivate;