class SecurityLogger {
  private static SENSITIVE_KEYS = ['password', 'token', 'amount', 'reference'];

  private static redact(data: any): any {
    if (data === null || data === undefined) return data;
    
    if (Array.isArray(data)) {
      return data.map(item => this.redact(item));
    }
    
    if (typeof data === "object") {
      const redactedObj: Record<string, any> = {};
      Object.keys(data).forEach((key) => {
        const lowerKey = key.toLowerCase();
        const isSensitive = this.SENSITIVE_KEYS.some((sensitiveKey) =>
          lowerKey.includes(sensitiveKey.toLowerCase())
        );

        if (isSensitive) {
          redactedObj[key] = "[REDACTED]";
        } else {
          redactedObj[key] = this.redact(data[key]);
        }
      });
      return redactedObj;
    }

    if (typeof data === "string" && data.length > 20 && this.SENSITIVE_KEYS.some(k => data.toLowerCase().includes(k))) {
      return "[REDACTED_STRING]";
    }

    return data;
  }

  public static log(message: string, data?: any) {
    if (__DEV__) {
       if (data !== undefined) {
         console.log(`[SECURITY LOG] ${message}`, this.redact(data));
       } else {
         console.log(`[SECURITY LOG] ${message}`);
       }
    }
  }
}

export default SecurityLogger;
