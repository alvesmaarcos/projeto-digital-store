import { useEffect, useState } from "react";
export function useResource(loader) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    let active = true;
    setState({ data: null, loading: true, error: null });
    Promise.resolve()
      .then(loader)
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch(() => {
        if (active)
          setState({
            data: null,
            loading: false,
            error: "Não foi possível carregar os produtos.",
          });
      });
    return () => {
      active = false;
    };
  }, [loader, attempt]);
  return { ...state, retry: () => setAttempt((value) => value + 1) };
}
