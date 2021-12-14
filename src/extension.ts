import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("插件启动-----------", context.globalStoragePath);

  const disposable = vscode.commands.registerCommand(
    "extension.openWebView",
    () => {
      vscode.window.showInformationMessage("Hello World!");
    }
  );

  context.subscriptions.push(disposable);

  // gitHub 下载
  require("./gitHubClone")(context);

  // treeView
  require("./viewContainer")(context);

  // webView
  require("./webView")(context);
}
