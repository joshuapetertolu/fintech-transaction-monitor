const SENSITIVE_KEYS = [
  "token",
  "password",
  "secret",
  "accesstoken",
  "refreshtoken",
  "cvv",
  "authorization",
  "bearer",
];

const mask16Digits = (str: string) => str.replace(/\b\d{12}(\d{4})\b/g, '************$1');

export const sanitize = (data: any): any => {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item));
  }

  if (typeof data === "object") {
    const sanitizedObj: Record<string, any> = {};

    Object.keys(data).forEach((key) => {
      const lowerKey = key.toLowerCase();
      const isSensitive = SENSITIVE_KEYS.some((sensitiveKey) =>
        lowerKey.includes(sensitiveKey)
      );

      if (isSensitive) {
        sanitizedObj[key] = "[REDACTED]";
      } else {
        sanitizedObj[key] = sanitize(data[key]);
      }
    });

    return sanitizedObj;
  }

  if (typeof data === "string") {
    return mask16Digits(data);
  }

  return data;
};

export const SecurityLogger = {
  info: (message: string, ...args: any[]) => {
    // if (__DEV__) {
    //   console.log(
    //     `[SECURITY LOG INFO] ${new Date().toISOString()}: ${message}`,
    //     ...args.map(sanitize)
    //   );
    // }
  },
  warn: (message: string, ...args: any[]) => {
    if (__DEV__) {
      console.warn(
        `[SECURITY LOG WARN] ${new Date().toISOString()}: ${message}`,
        ...args.map(sanitize)
      );
    }
  },
  error: (message: string, ...args: any[]) => {
    if (__DEV__) {
      console.error(
        `[SECURITY LOG ERROR] ${new Date().toISOString()}: ${message}`,
        ...args.map(sanitize)
      );
    }
  },
  debug: (message: string, ...args: any[]) => {
    if (__DEV__) {
      console.debug(
        `[SECURITY LOG DEBUG] ${new Date().toISOString()}: ${message}`,
        ...args.map(sanitize)
      );
    }
  }
};

export default SecurityLogger;
