export function maskSensitiveData(data) {
  if (!data) return data;
  const clone = { ...data };
  if ('password' in clone) clone.password = '****';
  return clone;
}
