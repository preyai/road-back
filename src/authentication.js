const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');

class AuthServiceWithPermissions extends AuthenticationService {
  async getPayload(authResult, params) {
    const payload = await super.getPayload(authResult, params);
    const { user } = authResult;

    if (user && user.roles) {
      payload.permissions = user.roles;
    }

    return payload;
  }
}


module.exports = app => {
  const authentication = new AuthServiceWithPermissions(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
