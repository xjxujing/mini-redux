const AppContext = React.createContext(null);

const App = () => {
  const [appState, setAppState] = React.useState({
    user: { name: "Kitty", age: 2 },
  });

  const contextValue = { appState, setAppState };

  return (
    <AppContext.Provider value={contextValue}>
      <UserInfo></UserInfo>
      <UserModifier></UserModifier>
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

const dispatch = (action) => {
  // 提取组件 UserModifier 中的 onChange 中的 setSate 到 dispatch 中
  // 这时候拿不到 setAppState 和 appState
  setAppState(reducer(appState, action));
};

const UserInfo = () => {
  const contextValue = React.useContext(AppContext);
  return <p>User: {contextValue.appState.user.name}</p>;
};

const UserModifier = () => {
  const contextValue = React.useContext(AppContext);

  const { appState, setAppState } = contextValue;

  const onChange = (e) => {
    dispatch({
      type: "updateUser",
      payload: { name: e.target.value },
    });
  };
  return (
    <input value={contextValue.appState.user.name} onChange={onChange}></input>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
