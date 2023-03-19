"use strict";

const { utils } = require("@ckb-lumos/base");
const { ckbHash } = utils;
const { initializeConfig } = require("@ckb-lumos/config-manager");
const { addressToScript, sealTransaction, TransactionSkeleton } = require("@ckb-lumos/helpers");
const { Indexer } = require("@ckb-lumos/ckb-indexer");
const { addDefaultCellDeps, addDefaultWitnessPlaceholders, collectCapacity, getLiveCell, indexerReady, readFileToHexString, readFileToHexStringSync, sendTransaction, signTransaction, waitForTransactionConfirmation } = require("./lib/index.js");
const { ckbytesToShannons, hexToArrayBuffer, hexToInt, intToHex, stringToHex } = require("./lib/util.js");
const { describeTransaction, initializeLab } = require("./lab.js");
const config = require("./config.json");

// CKB Node and CKB Indexer Node JSON RPC URLs.
const NODE_URL = "http://127.0.0.1:8114/";
const INDEXER_URL = "http://127.0.0.1:8116/";

// This is the private key and address which will be used.
const PRIVATE_KEY_1 = "0x67842f5e4fa0edb34c9b4adbe8c3c1f3c737941f7c875d18bc6ec2f80554111d";
const ADDRESS_1 = "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqvc32wruaxqnk4hdj8yr4yp5u056dkhwtc94sy8q";

// This is the always success RISC-V binary.

//Always success cell
//Old capsule generates a working version
// const DATA_FILE_1 = "../capsule-contracts/build/release/always_capsule_0.7.3";
//After 0.7.3, capsule doesn't generate a working version
// const DATA_FILE_1 = "../capsule-contracts/build/release/always";

//JSON cell
//Old capsule generates a working version
// const DATA_FILE_1 = "../capsule-contracts/build/release/jsoncell_capsule_0.7.3";
//After 0.7.3, capsule doesn't generate a working version
const DATA_FILE_1 = "../capsule-contracts/build/release/jsoncell";


const DATA_FILE_HASH_1 = ckbHash(hexToArrayBuffer(readFileToHexStringSync(DATA_FILE_1).hexString)).serializeJson(); // Blake2b hash of the always success binary.

// This is the TX fee amount that will be paid in Shannons.
const TX_FEE = 100_000n;

async function deployCode(indexer) {
	// Create a transaction skeleton.
	let transaction = TransactionSkeleton();

	// Add the cell dep for the lock script.
	transaction = addDefaultCellDeps(transaction);

	// Create a cell with data from the specified file.
	const { hexString: hexString1, dataSize: dataSize1 } = await readFileToHexString(DATA_FILE_1);
	const outputCapacity1 = ckbytesToShannons(61n) + ckbytesToShannons(dataSize1);
	const output1 = { cell_output: { capacity: intToHex(outputCapacity1), lock: addressToScript(ADDRESS_1), type: null }, data: hexString1 };
	transaction = transaction.update("outputs", (i) => i.push(output1));

	// Add input capacity cells.
	const collectedCells = await collectCapacity(indexer, addressToScript(ADDRESS_1), outputCapacity1 + ckbytesToShannons(61n) + TX_FEE);
	transaction = transaction.update("inputs", (i) => i.concat(collectedCells.inputCells));

	// Determine the capacity of all input cells.
	const inputCapacity = transaction.inputs.toArray().reduce((a, c) => a + hexToInt(c.cell_output.capacity), 0n);
	const outputCapacity = transaction.outputs.toArray().reduce((a, c) => a + hexToInt(c.cell_output.capacity), 0n);

	// Create a change Cell for the remaining CKBytes.
	const changeCapacity = intToHex(inputCapacity - outputCapacity - TX_FEE);
	let change = { cell_output: { capacity: changeCapacity, lock: addressToScript(ADDRESS_1), type: null }, data: "0x" };
	transaction = transaction.update("outputs", (i) => i.push(change));

	// Add in the witness placeholders.
	transaction = addDefaultWitnessPlaceholders(transaction);

	// Print the details of the transaction to the console.
	describeTransaction(transaction.toJS());

	// Sign the transaction.
	const signedTx = signTransaction(transaction, PRIVATE_KEY_1);

	// Send the transaction to the RPC node.
	const txid = await sendTransaction(NODE_URL, signedTx);
	console.log(`Transaction Sent: ${txid}\n`);

	// Wait for the transaction to confirm.
	await waitForTransactionConfirmation(NODE_URL, txid);
	console.log("\n");

	// Return the out point for the always success binary so it can be used in the next transaction.
	const outPoint =
	{
		tx_hash: txid,
		index: "0x0"
	};

	return outPoint;
}

