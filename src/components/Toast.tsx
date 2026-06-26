/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast, language } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="pointer-events-auto flex items-start gap-3 p-4 rounded-sm border bg-white/95 backdrop-blur-md shadow-2xl border-stone-200"
              style={{
                boxShadow: isSuccess 
                  ? '0 10px 30px -10px rgba(212, 175, 55, 0.15)' 
                  : '0 10px 30px -10px rgba(239, 68, 68, 0.15)'
              }}
            >
              {isSuccess && <CheckCircle className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />}
              {isError && <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />}

              <div className="flex-1 text-xs font-semibold text-stone-900 uppercase tracking-wider font-sans">
                {toast.message[language]}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-stone-900 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
