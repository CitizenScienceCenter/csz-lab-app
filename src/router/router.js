import VueRouter from 'vue-router';
import { routes } from './routes.js';
import store from '../store/index.js';
import { i18n } from '../i18n.js';

export const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

const publicRoutes = [
    'home', 'login', 'register', 'logout', 'discover', 'about', 'project', 'project.task.presenter', 'reset-password','recover-password'
  ]

router.beforeEach((to, from, next) => {
    
    console.log(to.params);
    console.log( 'navigate to: '+to.path );
    console.log('split:');

    document.title = to.meta.title || 'CS Project Builder';
    
    //const link = document.querySelector("[rel='icon']")
    //link.setAttribute('href',to.meta.icon)

    let filteredPath = to.path.split('/').filter(element => element.length > 0);
    console.log( filteredPath );

    //if( to.params.lang && to.params.lang.split('/')[0].length === 2 ) {
    if( filteredPath.length > 0 && filteredPath[0].length === 2 ) {
        console.log( 'url has language: '+ filteredPath[0]);
        let language = filteredPath[0];
        store.dispatch("settings/setLanguage", language);
        i18n.locale = language;
        console.log(i18n.locale);
   

        if (store.state.user.logged) {
            // user already logged (getAccountProfile already done) so he can access all the routes
            next()
        } else {
            // test if the user can be logged with his session if not already logged
            store.dispatch('user/getAccountProfile').then(() => {
            // can go next also if not logged and if the route is public
            if (store.state.user.logged || publicRoutes.includes(to.name)) {
                next()
            } else {
                // if the route needs to be logged the user is redirected
                store.commit('notification/showInfo', {
                title: 'Not authenticated',
                content: 'You must be logged to access this page'
                })
                from.name !== null ? next(false) : next({ name: 'login' })
            }
            }).catch(() => {
            next({ name: 'home' })
            })
        }

    } else{
        console.log('redirect to')
        console.log(to.fullPath)
        console.log( '/'+ i18n.locale + to.fullPath );
        next( '/'+ i18n.locale + to.fullPath );
    }


});
