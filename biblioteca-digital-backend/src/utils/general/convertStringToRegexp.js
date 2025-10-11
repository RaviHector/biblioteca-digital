export default function convertStringToRegexp(text) {
  const textNormalized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove all accents
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&') // remove all regexp reserved char
    .toLowerCase();

  const regexp = textNormalized
    .replace(/a/g, '[a,á,à,ä,â,ã]')
    .replace(/e/g, '[e,é,ë,è,ê]')
    .replace(/i/g, '[i,í,ï,ì,î]')
    .replace(/o/g, '[o,ó,ö,ò,õ,ô]')
    .replace(/u/g, '[u,ü,ú,ù,û]')
    .replace(/c/g, '[c,ç]')
    .replace(/n/g, '[n,ñ]')
    .replace(/[ªº°]/g, '[ªº°]');

  return new RegExp(regexp, 'i'); // "i" -> ignore case
}
