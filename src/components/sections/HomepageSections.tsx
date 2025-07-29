'use client';

import { motion } from 'framer-motion';
import { Mic2, Euro, BookOpen, Mail, Play, Star, Users } from 'lucide-react';

export function StemmenSection() {
  return (
    <section
      id="stemmen"
      className="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Onze Stemmen
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Ontdek ons diverse team van professionele stemacteurs, elk met hun unieke klank en
            expertise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mic2 className="w-20 h-20 text-purple-600/20 dark:text-purple-400/20" />
                </div>
                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                  <Play className="w-16 h-16 text-white" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Stem Artiest {i}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Gespecialiseerd in commercials, documentaires en corporate video&apos;s
                </p>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">4.9</span>
                  <span className="text-sm text-slate-500">(120+ projecten)</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PrijzenSection() {
  const plans = [
    {
      name: 'Basis',
      price: '€150',
      duration: 'per minuut',
      features: [
        'Professionele opname',
        'Standaard bewerking',
        '2 revisierondes',
        'WAV & MP3 formaat',
        '48 uur levertijd',
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: '€250',
      duration: 'per minuut',
      features: [
        'Premium opname kwaliteit',
        'Geavanceerde bewerking',
        '5 revisierondes',
        'Alle audio formaten',
        '24 uur levertijd',
        'Achtergrondmuziek inbegrepen',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Op maat',
      duration: 'projectbasis',
      features: [
        'Meerdere stemacteurs',
        'Volledige productie',
        'Onbeperkte revisies',
        'Project management',
        'Prioriteit support',
        'Lange termijn contract',
      ],
      popular: false,
    },
  ];

  return (
    <section id="prijzen" className="py-20 md:py-32 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6">
            <Euro className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Transparante Prijzen</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Kies het pakket dat bij uw project past. Geen verborgen kosten.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                'relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300',
                plan.popular && 'ring-2 ring-purple-600 scale-105'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Meest gekozen
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-slate-600 dark:text-slate-400 ml-2">{plan.duration}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={cn(
                    'w-full py-3 px-6 rounded-lg font-medium transition-all duration-200',
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                  )}
                >
                  Kies {plan.name}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BlogSection() {
  const posts = [
    {
      title: 'De Kunst van Voice-Over: Tips voor Beginners',
      excerpt:
        'Ontdek de essentiële technieken en best practices voor het opnemen van professionele voice-overs.',
      date: '15 Nov 2024',
      readTime: '5 min',
      category: 'Tips & Tricks',
    },
    {
      title: 'Trends in Voice-Over voor 2024',
      excerpt:
        'Een blik op de opkomende trends in de voice-over industrie en wat dit betekent voor uw projecten.',
      date: '10 Nov 2024',
      readTime: '7 min',
      category: 'Industrie',
    },
    {
      title: 'Het Belang van de Juiste Stem voor Uw Merk',
      excerpt: 'Hoe de juiste stem keuze het verschil kan maken in uw marketing en merkidentiteit.',
      date: '5 Nov 2024',
      readTime: '6 min',
      category: 'Marketing',
    },
  ];

  return (
    <section
      id="blog"
      className="py-20 md:py-32 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Laatste Nieuws & Inzichten</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Blijf op de hoogte van de laatste ontwikkelingen in de wereld van voice-over
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20"></div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                  <span>{post.readTime} lezen</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{post.excerpt}</p>
                <div className="flex items-center text-purple-600 font-medium">
                  Lees meer
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="py-20 md:py-32 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Start Uw Project Vandaag</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Heeft u een voice-over nodig? Neem contact op en ontvang binnen 24 uur een offerte op
            maat
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-2xl">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-12">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Naam</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                      placeholder="Uw naam"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                      placeholder="uw@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Project Type</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all">
                    <option>Commercial</option>
                    <option>Documentaire</option>
                    <option>E-learning</option>
                    <option>Audioboek</option>
                    <option>Anders</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bericht</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all resize-none"
                    placeholder="Vertel ons meer over uw project..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Verstuur Aanvraag
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
