import React, {
  Dispatch,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState
} from "react";
import "./App.css";

const Counter: React.FC<{ counter: number; onClick: () => void }> = React.memo(
  props => {
    console.log("Counter");
    return (
      <div className="container">
        <Value value={props.counter} />
        <Button onClick={props.onClick}>Increment</Button>
      </div>
    );
  }
);

const Value: React.FC<{ value: number }> = React.memo(props => {
  console.log("Value");
  return <div className="counter">{props.value}</div>;
});

const Button: React.FC<{ onClick: () => void }> = React.memo(props => {
  console.log("Button");
  return (
    <button className="button" onClick={props.onClick}>
      {props.children}
    </button>
  );
});

// コンテキスト経由で状態とdispatchを受け取る
const ContextCounterC: React.FC = React.memo(() => {
  console.log("ContextCounterC");
  const { counter, dispatch } = useContext(CounterContextC);
  const increment = useCallback(() => dispatch({ type: "increment" }), [
    dispatch
  ]);
  const decrement = useCallback(() => dispatch({ type: "decrement" }), [
    dispatch
  ]);
  return (
    <div className="container">
      <Value value={counter} />
      <Button onClick={increment}>Increment</Button>
      <Button onClick={decrement}>Decrement</Button>
    </div>
  );
});

// コンテキスト経由で状態とコールバック関数を受け取る
const ContextCounterD: React.FC = React.memo(() => {
  console.log("ContextCounterD");
  const { counter, increment, decrement } = useContext(CounterContextD);
  return (
    <div className="container">
      <Value value={counter} />
      <Button onClick={increment}>Increment</Button>
      <Button onClick={decrement}>Decrement</Button>
    </div>
  );
});

type Action = { type: "increment" | "decrement" };

const CounterContextC = React.createContext({
  counter: 0,
  dispatch: (() => {}) as Dispatch<Action>
});

const counterReducer = (count: number, action: Action) => {
  switch (action.type) {
    case "increment":
      return count + 1;
    case "decrement":
      return count - 1;
  }
};

const CounterContextD = React.createContext({
  counter: 0,
  increment: () => {},
  decrement: () => {}
});

const App: React.FC = () => {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);
  const [countC, dispatchC] = useReducer(counterReducer, 0);
  const [countD, setCountD] = useState(0);

  // 関数は毎回作成されるので再レンダリングを誘発する
  const incrementA = () => {
    setCountA(c => c + 1);
  };

  // useCallbackで関数が不要に変化しないようにして再レンダリングを防ぐ
  const incrementB = useCallback(() => setCountB(c => c + 1), []);

  // 毎回生成され再レンダリングを引き起こすのを避けるためにメモ化する
  const contextValueC = useMemo(() => {
    return { counter: countC, dispatch: dispatchC };
  }, [countC]);

  // コンテキスト経由でコールバック関数を渡す
  const incrementD = useCallback(() => setCountD(c => c + 1), []);

  // コンテキスト経由でコールバック関数を渡す
  const decrementD = useCallback(() => setCountD(c => c - 1), []);

  // 毎回生成され再レンダリングを引き起こすのを避けるためにメモ化する
  const contextValueD = useMemo(() => {
    return { counter: countD, increment: incrementD, decrement: decrementD };
  }, [countD, decrementD, incrementD]);

  return (
    <CounterContextC.Provider value={contextValueC}>
      <CounterContextD.Provider value={contextValueD}>
        <div className="App">
          <Counter counter={countA} onClick={incrementA} />
          <Counter counter={countB} onClick={incrementB} />
          <ContextCounterC />
          <ContextCounterD />
        </div>
      </CounterContextD.Provider>
    </CounterContextC.Provider>
  );
};

export default App;
