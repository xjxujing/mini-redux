const AppContext = React.createContext(null);

const store = {
  state: undefined,
  reducer: undefined,
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

const createStore = (reducer, initState) => {
  store.state = initState;
  store.reducer = reducer;
  return store;
};

const connect = (selector, dispatchSelector) => (Component) => {
  const Wrapper = (props) => {
    const { state, setState } = store;
    // 这里只会在初始化的时候打印
    // console.log("outside: ", store.state.user.name);

    const dispatch = (action) => {
      setState(store.reducer(state, action));
    };

    const [, update] = React.useState({});

    const data = selector ? selector(state) : { state };

    const dispatcher = dispatchSelector
      ? dispatchSelector(dispatch)
      : { dispatch };

    React.useEffect(() => {
      const unsubscribe = store.subscribe(() => {
        // 这里直接用 state, 页面不会更新，需要用 store 里面最新的 state 值
        // useEffect 在第一次渲染之后和每次更新之后都会执行
        // console.log("inside", store.state.user.name);
        const newData = selector
          ? selector(store.state)
          : { state: store.state };

        // console.log("data: ", data);
        // console.log("newData: ", newData);
        if (!deepEqual(data, newData)) {
          update({});
        }
      });
      return unsubscribe;
    }, []);

    return <Component {...props} {...data} {...dispatcher}></Component>;
  };
  return Wrapper;
};

const deepEqual = (x, y) => {
  if (x === y) {
    return true;
  } else if (
    typeof x == "object" &&
    x != null &&
    typeof y == "object" &&
    y != null
  ) {
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false;
    }
    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) return false;
      } else {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
};

const Provider = ({ store, children }) => {
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};
