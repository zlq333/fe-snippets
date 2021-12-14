import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("插件启动-----------", context.globalStoragePath);

  // gitHub 下载
  require("./gitHubClone")(context);

  // treeView
  require("./viewContainer")(context);

  // webView
  require("./webView")(context);
}
