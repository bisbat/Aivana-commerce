"use client";

import { BankInfo } from "@/lib/types/user/sellerProfile";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const BANKS = [
  {
    code: "kbank",
    name: "ธนาคารกสิกรไทย",
    logo: `${basePath}/become-seller/logo-bank/kbank.jpg`,
  },
  {
    code: "scb",
    name: "ธนาคารไทยพาณิชย์",
    logo: `${basePath}/become-seller/logo-bank/scb.png`,
  },
  {
    code: "ktb",
    name: "ธนาคารกรุงไทย",
    logo: `${basePath}/become-seller/logo-bank/ktb.png`,
  },
  {
    code: "bbl",
    name: "ธนาคารกรุงเทพ",
    logo: `${basePath}/become-seller/logo-bank/bbl.jpg`,
  },
  {
    code: "bay",
    name: "ธนาคารกรุงศรีอยุธยา",
    logo: `${basePath}/become-seller/logo-bank/bay.jpg`,
  },
];

interface BankInfoSectionProps {
  bankInfo: BankInfo;
  onChange: (value: Partial<BankInfo>) => void;
}

export default function BankInfoSection({
  bankInfo,
  onChange,
}: BankInfoSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-4">
        ข้อมูลบัญชีธนาคาร
      </h2>

      <label className="block text-sm font-medium text-slate-300 mb-2">
        ธนาคาร
      </label>
      <div className="relative mb-4">
        <select
          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all appearance-none"
          value={BANKS.find((b) => b.name === bankInfo.bankName)?.code || ""}
          onChange={(e) => {
            const selectedCode = e.target.value;
            const bank = BANKS.find((b) => b.code === selectedCode);
            if (bank) {
              onChange({ bankName: bank.name });
            }
          }}
        >
          <option value="" className="bg-slate-800">
            เลือกธนาคาร
          </option>
          {BANKS.map((bank) => (
            <option key={bank.code} value={bank.code} className="bg-slate-800">
              {bank.name}
            </option>
          ))}
        </select>
      </div>

      <label className="block text-sm font-medium text-slate-300 mb-2">
        ชื่อบัญชี
      </label>
      <input
        type="text"
        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all mb-4"
        placeholder="ชื่อบัญชี"
        value={bankInfo.accountName}
        onChange={(e) => onChange({ accountName: e.target.value })}
      />

      <label className="block text-sm font-medium text-slate-300 mb-2">
        เลขที่บัญชี
      </label>
      <input
        type="text"
        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8a57fb]/50 focus:border-transparent transition-all"
        placeholder="เลขบัญชี"
        value={bankInfo.accountNumber}
        onChange={(e) => onChange({ accountNumber: e.target.value })}
      />
    </section>
  );
}
