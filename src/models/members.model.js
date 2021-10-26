// members-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'members';
  const mongooseClient = app.get('mongooseClient');
  const { Schema, Types } = mongooseClient;
  const schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique : true},
    phone: { type: String},
    region: {type: Types.ObjectId, ref: 'regions'},
    comment: { type: String},
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
