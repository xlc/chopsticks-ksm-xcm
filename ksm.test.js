import { test } from 'vitest'
import { setupNetworks, checkSystemEvents } from '@acala-network/chopsticks-testing'

// replay this tx: https://kusama.subscan.io/extrinsic/0x605419331808783c03f7f16d76e912983a0db742574a50db53de8c88e7fec34d

test('test', async () => {
    const { kusama, karura } = await setupNetworks({
    kusama: {
      endpoint: 'wss://kusama-rpc.polkadot.io',
      db: "./db.sqlite",
      block: 20466524, // the parent of the block we want to replay
      port: 8000,
      "runtime-log-level": 5,
      'wasm-override': process.env.KUSAMA_WASM,
    },
    karura: {
      endpoint: 'wss://karura-rpc.aca-api.network',
      db: "./db.sqlite",
      block: 5604887,
      port: 8001,
    },
  })

  // signed tx for txhash 0x605419331808783c03f7f16d76e912983a0db742574a50db53de8c88e7fec34d
  const tx = '0x990284007c2371230cc4289cbdc36ac0880f435ddadb79a64545f2f0d30fcde2bce0c5010138fb5264333fe5b650d1490491fa4fbea4af8cf190dfc434c9cad8a3037c2e2f5cc7f649bd52bb9ed57cf85feeab09f9af8d35ad10f4dab69e1b5a4b9ab1d68595010d0600630803000100411f03000101007c2371230cc4289cbdc36ac0880f435ddadb79a64545f2f0d30fcde2bce0c5010304000000000740eb8ad3d90000000000'

  await kusama.api.rpc.author.submitExtrinsic(tx)
  await kusama.dev.newBlock()

  await checkSystemEvents(kusama, 'xcmPallet').toMatchSnapshot()

  await karura.dev.newBlock()

  await checkSystemEvents(karura).toMatchSnapshot()
}, 300000)
