import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import useUser from '../composables/user.composable'
import storage from '../composables/storage'
import roles from '../roles'

const routeGuard=(to, from, next)=>{
  
 
  let user=storage.get("session")
  let routeRoles=to.meta.roles || []
  const allowAccess = routeRoles.length==0 || (user && routeRoles.some(r=>user.role.toLowerCase().indexOf(r)>-1))
  if(!allowAccess){
    return next('/login'); //go to '/login';
  }
 
  next(); //enter into the route
  
}



const routes = [
  {
    path: '/',
    name: 'home.index',
    component: HomeView,
    meta: {
      page:{
        name:"Home",
        title: "Home Page",
        subtitle: "",
        description:"home page"
      },
      
   },
  },
  {
    path:'/signup',
    name:'signup.index',
    component: ()=>import('@/components/account/Signup.vue'),
    meta: {
      page:{
        name:"Registrati",
        title: "Registrazione",
        subtitle: "",
      }

   },
  },
  {
    path:'/login',
    name:'login.index',
    component: ()=>import('@/components/account/Signin.vue'),
    meta: {
      page:{
        name:"Accedi",
        title: "Accedi",
        subtitle: "",
      }
   },
  },
  {
    path:'/logout',
    name:'logout.index',
    component: ()=>import('@/components/account/Signout.vue'),
    meta: {
      page:{
        name:"Logout",
      },
      
   },
  },
  {
    path: '/school',
    name: 'school.index',
    component: ()=>import('@/components/school/SchoolIndex.vue'),
    meta: {
       page:{
        name: "Scuole",
        title: "",
        subtitle:"",
        description:""
       },
       roles:[roles.DOCENTE,roles.ADMIN]
    }
  },
  {
    path:'/accounts',
    name:'useraccount.index',
    component: ()=>import('@/components/UserAccount.vue'),
    meta: {
        page:{
        name:"Accounts",
        title: "Lista account",
        subtitle: "",
      },
      roles:[roles.DOCENTE,roles.ADMIN]
   },
   
  },
  {
    path: '/requests',
    name: 'requests.index',
    component: ()=>import('@/components/Requests.vue'),
    meta: {
        page:{
          name:"Richieste",
          title: "Richieste",
          subtitle:"",
          description:"lista delle richieste"
        },
        roles:[roles.DOCENTE,roles.ADMIN]
    }
  },
  /*{
    path: '/requests/add',
    name: 'requests.add',
    component: ()=>import('@/components/request/user/RequestAdd.vue'),
    meta: {
     
        title: "Nuova Richiesta",
        subtitle:"",
        description:""
     
    }
  },*/
  
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
