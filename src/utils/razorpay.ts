const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export interface RazorpayOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

export const loadRazorpay = (): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not available"));
  }

  if (document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
};

export const createOrder = async (
  amountInRupees: number
): Promise<RazorpayOrderResponse> => {
  const response = await fetch("https://apvcouncil.in/api/create_order.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(amountInRupees * 100),
      currency: "INR",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create Razorpay order");
  }

  const data = (await response.json()) as RazorpayOrderResponse;

  if (!data.order_id) {
    throw new Error("Invalid order response from server");
  }

  return data;
};
