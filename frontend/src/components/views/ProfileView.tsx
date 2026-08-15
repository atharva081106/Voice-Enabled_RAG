
export const ProfileView: React.FC = () => {
  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full flex flex-col gap-8">
      <div className="border-b-hard pb-4">
        <h2 className="font-headline-md text-headline-md uppercase text-primary mb-2">User Profile</h2>
        <p className="font-body-md text-on-surface-variant">Manage your account details and API access.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-surface-paper border-hard shadow-hard p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-tertiary-teal rounded-full border-hard flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-5xl text-on-tertiary">person</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm uppercase text-primary">Alex Mercer</h3>
            <p className="font-body-md text-on-surface-variant mb-4">Developer Tier</p>
            <span className="px-3 py-1 uppercase text-label-bold font-label-bold bg-surface border-hard">Active</span>
          </div>

          {/* Usage Stats */}
          <div className="bg-surface-paper border-hard shadow-hard p-6">
            <h3 className="font-headline-sm text-headline-sm uppercase text-primary border-b-hard pb-2 mb-4">Usage This Month</h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between font-label-bold text-label-bold uppercase text-primary mb-1">
                  <span>Tokens Generated</span>
                  <span>142k / 500k</span>
                </div>
                <div className="w-full h-3 bg-surface border-hard">
                  <div className="h-full bg-tertiary-orange border-r-hard" style={{ width: '28%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between font-label-bold text-label-bold uppercase text-primary mb-1">
                  <span>Storage Used</span>
                  <span>1.2GB / 5GB</span>
                </div>
                <div className="w-full h-3 bg-surface border-hard">
                  <div className="h-full bg-tertiary-teal border-r-hard" style={{ width: '24%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings & API Keys */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-surface-paper border-hard shadow-hard-lg p-8">
            <h3 className="font-headline-sm text-headline-sm uppercase text-primary border-b-hard pb-2 mb-6">Account Details</h3>
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-label-bold uppercase text-primary">First Name</label>
                  <input type="text" className="border-hard p-3 font-body-md bg-surface w-full" defaultValue="Alex" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-bold text-label-bold uppercase text-primary">Last Name</label>
                  <input type="text" className="border-hard p-3 font-body-md bg-surface w-full" defaultValue="Mercer" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-bold text-label-bold uppercase text-primary">Email Address</label>
                <input type="email" className="border-hard p-3 font-body-md bg-surface-dim w-full text-on-surface-variant cursor-not-allowed" defaultValue="alex.mercer@example.com" disabled />
              </div>
              <button type="submit" className="mt-2 bg-primary text-on-primary border-hard shadow-hard py-2 px-6 font-label-bold text-label-bold uppercase hover:bg-tertiary-teal active-press transition-colors cursor-pointer w-fit">
                Save Changes
              </button>
            </form>
          </div>

          <div className="bg-surface-paper border-hard shadow-hard-lg p-8">
            <div className="flex justify-between items-center border-b-hard pb-2 mb-6">
              <h3 className="font-headline-sm text-headline-sm uppercase text-primary">API Keys</h3>
              <button className="bg-tertiary-orange text-primary border-hard shadow-hard py-1 px-4 font-label-bold text-label-bold uppercase hover:bg-primary hover:text-tertiary-orange active-press transition-colors cursor-pointer text-sm">
                + Generate New
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface border-b-hard border-t-hard">
                    <th className="py-3 px-4 font-label-bold text-label-bold uppercase border-r-hard">Name</th>
                    <th className="py-3 px-4 font-label-bold text-label-bold uppercase border-r-hard">Key Prefix</th>
                    <th className="py-3 px-4 font-label-bold text-label-bold uppercase border-r-hard">Created</th>
                    <th className="py-3 px-4 font-label-bold text-label-bold uppercase w-20">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b-hard bg-surface-paper">
                    <td className="py-3 px-4 font-body-md border-r-hard">Production API</td>
                    <td className="py-3 px-4 font-body-md border-r-hard font-mono">nr_sk_prod_...</td>
                    <td className="py-3 px-4 font-body-sm border-r-hard text-on-surface-variant">Oct 12, 2023</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-error hover:text-primary cursor-pointer transition-colors" title="Revoke">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b-hard bg-surface-dim">
                    <td className="py-3 px-4 font-body-md border-r-hard">Local Testing</td>
                    <td className="py-3 px-4 font-body-md border-r-hard font-mono">nr_sk_test_...</td>
                    <td className="py-3 px-4 font-body-sm border-r-hard text-on-surface-variant">Jan 05, 2024</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-error hover:text-primary cursor-pointer transition-colors" title="Revoke">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};
