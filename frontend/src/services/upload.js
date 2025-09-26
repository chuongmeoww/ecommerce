import api from './api';

export async function uploadImage(file) {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await api.post('/upload/image', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data; // { url, ... }
}
