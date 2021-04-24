import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    }
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', true)
      } else {
        Cookies.set('sidebarStatus', false)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    CLOSE_SIDEBAR: state => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
    },
    OPEN_SIDEBAR: state => {
      Cookies.set('sidebarStatus', 0)
      state.sidebar.opened = true
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }) {
      commit('CLOSE_SIDEBAR')
    },
    OpenSideBar({ commit }) {
      commit('OPEN_SIDEBAR')
    }
  }
}

export default app
