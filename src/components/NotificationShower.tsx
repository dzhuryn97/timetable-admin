import { Alert } from "@chakra-ui/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";

export enum NotificationType {
  ERROR = "error",
  SUCCESS = "success",
}

export class Notification {
  id: number;
  type: NotificationType;
  message: String;

  constructor(type: NotificationType, message: String) {
    this.id = Date.now();
    this.type = type;
    this.message = message;
  }
}

interface SuccessMessageAction {
  type: "success";
  message: string;
}

interface AddMessageAction {
  type: "add";
  messageType: NotificationType;
  message: string;
}

interface RemoveMessageAction {
  type: "remove";
  notificationId: number;
}

type NotificationState = Notification[];

type NotificationActionTypes =
  | AddMessageAction
  | RemoveMessageAction
  | SuccessMessageAction;
const notificationReducer = (
  state: NotificationState,
  action: NotificationActionTypes,
) => {
  switch (action.type) {
    case "success":
      return [
        ...state,
        new Notification(NotificationType.SUCCESS, action.message),
      ];
    case "add":
      return [...state, new Notification(action.messageType, action.message)];
    case "remove":
      return state.filter(function (notification) {
        return notification.id !== action.notificationId;
      });
    default:
      throw new Error("Undefined type");
  }
};
export const NotificationsContext = createContext<NotificationState>([]);
export const NotificationsDispatchContext = createContext<
  React.Dispatch<NotificationActionTypes>
>(() => null);

export function useNotifications() {
  return useContext(NotificationsContext);
}
export function useNotificationsDispatch() {
  return useContext(NotificationsDispatchContext);
}

export function useDispatchSuccessNotification() {
  const dispatcher = useContext(NotificationsDispatchContext);

  return (message: string) => {
    dispatcher({
      type: "add",
      messageType: NotificationType.SUCCESS,
      message: message,
    });
  };
}

export function useDispatchErrorNotification() {
  const dispatcher = useContext(NotificationsDispatchContext);

  return (message: string) => {
    dispatcher({
      type: "add",
      messageType: NotificationType.ERROR,
      message: message,
    });
  };
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  return (
    <>
      <NotificationsContext.Provider value={notifications}>
        <NotificationsDispatchContext.Provider value={dispatch}>
          {children}
        </NotificationsDispatchContext.Provider>
      </NotificationsContext.Provider>
    </>
  );
}
export default function NotificationShower() {
  const notifications = useNotifications();
  const dispatch = useNotificationsDispatch();

  const alerts = notifications.map(function (notification) {
    return (
      <Alert m={"5px"} status={notification.type}>
        {notification.message}
      </Alert>
    );
  });

  useEffect(() => {
    notifications.forEach(function (notification) {
      setTimeout(
        () => dispatch({ type: "remove", notificationId: notification.id }),
        3000,
      );
    });
  }, [notifications]);
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        width: 200,
      }}
    >
      {alerts}
    </div>
  );
}
