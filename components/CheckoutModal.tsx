'use client';

import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  Layers, 
  Zap, 
  Loader2,
  Check
} from 'lucide-react';
import { UserAccount, firebaseSkeleton } from '@/lib/auth';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: () => void;
  currentUser: UserAccount | null;
  onUserUpdate: (user: UserAccount) => void;
  preSelectedNodeTitle?: string;
}

export function CheckoutModal({
  isOpen,
  onClose,
  onPurchaseSuccess,
  currentUser,
  onUserUpdate,
  preSelectedNodeTitle,
}: CheckoutModalProps) {
  useBodyScrollLock(isOpen);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'google_pay' | 'card'>('google_pay');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState('Alexander Jackson');
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const user = await firebaseSkeleton.signInWithGoogle();
      onUserUpdate(user);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handlePay = async (method: 'google_pay' | 'credit_card') => {
    setIsProcessingPayment(true);
    try {
      const updated = await firebaseSkeleton.processCheckoutPayment(method);
      onUserUpdate(updated);
      setPurchaseComplete(true);
      setTimeout(() => {
        onPurchaseSuccess();
        onClose();
        setPurchaseComplete(false);
      }, 1400);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-lg rounded-2xl border-2 border-amber-500/50 bg-[#12130e] text-stone-100 shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient decorations */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-yellow-500/15 blur-3xl pointer-events-none" />

        {/* Top bar */}
        <div className="px-5 py-4 border-b-2 border-stone-800 bg-[#181913] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-950/90 border border-amber-400/50 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold font-mono text-stone-100">
                  Unlock TechBook Pro
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Read. Code. Earn.
                </span>
              </div>
              <span className="text-[11px] font-mono text-amber-400 font-semibold">
                Lifetime Unrestricted Access · $8.99 USD
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {purchaseComplete ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 flex items-center justify-center animate-bounce shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <Check className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-mono text-slate-100">Full Access Granted!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                All 131 knowledge nodes, 260 KaTeX equations, and behavioral monetization blueprints are now completely unlocked.
              </p>
            </div>
          ) : (
            <>
              {preSelectedNodeTitle && (
                <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono text-cyan-200 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Unlocking: <strong className="text-white">{preSelectedNodeTitle}</strong></span>
                </div>
              )}

              {/* What you get */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2 font-mono">
                <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold">
                  Included in Lifetime Membership:
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>All 131 Architecture Nodes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>260 KaTeX Formulas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Production AI &amp; Evals</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Gamification &amp; SaaS Economics</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Authentication */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">
                    Step 1: Account &amp; Identity
                  </span>
                  {currentUser && (
                    <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                      <Check className="w-3 h-3" /> Signed In
                    </span>
                  )}
                </div>

                {currentUser ? (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400/50 flex items-center justify-center font-bold text-xs text-cyan-300 shrink-0">
                      {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate text-slate-100">
                        {currentUser.displayName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate font-mono">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-medium text-xs shadow-md transition-all cursor-pointer touch-manipulation min-h-[42px]"
                  >
                    {isSigningIn ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    )}
                    <span>{isSigningIn ? 'Connecting to Google...' : 'Continue with Google'}</span>
                  </button>
                )}
              </div>

              {/* Step 2: Payment Method Choice */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
                <span className="text-slate-400 font-semibold uppercase text-[10px] font-mono">
                  Step 2: Instant Checkout ($8.99)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('google_pay')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono transition-all cursor-pointer ${
                      paymentMethod === 'google_pay'
                        ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Credit Card</span>
                  </button>
                </div>

                {paymentMethod === 'google_pay' ? (
                  <button
                    type="button"
                    onClick={() => handlePay('google_pay')}
                    disabled={isProcessingPayment}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-stone-950 font-sans font-black text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_25px_rgba(245,158,11,0.5)] border border-amber-300 transition-all cursor-pointer touch-manipulation min-h-[48px] active:scale-98"
                  >
                    {isProcessingPayment ? (
                      <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                    ) : (
                      <Zap className="w-4 h-4 text-stone-950 fill-stone-950" />
                    )}
                    <span>{isProcessingPayment ? 'AUTHORIZING $8.99...' : 'PAY $8.99 WITH GOOGLE PAY'}</span>
                  </button>
                ) : (
                  <div className="space-y-2 pt-1 font-mono text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400">Exp Date</label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePay('credit_card')}
                      disabled={isProcessingPayment}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-stone-950 font-sans font-black text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_25px_rgba(245,158,11,0.5)] border border-amber-300 transition-all cursor-pointer touch-manipulation min-h-[48px] active:scale-98"
                    >
                      {isProcessingPayment ? (
                        <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-stone-950" />
                      )}
                      <span>{isProcessingPayment ? 'SECURING TRANSACTION...' : 'COMPLETE PAYMENT · $8.99'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulated Encrypted 256-bit SSL Checkout · Instant Node Unlock</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
