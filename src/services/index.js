const users = require('./users/users.service.js');
const members = require('./members/members.service.js');
const regions = require('./regions/regions.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(members);
  app.configure(regions);
};
