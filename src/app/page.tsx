import Link from "next/link";
import { db } from "~/server/db";
import { customers } from "~/server/db/schema";
import { addCustomer } from "./actions";

export default async function HomePage() {
  const allCustomers = await db.select().from(customers);

  return (
    // 使用更深邃的徑向漸層背景
    <main className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-black text-slate-200 p-4 md:p-12">
      <div className="container mx-auto max-w-5xl">
        
        {/* 標題區：增加文字漸層與陰影 */}
        <header className="mb-16 text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
              CRM
            </span>
            <span className="text-white ml-4">ULTIMATE</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">智能客戶管理解決方案</p>
          
          <div className="pt-6">
            <Link 
              href="/bmi" 
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              體適能 BMI 工具 →
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 左側：新增客戶卡片 (佔 4 格) */}
          <section className="lg:col-span-4">
            <div className="sticky top-12 p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="text-purple-400 text-2xl">+</span> 新增客戶檔案
              </h2>
              <form action={addCustomer} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">姓名</label>
                  <input
                    name="name"
                    placeholder="例如：張小明"
                    className="w-full bg-slate-800/50 border border-white/5 p-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-600"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">電子郵件</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="example@mail.com"
                    className="w-full bg-slate-800/50 border border-white/5 p-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-600"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-white shadow-lg shadow-purple-900/20 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                  確認錄入系統
                </button>
              </form>
            </div>
          </section>

          {/* 右側：客戶列表 (佔 8 格) */}
          <section className="lg:col-span-8">
            <div className="overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-sm shadow-2xl">
              <div className="p-8 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                <h2 className="text-2xl font-bold italic">DATABASE <span className="text-slate-500 font-light text-base not-italic ml-2">/ 實時清單</span></h2>
                <span className="px-3 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-mono">
                  {allCustomers.length} RECORDS
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-500 uppercase text-[10px] tracking-[0.2em]">
                      <th className="p-6 font-black">姓名</th>
                      <th className="p-6 font-black">聯繫方式</th>
                      <th className="p-6 font-black text-right">狀態</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allCustomers.map((c) => (
                      <tr key={c.id} className="group hover:bg-white/[0.03] transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center font-bold text-purple-400">
                              {c.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-200">{c.name}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-slate-400 text-sm font-mono">{c.email}</span>
                        </td>
                        <td className="p-6 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {allCustomers.length === 0 && (
                <div className="py-32 text-center">
                  <div className="inline-block p-4 rounded-full bg-white/5 mb-4">📂</div>
                  <p className="text-slate-500 font-medium text-sm">資料庫目前空空如也...</p>
                </div>
              )}
            </div>
            
            <footer className="mt-8 text-center text-slate-600 text-[10px] tracking-widest uppercase">
              Secure Data Storage Powered by Neon PostgreSQL
            </footer>
          </section>
          
        </div>
      </div>
    </main>
  );
}