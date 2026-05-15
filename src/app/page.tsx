import Link from "next/link";
import { db } from "~/server/db";
import { customers } from "~/server/db/schema";
import { addCustomer } from "./actions";
import { count } from "drizzle-orm";

// 設定每頁顯示 5 筆
const ITEMS_PER_PAGE = 5;

export default async function HomePage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Next.js 15 修正：必須 await searchParams 才能取得頁碼
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams.page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // 同時抓取客戶資料與總數
  const [allCustomers, totalCountResult] = await Promise.all([
    db.select().from(customers).limit(ITEMS_PER_PAGE).offset(offset),
    db.select({ value: count() }).from(customers),
  ]);

  const totalRecords = totalCountResult[0]?.value ?? 0;
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  return (
    <main className="relative min-h-screen w-full bg-[#030712] text-slate-200">
      
      {/* 豪華商務背景：深色光暈與微妙噪點 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-6 py-16">
        
        {/* 標題區域 */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
          <div>
            <h1 className="text-6xl font-black tracking-tighter italic leading-none">
              CRM <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent not-italic">ULTIMATE</span>
            </h1>
            <p className="mt-4 text-slate-500 text-xs tracking-[0.4em] uppercase font-bold">
              企業級客戶數據管理系統 / v2.0
            </p>
          </div>
          
          <nav className="flex items-center gap-3">
            <Link href="/bmi" className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all">
              健康工具箱
            </Link>
            <div className="px-6 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-bold shadow-[0_0_25px_rgba(79,70,229,0.3)]">
              {totalRecords} 位客戶存檔
            </div>
          </nav>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* 左側：錄入表單 */}
          <aside className="lg:col-span-4">
            <div className="sticky top-12 p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 text-lg">+</span>
                  快速錄入客戶
                </h2>
                <p className="text-slate-500 text-xs mt-2">請輸入完整的身份資訊以供雲端備份</p>
              </div>

              <form action={addCustomer} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">客戶姓名</label>
                  <input
                    name="name"
                    placeholder="例如：Alex Chen"
                    className="w-full bg-slate-800/40 border border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">電子郵件</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="alex@enterprise.com"
                    className="w-full bg-slate-800/40 border border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-white shadow-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  確認儲存至數據庫
                </button>
              </form>
            </div>
          </aside>

          {/* 右側：資料清單 */}
          <section className="lg:col-span-8">
            <div className="rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                <h3 className="text-lg font-bold">即時客戶數據清單</h3>
                <div className="flex gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-slate-500">SERVER STATUS: ONLINE</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                      <th className="p-6">基本資料</th>
                      <th className="p-6">聯繫信箱</th>
                      <th className="p-6 text-right">當前狀態</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allCustomers.map((c) => (
                      <tr key={c.id} className="group hover:bg-white/[0.03] transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center font-black text-indigo-400 group-hover:scale-110 transition-transform">
                              {c.name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-200">{c.name}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-slate-400 text-sm font-mono tracking-tighter">{c.email}</span>
                        </td>
                        <td className="p-6 text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            已啟用
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分頁控制列 */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-white/5 flex justify-between items-center bg-black/20">
                  <p className="text-xs text-slate-500">
                    第 <span className="text-white font-bold">{currentPage}</span> 頁 / 共 {totalPages} 頁
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/?page=${currentPage - 1}`}
                      className={`px-5 py-2 rounded-xl border border-white/10 text-xs font-bold transition-all ${currentPage <= 1 ? "opacity-10 pointer-events-none" : "hover:bg-white/10"}`}
                    >
                      上一頁
                    </Link>
                    <Link
                      href={`/?page=${currentPage + 1}`}
                      className={`px-5 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold transition-all ${currentPage >= totalPages ? "opacity-10 pointer-events-none" : "hover:bg-indigo-600/40"}`}
                    >
                      下一頁
                    </Link>
                  </div>
                </div>
              )}

              {allCustomers.length === 0 && (
                <div className="py-32 text-center flex flex-col items-center">
                  <div className="text-4xl opacity-20 mb-4">📭</div>
                  <p className="text-slate-500 font-medium tracking-widest text-sm uppercase">目前尚無錄入數據</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <footer className="mt-20 text-center text-[10px] text-slate-700 tracking-[0.5em] uppercase">
          Enterprise Data Management • Next.js 15
        </footer>
      </div>
    </main>
  );
}