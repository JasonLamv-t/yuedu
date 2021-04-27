// 云函数入口文件
const cloud = require('wx-server-sdk')
const tencentcloud = require("tencentcloud-sdk-nodejs");


const NlpClient = tencentcloud.nlp.v20190408.Client;
const models = tencentcloud.nlp.v20190408.Models;

const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

let cred = new Credential("AKIDh6E4dw6MK2WjxvH4EEyWnmUv4xlIHjW2", "OVLozyg7LIyNedPu73i6D9oGSN1OaWUF");
let httpProfile = new HttpProfile();
httpProfile.endpoint = "nlp.tencentcloudapi.com";
let clientProfile = new ClientProfile();
clientProfile.httpProfile = httpProfile;
let client = new NlpClient(cred, "ap-guangzhou", clientProfile);

let req = new models.KeywordsExtractionRequest();




cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // let params = '{\"Text\":\"测试\"}'
  let params = JSON.stringify({ Text: event.Text })
  req.from_json_string(params);

  var res = new Promise((resolve, resject) => {
    client.KeywordsExtraction(req, function (errMsg, response) {
      if (errMsg == null) resolve(response.to_json_string())
      else resject(errMsg)
    })
  })

  return res.then(res => {
    console.log(res)
    return (res)
  })
}