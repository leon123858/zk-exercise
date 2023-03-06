const snarkjs = require('snarkjs');
const fs = require('fs');
const { assert } = require('console');

async function run() {
	/**
	 * Provider: 利用 secret 產生結果與證明
	 */
	const secrets = [15, 22];

	const { proof, publicSignals } = await snarkjs.groth16.fullProve(
		{ a: secrets[0], b: secrets[1] },
		'circuit.wasm',
		'circuit_final.zkey'
	);

	assert(publicSignals[0] == secrets[0] * secrets[1], 'signal should right');
	// console.log('Proof: ');
	// console.log(JSON.stringify(proof, null, 1));

	/**
	 * 驗證者: 利用 proof 驗證 publicSignals 有效, 無需提交 secrets
	 */
	const vKey = JSON.parse(fs.readFileSync('verification_key.json'));

	const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

	assert(res === true, 'Verification should be valid');
}

run().then(() => {
	process.exit(0);
});
