const AppContext = React.createContext(null);

const App = () => {
  const [appState, setAppState] = React.useState({
    user: { name: "Kitty", age: 2 },
  });

  const contextValue = { appState, setAppState };

  return (
    <AppContext.Provider value={contextValue}>
      <UserInfo></UserInfo>
      <UserModifier id="6789">children content</UserModifier>
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

const connect = (Component) => {
  const Wrapper = (props) => {
    const { appState, setAppState } = React.useContext(AppContext);

    const dispatch = (action) => {
      setAppState(reducer(appState, action));
    };
    return (
      <Component {...props} dispatch={dispatch} state={appState}></Component>
    );
  };
  return Wrapper;
};

const UserInfo = () => {
  const contextValue = React.useContext(AppContext);
  return <p>User: {contextValue.appState.user.name}</p>;
};

const UserModifier = connect(({ dispatch, state, id, children }) => {
  const onChange = (e) => {
    dispatch({
      type: "updateUser",
      payload: { name: e.target.value },
    });
  };
  return (
    <div>
      <p>{id}</p>
      <p>{children}</p>
      <input value={state.user.name} onChange={onChange}></input>
    </div>
  );
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
