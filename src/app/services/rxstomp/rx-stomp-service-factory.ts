import {RxStompService} from "./rx-stomp.service";
import {RxStompDevBaseConfig} from "../../config/RxStompDevBaseConfig";

export function rxStompServiceFactory() {
  const rxStomp = new RxStompService();
  rxStomp.configure(RxStompDevBaseConfig);
  return rxStomp;
}
