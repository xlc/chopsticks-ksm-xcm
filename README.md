# chopsticks-ksm-xcm

Reproduce for https://github.com/paritytech/polkadot-sdk/issues/2238

`yarn test` to run the test

Check the snap file for the actual output

`yarn test -u` to update the snapshot file

Use env `KUSAMA_WASM` to specify wasm override for Kusama. e.g. `KUSAMA_WASM=./staging_kusama_runtime.wasm yarn test`

The `staging_kusama_runtime.wasm` is what I used to debug the bug with additional logs
