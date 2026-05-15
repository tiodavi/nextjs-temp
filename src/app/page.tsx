import Link from "next/link";
import { db } from "~/server/db";
import { customers } from "~/server/db/schema";
import { addCustomer } from "./actions";
import { count } from "drizzle-orm"; // 引入計數功能

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // 設定每頁顯示 5 筆
  const ITEMS_PER_PAGE = 5;
  
  // 從 URL 取得目前頁碼，預設為第一頁
  const currentPage = Number(searchParams.page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // 同時抓取該頁資料與總資料量
  const [allCustomers, totalCountResult] = await Promise.all([
    db.select().from(customers).limit(ITEMS_PER_PAGE).offset(offset),
    db.select({ value: count() }).from(customers),
  ]);

  const totalRecords = totalCountResult[0]?.value ?? 0;
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-black text-slate-200 p-4 md:p-12">
      <div className="container mx-auto max-w-5xl">
        
        {/* 標題與 Header (保持不變) */}
        <header className="mb-16 text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">CRM</span>
            <span className="text-white ml-4">ULTIMATE</span>
          </h1>
          <div className="pt-6">
            <Link href="/bmi" className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              體適能 BMI 工具 →
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左側：新增客戶表單 (保持不變) */}
          <section className="lg:col-span-4">
            <div className="sticky top-12 p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">+ 新增客戶檔案</h2>
              <form action={addCustomer} className="space-y-4">
                <input name="name" placeholder="姓名" className="w-full bg-slate-800/50 border border-white/5 p-3 rounded-xl outline-none" required />
                <input name="email" type="email" placeholder="Email" className="w-full bg-slate-800/50 border border-white/5 p-3 rounded-xl outline-none" required />
                <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold">確認錄入系統</button>
              </form>
            </div>
          </section>

          {/* 右側：客戶列表 (新增分頁控制) */}
          <section className="lg:col-span-8">
            <div className="overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-sm shadow-2xl">
              <div className="p-8 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                <h2 className="text-2xl font-bold italic">DATABASE <span className="text-slate-500 font-light text-base not-italic ml-2">/ 第 {currentPage} 頁</span></h2>
                <span className="px-3 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-mono">
                  TOTAL: {totalRecords}
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-white/5">
                    {allCustomers.map((c) => (
                      <tr key={c.id} className="group hover:bg-white/[0.03] transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-purple-400">
                              {c.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-200">{c.name}</span>
                          </div>
                        </td>
                        <td className="p-6 text-slate-400 text-sm font-mono">{c.email}</td>
                        <td className="p-6 text-right">
                          <span className="px-2.5 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* --- 分頁控制按鈕區域 --- */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-white/5 flex justify-between items-center bg-white/[0.01]">
                  <p className="text-xs text-slate-500 tracking-widest uppercase">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-4">
                    <Link
                      href={`/?page=${currentPage - 1}`}
                      className={`px-6 py-2 rounded-xl border border-white/10 text-sm transition-all ${currentPage <= 1 ? "opacity-20 pointer-events-none" : "hover:bg-white/10"}`}
                    >
                      PREV
                    </Link>
                    <Link
                      href={`/?page=${currentPage + 1}`}
                      className={`px-6 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-sm font-bold transition-all ${currentPage >= totalPages ? "opacity-20 pointer-events-none" : "hover:bg-indigo-600/40"}`}
                    >
                      NEXT
                    </Link>
                  </div>
                </div>
              )}

              {allCustomers.length === 0 && (
                <div className="py-32 text-center text-slate-500">此頁面尚無資料</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}