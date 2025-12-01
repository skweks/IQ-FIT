import React, { useEffect, useState } from 'react';
import { Check, Shield, Crown, CreditCard, X, ArrowLeft, Calendar, Lock } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

// --- Helper to define benefits for each plan ---
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
    return ['Standard Access', 'Customer Support'];
};

// --- Payment Modal Component ---
const PaymentModal = ({ plan, onClose, onConfirm, loading }) => {
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvc: '' });

    if (!plan) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
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
                            {plan.price === 0 ? 'Forever' : `${plan.durationDays} Days`}
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

// --- Main Plans Page ---
const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // Get updateProfile and user from context
    const { user, updateProfile } = useAuth(); 

    // Fetch Plans from Backend
    useEffect(() => {
        fetch('http://localhost:8080/api/plans') 
            .then(response => response.json())
            .then(data => {
                // Sort plans: Free first, then by price
                const sortedPlans = data.sort((a, b) => a.price - b.price);
                setPlans(sortedPlans);
            })
            .catch(error => console.error('Error fetching plans:', error));
    }, []);

    const handlePayment = async (method) => {
        setLoading(true);
        // Note: user comes from useAuth() now, so it is always current

        if (!user) {
            alert("Please login first!");
            navigate('/login');
            return;
        }

        const paymentRequest = {
            userId: user.id,
            planId: selectedPlan.id,
            amount: selectedPlan.price,
            paymentMethod: method
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay

            const response = await fetch('http://localhost:8080/api/payments/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentRequest)
            });

            if (response.ok) {
                // Use context to update state globally
                const isPremium = selectedPlan.price > 0;
                
                // This updates the React Context AND localStorage instantly
                updateProfile({ isPremium: isPremium });
                
                setSelectedPlan(null);
                if (isPremium) {
                    navigate('/workouts');
                } else {
                    navigate('/dashboard');
                }
            } else {
                alert("Transaction failed. Please try again.");
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Network error processing request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-8 font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
                    <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-2 block">Choose Your Path</span>
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-slate-600">Start for free or upgrade to unlock your full potential.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 justify-center items-start">
                    {plans.map(plan => {
                        const isYearly = plan.planName.toLowerCase().includes('year');
                        const isFree = plan.price === 0;
                        const benefits = getPlanBenefits(plan.planName);

                        return (
                            <div 
                                key={plan.id} 
                                className={`relative bg-white rounded-3xl p-8 flex flex-col h-full transition-all duration-300 
                                    ${isYearly 
                                        ? 'border-2 border-blue-500 shadow-xl scale-105 z-10' 
                                        : 'border border-slate-100 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isYearly && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 tracking-wide whitespace-nowrap">
                                        <Crown className="w-3 h-3" /> BEST VALUE
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.planName}</h3>
                                    <p className="text-slate-500 text-sm">{plan.description}</p>
                                </div>

                                <div className="mb-8 pb-8 border-b border-slate-100">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                                        <span className="text-slate-500 font-medium">
                                            {isFree ? '/ forever' : isYearly ? '/ year' : '/ month'}
                                        </span>
                                    </div>
                                    {isYearly && <p className="text-xs text-green-600 font-bold mt-2">Save 20% compared to monthly</p>}
                                </div>

                                <div className="space-y-4 mb-8 flex-1">
                                    {benefits.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3 group">
                                            <div className={`p-1 mt-0.5 rounded-full shrink-0 transition-colors ${isYearly ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className="text-sm text-slate-600 leading-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`w-full py-3 rounded-xl font-bold transition-all transform active:scale-95 ${
                                        isYearly 
                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:opacity-90' 
                                        : isFree
                                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        : 'bg-slate-800 text-white hover:bg-slate-900'
                                    }`}
                                >
                                    {isFree ? 'Get Started' : 'Choose Plan'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 text-center flex flex-col items-center gap-2 text-slate-400 text-sm">
                    <Shield className="w-6 h-6 mb-1 opacity-50" />
                    <p>Secure payment processing via SSL encryption.</p>
                </div>
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
};

export default Plans;