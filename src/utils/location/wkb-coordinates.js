export function wkbToCoords(hex) {
  const buffer = new ArrayBuffer(hex.length / 2);
  const view = new DataView(buffer);

  // Fill buffer with byte values from hex string
  for (let i = 0; i < hex.length; i += 2) {
    view.setUint8(i / 2, parseInt(hex.substr(i, 2), 16));
  }

  console.log(view);

  // Little endian
  const littleEndian = true;

  // X (longitude) and Y (latitude) start after byte 21
  const x = view.getFloat64(9, littleEndian);
  const y = view.getFloat64(17, littleEndian);

  return { longitude: x, latitude: y };
}