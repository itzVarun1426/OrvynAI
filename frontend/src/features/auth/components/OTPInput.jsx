import { useRef, useEffect } from 'react';

const OTPInput = ({
  value = '',
  onChange,
  onComplete,
  isDisabled = false,
  autoFocus = true
}) => {
  const inputsRef = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  const handleChange = (index, e) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    if (!rawVal) return;

    // Take the last entered character if multiple were entered in single field
    const char = rawVal.slice(-1);
    const chars = value.split('');
    chars[index] = char;
    const newOtp = chars.slice(0, 6).join('');
    onChange(newOtp);

    // Auto-advance to next input
    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.length === 6 && onComplete) {
      onComplete(newOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const chars = value.split('');
      
      if (chars[index]) {
        // Clear current index digit
        chars[index] = '';
        const newOtp = chars.join('');
        onChange(newOtp);
      } else if (index > 0) {
        // Move back and clear previous digit
        chars[index - 1] = '';
        const newOtp = chars.join('');
        onChange(newOtp);
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData('text') || '';
    const numbersOnly = pasted.replace(/[^0-9]/g, '').slice(0, 6);
    if (!numbersOnly) return;

    onChange(numbersOnly);

    const focusIndex = Math.min(numbersOnly.length, 5);
    inputsRef.current[focusIndex]?.focus();

    if (numbersOnly.length === 6 && onComplete) {
      onComplete(numbersOnly);
    }
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }, (_, index) => (
        <input
          key={index}
          ref={(el) => { inputsRef.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[index]}
          disabled={isDisabled}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-2xl font-bold font-mono rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
          aria-label={`Digit ${index + 1} of 6`}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};

export default OTPInput;