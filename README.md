理想流程：

- 添加 git 项目
- 配置 webhooks
- 选择 node 编译环境(Provide Node & npm bin/ folder to PATH)
- 编译成功推送生产服务起(Provide Node & npm bin/ folder to PATH)
- 钉钉通知状态
- 账号权限管理(Role-based Authorization Strategy)

## 一、安装 docker 环境

略

## 二、使用

```bash
# 启动
sh start.sh
# 关闭
sh stop.sh
```

## 三、 环境配置

- 域名配置
  修改 nginx/conf.d 中的 server_name

- 授权 volumns 文件夹（chown -R 1000:1000 jenkins/jenkins_home）

- jenkins 安装 访问 http://${server_name}

- 复制密钥

```bash
# 启动服务之后，通过配置的域名进入jenkins登录页面
# 查看登录密钥、也可以进入容器内部查看
docker service logs halohear_jenkins --tail 1000
```

- 设置凭证
  Jenkins -> 凭据 -> 系统 -> 全局凭据 (unrestricted) -> （选择对应类型添加凭证）

- 安装 NodeJS （node 环境）
  插件管理 -> 搜索安装 ->
  系统设置 -> 全局工具设置 -> NODEJS（选择对应版本安装）

- 安装 Publish over SSH（推送编译代码到生产服务器）
  插件管理 -> 搜索安装 ->
  系统管理 -> 系统设置 -> 设置 ssh 地址

- 安装 钉钉通知 插件
  插件管理 -> 搜索安装

- 安装 gitee（gitee webhooks）
  插件管理 -> 搜索安装

- 安装 Role-based Authorization Strategy（管理权限）【添加角色 -> 项目分配角色 -> 添加试图】[参考](https://blog.51cto.com/wzlinux/2160778)
  插件管理 -> 搜索安装 ->
  系统管理 -> 全局安全配置 -> 选中 Role-Based Strategy ->
  系统设置 —> Manage and Assign Roles -> 添加角色（Manage Roles）-> 分配角色(Assign Roles) ->
  视图管理 -> 添加视图(管理)

## 四、 配置项目

- 源码管理（选择 git、Credentials 关联凭证）
- 配置 gitee webhooks
- 选择 node 环境变量（Provide Node & npm bin/ folder to PATH）
- build 之后提送代码到生产服务器（Send files or execute commands over SSH after the build runs）
- 构建后操作（选择钉钉通知、添加自定义群机器人【可先建群，然后踢人，变成个人机器人助手】）
- 配置执行者数量(默认 2)：系统设置 -> 管理结点 -> -> 配置节点 -> 执行者数量

## 五、node 项目代码回滚

- 参数化构建过程

选项参数

```bash
# 名称
Status
# 选项
Deploy
RollBack
# Deploy: 发布
# ----------------
# RollBack: 回滚
```

字符参数

```
# 名称
Version

```

- 执行 shell

```
node -v
echo "Status:$Status"

path="${WORKSPACE}/bak"

case $Status  in
  Deploy)
    if [ -d $path ];
    then
        echo "The files is already  exists "
    else
        mkdir -p $path
    fi
    cd ${WORKSPACE}
    npm i
    npm run build
    cd dist
    tar -zcvf ../bak/${JOB_NAME}-${BUILD_NUMBER}.tar.gz *
    find $path  -mtime 10 -name "*.tar.gz"  -exec rm -rf {} \;
    echo "Completin!"
    ;;
  RollBack)
    echo "Version:$Version"
    cd ${WORKSPACE}/bak
    cp -R `ls $path | grep $Version`  ${JOB_NAME}-${BUILD_NUMBER}.tar.gz   ##复制为最新版本构建号
    ;;
  *)
  exit
      ;;
esac

```

- SSH Publishers

```bash
# Source files
bak/${JOB_NAME}-${BUILD_NUMBER}.tar.gz
# Remove prefix
bak/
# Remote directory
temp/
# Exec command
cd /***/temp/
tar -zxvf ${JOB_NAME}-${BUILD_NUMBER}.tar.gz
```

## 六、 问题

- jenkinsci/blueocean:lts 无法使用 nodeJS Plugins
  错误信息: `/tmp/jenkins642042413779803421.sh: line 4: node: not found`

```bash
# 进入容器内部安装nodejs
apk add --no-cache nodejs
# 或者更换版本jenkins/jenkins:lts
```
