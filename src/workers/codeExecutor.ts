
self.onmessage = (e: MessageEvent) => {
  const code = e.data;

  // Helper to send console logs back
  const sendLog = (level: string, ...args: any[]) => {
    self.postMessage({
      type: 'console',
      level,
      args: args.map(arg => {
        try {
            return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
        } catch {
            return String(arg);
        }
      })
    });
  };

  // Mock console
  const mockConsole = {
    log: (...args: any[]) => sendLog('log', ...args),
    error: (...args: any[]) => sendLog('error', ...args),
    warn: (...args: any[]) => sendLog('warn', ...args),
    info: (...args: any[]) => sendLog('info', ...args),
  };

  // AI Functions
  const ai = {
    call: (functionName: string, ...args: any[]) => {
      self.postMessage({
        type: 'ai',
        functionName,
        args
      });
    }
  };

  // Editor Functions
  const editor = {
    highlightError: (line: number, message: string) => {
      self.postMessage({
        type: 'editor',
        action: 'highlightError',
        line,
        message
      });
    }
  };

  try {
    // We shadow 'console' and expose 'ai' and 'editor'.
    const func = new Function('console', 'ai', 'editor', code);
    func(mockConsole, ai, editor);
    
    self.postMessage({ type: 'system', status: 'finished' });
  } catch (error: any) {
    self.postMessage({
      type: 'error',
      message: error.message,
      stack: error.stack
    });
  }
};
