import Ember from 'ember';

const tokenCookieName = 'jwt-token';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  cookies: Ember.inject.service(),
  store: Ember.inject.service(),
  token: null,
  user: null,
  clearCookie(name) {
    return this.get('cookies').write(name, '', { expires: new Date('1970-01-01'), path: '/' });
  },
  init() {
    this._super(...arguments);
    var c = this.get('cookies');
    this.set('token', c.read(tokenCookieName));
    this.refreshUser();
  },
  refreshUser() {
    var token = this.get('token');
    if (token) {
      return this.get('ajax').request('/api/verify', {
        data: { token: token }
      }).then(user => {
        this.set('user', user);
      }).catch(() => {
        this.set('user', null);
      });
    }
  },
  login(email, password) {
    return this.get('ajax').post('/api/authenticate', {
      data: {
        email: email,
        password: password
      }
    }).then(info => {
      this.set('token', info.token);
      this.get('cookies').write(tokenCookieName, info.token, { path: '/' });
      this.refreshUser();
    });
  },
  logout() {
    this.set('token', null);
    this.clearCookie(tokenCookieName);
    this.refreshUser();
  }
});
