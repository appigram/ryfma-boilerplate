import React, {
  createContext,
  useContext,
  useMemo,
  useState
} from 'react'

const DEFAULT_STATE = {
  currUser: null,
  currUserId: null,
  token: null,
  isPremium: false
}

function createContextValue ({ token, currUser, currUserId, isPremium, setState }) {
  return {
    token,
    currUser,
    currUserId,
    isPremium,
    signin: ({ token, currUser }) => setState({ token, currUser, currUserId: currUser._id, isPremium: currUser.roles.includes('premium') }),
    signout: () => setState({ token: null, currUser: null, currUserId: null, isPremium: false }),
    setCurrUser: (newCurrUser) => setState({ token, currUser: newCurrUser, currUserId, isPremium })
  }
}

const AuthContext = createContext(
  createContextValue({
    ...DEFAULT_STATE,
    setState: () =>
      console.error('You are using AuthContext without AuthProvider!')
  }),
)

export function useAuth () {
  return useContext(AuthContext)
}

export function AuthProvider ({ context, children }) {
  // console.log('authContext: ', context)
  const [state, setState] = useState(context || DEFAULT_STATE)

  const contextValue = useMemo(() => {
    const { token, currUser, currUserId, isPremium } = state
    return createContextValue({ token, currUser, currUserId, isPremium, setState })
  }, [state, setState])

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

/* function usePersistedAuth(defaultState) {
  const [state, setStateRaw] = useState(() => getStorageState(defaultState))

  const setState = useCallback(newState => {
    setStateRaw(newState)
    setStorageState(newState)
  }, [])

  return [state, setState]
}

function getStorageState(defaultState) {
  if (!store) {
    return defaultState
  }

  const rawDataToken = store.getItem(LOCAL_STORAGE_AUTH_TOKEN)
  if (!rawDataToken) {
    return defaultState
  }

  const rawDataUser = store.getItem(LOCAL_STORAGE_AUTH_USER)

  try {
    const token = rawDataToken
    const currUser = JSON.parse(rawDataUser)

    if (token && currUser && currUser.username) {
      const isPremium = currUser.roles.includes('premium')
      const currUserId = currUser._id
      return { token, currUser, currUserId, isPremium }
    }
  } catch {}

  return defaultState
}

function setStorageState(newState) {
  if (!store) {
    return
  }

  store.setItem(LOCAL_STORAGE_AUTH_TOKEN, newState.token)
  store.setItem(LOCAL_STORAGE_AUTH_USER, JSON.stringify(newState.currUser))
} */
