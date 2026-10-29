/**
 * Cloudflare Turnstile in the browser: loads the script on demand, renders an
 * interaction-only widget into a container, and hands out single-use tokens.
 * Disabled (no site key) builds skip verification entirely.
 */
type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      appearance?: "always" | "execute" | "interaction-only";
      callback: (token: string) => void;
      "error-callback"?: (code?: string) => void;
      "expired-callback"?: () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
export const turnstileEnabled = SITE_KEY.length > 0;

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window !== "undefined" && window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error("The browser check could not load. Please try again."));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

type Waiter = { resolve: (token: string) => void; reject: (err: Error) => void };

export class TurnstileClient {
  private widgetId: string | null = null;
  private spare: string | null = null;
  private waiting: Waiter[] = [];

  constructor(private readonly container: HTMLElement) {}

  /**
   * Resolves with a fresh single-use token; renders the widget on first use,
   * resets it afterwards. Gives up after 25 seconds so a challenge that never
   * completes (an automated browser, a blocked network) surfaces as an error.
   */
  async getToken(): Promise<string> {
    await loadScript();
    if (this.spare) {
      const token = this.spare;
      this.spare = null;
      return token;
    }
    return new Promise<string>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        this.waiting = this.waiting.filter((w) => w.resolve !== resolve);
        reject(new Error("The browser check did not complete. Please reload the page and try again."));
      }, 25_000);
      this.waiting.push({
        resolve: (token) => {
          window.clearTimeout(timer);
          resolve(token);
        },
        reject: (err) => {
          window.clearTimeout(timer);
          reject(err);
        },
      });
      if (this.widgetId === null) {
        this.widgetId = window.turnstile!.render(this.container, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          callback: (token) => this.deliver(token),
          "error-callback": () => this.fail(new Error("The browser check failed. Please reload and try again.")),
          "expired-callback": () => {
            this.spare = null;
          },
        });
      } else {
        window.turnstile!.reset(this.widgetId);
      }
    });
  }

  remove() {
    if (this.widgetId !== null) {
      try {
        window.turnstile?.remove(this.widgetId);
      } catch {
        // already gone
      }
      this.widgetId = null;
    }
    this.spare = null;
    this.fail(new Error("The chat was closed."));
  }

  private deliver(token: string) {
    const waiters = this.waiting.splice(0);
    if (waiters.length) waiters.forEach((w) => w.resolve(token));
    else this.spare = token;
  }

  private fail(err: Error) {
    this.waiting.splice(0).forEach((w) => w.reject(err));
  }
}