async function createCells(indexer, alwaysSuccessCodeOutPoint) {
	// Create a transaction skeleton.
	let transaction = TransactionSkeleton();

	// Add the cell dep for the lock script.
	transaction = addDefaultCellDeps(transaction);
	const cellDep = { dep_type: "code", out_point: alwaysSuccessCodeOutPoint };
	transaction = transaction.update("cellDeps", (cellDeps) => cellDeps.push(cellDep));


	// Create a cell using the provided lock.
	const outputCapacity1 = ckbytesToShannons(116n);
	const lockScript1 = addressToScript(ADDRESS_1)
	const typeScript1 =
	{
		code_hash: DATA_FILE_HASH_1,
		hash_type: "data",
		args: "0x"
	};
	// Data used for jsoncell compatibility
	const data1 = stringToHex(JSON.stringify({ "msg": "Hello World!" }));
	const output1 = { cell_output: { capacity: intToHex(outputCapacity1), lock: lockScript1, type: typeScript1 }, data: data1 };

	transaction = transaction.update("outputs", (i) => i.push(output1));

	// Add input capacity cells.
	const capacityRequired = outputCapacity1 + ckbytesToShannons(61n) + TX_FEE;
	const collectedCells = await collectCapacity(indexer, addressToScript(ADDRESS_1), capacityRequired);
	transaction = transaction.update("inputs", (i) => i.concat(collectedCells.inputCells));

	// Determine the capacity of all input cells.
	const inputCapacity = transaction.inputs.toArray().reduce((a, c) => a + hexToInt(c.cell_output.capacity), 0n);
	const outputCapacity = transaction.outputs.toArray().reduce((a, c) => a + hexToInt(c.cell_output.capacity), 0n);

	// Create a change Cell for the remaining CKBytes.
	const changeCapacity = intToHex(inputCapacity - outputCapacity - TX_FEE);
	let change = { cell_output: { capacity: changeCapacity, lock: addressToScript(ADDRESS_1), type: null }, data: "0x" };
	transaction = transaction.update("outputs", (i) => i.push(change));

	// Add in the witness placeholders.
	transaction = addDefaultWitnessPlaceholders(transaction);

	// Print the details of the transaction to the console.
	describeTransaction(transaction.toJS());

	// Sign the transaction.
	const signedTx = signTransaction(transaction, PRIVATE_KEY_1);

	// Send the transaction to the RPC node.
	const txid = await sendTransaction(NODE_URL, signedTx);
	console.log(`Transaction Sent: ${txid}\n`);

	// Wait for the transaction to confirm.
	await waitForTransactionConfirmation(NODE_URL, txid);
	console.log("\n");

	// Return the out points for the cells locked with the always success lock so it can be used in the next transaction.
	const outPoints =
		[
			{ tx_hash: txid, index: "0x0" },
		];

	return outPoints;
}

async function consumeCells(indexer, alwaysSuccessCodeOutPoint, alwaysSuccessCellOutPoints) {
	// Create a transaction skeleton.
	let transaction = TransactionSkeleton();

	// Add the cell dep for the lock script.
	transaction = addDefaultCellDeps(transaction);
	const cellDep = { dep_type: "code", out_point: alwaysSuccessCodeOutPoint };
	transaction = transaction.update("cellDeps", (cellDeps) => cellDeps.push(cellDep));

	// Add the always success cells to the transaction.
	for (const outPoint of alwaysSuccessCellOutPoints) {
		const input = await getLiveCell(NODE_URL, outPoint);
		transaction = transaction.update("inputs", (i) => i.push(input));
	}

	// Determine the capacity of all input cells.
	const inputCapacity = transaction.inputs.toArray().reduce((a, c) => a + hexToInt(c.cell_output.capacity), 0n);
	const outputCapacity = transaction.outputs.toArray().reduce((a, c) => a + hexToInt(c.cell_output.capacity), 0n);

	// Create a change Cell for the remaining CKBytes.
	const changeCapacity = intToHex(inputCapacity - outputCapacity - TX_FEE);
	let change = { cell_output: { capacity: changeCapacity, lock: addressToScript(ADDRESS_1), type: null }, data: "0x" };
	transaction = transaction.update("outputs", (i) => i.push(change));

	// Add in the witness placeholders.
	transaction = addDefaultWitnessPlaceholders(transaction);

	// Print the details of the transaction to the console.
	describeTransaction(transaction.toJS());

	// Sign the transaction.
	const signedTx = signTransaction(transaction, PRIVATE_KEY_1);

	// Send the transaction to the RPC node.
	const txid = await sendTransaction(NODE_URL, signedTx);
	console.log(`Transaction Sent: ${txid}\n`);

	// Wait for the transaction to confirm.
	await waitForTransactionConfirmation(NODE_URL, txid);
	console.log("\n");
}

async function main() {
	// Initialize the Lumos configuration using ./config.json.
	initializeConfig(config);

	// Initialize an Indexer instance.
	const indexer = new Indexer(INDEXER_URL, NODE_URL);

	// Initialize our lab.
	await initializeLab(NODE_URL, indexer);
	await indexerReady(indexer);

	// Create a cell that contains the always success binary.
	const alwaysSuccessCodeOutPoint = await deployCode(indexer);
	await indexerReady(indexer);

	// Create a cell that uses the always success binary as a lock script.
	const alwaysSuccessCellOutPoint = await createCells(indexer, alwaysSuccessCodeOutPoint);
	await indexerReady(indexer);

	// Consume the cell using the always success lock script.
	await consumeCells(indexer, alwaysSuccessCodeOutPoint, alwaysSuccessCellOutPoint);
	await indexerReady(indexer);

	console.log("Lab completed successfully!");
}
main();
