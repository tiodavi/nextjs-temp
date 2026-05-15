import Link from "next/link";
import { db } from "~/server/db";
import { customers } from "~/server/db/schema";
import { addCustomer } from "./actions";
import { count } from "drizzle-orm"; // 引入計數功能

// 定義每頁顯示幾筆
const ITEMS_PER_PAGE = 5;

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // 解析當前頁碼，預設為 1
  const currentPage = Number(searchParams.page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // 1. 同時抓取分頁後的資料與總筆數
  const [allCustomers, totalCountResult] = await Promise.all([
    db.select().from(customers).limit(ITEMS_PER_PAGE).offset(offset),
    db.select({ value: count() }).from(customers),
  ]);

  const totalRecords = totalCountResult[0]?.value ?? 0;
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-black text-slate-200 p-4 md:p-12">
      <div className="container mx-auto max-w-5xl">
        {/* ... 原本的 Header 區塊 ... */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左側表單 (省略，保持不變) */}
          <section className="lg:col-span-4">
             {/* ... 原本的 Form ... */}
          </section>

          {/* 右側：客戶列表 */}
          <section className="lg:col-span-8">
            <div className="overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-sm shadow-2xl">
              <div className="p-8 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                <h2 className="text-2xl font-bold italic">DATABASE <span className="text-slate-500 font-light text-base not-italic ml-2">/ 實時清單</span></h2>
                <span className="px-3 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-mono">
                  {totalRecords} RECORDS
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  {/* ... Table Header ... */}
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
                        <td className="p-6 text-right text-xs">
                          <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* --- 分頁控制按鈕 --- */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-white/5 flex justify-between items-center">
                  <div className="text-sm text-slate-500">
                    第 {currentPage} 頁，共 {totalPages} 頁
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/?page=${currentPage - 1}`}
                      className={`px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition ${currentPage <= 1 ? "pointer-events-none opacity-20" : ""}`}
                    >
                      上一頁
                    </Link>
                    <Link
                      href={`/?page=${currentPage + 1}`}
                      className={`px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition ${currentPage >= totalPages ? "pointer-events-none opacity-20" : ""}`}
                    >
                      下一頁
                    </Link>
                  </div>
                </div>
              )}

              {allCustomers.length === 0 && (
                <div className="py-32 text-center text-slate-500">資料庫目前空空如也...</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}