import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Option {
  value: string;
  label: string;
}

interface SmartSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  id?: string;
  disabled?: boolean;
}

const SmartSelect: React.FC<SmartSelectProps> = ({ options, value, onChange, label, id, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [maxHeight, setMaxHeight] = useState('16rem');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - 24; // 24px margin from bottom
      const spaceAbove = rect.top - 24; // 24px margin from top
      
      // Default preferred height
      const preferredHeight = 450;
      
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setOpenUpward(true);
        setMaxHeight(`${Math.min(spaceAbove, preferredHeight)}px`);
      } else {
        setOpenUpward(false);
        setMaxHeight(`${Math.max(250, Math.min(spaceBelow, preferredHeight))}px`);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={containerRef} id={id}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`peer w-full h-12 px-4 rounded-sm bg-white border cursor-pointer flex items-center justify-between transition-all ${
          isOpen ? 'border-gold-500 ring-1 ring-gold-500/20 shadow-md' : 'border-stone-200'
        } ${disabled ? 'bg-stone-50 cursor-not-allowed' : 'hover:bg-stone-50/50'}`}
      >
        <span className={`text-sm ${selectedOption ? 'text-stone-900 font-medium' : 'text-stone-300'}`}>
          {selectedOption ? selectedOption.label : 'সিলেক্ট করুন'}
        </span>
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gold-600' : ''}`} />
      </div>
      
      <label className={`absolute left-3.5 px-1 bg-white text-[9px] font-bold uppercase tracking-widest transition-all pointer-events-none ${
        selectedOption 
          ? '-top-2 text-gold-600' 
          : 'top-3.5 text-xs font-normal text-stone-300'
      }`}>
        {label}
      </label>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? 5 : -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? 5 : -5, scale: 0.98 }}
            className={`absolute left-0 right-0 z-[100] bg-white rounded-xl shadow-2xl border border-stone-200/60 overflow-hidden py-2 ${
              openUpward ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'
            }`}
            style={{ maxHeight }}
          >
              <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: `calc(${maxHeight} - 16px)` }}>
                {options.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`px-5 py-3.5 flex items-center justify-between cursor-pointer transition-colors border-b border-stone-50 last:border-0 ${
                      value === option.value ? 'bg-gold-50/30' : 'hover:bg-stone-50'
                    }`}
                  >
                    <span className={`text-[13px] font-medium tracking-wide ${
                      value === option.value ? 'text-gold-700' : 'text-stone-600'
                    }`}>
                      {option.label}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      value === option.value 
                        ? 'border-gold-500 bg-gold-500' 
                        : 'border-stone-200 bg-transparent'
                    }`}>
                      {value === option.value && <Check className="w-3 h-3 text-white stroke-[4px]" />}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSelect;
