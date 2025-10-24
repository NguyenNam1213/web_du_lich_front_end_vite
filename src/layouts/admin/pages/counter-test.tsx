import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "../../../store/slices/counterSlice";

export function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => dispatch(decrement())}>–</button>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}
