import { app }  from "./app.ts"
import { logger } from "./logging.ts"

logger.info("Starting server on 127.0.0.1:8000"); 

await app.listen("127.0.0.1:8000"); 
