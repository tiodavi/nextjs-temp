import Link from "next/link";
import { db } from "~/server/db";
import { customers } from "~/server/db/schema";
import { addCustomer, deleteCustomer } from "./actions";
import BackgroundCanvas from "./_components/BackgroundCanvas"; // 引入 WebGL

export default async function HomePage() {
  const allCustomers = await db.select().from(customers);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* 1. WebGL 背景 */}
      <BackgroundCanvas />

      <div className="container relative mx-auto max-w-5xl px-6 py-16 text-white">
        {/* 2. 標題區 (增加發光特效) */}
        <header className="mb-16 text-center">
          <h1 className="text-6xl font-black tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            DASHBOARD <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">ULTRA</span>
          </h1>
          <p className="mt-4 text-gray-400">高端客戶管理系統 ‧ 實時雲端同步</p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 3. 左側：新增表單 (毛玻璃效果) */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="mb-6 text-xl font-bold">快速錄入</h2>
              <form action={addCustomer} className="flex flex-col gap-4">
                <input
                  name="name"
                  placeholder="姓名"
                  required
                  className="rounded-lg bg-white/5 border border-white/10 p-3 outline-none focus:border-purple-500 transition"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="rounded-lg bg-white/5 border border-white/10 p-3 outline-none focus:border-purple-500 transition"
                />
                <button className="mt-2 w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition">
                  存入資料庫
                </button>
              </form>
            </div>

            <Link href="/bmi" className="mt-6 block rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm hover:bg-white/10 transition">
               身體質量指數 (BMI) 工具 →
            </Link>
          </aside>

          {/* 4. 右側：客戶列表 (透明卡片) */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-8 backdrop-blur-md">
              <h2 className="mb-6 text-2xl font-bold">現有成員</h2>
              <div className="max-h-[500px] overflow-y-auto pr-2">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                      <th className="pb-4">客戶資訊</th>
                      <th className="pb-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allCustomers.map((c) => (
                      <tr key={c.id} className="group">
                        <td className="py-5">
                          <div className="font-bold">{c.name}</div>
                          <div className="text-xs text-gray-500">{c.email}</div>
                        </td>
                        <td className="py-5 text-right">
                          <form action={deleteCustomer.bind(null, c.id)}>
                            <button className="rounded-md px-3 py-1 text-xs border border-red-500/50 text-red-400 opacity-0 group-hover:opacity-100 transition hover:bg-red-500 hover:text-white">
                              移除
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {allCustomers.length === 0 && (
                  <p className="py-20 text-center text-gray-500">尚無存檔紀錄</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}