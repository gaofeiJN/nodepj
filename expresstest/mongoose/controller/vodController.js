"use strict";
// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
const vod20170321 = require("@alicloud/vod20170321");
const OpenApi = require("@alicloud/openapi-client");
const Util = require("@alicloud/tea-util");
const Credential = require("@alicloud/credentials");
const Tea = require("@alicloud/tea-typescript");

const util = require("util");

// 创建客户端实例
let client;

try {
  // 工程代码建议使用更安全的无 AK 方式，凭据配置方式请参见：https://help.aliyun.com/document_detail/378664.html。
  let credential = new Credential.default();
  let config = new OpenApi.Config({
    credential: credential,
  });

  // Endpoint 请参考 https://api.aliyun.com/product/vod
  config.endpoint = `vod.cn-shanghai.aliyuncs.com`;

  // 创建client
  /**
   * 使用凭据初始化账号 Client
   * @return Client
   * @throws Exception
   */
  client = new vod20170321.default(config);
} catch (error) {
  console.log(error);
  client = null;
}

exports.CreateUploadVideo = async function (req, res, next) {
  console.log(req.query);

  if (!client) {
    return res.status(500).json({ error: "无法连接到阿里云点播服务器" });
  }

  // 上传视频的信息
  const { title, filename } = req.query;
  // console.log(`title : ${title}; filename : ${filename}`);

  const alireq = new vod20170321.CreateUploadVideoRequest({
    title: title,
    fileName: filename,
  });
  let runtime = new Util.RuntimeOptions({});
  // console.log(util.inspect(alireq, true));

  try {
    const alires = await client.createUploadVideo(alireq);
    // const alires = await client.createUploadVideoWithOptions(
    //   alireq,
    //   runtime,
    // );
    req.alires = alires;
    console.log(JSON.stringify(alires, null, 1));
    next();
  } catch (error) {
    // 错误 message
    console.log(error);
    // API返回
    return res.status(500).json({ error: "无法从阿里云点播获得上传权限" });
  }
};

exports.RefreshUploadVideo = async function (req, res, next) {
  console.log(req.query);

  if (!client) {
    return res.status(500).json({ error: "无法连接到阿里云点播服务器" });
  }

  // 上传视频的信息
  const { title, filename, videoId } = req.query;
  // console.log(`title : ${title}; filename : ${filename}`);

  const alireq = new vod20170321.RefreshUploadVideoRequest({
    title: title,
    fileName: filename,
    videoId: videoId,
  });
  let runtime = new Util.RuntimeOptions({});
  // console.log(util.inspect(alireq, true));

  try {
    const alires = await client.refreshUploadVideo(alireq);
    // const alires = await client.refreshUploadVideoWithOptions(
    //   alireq,
    //   runtime,
    // );
    req.alires = alires;
    console.log(JSON.stringify(alires, null, 1));
    next();
  } catch (error) {
    // 错误 message
    console.log(error);
    // API返回
    return res.status(500).json({ error: "无法从阿里云点播刷新上传权限" });
  }
};
