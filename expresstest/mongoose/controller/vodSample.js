"use strict";
// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
const vod20170321 = require("@alicloud/vod20170321");
const OpenApi = require("@alicloud/openapi-client");
const Util = require("@alicloud/tea-util");
const Credential = require("@alicloud/credentials");
const Tea = require("@alicloud/tea-typescript");

class Client {
  /**
   * 使用凭据初始化账号 Client
   * @return Client
   * @throws Exception
   */
  static createClient() {
    // 工程代码建议使用更安全的无 AK 方式，凭据配置方式请参见：https://help.aliyun.com/document_detail/378664.html。
    let credential = new Credential.default();
    let config = new OpenApi.Config({
      credential: credential,
    });
    // Endpoint 请参考 https://api.aliyun.com/product/vod
    config.endpoint = `vod.cn-beijing.aliyuncs.com`;
    return new vod20170321.default(config);
  }

  static async main(args) {
    let client = Client.createClient();
    let addAITemplateRequest = new vod20170321.AddAITemplateRequest({
      templateName: "your_value",
      templateType: "your_value",
    });
    try {
      let resp = await client.addAITemplateWithOptions(
        addAITemplateRequest,
        new Util.RuntimeOptions({}),
      );
      console.log(JSON.stringify(resp, null, 2));
    } catch (error) {
      // 此处仅做打印展示，请谨慎对待异常处理，在工程项目中切勿直接忽略异常。
      // 错误 message
      console.log(error.message);
      // 诊断地址
      console.log(error.data["Recommend"]);
    }
  }
}

exports.Client = Client;
Client.main(process.argv.slice(2));
