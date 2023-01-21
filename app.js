const AppContext = React.createContext(null);

const App = () => {
  const [appState, setAppState] = React.useState({
    user: { name: "Kitty", age: 2 },
  });

  const contextValue = { appState, setAppState };

  return (
    <AppContext.Provider value={contextValue}>
      <UserInfo></UserInfo>
      <Wrapper></Wrapper>
    </AppContext.Provider>
  );
};

const reducer = (oldState, { type, payload }) => {
  if (type === "updateUser") {
    return {
      ...oldState,
      user: {
        ...oldState.user,
        ...payload,
      },
    };
  } else {
    return state;
  }
};

const Wrapper = () => {
  const { appState, setAppState } = React.useContext(AppContext);

  const dispatch = (action) => {
    // 借助 Wrapper，在 Wrapper 里面使用 useContext 拿到 state 和 setSate
    setAppState(reducer(appState, action));
  };

  // dispatch 和 state 通过 props 传递
  return <UserModifier dispatch={dispatch} state={appState}></UserModifier>;
};

const UserInfo = () => {
  const contextValue = React.useContext(AppContext);
  return <p>User: {contextValue.appState.user.name}</p>;
};

const UserModifier = ({ dispatch, state }) => {
  const onChange = (e) => {
    dispatch({
      type: "updateUser",
      payload: { name: e.target.value },
    });
  };
  return <input value={state.user.name} onChange={onChange}></input>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
