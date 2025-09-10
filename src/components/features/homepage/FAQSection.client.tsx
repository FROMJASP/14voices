'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
// TODO: Replace with generated types after running bun payload generate:types
interface FAQ {
  id: string | number;
  question: string;
  answer: any; // Rich text field
  category: string;
  order: number;
  published: boolean;
}

interface FAQSettings {
  title?: string;
  description?: string;
  showCategories?: boolean;
}

interface FAQSectionClientProps {
  settings: FAQSettings;
  items: FAQ[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// Function to convert rich text to plain text (simple version)
function richTextToPlainText(richText: any): string {
  if (!richText || !richText.root || !richText.root.children) {
    return '';
  }

  const extractText = (node: any): string => {
    if (node.text) {
      return node.text;
    }
    if (node.children && Array.isArray(node.children)) {
      return node.children.map(extractText).join(' ');
    }
    return '';
  };

  return richText.root.children.map(extractText).join('\n\n').trim();
}

export function FAQSectionClient({ settings, items }: FAQSectionClientProps) {
  // If no items, show a message for admins
  if (!items || items.length === 0) {
    return (
      <section id="faq" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h2
              className="text-4xl font-bold text-text-primary mb-4"
              style={{ fontFamily: 'var(--font-bricolage)' }}
            >
              {settings.title || 'Veelgestelde vragen'}
            </h2>
            <p className="text-text-secondary">
              Er zijn nog geen FAQ items toegevoegd. Ga naar het admin panel om FAQ items toe te
              voegen.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-4xl font-bold text-text-primary mb-4"
            style={{ fontFamily: 'var(--font-bricolage)' }}
            variants={itemVariants}
          >
            {settings.title || 'Veelgestelde vragen'}
          </motion.h2>
          {settings.description && (
            <motion.p
              className="text-lg text-text-secondary max-w-2xl mx-auto"
              variants={itemVariants}
            >
              {settings.description}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={itemVariants}
        >
          <Accordion type="single" collapsible className="w-full">
            {items.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id.toString()} className="border-border">
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-surface/50 transition-colors">
                  <span className="text-base font-medium text-text-primary">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-text-secondary leading-relaxed prose prose-sm max-w-none">
                    {richTextToPlainText(faq.answer)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <div className="text-center mt-8">
          <p className="text-text-secondary">
            Heeft u nog andere vragen?{' '}
            <a
              href="mailto:info@14voices.nl"
              className="text-primary hover:opacity-75 transition-opacity font-medium"
            >
              Neem contact met ons op
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
