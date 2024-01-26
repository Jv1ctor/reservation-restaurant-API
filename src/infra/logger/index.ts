import pino from "pino";
import pinoHttp from "pino-http";

export const logger = pino({ 
  transport: {
    target: "pino-pretty",
  },
  level: "debug"
})

export const loggerHttp = pinoHttp({
  logger,
  customLogLevel(_, res) {
    if (res.statusCode >= 400 && res.statusCode < 500) return "warn"
    if (res.statusCode >= 500) return "error"
    return "info"
  },
  customSuccessMessage(req, res, responseTime) {
    return `[HTTP] ${req.method} - ${res.statusCode} - ${
      req.url
    } - request completed - ${responseTime.toPrecision()}ms`
  },
  customSuccessObject: () => {},
})