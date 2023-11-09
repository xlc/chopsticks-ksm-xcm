import { test } from 'vitest'
import { setupNetworks, checkSystemEvents } from '@acala-network/chopsticks-testing'

// replay this tx: https://kusama.subscan.io/extrinsic/20471678-2

test('test', async () => {
    const { kusama, karura } = await setupNetworks({
    kusama: {
      endpoint: 'wss://kusama-rpc.polkadot.io',
      db: "./db.sqlite",
      block: 20471677, // the parent of the block we want to replay
      port: 8000,
      "runtime-log-level": 5,
    },
    karura: {
      endpoint: 'wss://karura-rpc.aca-api.network',
      db: "./db.sqlite",
      block: 5604887,
      port: 8001,
    },
  })

  // signed tx taken from 20471678-2
  const tx = '0x69028400d2b4c334b6ee67c7f4f42a47efb4345978d4787514fd79dd6ded6cc73107265c01588e625a56b365ef1cf55f79bc9cf481ab2c46d9c56a91cb6ba503de873b4879909d557bb29b14b984cf2cdde937c0ffdf974076d2155304e328567c5a73888c6503a4006308010001009d1f0100010300f8b497a64b1216b8caaaadcc710b99d22d4b38d20104000000000b0040c2ab19150000000000'

  await kusama.api.rpc.author.submitExtrinsic(tx)
  await kusama.dev.newBlock()

  await checkSystemEvents(kusama, 'xcmPallet').toMatchSnapshot()

  await karura.dev.newBlock()

  await checkSystemEvents(karura).toMatchSnapshot()
}, 300000)
