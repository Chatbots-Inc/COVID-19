import firebase from 'firebase';
import Vue from 'vue';
import Router from 'vue-router';

// eslint-disable-next-line import/extensions
import Home from '@/views/Home';
// eslint-disable-next-line import/extensions
import Login from '@/views/Login';
// eslint-disable-next-line import/extensions
import SignUp from '@/views/SignUp';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/login',
    },
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Login',
      }
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
      meta: {
        title: 'Sign Up',
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true,
        title: 'Home',
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { currentUser } = firebase.auth();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  document.title = to.meta.title + ' | Chatbot' || 'Chatbot';

  if (requiresAuth && !currentUser) next('login');
  else if (!requiresAuth && currentUser) next('home');
  else next();
});

export default router;
