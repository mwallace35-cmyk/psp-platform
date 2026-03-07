/**
 * Type declarations for optional dependencies that may not be installed.
 * These modules degrade gracefully at runtime when not present.
 */
declare module "@sentry/nextjs" {
  const Sentry: any;
  export default Sentry;
  export function init(options: any): void;
  export function captureException(error: any, context?: any): void;
  export function setUser(user: any): void;
  export function setTag(key: string, value: string): void;
  export function setContext(name: string, context: any): void;
  export function addBreadcrumb(breadcrumb: any): void;
  export function getCurrentHub(): any;
  export function getClient(): any;
  export function replayIntegration(options?: any): any;
  export function prismaIntegration(): any;
  export function nextjsIntegration(options?: any): any;
  export class Replay {
    constructor(options?: any);
  }
}

declare module "ioredis" {
  class Redis {
    constructor(url: string, options?: any);
    ping(): Promise<string>;
    quit(): Promise<string>;
    disconnect(): void;
    on(event: string, callback: (...args: any[]) => void): void;
  }
  export default Redis;
}
