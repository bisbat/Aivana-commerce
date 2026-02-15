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
      <h2 className="text-xl font-medium mb-4">Bank Information</h2>

      {/* BANK SELECT */}
      <label className="block text-sm font-medium mb-1">Bank</label>
      <div className="relative mb-4">
        <select
          className="border rounded px-3 py-2 w-full appearance-none bg-white text-black"
          value={BANKS.find((b) => b.name === bankInfo.bankName)?.code || ""}
          onChange={(e) => {
            const selectedCode = e.target.value;
            const bank = BANKS.find((b) => b.code === selectedCode);
            if (bank) {
              onChange({ bankName: bank.name });
            }
          }}
        >
          <option value="">เลือกธนาคาร</option>
          {BANKS.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
      </div>

      {/* Account Holder */}
      <label className="block text-sm font-medium mb-1">Account Name</label>
      <input
        type="text"
        className="border rounded px-3 py-2 w-full mb-4"
        placeholder="ชื่อบัญชี"
        value={bankInfo.accountName}
        onChange={(e) => onChange({ accountName: e.target.value })}
      />

      {/* Account Number */}
      <label className="block text-sm font-medium mb-1">Account Number</label>
      <input
        type="text"
        className="border rounded px-3 py-2 w-full"
        placeholder="เลขบัญชี"
        value={bankInfo.accountNumber}
        onChange={(e) => onChange({ accountNumber: e.target.value })}
      />
    </section>
  );
}
