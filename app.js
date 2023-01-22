const AppContext = React.createContext(null);

// 2 state 和 setState 移到了外面
const store = {
  state: {
    user: { name: "Kitty", age: 2 },
  },
  setState(newState) {
    // 4 打印可以看到状态已经发生了变化，但是页面没有更新
    console.log(newState);
    store.state = newState;
  },
};

const App = () => {
  // 1 把 setAppState 移出去
  // const [appState, setAppState] = React.useState({
  //   user: { name: "Kitty", age: 2 },
  // });

  // const contextValue = { appState, setAppState };

  return (
    <AppContext.Provider value={store}>
      <Temp1></Temp1>
      <Temp2></Temp2>
      <Temp3></Temp3>
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
    // 3 修改相应名字，依然是从 context 中拿到的状态
    const { state, setState } = React.useContext(AppContext);

    const dispatch = (action) => {
      setState(reducer(state, action));
    };
    return <Component {...props} dispatch={dispatch} state={state}></Component>;
  };
  return Wrapper;
};

const UserInfo = () => {
  console.log("render UserInfo");

  // 3 修改相应名字，依然是从 context 中拿到的状态
  const { state } = React.useContext(AppContext);
  return <p>User: {state.user.name}</p>;
};

const UserModifier = connect(({ dispatch, state, id, children }) => {
  const onChange = (e) => {
    dispatch({
      type: "updateUser",
      payload: { name: e.target.value },
    });
  };

  console.log("render UserModifier");
  return (
    <div>
      <p>{id}</p>
      <p>{children}</p>
      <input value={state.user.name} onChange={onChange}></input>
    </div>
  );
});

const Temp1 = () => {
  console.log("render Temp1");

  return (
    <section>
      Temp1 UserInfo:
      <UserInfo></UserInfo>
    </section>
  );
};

const Temp2 = () => {
  console.log("render Temp2");
  return (
    <section>
      Temp2 UserModifier:
      <UserModifier id="this is id from UserModifier's props">
        this is children content from UserModifier's props
      </UserModifier>
    </section>
  );
};
const Temp3 = () => {
  console.log("render Temp3");
  return (
    <section>
      <p>Temp3</p>
    </section>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
