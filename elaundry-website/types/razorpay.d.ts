declare interface Window {
  Razorpay?: any;
}

declare var Razorpay: any;
// types/razorpay.d.ts
declare module "razorpay" {
  export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name?: string;
    description?: string;
    order_id?: string;
    prefill?: { name?: string; email?: string; contact?: string };
    handler?: (response: any) => void;
  }

  export default class Razorpay {
    constructor(options: RazorpayOptions);
    open(): void;
    on(event: string, callback: (response: any) => void): void;
  }
}
declare global {
  interface Window {
    Razorpay?: any;
  }
}
