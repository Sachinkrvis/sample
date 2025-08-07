// hooks/useAppState.tsx
import { v4 as uuid } from "uuid";
import useLocalStorage from "./useLocalStorage";

const LS_UUID = "chatgpt_ui_userid";

function useAppState() {
  const [userId, setUserId] = useLocalStorage(LS_UUID, uuid());
  return { userId, setUserId };
}

export default useAppState;
