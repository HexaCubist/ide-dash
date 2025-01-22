import { env } from "$env/dynamic/private";
import Push from "pushover-notifications";

// Manage notifications for the app
const users = env.pushover_users.split(",");

export const push = new Push({
  user: env.pushover_user,
  token: env.pushover_token,
});

export const sendNotification = async (msg: {
  message: string;
  title?: string;
  url?: string;
}) => {
  await Promise.all(
    users.map((user) => {
      return new Promise((resolve, reject) => {
        push.send(
          {
            ...msg,
            user,
          },
          (err: any, res: any) => {
            if (err) return reject(err);
            return resolve(res);
          }
        );
      });
    })
  );
};
