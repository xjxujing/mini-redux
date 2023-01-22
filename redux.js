const AppContext = React.createContext(null);

const store = {
  state: {
    user: { name: "Kitty", age: "2" },
    group: "前端",
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

const connect = (selector) => (Component) => {
  const Wrapper = (props) => {
    const { state, setState } = store;

    const [, update] = React.useState({});
    const data = selector ? selector(state) : { state };

    React.useEffect(() => {
      const unsubscribe = store.subscribe(() => {
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
    }, [selector]);

    const dispatch = (action) => {
      setState(reducer(state, action));
    };
    return (
      <Component
        {...props}
        {...data}
        dispatch={dispatch}
        state={state}
      ></Component>
    );
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
