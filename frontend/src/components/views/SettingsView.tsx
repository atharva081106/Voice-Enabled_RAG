
export const SettingsView: React.FC = () => {
  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full flex flex-col gap-8">
      <div className="border-b-hard pb-4">
        <h2 className="font-headline-md text-headline-md uppercase text-primary mb-2">Application Settings</h2>
        <p className="font-body-md text-on-surface-variant">Global preferences and configuration for Neo-RAG.</p>
      </div>

      <div className="max-w-4xl bg-surface-paper border-hard shadow-hard-lg p-8">
        <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* General Preferences */}
          <section>
            <h3 className="font-headline-sm text-headline-sm uppercase text-primary border-b-hard pb-2 mb-4">General Preferences</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-label-bold text-label-bold uppercase text-primary">Default Language</h4>
                  <p className="font-body-sm text-on-surface-variant">Language used for UI and default text generation.</p>
                </div>
                <select className="border-hard p-2 font-body-md bg-surface focus:outline-none focus:ring-2 focus:ring-tertiary-orange w-48">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-label-bold text-label-bold uppercase text-primary">Auto-Save History</h4>
                  <p className="font-body-sm text-on-surface-variant">Automatically save query transcripts to your account.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none border-hard rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-primary after:border-hard after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary-teal"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Privacy & Data */}
          <section>
            <h3 className="font-headline-sm text-headline-sm uppercase text-primary border-b-hard pb-2 mb-4">Privacy & Data</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-label-bold text-label-bold uppercase text-primary">Allow Telemetry</h4>
                  <p className="font-body-sm text-on-surface-variant">Send anonymous usage data to improve Neo-RAG.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none border-hard rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-primary after:border-hard after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary-teal"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-label-bold text-label-bold uppercase text-primary">Use Data for Training</h4>
                  <p className="font-body-sm text-on-surface-variant">Allow your queries to be used for fine-tuning our open models.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none border-hard rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-primary after:border-hard after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary-teal"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Dangerous Actions */}
          <section className="mt-4 p-4 border-hard border-error bg-error-container">
            <h3 className="font-headline-sm text-headline-sm uppercase text-on-error-container mb-2">Danger Zone</h3>
            <p className="font-body-md text-on-error-container mb-4">Actions here are permanent and cannot be undone.</p>
            <button type="button" className="bg-error text-on-error border-hard shadow-hard py-2 px-6 font-label-bold text-label-bold uppercase hover:opacity-90 active-press transition-colors cursor-pointer">
              Delete All History
            </button>
          </section>

          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-tertiary-orange text-primary border-hard shadow-hard py-3 px-8 font-label-bold text-label-bold uppercase hover:bg-primary hover:text-tertiary-orange active-press transition-colors cursor-pointer">
              Save Settings
            </button>
          </div>

        </form>
      </div>
    </main>
  );
};
