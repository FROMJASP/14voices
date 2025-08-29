'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Trash2 } from 'lucide-react';
import { useCartStore } from '@/stores';

interface CartHoverMenuProps {
  isVisible: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

interface CartItemDisplayProps {
  item: {
    id: string;
    name: string;
    price: number;
    details: string[];
  };
  onRemove: (id: string) => void;
}

const CartItemDisplay = ({ item, onRemove }: CartItemDisplayProps) => {
  // Format price with proper currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        padding: '16px 0',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      {/* Placeholder for voiceover photo - you can replace this with actual image */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: '1px solid var(--border)',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: 'var(--text-secondary)' }}
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>

      {/* Item content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: '0 0 4px 0',
            lineHeight: '1.4',
          }}
        >
          {item.name}
        </h4>

        {/* Production details */}
        <div style={{ marginBottom: '8px' }}>
          {item.details.map((detail, index) => (
            <p
              key={index}
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                margin: '0',
                lineHeight: '1.3',
              }}
            >
              {detail}
            </p>
          ))}
        </div>

        {/* Price */}
        <p
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--primary)',
            margin: '0',
          }}
        >
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(item.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          color: 'var(--text-secondary)',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface)';
          e.currentTarget.style.color = 'var(--destructive)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
};

export function CartHoverMenu({ isVisible, onClose, triggerRef }: CartHoverMenuProps) {
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = useCartStore((state) => state.itemCount);
  const cartTotal = useCartStore((state) => state.total);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }

    return undefined;
  }, [isVisible, onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVisible &&
        menuRef.current &&
        triggerRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }

    return undefined;
  }, [isVisible, onClose, triggerRef]);

  // Format total price
  const formatTotal = (total: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(total);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              zIndex: 40,
              backdropFilter: 'blur(2px)',
            }}
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, x: '100%', scale: 0.95 }}
            animate={{ opacity: 1, x: '0%', scale: 1 }}
            exit={{ opacity: 0, x: '100%', scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
            style={{
              position: 'fixed',
              top: '80px', // Below navigation bar
              right: '24px',
              width: '400px',
              maxWidth: 'calc(100vw - 48px)',
              maxHeight: 'calc(100vh - 120px)',
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              zIndex: 50,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 20px 16px 20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                Winkelwagen ({cartItemCount})
              </h3>

              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Content */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 20px',
                maxHeight: '400px',
              }}
            >
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    padding: '40px 0',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px auto',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 8px 0' }}>
                    Je winkelwagen is leeg
                  </p>
                  <p style={{ fontSize: '14px', margin: 0 }}>Voeg voice-overs toe om te beginnen</p>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <CartItemDisplay key={item.id} item={item} onRemove={removeItem} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer with Total and Actions */}
            {cartItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  padding: '16px 20px 20px 20px',
                  borderTop: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                }}
              >
                {/* Total */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Totaal
                  </span>
                  <span
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: 'var(--primary)',
                    }}
                  >
                    {formatTotal(cartTotal)}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link
                    href="/order"
                    onClick={onClose}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      backgroundColor: 'var(--primary)',
                      color: 'black',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-block',
                    }}
                  >
                    Naar winkelwagen
                  </Link>

                  <button
                    onClick={clearCart}
                    style={{
                      padding: '12px',
                      backgroundColor: 'transparent',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface)';
                      e.currentTarget.style.borderColor = 'var(--destructive)';
                      e.currentTarget.style.color = 'var(--destructive)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
