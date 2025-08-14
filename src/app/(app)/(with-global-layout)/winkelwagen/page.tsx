'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bricolage_Grotesque, Instrument_Serif } from 'next/font/google';
import {
  ShoppingCart,
  Trash2,
  Edit3,
  User,
  Package,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  Sparkles,
  FileText,
  Plus,
  Globe,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

interface OrderFormData {
  scriptText: string;
  toneOfVoice: string;
  referenceExamples: string;
  deliveryDate: string;
  wordCount: number;
}

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    cartTotal,
    selectedVoiceover,
    productionName,
    wordCount,
    region,
    removeItem,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState<OrderFormData>({
    scriptText: '',
    toneOfVoice: '',
    referenceExamples: '',
    deliveryDate: '',
    wordCount: 0,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate word count automatically from script text
  useEffect(() => {
    const words = formData.scriptText.trim().split(/\s+/).filter(word => word.length > 0);
    setFormData(prev => ({
      ...prev,
      wordCount: formData.scriptText.trim() ? words.length : 0,
    }));
  }, [formData.scriptText]);

  // Font classes for consistency
  const fontClasses = `${bricolageGrotesque.variable} ${instrumentSerif.variable}`;

  // Check if cart is empty
  const isEmpty = !selectedVoiceover && (!cartItems || cartItems.length === 0) && !productionName;

  // Calculate subtotals
  const extrasSubtotal = useMemo(() => {
    return cartItems
      .filter(item => item.id.startsWith('option-'))
      .reduce((sum, item) => sum + item.price, 0);
  }, [cartItems]);

  // Handle form submission
  const handleCheckout = async () => {
    if (!formData.scriptText.trim()) {
      alert('Voer eerst je script in om door te gaan.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      setTimeout(() => {
        clearCart();
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error('Order processing failed:', error);
      alert('Er is iets misgegaan. Probeer het opnieuw.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Success animation
  if (showSuccess) {
    return (
      <div className={`min-h-screen bg-background ${fontClasses}`}>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-text-primary mb-4"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Bestelling ontvangen!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-text-secondary text-lg mb-6"
          >
            We nemen binnen 24 uur contact met je op om de details door te spreken.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-text-muted"
          >
            Je wordt doorgestuurd naar de homepage...
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${fontClasses}`}>
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-3xl lg:text-4xl font-bold text-text-primary"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                Winkelwagen
              </h1>
              <p className="text-text-secondary mt-1">
                Voltooi je bestelling en voeg je projectdetails toe
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {!isEmpty && (
                <button
                  onClick={clearCart}
                  className="text-sm text-text-muted hover:text-destructive transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Wis winkelwagen
                </button>
              )}
              
              <Link
                href="/voiceovers"
                className="text-sm text-primary hover:text-primary-hover transition-colors font-medium flex items-center gap-2"
              >
                Bekijk stemmen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEmpty ? (
          // Empty Cart State
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-text-muted" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Je winkelwagen is leeg
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Ontdek onze professionele voice-over artiesten en selecteer de perfecte stem voor jouw project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/voiceovers"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors flex items-center gap-2 justify-center"
              >
                <User className="w-5 h-5" />
                Bekijk stemmen
              </Link>
              <Link
                href="/"
                className="bg-surface text-text-primary border border-border px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors flex items-center gap-2 justify-center"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Terug naar home
              </Link>
            </div>
          </div>
        ) : (
          // Cart Content
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items & Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cart Items Section */}
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
                  <Package className="w-6 h-6 text-primary" />
                  Jouw selectie
                </h2>

                <div className="space-y-6">
                  {/* Selected Voiceover */}
                  {selectedVoiceover && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-background rounded-xl p-6 border border-border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          {selectedVoiceover.profilePhoto ? (
                            <Image
                              src={selectedVoiceover.profilePhoto}
                              alt={selectedVoiceover.name}
                              width={60}
                              height={60}
                              className="w-15 h-15 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-15 h-15 rounded-full bg-primary/20 flex items-center justify-center">
                              <User className="w-8 h-8 text-primary" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-text-primary text-lg">Stemacteur</h3>
                            <p className="text-text-primary font-semibold">{selectedVoiceover.name}</p>
                            <p className="text-sm text-text-secondary">Professionele voice-over</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-text-muted">Inclusief</p>
                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">Geselecteerd</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Production Configuration */}
                  {productionName && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-background rounded-xl p-6 border border-border"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-text-primary text-lg mb-2">Productieconfiguratie</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-primary" />
                              <span className="font-semibold text-text-primary">{productionName}</span>
                            </div>
                            {wordCount && (
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-text-secondary" />
                                <span className="text-text-secondary">{wordCount}</span>
                              </div>
                            )}
                            {region && (
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-text-secondary" />
                                <span className="text-text-secondary">Uitzendgebied: {region}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-text-primary">
                            €{cartItems.find(item => item.name === productionName)?.price || 0}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Additional Items */}
                  {cartItems.filter(item => item.id !== 'production' && item.name !== productionName).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (index + 2) }}
                      className="bg-background rounded-xl p-4 border border-border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {item.id.startsWith('option-') ? (
                              <Plus className="w-5 h-5 text-primary" />
                            ) : (
                              <Package className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-text-primary">{item.name}</p>
                            {item.id.startsWith('option-') && (
                              <p className="text-sm text-text-secondary">Extra optie</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-text-primary">€{item.price}</span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-text-muted hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                            aria-label={`Verwijder ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Project Details Form */}
              <div className="bg-surface rounded-xl border border-border p-6">
                <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
                  <Edit3 className="w-6 h-6 text-primary" />
                  Projectdetails
                </h2>

                <div className="space-y-6">
                  {/* Script Text Area */}
                  <div>
                    <label htmlFor="scriptText" className="block text-sm font-semibold text-text-primary mb-2">
                      Script tekst *
                    </label>
                    <div className="relative">
                      <textarea
                        id="scriptText"
                        value={formData.scriptText}
                        onChange={(e) => setFormData(prev => ({ ...prev, scriptText: e.target.value }))}
                        placeholder="Plak hier de tekst die ingesproken moet worden..."
                        className="w-full h-32 px-4 py-3 rounded-lg border border-border bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        required
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-text-muted bg-surface px-2 py-1 rounded">
                        {formData.wordCount} woorden
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary mt-2">
                      De tekst die door de stemacteur wordt ingesproken
                    </p>
                  </div>

                  {/* Tone of Voice */}
                  <div>
                    <label htmlFor="toneOfVoice" className="block text-sm font-semibold text-text-primary mb-2">
                      Beschrijf de tone of voice die je wil
                    </label>
                    <textarea
                      id="toneOfVoice"
                      value={formData.toneOfVoice}
                      onChange={(e) => setFormData(prev => ({ ...prev, toneOfVoice: e.target.value }))}
                      placeholder="Bijvoorbeeld: Warm en vriendelijk, professioneel, energiek, rustig en vertrouwenswaardig..."
                      className="w-full h-24 px-4 py-3 rounded-lg border border-border bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                    <p className="text-sm text-text-secondary mt-2">
                      Beschrijf hoe je wilt dat de stem klinkt en overkomt
                    </p>
                  </div>

                  {/* Reference Examples */}
                  <div>
                    <label htmlFor="referenceExamples" className="block text-sm font-semibold text-text-primary mb-2">
                      Referentie voorbeelden (optioneel)
                    </label>
                    <textarea
                      id="referenceExamples"
                      value={formData.referenceExamples}
                      onChange={(e) => setFormData(prev => ({ ...prev, referenceExamples: e.target.value }))}
                      placeholder="Links naar video's, audio's of beschrijvingen van vergelijkbare producties..."
                      className="w-full h-20 px-4 py-3 rounded-lg border border-border bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                    <p className="text-sm text-text-secondary mt-2">
                      Deel referenties die helpen om jouw gewenste stijl te begrijpen
                    </p>
                  </div>

                  {/* Delivery Date */}
                  <div>
                    <label htmlFor="deliveryDate" className="block text-sm font-semibold text-text-primary mb-2">
                      Gewenste opleverdatum
                    </label>
                    <input
                      type="date"
                      id="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                      className="px-4 py-3 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-sm text-text-secondary mt-2">
                      We leveren standaard binnen 48 uur
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-surface rounded-xl border border-border p-6">
                  <h3 className="text-lg font-bold text-text-primary mb-6">Bestelling overzicht</h3>

                  {/* Order Items */}
                  <div className="space-y-3 mb-6">
                    {selectedVoiceover && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Stemacteur</span>
                        <span className="text-text-muted">Inclusief</span>
                      </div>
                    )}

                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary flex-1 truncate">{item.name}</span>
                        <span className="font-medium text-text-primary ml-2">€{item.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Subtotals */}
                  {extrasSubtotal > 0 && (
                    <div className="border-t border-border pt-4 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Extra opties</span>
                        <span className="font-medium text-text-primary">€{extrasSubtotal}</span>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-text-primary">Totaal</span>
                      <span className="text-2xl font-bold text-text-primary">€{cartTotal}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    disabled={!formData.scriptText.trim() || isProcessing}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                      !formData.scriptText.trim() || isProcessing
                        ? 'bg-muted text-text-muted cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                        />
                        Verwerken...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-6 h-6" />
                        Doorgaan naar afrekenen
                      </>
                    )}
                  </motion.button>

                  {!formData.scriptText.trim() && (
                    <p className="text-sm text-destructive text-center mt-3">
                      Vul eerst je script in om door te gaan
                    </p>
                  )}

                  {/* Trust Indicators */}
                  <div className="mt-8 pt-6 border-t border-border space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-text-secondary">Levering binnen 48 uur</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-text-secondary">100% tevredenheidsgarantie</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-text-secondary">Professionele kwaliteit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}