const luxt = require('luxt')

module.exports = (byte, color, base = 16) => {
	let stringByte = byte.toString(base)

	if (base === 16 && stringByte.length === 1) stringByte = '0' + stringByte

	if (base === 10 && stringByte.length < 3) stringByte = '0'.repeat(3 - stringByte.length) + stringByte

	return luxt(stringByte)[color].toString() + ' '
}