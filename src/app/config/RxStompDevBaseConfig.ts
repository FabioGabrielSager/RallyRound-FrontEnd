import { RxStompConfig } from '@stomp/rx-stomp';

export const RxStompDevBaseConfig: RxStompConfig = {
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,

  reconnectDelay: 500,

  debug: (msg: string): void => {
    console.log(new Date(), msg);
  },
};
