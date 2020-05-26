import * as log from "https://deno.land/std/log/mod.ts"; 

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),

    file: new log.handlers.FileHandler("DEBUG", {
      filename: "./logs/log.txt",
      formatter: `${(new Date).toLocaleString()} {levelName} {msg}`
    })
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console", "file"]
    } 
  }
});

export const logger = log.getLogger(); 

export const logRequest = async (ctx: any, next: Function) => {
  await next();
  logger.info( `${ctx.request.method} ${ctx.request.url}` );
}; 