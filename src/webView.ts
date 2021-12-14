import {
  ExtensionContext,
  ViewColumn,
  WebviewPanel,
  window,
  commands,
} from "vscode";
import * as vscode from "vscode";
const fs = require("fs-extra");
const path = require("path");

// 创建一个全局变量，类型为：WebviewPanel 或者 undefined
let webviewPanel: WebviewPanel | undefined;

// 写入git地址
const writeAddress = (path: any, data: any) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      // 没有文件就创建文件
      await fs.ensureFile(path);
      // 写入文件，设置写入文件格式
      await fs.writeJson(path, data, { spaces: 2 });

      resolve();
    } catch (err) {
      console.error("写入git地址失败");
      reject(err);
    }
  });
};

export function createWebView(
  context: ExtensionContext,
  viewColumn: ViewColumn, // 窗口编辑器
  label: string
) {
  if (webviewPanel === undefined || label !== webviewPanel.title) {
    webviewPanel = window.createWebviewPanel("webView", label, viewColumn, {
      retainContextWhenHidden: true, // 控制是否保持webview面板的内容（iframe），即使面板不再可见。
      enableScripts: true, // 下面的 html 页可以使用 Scripts
    });

    const resourcePath = path.join(
      context.extensionPath,
      "src",
      `./html/${label}.html`
    );

    const dirPath = path.dirname(resourcePath);

    const htmlPath = path.resolve(
      path.join(__filename, "..", "..", "src", "html", label + ".html")
    );

    let content = fs.readFileSync(htmlPath, "utf-8");

    content = content.replace(
      /(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g,
      (m: any, $1: any, $2: any) => {
        return (
          $1 +
          vscode.Uri.file(path.resolve(dirPath, $2))
            .with({ scheme: "vscode-resource" })
            .toString() +
          '"'
        );
      }
    );
    webviewPanel.webview.html = content;
    webviewPanel.webview.onDidReceiveMessage(
      (message) => {
        console.log("message", message);
        switch (message.command) {
          case "save":
            vscode.window.showErrorMessage(message.text);
            writeAddress("D:/vsceDownloud/gitHubAddress.json", {
              address: message.text,
            });
            return;
        }
      },
      undefined,
      context.subscriptions
    );
  } else {
    // 面板存在，重新设置标题
    webviewPanel.title = label;
    webviewPanel.reveal();
  }

  // 关闭面板
  webviewPanel.onDidDispose(() => {
    webviewPanel = undefined;
  });

  return webviewPanel;
}

module.exports = function (context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("itemClick", (label) => {
      // vscode.ViewColumn.Active: 表示当前选中的面板
      const webView = createWebView(context, vscode.ViewColumn.One, label);
      context.subscriptions.push(webView);
    })
  );
};
