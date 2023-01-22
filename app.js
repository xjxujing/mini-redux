const AppContext = React.createContext(null);

const store = {
  state: {
    user: { name: "Kitty", age: 2 },
  },
  setState(newState) {
    store.state = newState;
    // setState 会调用 fn ( 也就是 connect 里面传的 update ）
    store.listeners.map((fn) => fn(store.state));
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn);
    return () => {
      const index = store.listeners.findIndex(fn);
      store.listeners.splice(index, 1);
    };
  },
};

const App = () => {
  return (
    <AppContext.Provider value={store}>
      <Temp1></Temp1>
      <Temp2></Temp2>
      <Temp3></Temp3>
      <Temp4></Temp4>
    </AppContext.Provider>
  );
};

const reducer = (oldState, { type, payload }) => {
  if (type === "updateUser") {
    const newState = {
      ...oldState,
      user: {
        ...oldState.user,
        ...payload,
      },
    };
    return newState;
  } else {
    return state;
  }
};

const connect = (Component) => {
  const Wrapper = (props) => {
    // store 也可以从 context 里面拿
    const { state, setState } = React.useContext(AppContext);

    const [, update] = React.useState({});
    React.useEffect(() => {
      store.subscribe(() => {
        console.log("update");
        update({});
      });
    }, []);

    const dispatch = (action) => {
      setState(reducer(state, action));
    };
    return <Component {...props} dispatch={dispatch} state={state}></Component>;
  };
  return Wrapper;
};

const UserInfo = connect(({ state }) => {
  console.log("render UserInfo");
  return <p>User: {state.user.name}</p>;
});

const UserInfo2 = connect(({ state }) => {
  console.log("render UserInfo2");
  return <p>User: {state.user.age}</p>;
});

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

const UserModifier2 = connect(({ dispatch, state, id, children }) => {
  const onChange = (e) => {
    dispatch({
      type: "updateUser",
      payload: { age: e.target.value },
    });
  };

  console.log("render UserModifier2");
  return (
    <div>
      <p>{id}</p>
      <p>{children}</p>
      <input value={state.user.age} onChange={onChange}></input>
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

// 注意 state 变化，Temp3 和 Temp4 依然会渲染
const Temp3 = () => {
  console.log("render Temp3");
  return (
    <section>
      <p>Temp3 UserModifier2:</p>
      <UserModifier2></UserModifier2>
    </section>
  );
};

const Temp4 = () => {
  console.log("render Temp4");
  return (
    <section>
      <p>Temp4 UserInfo2</p>
      <UserInfo2></UserInfo2>
    </section>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
