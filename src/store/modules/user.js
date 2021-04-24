import { login} from '@/api/user'
import { getToken, setToken, removeToken} from '@/utils/store'

const user = {
  state: {
    token: getToken(),
    user: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },

  actions: {
    
  }
}

export default user
