'use client'

import Link from 'next/link'
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <span className="text-dark font-bold text-xl">Z</span>
            </div>
            <span className="text-2xl font-bold">ZBank</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-gray-300">Core Banking System Demo</span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-gradient">Banking</span>
            <br />
            <span className="text-white">Reimagined</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Experience the future of digital banking with cutting-edge security,
            instant transactions, and seamless user experience.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/register" className="btn-primary flex items-center gap-2">
              Open Account <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="btn-secondary">
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose ZBank?</h2>
            <p className="text-gray-400">Built with enterprise-grade technology</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Bank-Grade Security',
                desc: 'JWT authentication with ACID-compliant transactions ensure your money is always safe.',
                color: 'accent',
              },
              {
                icon: Zap,
                title: 'Instant Transfers',
                desc: 'Send money to any account instantly with real-time balance updates.',
                color: 'primary-400',
              },
              {
                icon: Globe,
                title: 'External Integration',
                desc: 'Connect with payment gateways and external services seamlessly.',
                color: 'purple-400',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-8 hover:border-accent/30 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-${item.color}/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`text-${item.color}`} size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="glass rounded-3xl p-8 md:p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of users who trust ZBank for their digital banking needs.
            </p>
            <Link href="/register" className="btn-primary inline-flex items-center gap-2">
              Create Your Account <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-dark font-bold">Z</span>
            </div>
            <span className="font-semibold text-white">ZBank</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span>Spring Boot 3.x</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>Next.js 14</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>PostgreSQL</span>
          </div>
          <p>&copy; 2024 ZBank. Core Banking Demo.</p>
        </div>
      </footer>
    </main>
  )
}
