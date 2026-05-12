export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-100">Get in Touch</h1>
        <p className="text-slate-400 text-lg">Have a question about our architecture? Want to join the team? Drop us a message.</p>
      </div>

      <div className="card p-8 md:p-10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none"></div>
        
        <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-300">Full Name</label>
              <input type="text" id="name" className="input-field" placeholder="Ada Lovelace" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">Email Address</label>
              <input type="email" id="email" className="input-field" placeholder="ada@example.com" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium text-slate-300">Subject</label>
            <input type="text" id="subject" className="input-field" placeholder="Engineering Inquiry" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-slate-300">Message</label>
            <textarea id="message" rows="5" className="input-field resize-none" placeholder="Tell us what's on your mind..."></textarea>
          </div>
          
          <button type="submit" className="btn-primary w-full flex justify-center items-center space-x-2">
            <span>Send Message</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
