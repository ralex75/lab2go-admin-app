import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import useUser from '../composables/user.composable'
import storage from '../composables/storage'

const routeGuard=(to, from, next)=>{
  
  //let excludeRoutes=['login.index','signup.index','home.index']
  
  /*if(!excludeRoutes.some(r=>r==to.name))
  {
    let isAuthenticated= storage.get("session") ? true : false

    if(!isAuthenticated) 
    {
      return next('/login'); //go to '/login';
    }
  } */

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
  /*{
    path:'/accounts',
    name:'useraccount.index',
    component: ()=>import('@/components/UserAccount.vue'),
    meta: {
        page:{
        title: "Lista account",
        subtitle: "",
      },
      roles:['docente']
   },
   
  },*/
  {
    path: '/requests',
    name: 'requests.index',
    component: ()=>import('@/components/request/RequestIndex.vue'),
    meta: {
        page:{
          name:"Richieste",
          title: "Richieste",
          subtitle:"",
          description:"lista delle richieste"
        },
        roles:["docente"]

     
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
