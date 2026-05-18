import React, { useState, useMemo } from 'react';
import { Phone, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { normalizePhoneNumber, isPhoneValid } from '../lib/phoneUtils';

interface PhoneInputComponentProps {
  onContinue: (phone: string) => void;
  initialValue?: string;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export const PhoneInputComponent: React.FC<PhoneInputComponentProps> = ({
  onContinue,
  initialValue = '',
  isLoading = false,
  title = 'Contact Number',
  description = 'Enter your phone number to continue'
}) => {
  const [rawInput, setRawInput] = useState(initialValue);

  const normalizedPhone = useMemo(() => {
    return normalizePhoneNumber(rawInput);
  }, [rawInput]);

  const isValid = useMemo(() => {
    return isPhoneValid(normalizedPhone);
  }, [normalizedPhone]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      console.log('Normalized Phone:', normalizedPhone);
      onContinue(normalizedPhone);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-surface border border-border rounded-[32px] shadow-sm space-y-8">
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-muted">{description}</p>
      </div>

      <form onSubmit={handleContinue} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] px-1">
            Phone Number
          </label>
          <div className="relative">
            <input 
              type="text"
              placeholder="+7 (999) 000-00-00"
              className={cn(
                "w-full h-14 pl-12 pr-4 rounded-2xl bg-background border outline-none text-sm transition-all shadow-sm font-medium",
                rawInput && !isValid ? "border-red-500/50 focus:border-red-500" : "border-border focus:border-primary"
              )}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              <Phone className="w-5 h-5" />
            </div>
          </div>
          {rawInput && !isValid && (
            <p className="text-[10px] text-red-500 font-medium px-1">
              Please enter a valid phone number
            </p>
          )}
        </div>

        <button 
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full h-14 bg-primary text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Continue
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-border/50">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-muted/60 text-center uppercase tracking-wider font-bold">
            Normalization format
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="p-2 rounded-lg bg-background/50 border border-border/30 text-center">
              <p className="text-[9px] text-muted uppercase">Russia (8...)</p>
              <p className="text-xs font-bold text-primary">+7...</p>
            </div>
            <div className="p-2 rounded-lg bg-background/50 border border-border/30 text-center">
              <p className="text-[9px] text-muted uppercase">Bali (0...)</p>
              <p className="text-xs font-bold text-primary">+62...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
