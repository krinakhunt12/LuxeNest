import React, { useState } from 'react';
import { Mail, Send, Sparkles } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubscribed(true);
    setIsSubmitting(false);
    setEmail('');
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 animate-scale-in">
              <Mail className="text-white" size={40} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 serif text-white">
              Stay Inspired
            </h2>
            <div className="w-20 h-1 bg-white mx-auto mb-6 animate-scale-in"></div>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
              Get exclusive access to new collections, design tips, and special offers delivered to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 rounded-full text-gray-800 placeholder-gray-500 bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300"
                  required
                />
                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] animate-pulse" size={20} />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300 hover-scale hover-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {isSubscribed && (
            <div className="mt-6 p-4 bg-white/20 rounded-full backdrop-blur-sm animate-scale-in">
              <p className="text-white font-medium">
                🎉 Thank you for subscribing! Check your email for a welcome gift.
              </p>
            </div>
          )}

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80 text-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Exclusive offers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Early access</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Unsubscribe anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
