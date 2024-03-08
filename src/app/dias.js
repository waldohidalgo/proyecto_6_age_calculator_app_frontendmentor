function days(mils) {
  const dia = 24 * 60 * 60 * 1000;
  const year = Math.floor(mils / (365 * dia));
  const month = Math.floor(mils / (30.41 * dia)) % 12;
  const day = Math.floor(mils / dia) % 30.41;
  return { year, month, day: Math.floor(day) };
}
a = new Date("1990-03-07");

b = new Date("2024-03-08");
console.log(days(b - a));
