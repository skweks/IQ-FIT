import React, { useEffect, useState } from 'react';
import { Check, Shield, Crown, CreditCard, X, ArrowLeft, Calendar, Lock, Smartphone, CheckCircle, Sparkles, Globe } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
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

// --- Payment Modal Component ---
const PaymentModal = ({ plan, onClose, onConfirm, status }) => {
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-lg relative overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* --- CLOSE BUTTON --- */}
                {status !== 'success' && (
                    <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors z-10 bg-slate-100 p-2 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
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

                {/* --- SUCCESS STATE ANIMATION --- */}
                {status === 'success' ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2 animate-in slide-in-from-bottom-4 duration-500 delay-100">Payment Successful!</h2>
                        <p className="text-slate-500 mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-200">
                            Welcome to the elite club. Redirecting you to your premium experience...
                        </p>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[200px] overflow-hidden">
                            <div className="bg-green-500 h-full w-full animate-progress origin-left"></div>
                        </div>
                    </div>
                ) : (
                    /* --- CHECKOUT FORM STATE --- */
                    <>
                        {/* Header */}
                        <div className="bg-slate-50 p-8 border-b border-slate-100">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Upgrade</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-1">Secure Checkout</h2>
                            <p className="text-sm text-slate-500">You are subscribing to <span className="font-bold text-blue-600">{plan.planName}</span></p>
                        </div>

                        {/* Body */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            {/* Plan Summary Card */}
                            <div className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-2xl shadow-sm mb-8">
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Due</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">${plan.price}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                                        {plan.price === 0 ? 'Forever' : `Billed every ${plan.durationDays} days`}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Method Selector */}
                            <p className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 ml-1">Select Payment Method</p>
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {[
                                    { id: 'Credit Card', icon: CreditCard },
                                    { id: 'PayPal', icon: Globe }, // Replaced Globe with placeholder for Paypal logic
                                    { id: 'GCash', icon: Smartphone }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                                            paymentMethod === method.id 
                                            ? 'border-blue-600 bg-blue-50 text-blue-700' 
                                            : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-blue-600' : 'text-slate-400'}`} />
                                        <span className="text-xs font-bold">{method.id}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Input Fields */}
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

                            {/* Footer / Button */}
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
    const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success', 'error'
    const navigate = useNavigate();
    const { user, updateProfile } = useAuth(); 

    useEffect(() => {
        fetch('http://localhost:8080/api/plans') 
            .then(response => response.json())
            .then(data => {
                const sortedPlans = data.sort((a, b) => a.price - b.price);
                setPlans(sortedPlans);
            })
            .catch(error => console.error('Error fetching plans:', error));
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
        setPaymentStatus('processing');

        if (!user) {
            alert("Please login first!");
            navigate('/login');
            return;
        }
        setLoading(true);
        setError(null);

        const paymentRequest = {
            userId: user.id,
            planId: selectedPlan.id,
            amount: selectedPlan.price,
            paymentMethod: method
        };

        try {
            // Artificial delay to show the "Processing" state and then the "Success" animation
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await fetch('http://localhost:8080/api/payments/pay', {
            // Mock delay and call backend API
            await new Promise(resolve => setTimeout(resolve, 800)); 
            
            const response = await fetch(`${API_URL}/payments/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentRequest)
            });

            if (response.ok) {
                const isPremium = selectedPlan.price > 0;
                updateProfile({ isPremium: isPremium });
                
                // Show Success Animation
                setPaymentStatus('success');
                
                // Wait for animation to finish before redirecting
                setTimeout(() => {
                    setSelectedPlan(null);
                    setPaymentStatus('idle');
                    if (isPremium) {
                        navigate('/workouts');
                    } else {
                        navigate('/dashboard');
                    }
                }, 2500); // 2.5 seconds to enjoy the success screen
            } else {
                alert("Transaction failed. Please try again.");
                setPaymentStatus('error');
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Network error processing request.");
            setPaymentStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-10 font-bold bg-white px-4 py-2 rounded-full w-fit shadow-sm border border-slate-200 hover:shadow-md"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>

                <div className="text-center max-w-2xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold tracking-widest uppercase mb-4 border border-blue-100">Unlock Your Potential</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">Choose the Plan That Fits Your Ambition</h2>
                    <p className="text-lg text-slate-500">Whether you're just starting or ready to dominate, we have a tier for you. No hidden fees. Cancel anytime.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 justify-center items-start relative z-10">
                    {plans.map((plan, index) => {
                        const isYearly = plan.planName.toLowerCase().includes('year');
                        const isFree = plan.price === 0;
                        const benefits = getPlanBenefits(plan.planName);

                        return (
                            <div 
                                key={plan.id} 
                                className={`relative bg-white rounded-[2.5rem] p-8 flex flex-col h-full transition-all duration-300 group
                                    ${isYearly 
                                        ? 'border-2 border-blue-500 shadow-2xl scale-105 z-10' 
                                        : 'border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1'
                                    }
                                    animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards
                                `}
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {isYearly && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 tracking-wider whitespace-nowrap uppercase">
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

                                <div className="space-y-5 mb-10 flex-1">
                                    {benefits.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className={`p-1 mt-0.5 rounded-full shrink-0 ${isYearly ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-600 leading-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all transform active:scale-95 shadow-lg ${
                                        isYearly 
                                        ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20' 
                                        : isFree
                                        ? 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'
                                    }`}
                                >
                                    {isFree ? 'Get Started For Free' : 'Select Plan'}
                                </button>
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

                <div className="mt-20 text-center border-t border-slate-200 pt-10">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Shield className="w-8 h-8 text-slate-300 mb-2" />
                        <p className="text-sm font-medium">Secure payment processing via SSL encryption.</p>
                        <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Icons representing payment methods - visually implied */}
                            <div className="h-6 w-10 bg-slate-200 rounded"></div>
                            <div className="h-6 w-10 bg-slate-200 rounded"></div>
                            <div className="h-6 w-10 bg-slate-200 rounded"></div>
                        </div>
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

            {/* Render Modal if Plan Selected */}
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
                    onClose={() => { setSelectedPlan(null); setPaymentStatus('idle'); }} 
                    onConfirm={handlePayment}
                    status={paymentStatus}
                />
            )}
            
        </div>
    );
}