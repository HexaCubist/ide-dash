declare module "secure-compare" {
  export default (string, string) => boolean;
}

declare module "pushover-notifications" {
  export default class Push {
    constructor(config: { user: string; token: string });
    send: (msg: any, cb: (err: any, res: any) => void) => void;
  }
}
