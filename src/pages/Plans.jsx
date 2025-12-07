import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { Crown, DollarSign, ArrowRight, X, CheckCircle, Clock, Check, Shield, CreditCard, Calendar, Lock, ArrowLeft } from 'lucide-react';

// FIX: Define the API_URL constant here
const API_URL = 'http://localhost:8080/api'; 

// --- Helper to define benefits for each plan (REUSABLE) ---
const getPlanBenefits = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes('free')) {
        return [
            'Access to Basic Workouts',
            'Community Support',
            'Basic Progress Tracking',
            'Ad-Supported Experience'
        ];
    } else if (name.includes('monthly')) {
        return [
            'Unlock ALL Premium Workouts',
            'Advanced Analytics Dashboard',
            'Personalized Meal Plans',
            'Ad-Free Experience',
            'Priority Email Support'
        ];
    } else if (name.includes('yearly')) {
        return [
            'Everything in Monthly',
            '2 Months Free (Save 20%)',
            '1-on-1 Coach Consultation',
            'Offline Video Downloads',
            'Exclusive "Pro" Badge',
            'Early Access to New Features'
        ];
    }
    // Default fallback for general Plan objects
    return ['Basic Access', 'Customer Support']; 
};

// --- Payment Modal Component (REUSABLE) ---
const PaymentModal = ({ plan, onClose, onConfirm, loading }) => {
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvc: '' });

    if (!plan) return null;
    
    // Safety check for duration (assuming plan data has this field)
    const planDurationDays = plan.durationDays || (plan.planName.includes('Yearly') ? 365 : plan.planName.includes('Monthly') ? 30 : 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-6 h-6" />
                </button>
                
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                    {plan.price > 0 ? 'Secure Checkout' : 'Confirm Selection'}
                </h2>
                <p className="text-sm text-slate-500 mb-6">You are selecting <span className="font-semibold text-blue-600">{plan.planName}</span></p>

                {/* Plan Summary */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">Total to Pay</p>
                        <p className="text-2xl font-bold text-slate-900">${plan.price}</p>
                    </div>
                    <div className="text-right">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">
                            {plan.price === 0 ? 'Forever' : `${planDurationDays} Days`}
                        </span>
                    </div>
                </div>

                {/* Payment Method Selector (Only if price > 0) */}
                {plan.price > 0 && (
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-slate-700 mb-3">Payment Method</p>
                        <div className="grid grid-cols-3 gap-3">
                            {['Credit Card', 'PayPal', 'GCash'].map((method) => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    className={`py-2 px-2 text-xs sm:text-sm font-medium rounded-lg border transition-all flex flex-col items-center gap-1 ${
                                        paymentMethod === method 
                                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' 
                                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {method === 'Credit Card' && <CreditCard className="w-4 h-4"/>}
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mock Input Fields (Only for Credit Card & Paid Plans) */}
                {plan.price > 0 && paymentMethod === 'Credit Card' && (
                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Cardholder Name</label>
                            <input type="text" name="name" placeholder="John Doe" className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={cardDetails.name} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Card Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input type="text" name="number" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" maxLength="19" value={cardDetails.number} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Expiry</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                                    <input type="text" name="expiry" placeholder="MM/YY" className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" maxLength="5" value={cardDetails.expiry} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">CVC</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                                    <input type="text" name="cvc" placeholder="123" className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" maxLength="3" value={cardDetails.cvc} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button 
                    onClick={() => onConfirm(paymentMethod)}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                        </>
                    ) : (
                        plan.price > 0 ? `Confirm Payment $${plan.price}` : 'Confirm Selection'
                    )}
                </button>
                
                {plan.price > 0 && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                        <Shield className="w-3 h-3" />
                        <span>256-bit SSL Encrypted Payment</span>
                    </div>
                )}
            </div>
        </div>
    );
};


export default function Plans() {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null); // Used to trigger and hold modal data
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    
    // --- Data Fetching ---
    const fetchPlans = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/plans`);
            if (!response.ok) {
                throw new Error('Failed to fetch subscription plans.');
            }
            const data = await response.json();
            
            // Assuming the backend returns basic Plan objects {id, name, price, durationDays}
            const sortedPlans = data.sort((a, b) => a.price - b.price);
            setPlans(sortedPlans);
        } catch (err) {
            setError(err.message || "Could not connect to the Plans API.");
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // --- Payment Logic ---
    const handlePayment = async (method) => {
        setLoading(true);
        setError(null);

        const paymentRequest = {
            userId: user.id,
            planId: selectedPlan.id,
            amount: selectedPlan.price,
            paymentMethod: method
        };

        try {
            // Mock delay and call backend API
            await new Promise(resolve => setTimeout(resolve, 800)); 
            
            const response = await fetch(`${API_URL}/payments/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentRequest)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Payment processing failed on the server.');
            }
            
            // Successful payment: Update state globally
            const isPremium = selectedPlan.price > 0;
            updateProfile({ isPremium: isPremium });
            
            setPaymentSuccess(true);
            setSelectedPlan(null); // Close modal
            
            // Navigate after brief pause
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);


        } catch (err) {
            setError(err.message || "Payment Failed. Please try again.");
            console.error("Payment Error:", err);
            setLoading(false);

        }
    };

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    // UI Helpers based on fetched data
    const isUserPremium = user?.isPremium;

    // Filter plans for display (assuming Free, Monthly, Yearly are present)
    const planOrder = ['Free', 'Monthly', 'Yearly'];
    const filteredPlans = planOrder
        .map(name => plans.find(p => p.planName?.includes(name) || p.name?.includes(name)))
        .filter(p => p && (p.price === 0 || !p.planName?.toLowerCase().includes('yearly'))) // Simplified filter for 2 cards if data is complex
        .sort((a, b) => a.price - b.price);

    const PlanCard = ({ plan }) => {
        if (!plan) return null;
        
        // Use plan.name or plan.planName based on what the API returns
        const planName = plan.planName || plan.name || 'Plan'; 
        
        // Card styling logic
        const isYearly = planName.toLowerCase().includes('yearly');
        const isFree = plan.price === 0;
        const isCurrentPlan = isUserPremium && plan.price > 0 || !isUserPremium && isFree;
        const isUnavailable = isUserPremium && isFree; // Cannot select Free if already premium

        const cardClasses = isYearly 
            ? "border-2 border-blue-500 shadow-2xl scale-105 z-10" 
            : "border border-slate-100 shadow-lg hover:shadow-xl";
        
        const benefits = getPlanBenefits(planName);

        return (
            <div className={`relative bg-white rounded-3xl p-8 flex flex-col h-full transition-all duration-300 ${cardClasses} ${isCurrentPlan ? 'ring-4 ring-blue-100' : ''}`}>
                
                {isYearly && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 tracking-wide whitespace-nowrap">
                        <Crown className="w-3 h-3" /> BEST VALUE
                    </div>
                )}

                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{planName}</h3>
                    <p className="text-slate-500 text-sm">{plan.description || (isFree ? 'Basic access to all core features.' : 'Unlock your full potential.')}</p>
                </div>

                <div className="mb-8 pb-8 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-slate-900">
                            {isFree ? 'FREE' : `$${plan.price}`}
                        </span>
                        {!isFree && (
                            <span className="text-slate-500 font-medium">
                                {isYearly ? '/ year' : '/ month'}
                            </span>
                        )}
                    </div>
                    {isYearly && <p className="text-xs text-green-600 font-bold mt-2">Save 20% compared to monthly</p>}
                </div>

                <div className="space-y-4 mb-8 flex-1">
                    {benefits.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 group">
                            <div className={`p-1 mt-0.5 rounded-full shrink-0 ${isYearly ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                <Check className="w-3 h-3" />
                            </div>
                            <span className="text-sm text-slate-600 leading-tight">{feature}</span>
                        </div>
                    ))}
                </div>

                {isUnavailable || isCurrentPlan ? (
                    <button 
                        disabled 
                        className={`w-full py-3.5 rounded-xl text-white font-bold cursor-not-allowed flex items-center justify-center gap-2 ${isCurrentPlan ? 'bg-green-500' : 'bg-slate-400'}`}
                    >
                        {isCurrentPlan ? 'Active Plan' : 'Already Purchased'}
                    </button>
                ) : (
                    <button 
                        onClick={() => setSelectedPlan(plan)}
                        className={`w-full py-3.5 rounded-xl font-bold transition-all transform active:scale-95 ${
                            isYearly 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:opacity-90' 
                            : isFree 
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-slate-800 text-white hover:bg-slate-900'
                        }`}
                    >
                        {isFree ? 'Get Started' : 'Choose Plan'}
                    </button>
                )}
            </div>
        );
    };

    if (isLoading) {
        return <div className="text-center py-20 text-slate-600">Loading plans...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-600 bg-red-50 p-6 rounded-xl border border-red-200">Error: {error}</div>;
    }
    
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            {paymentSuccess && (
                <div className="fixed top-24 right-6 z-50 bg-white border-l-4 border-emerald-500 shadow-2xl rounded-xl p-4 flex items-start gap-4 max-w-sm animate-in slide-in-from-right-10 duration-300">
                    <div className="bg-emerald-100 p-2 rounded-full shrink-0">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">Payment Successful!</h4>
                        <p className="text-slate-500 text-xs leading-relaxed">
                            You are now a Premium Member. Redirecting to dashboard...
                        </p>
                    </div>
                    <button onClick={() => setPaymentSuccess(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
            
            <div className="max-w-7xl mx-auto">
                 <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-8 font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>
            </div>

            <div className="max-w-4xl mx-auto text-center mb-12">
                <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-2 block">Choose Your Path</span>
                <h1 className="text-5xl font-black text-slate-900 mb-4">Subscription Plans</h1>
                <p className="text-xl text-slate-500">Choose the plan that fits your goals.</p>
            </div>
            
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-start">
                {plans.map(plan => (
                    <PlanCard key={plan.id} plan={plan} />
                ))}
            </div>
            
            {selectedPlan && (
                <PaymentModal 
                    plan={selectedPlan} 
                    onClose={() => setSelectedPlan(null)} 
                    onConfirm={handlePayment}
                    loading={loading}
                />
            )}
            
        </div>
    );
}