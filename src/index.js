#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const luxt = require('luxt')

const args = require('gar')(process.argv.slice(2))

const format = require(path.join(__dirname, 'formatByte.js'))

if (args.help) {
	console.log('hexeye <file> [options]')
	console.log('\t--help\tAccess this menu\n\t--rowlen <number>\tSpecify row length for display\n\t--decimal\tView data in decimal instead of hex')

	process.exit(1)
}

if (args._.length === 0) {
	console.error('> Please specify a file. For help, use \'hexeye --help\'.')

	process.exit(1)
}

const base = args.decimal ? 10 : 16
const rowLength = typeof args.rowlen === 'number' ? args.rowlen : 11

process.stdout.write((base === 10 ? '----' : '---').repeat(rowLength) + '\n')

const filePath = path.resolve(process.cwd(), args._[0])
const fileData = fs.readFileSync(filePath)

let currentProcessed = []

for (let i = 0; i < fileData.length; i++) {
	if (fileData[i] >= 32 && fileData[i] <= 126) {
		process.stdout.write(format(fileData[i], 'blue', base))

		currentProcessed.push(luxt(fileData.toString('ascii', i, i + 1)).blue)
	}
	else if (fileData[i] === 0) {
		process.stdout.write(format(fileData[i], 'red', base))

		currentProcessed.push(luxt('0').red)
	}
	else if ((fileData[i] >= 0 && fileData[i] <= 31) || fileData[i] === 127) {
		process.stdout.write(format(fileData[i], 'yellow', base))

		currentProcessed.push(luxt('_').yellow)
	}
	else {
		process.stdout.write(format(fileData[i], 'green', base))

		currentProcessed.push(luxt('x').green)
	}

	if (((i + 1) % rowLength === 0 && i > 0) || i === fileData.length - 1) {
		if (i === fileData.length - 1) {
			process.stdout.write((base === 10 ? '    ' : '   ').repeat(rowLength - ((i + 1) % rowLength)))
		}

		process.stdout.write(' |  ')

		for (let b = 0; b < currentProcessed.length; b++) {
			process.stdout.write(currentProcessed[b].toString())
		}

		currentProcessed = []

		process.stdout.write('\n')
	}
}

process.stdout.write((base === 10 ? '----' : '---').repeat(rowLength) + '\n')

//process.stdout.write('Key:\n' + luxt('Blue = ASCII text data').blue + '\n' + luxt('Yellow = ASCII whitespace / special character data').yellow + '\n' + luxt('Green = Unknown binary data').green + '\n')