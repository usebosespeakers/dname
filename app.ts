import { Application, send } from "https://deno.land/x/oak/mod.ts";
import { logRequest } from "./logging.ts";
import { router } from "./routing.ts"

export const app = new Application(); 

app.use(logRequest) 

app.use(router.routes()).use(router.allowedMethods()); 

app.use(async (context) => {
  await send(context, context.request.url.pathname, {
    root: `${Deno.cwd()}/assets/`,
    index: "./views/main/index.html",
  });
});