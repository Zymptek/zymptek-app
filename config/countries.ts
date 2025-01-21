export const countries = [
  { name: "United States", code: "US", phone: "+1" },
  { name: "United Kingdom", code: "GB", phone: "+44" },
  { name: "Canada", code: "CA", phone: "+1" },
  { name: "Australia", code: "AU", phone: "+61" },
  { name: "Germany", code: "DE", phone: "+49" },
  { name: "France", code: "FR", phone: "+33" },
  { name: "Italy", code: "IT", phone: "+39" },
  { name: "Spain", code: "ES", phone: "+34" },
  { name: "Japan", code: "JP", phone: "+81" },
  { name: "China", code: "CN", phone: "+86" },
  { name: "India", code: "IN", phone: "+91" },
  { name: "Brazil", code: "BR", phone: "+55" },
  { name: "Russia", code: "RU", phone: "+7" },
  { name: "South Korea", code: "KR", phone: "+82" },
  { name: "Mexico", code: "MX", phone: "+52" },
  { name: "Indonesia", code: "ID", phone: "+62" },
  { name: "Netherlands", code: "NL", phone: "+31" },
  { name: "Turkey", code: "TR", phone: "+90" },
  { name: "Saudi Arabia", code: "SA", phone: "+966" },
  { name: "Switzerland", code: "CH", phone: "+41" },
  { name: "Sweden", code: "SE", phone: "+46" },
  { name: "Poland", code: "PL", phone: "+48" },
  { name: "Belgium", code: "BE", phone: "+32" },
  { name: "Thailand", code: "TH", phone: "+66" },
  { name: "Austria", code: "AT", phone: "+43" },
  { name: "Norway", code: "NO", phone: "+47" },
  { name: "Denmark", code: "DK", phone: "+45" },
  { name: "Singapore", code: "SG", phone: "+65" },
  { name: "Malaysia", code: "MY", phone: "+60" },
  { name: "Vietnam", code: "VN", phone: "+84" },
  { name: "Philippines", code: "PH", phone: "+63" },
  { name: "Ireland", code: "IE", phone: "+353" },
  { name: "New Zealand", code: "NZ", phone: "+64" },
  { name: "Israel", code: "IL", phone: "+972" },
  { name: "South Africa", code: "ZA", phone: "+27" },
  { name: "Pakistan", code: "PK", phone: "+92" },
  { name: "Bangladesh", code: "BD", phone: "+880" },
  { name: "Egypt", code: "EG", phone: "+20" },
  { name: "Nigeria", code: "NG", phone: "+234" },
  { name: "Kenya", code: "KE", phone: "+254" }
] as const;

export type Country = typeof countries[number];

export const getCountryByCode = (code: string) => {
  return countries.find(country => country.code === code);
};

export const getCountryByPhone = (phone: string) => {
  return countries.find(country => country.phone === phone);
}; 