export const mimeTypesData = {
  'solarea/jsx': 1,
  'solarea/link': 2,

  'application/json': 10,
  'application/xml': 11,
  'application/msword': 12,

  'image/png': 20,
  'image/jpeg': 21,
  'image/gif': 22,
  'image/svg+xml': 23,
  'image/webp': 24,

  'audio/mp4': 30,
  'audio/aac': 31,
  'audio/mpeg': 32,
  'audio/ogg': 33,

  'text/xml': 40,
  'text/javascript': 41,
  'text/plain': 42,
  'text/ogg': 43,
  'text/markdown': 44,
  'text/html': 45,

  getData(value: number) {
    return Object.keys(this).find((key) => this[key] === value);
  },
};
