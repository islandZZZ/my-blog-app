/**
 * 使用方法：node git 进度更新
 * 效果： git commit -am "Update: 进度更新"
 */
const { spawn } = require("child_process");

// 检查命令行参数是否提供
if (process.argv.length < 3) {
  console.log('Usage: node git.js "<commit message>"');
  process.exit(1);
}

// 获取提交信息
const commitMessage = "Update: " + process.argv.slice(2).join(' ');
// 定义要执行的 Git 命令
const commands = [["add", "."], ["commit", "-am", commitMessage], ["push"]];


// 执行 Git 命令的函数
const runCommand = (command, args, callback) => {
  const cmd = spawn(command, args);

  cmd.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);/*  */
  });

  cmd.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  cmd.on("close", (code) => {
    if (code !== 0) {
      console.error(`Command failed with code ${code}`);
      process.exit(code);
    } else {
      callback();
    }
  });
};

// 递归执行 Git 命令
const runCommandsRecursively = (index) => {
  if (index < commands.length) {
    const [...args] = commands[index];
    runCommand("git", args, () => runCommandsRecursively(index + 1));
  }
};

// 开始执行 Git 命令
runCommandsRecursively(0);
