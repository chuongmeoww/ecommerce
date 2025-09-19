export function normalizeImgUrl(u) {
  if (!u) return '';
  try {
    const url = new URL(u, 'https://yame.vn'); // base để xử lý link tương đối
    if (url.protocol === 'http:') url.protocol = 'https:'; // tránh mixed content khi deploy https
    return url.href;
  } catch {
    return u;
  }
}
