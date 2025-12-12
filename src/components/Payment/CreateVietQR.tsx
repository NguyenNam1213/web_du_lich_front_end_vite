export const convertToVND = (amount: number, currency: string): number => {
  if (currency.toUpperCase() === "VND") return amount;
  if (currency.toUpperCase() === "USD") return Math.round(amount * 25000);

  return amount;
};

export const getBankCode = (bankName: string): string => {
  const map: Record<string, string> = {
    MBBANK: "mbbank",
    VIETCOMBANK: "vietcombank",
    TECHCOMBANK: "techcombank",
    BIDV: "bidv",
    VPBANK: "vpbank",
    ACB: "acb",
  };

  return map[bankName.toUpperCase()] || "";
};

export const generateVietQR = ({
  bankCode,
  accountNo,
  accountName = "",
  amount,
  description,
  template = "compact",
}: {
  bankCode: string;
  accountNo: string;
  accountName?: string;
  amount: number;
  description: string;
  template?: string;
}) => {
  const encodedInfo = encodeURIComponent(description || "");
  const encodedName = encodeURIComponent(accountName || "");

  return `https://img.vietqr.io/image/${bankCode}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodedInfo}&accountName=${encodedName}`;
};
