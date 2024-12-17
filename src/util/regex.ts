export function regexPhone(phone: string) {
  if (!phone) return '';
  phone = phone.replace(/\D/g, '');
  phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
  phone = phone.replace(/(\d)(\d{4})$/, '$1-$2');
  return phone;
}

export function regexCPF(cpf: string) {
  const regex = /(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/;
  const x = cpf.replace(/\D/g, '').match(regex);
  const t = x
    ? x[2]
      ? x[1] + '.' + x[2] + (x[3] ? '.' : '') + x[3] + (x[4] ? '-' + x[4] : '')
      : x[1]
    : '';
  return t;
}
