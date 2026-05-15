import Link from "next/link";
import { db } from "~/server/db"; // 引入資料庫連線
import { customers } from "~/server/db/schema"; // 引入資料表定義
import { addCustomer } from "./actions";

export default async function HomePage() {
  // 從資料庫抓取所有客戶，並依照建立時間排序
  const allCustomers = await db.select().from(customers);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white p-8">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          客戶<span className="text-[hsl(280,100%,70%)]">管理</span>系統
        </h1>

        {/* 這裡可以放個超連結去 BMI */}
        <div className="mb-8 text-center">
           <Link href="/bmi" className="text-sm underline opacity-70 hover:opacity-100">前往 BMI 計算器 →</Link>
        </div>

        <div className="rounded-xl bg-white/10 p-6 shadow-xl">
          {/* 修正：在表格上方插入新增客戶表單 */}
          <form action={addCustomer} className="mb-10 flex gap-4 bg-white/5 p-4 rounded-lg">
            <input
              name="name"
              placeholder="客戶姓名"
              className="bg-white/10 border border-white/20 p-2 rounded flex-1 text-white"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="bg-white/10 border border-white/20 p-2 rounded flex-1 text-white"
              required
            />
            <button type="submit" className="bg-[hsl(280,100%,70%)] px-4 py-2 rounded font-bold hover:opacity-90 transition">
              新增客戶
            </button>
          </form>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/20">
                <th className="pb-3">姓名</th>
                <th className="pb-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {allCustomers.map((c) => (
                <tr key={c.id} className="border-b border-white/5">
                  <td className="py-3">{c.name}</td>
                  <td className="py-3 text-gray-400">{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {allCustomers.length === 0 && (
            <p className="py-10 text-center text-gray-400">目前資料庫沒有客戶</p>
          )}
        </div>
      </div>
    </main>
  );
}