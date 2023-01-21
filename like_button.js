const e = React.createElement;


const AppContext = React.createContext(null);

const App = () => {
  const [appState, setAppState] = React.useState({
    user: { name: "Kitty", age: 2 },
  });

  const contextValue = { appState, setAppState };

  return <div>123</div>;
};

const FirstChild = () => <section>First level</section>;
const SecondChild = () => <section>Second level</section>;
const ThirdChild = () => <section>Third level</section>;

const domContainer = document.querySelector("#like_button_container");
const root = ReactDOM.createRoot(domContainer);
root.render(e(App));
