const downloadGitRepo = require("download-git-repo");
const fs = require("fs-extra");
import * as vscode from "vscode";

const getGitAddress = async () => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      let data = await fs.readJson("D:/vsceDownloud/gitHubAddress.json");
      if (data) {
        resolve(data);
      } else {
        resolve("");
      }
    } catch (err) {
      // 出错了
      console.log("获取git信息出错", err);
      resolve("");
    }
  });
};

module.exports = function (context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.gitHubClone",
    async (uri) => {
      if (uri) {
        const fileName = uri.path.substr(uri.path.lastIndexOf("/") + 1);
        const path = uri.path;
        const arr = path.split(":/");
        const space = arr[0].split("/")[1].toUpperCase();
        const filePath = `${space}:/${arr[1]}`;
        console.log("filePath", filePath);

        const data = await getGitAddress();
        let gitUrl = data.address;
        console.log("gitUrl", gitUrl);
        gitUrl = gitUrl ? gitUrl : "github:zlq333/gitclonedemo#main";

        fs.stat(filePath, (err: any, data: any) => {
          if (err) {
            vscode.window.showErrorMessage("判断失败", err);
            return;
          }
          if (data.isFile()) {
            downloadGitRepo(gitUrl, "D:/vsceDownloud", (err: any) => {
              vscode.window.showErrorMessage(err ? err : "success");
              fs.readdir("D:/vsceDownloud", (err: any, fileList: any) => {
                if (err) {
                  vscode.window.showErrorMessage("读取文件列表失败", err);
                }
                vscode.window.showErrorMessage(fileList);
                let flag = false;
                fileList.forEach((item: any) => {
                  if (item == fileName) {
                    flag = true;
                  }
                });
                let name = flag
                  ? `D:/vsceDownloud/${fileName}`
                  : `D:/vsceDownloud/${fileList[0]}`;
                fs.readFile(name, (err: any, content: any) => {
                  if (err) {
                    vscode.window.showErrorMessage("读取文件内容失败", err);
                    return;
                  }
                  fs.writeFile(filePath, content, (err: any) => {
                    if (err) {
                      vscode.window.showErrorMessage("写入失败", err);
                      return;
                    }
                  });
                });
              });
            });
          } else {
            console.log("2---", data.isDirectory());
            if (data.isDirectory()) {
              downloadGitRepo(gitUrl, filePath, (err: any) => {
                console.log(err ? err : "success---");
              });
            }
          }
        });
      } else {
        vscode.window.showInformationMessage("当前路径是：空");
      }
    }
  );

  context.subscriptions.push(disposable);
};
