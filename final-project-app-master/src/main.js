import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import PasswordChange from "./components/auth/PasswordChange";
import PasswordReset from "./components/auth/PasswordReset";
import Profile from "./components/fragmnets/profile/Profile";
import Invites from "./components/fragmnets/invites/Invites";
import MyProjects from "./components/fragmnets/project/MyProjects";
import WorkingProjects from "./components/fragmnets/project/WorkingProjects";
// import ProjectStatistics from "./components/fragmnets/project_info/Project";
import Chat from "./components/fragmnets/chat/Chat";
import Tool from "./components/fragmnets/tool/Tool";
import RequestsAutomation from "./components/fragmnets/automation/RequestsAutomation";
import ProjectLog from "./components/fragmnets/log/ProjectLog";
import FrontEndDev from "./components/fragmnets/front_end_dev/FrontEndDev";
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css' //Vuesax styles

import 'material-icons/iconfont/material-icons.css';
import Commit from "./components/fragmnets/commit/Commit";
import Version from "./components/fragmnets/version/Version";
import Home from "./components/fragmnets/home/Home";
import Collaborators from "./components/fragmnets/collaboration/Collaborators";
import Dashboard from "./components/fragmnets/dashboard/Dashboard";
import Project from "./components/fragmnets/project_info/Project";
import VueCircle from 'vue2-circle-progress'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

import VueTimeago from 'vue-timeago'
// import timeline from 'vue-cute-timeline'
import VueHorizontalTimeline from "vue-horizontal-timeline";


import JsonViewer from 'vue-json-viewer'


import Auth_store from './stores/app_store'
import vuex from 'vuex'
import {UserSession} from "./services/users_session_services";
import 'vue-select/dist/vue-select.css';
import { VLazyImagePlugin } from "v-lazy-image";
import VueVideoPlayer from 'vue-video-player'

// require videojs style
import 'video.js/dist/video-js.css'
// import 'vue-video-player/src/custom-theme.css'


// Import JsonViewer as a Vue.js plugin

Vue.config.productionTip = false


// Vue.use(vSelect)

Vue.use(VueRouter);
Vue.use(VueCircle)


Vue.use(vSelect)
Vue.use(Vuelidate)
Vue.use(VLazyImagePlugin);

Vue.use(VueVideoPlayer, /* {
  options: global default options,
  events: global videojs events
} */)

// Vue.use(timeline)
Vue.use(Vuesax, {
    theme: {
        colors: {
            primary: '#00B8D4',
            success: '#00B8D4',
            danger: 'rgb(242, 19, 93)',
            warning: 'rgb(255, 130, 0)',
            dark: 'rgb(36, 33, 69)'
        }
    }
})
Vue.use(JsonViewer)
Vue.use(VueTimeago, {
    name: 'Timeago', // Component name, `Timeago` by default
    locale: 'en', // Default locale
    // We use `date-fns` under the hood
    // So you can use all locales from it
    locales: {
        'zh-CN': require('date-fns/locale/zh_cn'),
        ja: require('date-fns/locale/ja')
    }
})
Vue.use(VueHorizontalTimeline);

const store = new vuex.Store(Auth_store)


const routes = [
    {

        path: '/project/:p_id/admin/', component: Project, meta: {
            requiresAuth: true
        }, children: [
            {
                path: 'chat', component: Chat, meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'log', component: ProjectLog, meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'versions', component: Version, meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'commits', component: Commit, meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'collaborator', component: Collaborators, meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'dashboard', component: Dashboard, meta: {
                    requiresAuth: true
                }
            },
        ]
    },
    {

        path: '/project/:p_id/tester/', component: Project, meta: {
            requiresAuth: true
        }, children: [
            {
                path: 'chat', component: Chat, meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'testing_tool', component: Tool, meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'requests_automation', component: RequestsAutomation, meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'versions', component: Version, meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'commits', component: Commit, meta: {
                    requiresAuth: true
                }
            },

        ]
    },
    {

        path: '/project/:p_id/front_end_dev/', component: Project, meta: {
            requiresAuth: true
        }, children: [
            {
                path: 'chat', component: Chat, meta: {
                    requiresAuth: true
                }
            },

            {
                path: 'versions', component: Version, meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'commits', component: Commit, meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'front_dev', component: FrontEndDev, meta: {
                    requiresAuth: true
                }
            },
        ]
    },


    {
        path: '/my_projects', component: MyProjects, meta: {
            requiresAuth: true
        }
    },
    {
        path: '/working_project', component: WorkingProjects, meta: {
            requiresAuth: true
        }
    },
    {path: '/sign_up', component: SignUp},
    {
        path: '/', component: Home, meta: {
            requiresAuth: true
        }
    },

    {
        path: '/profile', component: Profile, meta: {
            requiresAuth: true
        }
    },
    {
        path: '/invites', component: Invites, meta: {
            requiresAuth: true
        }
    },
    {path: '/sign_in', component: SignIn},
    {path: '/password_change', component: PasswordChange},
    {path: '/password_reset', component: PasswordReset},
];

const router = new VueRouter({routes, linkActiveClass: "active",})


router.beforeEach(((to, from, next) => {
    const requireAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requireAuth) {
        if (UserSession.isAuth()) {
            next()
        } else {
            next('/sign_in')

        }
    } else {

        if (UserSession.isAuth()) {
            next('/')
        } else {

            next()

        }
    }
}));


const vm = new Vue({
    router, store,
    render: h => h(App),
}).$mount('#app')


export {vm}
