const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://127.0.0.1:27017");

// 封装一个函数，用于获取指定数据库的指定集合
const collection = async function (dbname, collectionname) {
  //链接数据库
  await client.connect();

  //use database
  let db = client.db(dbname);

  //use collection
  let collection = db.collection(collectionname);
  return collection;
};

// 对collection进行增删改查
async function test() {
  let col = await collection("gftst", "col1");

  //插入数据
  let insertResult = await col.insertMany([
    { name: "六一", age: 1.4, city: "天津" },
    { name: "小五", age: 2, city: "北京" },
  ]);
  console.log("插入结果:", insertResult);

  //删除数据
  let deleteResult = await col.deleteMany({ name: "点点" });
  console.log("删除结果:", deleteResult);

  //更新数据
  let updateResult = await col.updateMany(
    { name: "小五" },
    { $set: { age: 1.1 } },
  );
  console.log("更新结果:", updateResult);

  //查询数据 findOne()
  let findOneResult = await col.findOne({ name: "六一" });
  console.log("findOne结果:", findOneResult);

  //查询数据 find()
  let findResult = await col.find({}).toArray();
  console.log("find结果:", findResult);

  //关闭连接
  await client.close();
}

test();
