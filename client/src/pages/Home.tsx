import { useDispatch, useSelector } from "react-redux";
import { incrementByAmount } from "../store/store";
export default function Home() {
  const dispatch = useDispatch();
  const counter = useSelector(
    (state: { counter: { value: number } }) => state.counter.value
  );

  return (
    <div>
      Home: {counter}
      <button
        onClick={() => dispatch(incrementByAmount(30))}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        click me
      </button>
    </div>
  );
}
