import { useHistory } from "react-router-dom";

export function Connect() {
    let history = useHistory();

    function handleClick() {
      history.push("/settings");
    }

    return (
      <button type="button" onClick={handleClick}>
        Go home
      </button>
    );
  }