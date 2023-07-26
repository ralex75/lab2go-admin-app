import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import useUser from '../composables/user.composable'
import storage from '../composables/storage'

/*import SchoolIndex from '../components/school/SchoolIndex'
import CreateSchool from '@/components/school/SchoolCreate'
import EditSchool from '@/components/school/SchoolEdit'
import SchoolDetails from '@/components/school/SchoolDetails'
import StudentCreate from '@/components/students/StudentCreate'
import RequestEdit from '@/components/request/RequestEdit'
import storage from '@/composables/storage'
import userHelper from '@/composables/user.helper'*/

const routeGuard=(to, from, next)=>{
  
  let excludeRoutes=['login.index','signup.index','home.index']
  
  if(!excludeRoutes.some(r=>r==to.name))
  {
    let isAuthenticated= storage.get("session") ? true : false

    if(!isAuthenticated) 
    {
      return next('/login'); //go to '/login';
    }
  } 
 
  next(); //enter into the route
  
}


const {isAdmin}=useUser()


const routes = [
  {
    path: '/',
    name: 'home.index',
    component: HomeView,
    meta: {
      title: "Home Page",
      subtitle: "",
      description:"home page"
   },
  },
  {
    path:'/signup',
    name:'signup.index',
    component: ()=>import('@/components/Signup.vue'),
    meta: {
      title: "Registrazione",
      subtitle: "",
   },
  },
  {
    path:'/login',
    name:'login.index',
    component: ()=>import('@/components/Login.vue'),
    meta: {
      title: "Accedi",
      subtitle: "",
   },
  },
  {
    path:'/logout',
    name:'logout.index',
    component: ()=>import('@/components/Logout.vue') 
  },
  {
    path:'/accounts',
    name:'useraccount.index',
    component: ()=>import('@/components/UserAccount.vue'),
    meta: {
      title: "Lista account",
      subtitle: "",
   },
  },
  {
    path: '/requests',
    name: 'requests.index',
    component: ()=>import('@/components/request/RequestIndex.vue'),
    meta: {
     
        title: "Richieste",
        subtitle:"",
        description:"lista delle richieste"
     
    }
  },
  {
    path: '/requests/add',
    name: 'requests.add',
    component: ()=>import('@/components/request/user/RequestAdd.vue'),
    meta: {
     
        title: "Nuova Richiesta",
        subtitle:"",
        description:""
     
    }
  },
  
  { path: '/:pathMatch(.*)*', redirect: '/' },
  
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
   //{ component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue') }
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(routeGuard)



export default router
