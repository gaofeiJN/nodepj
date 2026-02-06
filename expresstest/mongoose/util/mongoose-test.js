const mongoose = require("mongoose");
const { User, Video, Subscribe } = require("../model/index");

// 【注意】默认情况下，只有对文档实例进行赋值操作才会触发Schema中定义的setter函数！！！
// 【注意】Model.update()、Model.updateOne()、Model.updateMany()、Model.findOneAndUpdate()等方法
//       直接更新数据库，绕过了mongoose的文档中间件，因此默认情况下，这些方法不会触发setter函数
async function updateUser() {
  var user = await User.findOne({ name: "gao fei" });
  user.channelId = 54321;
  user = await user.save();
  console.log(user);
}

// updateUser();

async function updateUsers() {
  var users = await User.find();
  //   console.log(users);

  for (let user of users) {
    user.channelId = 1234567;
    let newUser = await user.save();
    console.log(newUser);
  }
}

// updateUsers();

// Schema中指定了ref参数的path，其指向对应Model的_id字段
async function findSubscribe() {
  const subs = await Subscribe.find().populate(
    ["userId", "channelId"],
    "_id name age",
  );
  console.log(subs);
}

findSubscribe();

// 可以进行多级populate
// const person = await Person.findOne({ name: "gao fei" }).populate({
//   path: "city",
//   populate: {
//     path: "province",
//     populate: {
//       path: "country",
//     },
//   },
// });
