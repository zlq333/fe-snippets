import {
  TreeItem,
  TreeItemCollapsibleState,
  TreeDataProvider,
  Uri,
  window,
} from "vscode";
import * as vscode from "vscode";
import { join } from "path";

// 创建每一项 label 对应的图片名称
const ITEM_ICON_MAP = new Map<string, string>([
  ["feValidator", "pig_1.svg"],
  ["componentLibrary", "pig_2.svg"],
  ["indexOf", "pig_3.svg"],
  ["gitAddressSet", "pig_3.svg"],
]);

// 第一步：创建单项的节点(item)的类
export class TreeItemNode extends TreeItem {
  constructor(
    // readonly 只可读
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }

  // command: 为每项添加点击事件的命令
  command = {
    title: this.label, // 标题
    command: "itemClick", // 命令 ID
    tooltip: this.label, // 鼠标覆盖时的小小提示框
    arguments: [
      // 向 registerCommand 传递的参数。
      this.label, // 目前这里我们只传递一个 label
    ],
  };

  // iconPath： 为该项的图标因为我们是通过上面的 Map 获取的，所以我额外写了一个方法，放在下面
  iconPath = TreeItemNode.getIconUriForLabel(this.label);

  // __filename：当前文件的路径
  static getIconUriForLabel(label: string): Uri {
    return Uri.file(
      join(
        __filename,
        "..",
        "..",
        "src",
        "images",
        ITEM_ICON_MAP.get(label) + ""
      )
    );
  }
}

export class TreeViewProvider implements TreeDataProvider<TreeItemNode> {
  // 获取树视图中的每一项 item,所以要返回 element
  getTreeItem(element: TreeItemNode): TreeItem | Thenable<TreeItem> {
    return element;
  }

  // 给每一项都创建一个 TreeItemNode
  getChildren(
    element?: TreeItemNode | undefined
  ): import("vscode").ProviderResult<TreeItemNode[]> {
    console.log("TreeItemNode", TreeItemNode);
    return ["feValidator", "componentLibrary", "indexOf", "gitAddressSet"].map(
      (item) =>
        new TreeItemNode(
          item as string,
          TreeItemCollapsibleState.None as TreeItemCollapsibleState
        )
    );
  }
}

module.exports = function (context: vscode.ExtensionContext) {
  const treeViewProvider = new TreeViewProvider();
  window.registerTreeDataProvider("pig-1", treeViewProvider);
};
