const App = () => {
  return (
    <Provider store={store}>
      <Temp1></Temp1>
      <Temp2></Temp2>
      <Temp3></Temp3>
      <Temp4></Temp4>
      <Temp5></Temp5>
    </Provider>
  );
};

const initState = {
  user: { name: "Kitty", age: "2" },
  group: "前端",
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
const store = createStore(reducer, initState);

const mapStateToProps = (state) => {
  return { name: state.user.name };
};

const mapDispatchToProps = (dispatch) => ({
  updateUserName: (attrs) => {
    dispatch({ type: "updateUser", payload: attrs });
  },
});

// connect 统一管理了 读 （得到 state）和 写 (派发 action)
// 再传一个组件即可
const connectToUserName = connect(mapStateToProps, mapDispatchToProps);

const UserInfo = connect((state) => {
  return { name: state.user.name };
})(({ name }) => {
  console.log("render UserInfo");
  return <p>User: {name}</p>;
});

const UserInfo2 = connect((state) => {
  return { age: state.user.age };
})(({ age }) => {
  console.log("render UserInfo2");
  return <p>User: {age}</p>;
});

const UserModifier = connectToUserName(
  ({ updateUserName, name, id, children }) => {
    console.log("render UserModifier");

    const onChange = (e) => {
      updateUserName({ name: e.target.value });
    };

    return (
      <div>
        <p>{id}</p>
        <p>{children}</p>
        <input value={name} onChange={onChange}></input>
      </div>
    );
  }
);

// 注意 UserModifier2 中, 如果不给 selector, 修改 name 的时候，会导致 UserModifier2 不必要的渲染
// 因为不给 selector 的时候，UserModifier2 对比的是完整的 state, name 改变了 deepEqual 是 false
const UserModifier2 = connect((state) => {
  return { age: state.user.age };
})(({ dispatch, age, id, children }) => {
  console.log("render UserModifier2");

  const onChange = (e) => {
    dispatch({
      type: "updateUser",
      payload: { age: e.target.value },
    });
  };

  return (
    <div>
      <p>{id}</p>
      <p>{children}</p>
      <input value={age} onChange={onChange}></input>
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

const Temp5 = connect((state) => {
  return { group: state.group };
})(({ group }) => {
  console.log("render Temp5");
  return (
    <section>
      <p>Temp5: group: {group}</p>
    </section>
  );
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
