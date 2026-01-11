import { Phone, Mail, MapPin, Clock, Globe, Sparkles, Leaf, Instagram, Twitter, Facebook, Send } from "lucide-react";

export const Contact: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Immersive Contact Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Office" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1F2937]/70 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h4 className="text-[#D4AF37] uppercase tracking-[0.4em] font-bold text-xs mb-4">Concierge Services</h4>
          <h1 className="text-5xl md:text-7xl font-bold serif mb-6 tracking-tight">Connect With Us.</h1>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>
      </section>

      {/* Concierge Info Grid */}
      <section className="py-24 bg-white -mt-16 relative z-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 shadow-2xl rounded-sm border-t-4 border-[#D4AF37] flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-[#D4AF37] mb-6 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-bold serif mb-2">Speak With Us</h3>
              <p className="text-gray-400 text-sm mb-4">Available Mon-Fri, 9am - 6pm EST</p>
              <a href="tel:+18005893637" className="text-xl font-bold hover:text-[#D4AF37] transition-colors">+1 (800) LUXENEST</a>
            </div>
            <div className="bg-white p-10 shadow-2xl rounded-sm border-t-4 border-[#D4AF37] flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-[#D4AF37] mb-6 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-bold serif mb-2">Email Inquiries</h3>
              <p className="text-gray-400 text-sm mb-4">Response within 24 business hours</p>
              <a href="mailto:concierge@luxenest.com" className="text-xl font-bold hover:text-[#D4AF37] transition-colors">concierge@luxenest.com</a>
            </div>
            <div className="bg-white p-10 shadow-2xl rounded-sm border-t-4 border-[#D4AF37] flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-[#D4AF37] mb-6 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold serif mb-2">Main Gallery</h3>
              <p className="text-gray-400 text-sm mb-4">Visit our Manhattan showroom</p>
              <address className="not-italic text-sm font-bold leading-relaxed">
                742 Design Avenue, Chelsea<br />New York, NY 10001
              </address>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Map & Form */}
      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Form Section */}
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-bold serif mb-6">Send an Inquiry.</h2>
                <p className="text-gray-500 leading-relaxed">Interested in a custom piece or full interior styling? Share your vision with us, and our design leads will be in touch.</p>
              </div>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Full Name</label>
                  <input type="text" className="w-full bg-gray-50 border-b border-gray-200 py-4 px-2 outline-none focus:border-[#D4AF37] transition-colors" placeholder="Alexander Thorne" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Email Address</label>
                  <input type="email" className="w-full bg-gray-50 border-b border-gray-200 py-4 px-2 outline-none focus:border-[#D4AF37] transition-colors" placeholder="alex@design.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Inquiry Type</label>
                  <select className="w-full bg-gray-50 border-b border-gray-200 py-4 px-2 outline-none focus:border-[#D4AF37] transition-colors appearance-none cursor-pointer">
                    <option>Product Information</option>
                    <option>Custom Commission</option>
                    <option>Interior Design Consultation</option>
                    <option>Trade Program</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Your Message</label>
                  <textarea rows={5} className="w-full bg-gray-50 border-b border-gray-200 py-4 px-2 outline-none focus:border-[#D4AF37] transition-colors" placeholder="Tell us more about your project..."></textarea>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button className="bg-[#1F2937] text-white py-5 px-12 text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all flex items-center justify-center group">
                    Begin Conversation <Send size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>

            {/* Stylized Map Section */}
            <div className="relative group">
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#D4AF37] opacity-10 rounded-full blur-3xl group-hover:opacity-30 transition-opacity"></div>
              <div className="relative overflow-hidden rounded-sm shadow-2xl border border-gray-100 aspect-square lg:aspect-auto lg:h-[700px]">
                {/* Styled Placeholder for Map */}
                <div className="absolute inset-0 bg-[#E5E7EB]">
                  <img 
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Map Location" 
                    className="w-full h-full object-cover grayscale opacity-60"
                  />
                  {/* Map Marker Pin */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-20 h-20 bg-[#D4AF37] rounded-full opacity-20 animate-ping"></div>
                      <div className="relative w-12 h-12 bg-[#1F2937] text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white">
                        <MapPin size={24} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Map Overlay Card */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 border-l-4 border-[#D4AF37] shadow-xl">
                  <h4 className="font-bold serif mb-2">LuxeNest Chelsea Gallery</h4>
                  <p className="text-xs text-gray-500 mb-4 flex items-center"><Clock size={12} className="mr-2" /> Tue - Sun, 10:00 AM - 7:00 PM</p>
                  <button className="flex items-center text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:underline">
                    Get Directions <Globe size={14} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Showcase */}
      <section className="bg-gray-50 py-24 border-y">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full aspect-square object-cover rounded shadow-lg" alt="Showroom 1" />
                <img src="https://images.unsplash.com/photo-1567016432779-094069958ad5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full aspect-square object-cover rounded shadow-lg mt-8" alt="Showroom 2" />
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2 space-y-6">
              <h4 className="text-[#D4AF37] uppercase tracking-[0.3em] font-bold text-xs">Experience Luxury</h4>
              <h2 className="text-4xl font-bold serif">An In-Person Revelation.</h2>
              <p className="text-gray-500 leading-relaxed">
                Sometimes design needs to be felt. Our Chelsea gallery offers a tactile journey through our latest collections, featuring curated room sets that inspire and delight.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] rounded-full"><Sparkles size={18} /></div>
                  <p className="text-sm font-medium">Private Styling Appointments</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] rounded-full"><Leaf size={18} /></div>
                  <p className="text-sm font-medium">Material Library Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social CTA */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold serif mb-10">Follow Our Design Journey</h2>
          <div className="flex justify-center space-x-12">
            <a href="#" className="flex flex-col items-center group">
              <Instagram size={32} className="mb-3 text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Instagram</span>
            </a>
            <a href="#" className="flex flex-col items-center group">
              <Twitter size={32} className="mb-3 text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Twitter</span>
            </a>
            <a href="#" className="flex flex-col items-center group">
              <Facebook size={32} className="mb-3 text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Facebook</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};