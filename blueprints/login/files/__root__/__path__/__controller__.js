import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  email: '',
  password: '',
  actions: {
    login() {
      this.get('session')
        .login(this.get('email'), this.get('password'))
        .then(() => {
          this.transitionToRoute('bracket')
        }, err => {
          this.set('error', err)
        })
    }
  }
});
