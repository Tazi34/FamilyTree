const log = (text: any) => {
  console.log(text);
};
const error = (text: any) => {
  console.error(error);
};

const emptyLogger = {
  log: (text: any) => {},
  error: (text: any) => {},
};

const defaultLogger = {
  log,
  error,
};

const logger =
  process.env.NODE_ENV === "development" ? defaultLogger : emptyLogger;

export { logger };
