import React, { useState, useEffect, useCallback } from 'react';
import { Check, Shield, Crown, CreditCard, X, ArrowLeft, Calendar, Lock, Smartphone, CheckCircle, Sparkles, Globe } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:8080/api';


const getPlanBenefits = (planName) => {
  const name = planName.toLowerCase();
  if (name.includes('free')) {
    return [
      'Access to Basic Workouts',
      'Community Support',
      'Basic Progress Tracking',
      'Ad-Supported Experience',
    ];
  } else if (name.includes('monthly')) {
    return [
      'Unlock ALL Premium Workouts',
      'Advanced Analytics Dashboard',
      'Personalized Meal Plans',
      'Ad-Free Experience',
      'Priority Email Support',
    ];
  } else if (name.includes('yearly')) {
    return [
      'Everything in Monthly',
      '2 Months Free (Save 20%)',
      '1-on-1 Coach Consultation',
      'Offline Video Downloads',
      'Exclusive "Pro" Badge',
      'Early Access to New Features',
    ];
  }
  return ['Basic Access', 'Customer Support'];
};

const PaymentModal = ({ plan, onClose, onConfirm, status }) => {
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvc: '' });

  if (!plan) return null;

  const planDurationDays = plan.durationDays || (plan.planName?.includes('Yearly') ? 365 : plan.planName?.includes('Monthly') ? 30 : 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-lg relative overflow-hidden flex flex-col max-h-[90vh]">
        {status !== 'success' && (
          <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors z-10 bg-slate-100 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        )}

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Payment Successful!</h2>
            <p className="text-slate-500 mb-8">Welcome to the elite club. Redirecting you to your premium experience...</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[200px] overflow-hidden">
              <div className="bg-green-500 h-full w-full" />
            </div>
          </div>
        ) : (
          <>
            <div className="bg-slate-50 p-8 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Secure Checkout</h2>
              <p className="text-sm text-slate-500">You are subscribing to <span className="font-bold text-blue-600">{plan.planName}</span></p>
            </div>

            <div className="p-8 overflow-y-auto">
              <div className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-2xl shadow-sm mb-8">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Due</p>
                  <p className="text-3xl font-black text-slate-900">${plan.price}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                    {plan.price === 0 ? 'Forever' : `${planDurationDays} Days`}
                  </span>
                </div>
              </div>

              <p className="text-xs font-bold text-slate-900 uppercase mb-3 ml-1">Select Payment Method</p>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { id: 'Credit Card', icon: CreditCard },
                  { id: 'PayPal', icon: Globe },
                  { id: 'GCash', icon: Smartphone },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={paymentMethod === method.id ? 'py-3 px-2 rounded-2xl border-2 border-blue-600 bg-blue-50 text-blue-700 flex flex-col items-center gap-2' : 'py-3 px-2 rounded-2xl border-2 border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 flex flex-col items-center gap-2'}
                  >
                    <method.icon className={paymentMethod === method.id ? 'w-5 h-5 text-blue-600' : 'w-5 h-5 text-slate-400'} />
                    <span className="text-xs font-bold">{method.id}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'Credit Card' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Card Information</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="number"
                        placeholder="0000 0000 0000 0000"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-mono text-sm"
                        maxLength="19"
                        value={cardDetails.number}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Expiry</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-mono text-sm"
                          maxLength="5"
                          value={cardDetails.expiry}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">CVC</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          name="cvc"
                          placeholder="123"
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-mono text-sm"
                          maxLength="3"
                          value={cardDetails.cvc}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Cardholder Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name on Card"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                      value={cardDetails.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={() => onConfirm(paymentMethod)}
                  disabled={status === 'processing'}
                  className="w-full py-4 bg-slate-900 text-white font-bold text-lg rounded-2xl hover:bg-slate-800 shadow-xl hover:shadow-2xl transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {status === 'processing' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {plan.price > 0 ? `Pay $${plan.price}` : 'Confirm Free Plan'}
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </>
                  )}
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span>Encrypted & Secure. Cancel anytime.</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/plans`);
      if (!response.ok) throw new Error('Failed to fetch subscription plans.');
      const data = await response.json();
      const sorted = data.sort((a, b) => a.price - b.price);
      setPlans(sorted);
    } catch (err) {
      setError(err.message || 'Could not connect to the Plans API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handlePayment = async (method) => {
    setPaymentStatus('processing');
    if (!user) {
      navigate('/login');
      return;
    }
    const paymentRequest = {
      userId: user.id,
      planId: selectedPlan.id,
      amount: selectedPlan.price,
      paymentMethod: method,
    };
    try {
      await new Promise((r) => setTimeout(r, 800));
      const res = await fetch(`${API_URL}/payments/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentRequest),
      });
      if (!res.ok) throw new Error('Payment failed');
      setPaymentStatus('success');
      updateProfile({ isPremium: true });
      setTimeout(() => {
        setSelectedPlan(null);
        setPaymentStatus('idle');
        navigate('/dashboard');
      }, 2000);
    } catch (e) {
      setPaymentStatus('error');
      setError(e.message || 'Payment failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading Plans...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-10 font-bold bg-white px-4 py-2 rounded-full w-fit shadow-sm border border-slate-200 hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold tracking-widest uppercase mb-4 border border-blue-100">Unlock Your Potential</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">Choose the Plan That Fits Your Ambition</h2>
          <p className="text-lg text-slate-500">Whether you're just starting or ready to dominate, we have a tier for you. No hidden fees. Cancel anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 justify-center items-start">
          {plans.map((plan) => {
            const isYearly = plan.planName.toLowerCase().includes('year');
            const isFree = plan.price === 0;
            const benefits = getPlanBenefits(plan.planName);

            return (
              <div key={plan.id} className={isYearly ? 'relative bg-white rounded-[2.5rem] p-8 border-2 border-blue-500 shadow-2xl' : 'relative bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl'}>
                {isYearly && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 tracking-wider uppercase">
                    <Crown className="w-3 h-3" /> Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.planName}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-10 pb-8 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900 tracking-tight">${plan.price}</span>
                    <span className="text-slate-400 font-bold text-sm uppercase tracking-wide">
                      {isFree ? '/ forever' : isYearly ? '/ year' : '/ month'}
                    </span>
                  </div>
                  {isYearly && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold">
                      <Sparkles className="w-3 h-3" /> Save 20% vs Monthly
                    </div>
                  )}
                </div>

                <div className="space-y-5 mb-10">
                  {benefits.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={isYearly ? 'p-1 mt-0.5 rounded-full bg-blue-100 text-blue-600' : 'p-1 mt-0.5 rounded-full bg-slate-100 text-slate-600'}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-sm font-medium text-slate-600 leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={isYearly ? 'w-full py-4 rounded-2xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800' : isFree ? 'w-full py-4 rounded-2xl font-bold text-sm bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50' : 'w-full py-4 rounded-2xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700'}
                >
                  {isFree ? 'Get Started For Free' : 'Select Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          status={paymentStatus}
          onClose={() => setSelectedPlan(null)}
          onConfirm={handlePayment}
        />
      )}
    </div>
  );
}

