import React from 'react';

export const SupportView: React.FC = () => {
  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full flex flex-col gap-8">
      <div className="border-b-hard pb-4">
        <h2 className="font-headline-md text-headline-md uppercase text-primary mb-2">Support & Help</h2>
        <p className="font-body-md text-on-surface-variant">Get assistance with your RAG pipelines and account.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Contact Form */}
        <div className="bg-surface-paper border-hard shadow-hard-lg p-8">
          <h3 className="font-headline-sm text-headline-sm uppercase text-primary border-b-hard pb-2 mb-6">Contact Support</h3>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <label className="font-label-bold text-label-bold uppercase text-primary">Issue Type</label>
              <select className="border-hard p-3 font-body-md bg-surface w-full focus:outline-none focus:ring-2 focus:ring-tertiary-orange">
                <option>Bug Report</option>
                <option>Billing Inquiry</option>
                <option>Feature Request</option>
                <option>Other</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-label-bold text-label-bold uppercase text-primary">Subject</label>
              <input type="text" className="border-hard p-3 font-body-md bg-surface w-full focus:outline-none focus:ring-2 focus:ring-tertiary-orange" placeholder="Brief summary of the issue" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-bold text-label-bold uppercase text-primary">Description</label>
              <textarea 
                className="border-hard p-3 font-body-md bg-surface w-full focus:outline-none focus:ring-2 focus:ring-tertiary-orange min-h-[150px] resize-y" 
                placeholder="Provide detailed information..."
              />
            </div>

            <button type="submit" className="mt-4 bg-primary text-on-primary border-hard shadow-hard py-3 px-8 font-label-bold text-label-bold uppercase hover:bg-tertiary-teal active-press transition-colors cursor-pointer w-fit">
              Submit Ticket
            </button>
          </form>
        </div>

        {/* FAQs */}
        <div className="flex flex-col gap-6">
          <h3 className="font-headline-sm text-headline-sm uppercase text-primary border-b-hard pb-2">Frequently Asked Questions</h3>
          
          <div className="bg-surface border-hard p-4 hover:shadow-hard transition-shadow">
            <h4 className="font-label-bold text-label-bold uppercase text-primary mb-2">Why is my pipeline failing to ingest?</h4>
            <p className="font-body-md text-on-surface-variant text-sm">
              Ensure your documents are in supported formats (PDF, TXT, MD) and do not exceed the 50MB file size limit per upload.
            </p>
          </div>

          <div className="bg-surface border-hard p-4 hover:shadow-hard transition-shadow">
            <h4 className="font-label-bold text-label-bold uppercase text-primary mb-2">How do I change the default LLM?</h4>
            <p className="font-body-md text-on-surface-variant text-sm">
              Navigate to the 'Models' tab from the sidebar to configure the global fallback and generation models used across your pipelines.
            </p>
          </div>

          <div className="bg-surface border-hard p-4 hover:shadow-hard transition-shadow">
            <h4 className="font-label-bold text-label-bold uppercase text-primary mb-2">Is voice transcription stored?</h4>
            <p className="font-body-md text-on-surface-variant text-sm">
              Voice data is processed entirely in memory. Audio blobs are discarded immediately after transcription to ensure strict privacy.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
};
