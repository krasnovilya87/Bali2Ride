export interface PaymentParams {
  amount: number;
  bookingId?: string;
  customerDetails?: {
    name: string;
    email: string;
    phone: string;
  };
  items?: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

/**
 * Calls the internal backend API to create a Midtrans transaction token.
 * This is secure because the payment logic (and Server Key) stays on the server.
 */
export const createMidtransTransaction = async (params: PaymentParams) => {
  const response = await fetch('/api/payment/create-transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create payment transaction');
  }

  return response.json(); // returns { token, redirect_url }
};

/**
 * Loads the Midtrans Snap.js script dynamically.
 * URL for Sandbox: https://app.sandbox.midtrans.com/snap/snap.js
 */
export const loadSnapScript = (): Promise<void> => {
  return new Promise((resolve) => {
    const scriptId = 'midtrans-snap-script';
    if (document.getElementById(scriptId)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    
    // Client key is required by the script for Sandbox/Production identification
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    if (clientKey) {
      script.setAttribute('data-client-key', clientKey);
    }
    
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

/**
 * Full flow: Load script -> Create token -> Show payment popup
 */
export const startPayment = async (params: PaymentParams) => {
  try {
    const paymentData = await createMidtransTransaction(params);
    const { token, isDemo } = paymentData;

    if (isDemo) {
      console.log('Running in demo mode. Simulating success...');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ status: 'success', order_id: params.bookingId });
        }, 1500);
      });
    }

    await loadSnapScript();

    if (!(window as any).snap) {
      throw new Error('Midtrans Snap script not loaded properly');
    }

    return new Promise((resolve, reject) => {
      (window as any).snap.pay(token, {
        onSuccess: function (result: any) {
          console.log('Payment success:', result);
          resolve(result);
        },
        onPending: function (result: any) {
          console.log('Payment pending:', result);
          resolve(result);
        },
        onError: function (result: any) {
          console.error('Payment error:', result);
          reject(new Error('Payment failed'));
        },
        onClose: function () {
          console.log('Payment window closed');
          reject(new Error('Payment window closed'));
        },
      });
    });
  } catch (error) {
    console.error('Start payment error:', error);
    throw error;
  }
};
