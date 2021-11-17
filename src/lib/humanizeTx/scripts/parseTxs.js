const contractsManager = require('./../HumanContractsManager')
const {convertArrayToCSV} = require('convert-array-to-csv')
const fs = require('fs')

const CSV = []
let polygonTxs = [
  //swapExactETHForTokens
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    data: '0x7ff36ab5000000000000000000000000000000000000000000000018a823de1886a6b9f200000000000000000000000000000000000000000000000000000000000000800000000000000000000000005891f2A88311408A52289903df3017588562600300000000000000000000000000000000000000000000000000000000c31a7c7700000000000000000000000000000000000000000000000000000000000000030000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f000000000000000000000000229b1b6c23ff8953d663c4cbb519717e323a0a84',
    value: 1e18
  },

  //swapExactETHForTokens
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    data: '0x7ff36ab5000000000000000000000000000000000000000000000018a823de1886a6b9f20000000000000000000000000000000000000000000000000000000000000080000000000000000000000000a29a414a809e2fe93f7ce2bb746d6449ad577fe900000000000000000000000000000000000000000000000000000000c31a7c7700000000000000000000000000000000000000000000000000000000000000030000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f000000000000000000000000229b1b6c23ff8953d663c4cbb519717e323a0a84',
    value: 1e18
  },

  //swapExactTokensForETH
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    data: '0x18cbafe500000000000000000000000000000000000000000000000000040de4b7427fd60000000000000000000000000000000000000000000000002ad4aaa419ed574000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000003707aa64a35fe74dd4a21bdca160071929f6512a00000000000000000000000000000000000000000000000000000000c31ab27e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000007ceb23fd6bc0add59e62ac25578270cff1b9f6190000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  },

  //transfer
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0x831753dd7087cac61ab5644b308642cc1c33dc13',
    data: '0xa9059cbb0000000000000000000000004c66edbb7fd0567036482d09640ea55cb205bc0b00000000000000000000000000000000000000000000000098a7d9b8314c0000'
  },

  //approve
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0x831753dd7087cac61ab5644b308642cc1c33dc13',
    data: '0x095ea7b3000000000000000000000000a5E0829CaCEd8fFDD4De3c43696c57F7D7A678ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  },

  //Valueless tx
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0x831753dd7087cac61ab5644b308642cc1c33dc13',
    value: 0,
    data: '0x'
  },

  //Deploy contract
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    value: 0,
    data: '0x123132'
  },

  //Self tx
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0x5891f2A88311408A52289903df30175885626003',
    value: 0,
  },

  //approve on unknown token
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0x6af1d9376a7060488558cfb443939ed67bb9b48d',
    data: '0x095ea7b3000000000000000000000000a5E0829CaCEd8fFDD4De3c43696c57F7D7A678ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  },

  //Unknown call with send
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0x6af1d9376a7060488558cfb443939ed67bb9b48d',
    value: 12345678912345123456,
    data: '0x095eb7b3000000000000000000000000a5E0829CaCEd8fFDD4De3c43696c57F7D7A678ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  },
]


const ethTxs = [
  //WETH deposit
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    value: 10 ** 18,
    data: '0xd0e30db0'
  },
  //WETH withdraw
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    data: '0x2e1a7d4d0000000000000000000000000000000000000000000000000003c9eb8a01c064'
  },

  //UNIV3 Multicall exactOutputSingle
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0xe592427a0aece92de3edee1f18e0157c05861564',
    data: '0xac9650d800000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000104db3e219800000000000000000000000070cc41a7ba9101fdf402bc0758b7c40fc704ad05000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000618fb7440000000000000000000000000000000000000000000000000a3de717043d0000000000000000000000000000000000000000000000000133dc5abccfa15c2eb4000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c0000000000000000000000000000000000000000000000000a3de717043d0000000000000000000000000000ab6c7040b9c1bc2133081bbe008a740a5ba063d200000000000000000000000000000000000000000000000000000000'
  },

  // Masterchef V1 deposit 0/claim
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd',
    data: '0xe2bbb15800000000000000000000000000000000000000000000000000000000000000810000000000000000000000000000000000000000000000000000000000000000'
  },

  // Masterchef V1 withdraw
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: ' 0xc2edad668740f1aa35e4d8f227fb8e17dca888cd',
    data: '0x441a3e70000000000000000000000000000000000000000000000000000000000000014e0000000000000000000000000000000000000000000000002f3d6fb43056ce3d'
  },

  // Masterchef V2 deposit
  {
    from: '0x6dc5b0bb5bb3e3972e7b3f23ec1918b4c8450c61',
    to: ' 0xef0881ec094552b2e128cf945ef17a6752b4ec5d',
    data: '0x8dbdbe6d0000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000b6432573de457568000000000000000000000000ef6f774dc2ff41db3481e83e1b5abda19d3c4323'
  },

  // Masterchef V2 withdraw
  {
    from: '0x6dc5b0bb5bb3e3972e7b3f23ec1918b4c8450c61',
    to: ' 0xef0881ec094552b2e128cf945ef17a6752b4ec5d',
    data: '0x0ad58d2f00000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000002e53e1d37da419290000000000000000000000006dc5b0bb5bb3e3972e7b3f23ec1918b4c8450c61'
  },

  //ERC721 transfer
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
    data: '0xa9059cbb00000000000000000000000063760e7c402f64661da16c13c2353c839b210e9300000000000000000000000000000000000000000000000000000000001e8b51'
  },
  //ERC721 transferFrom
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
    data: '0x23b872dd0000000000000000000000009646aa0f9152c126b42f7ce4698f35fa700c8cde000000000000000000000000e7fa846ad3d12d89872220f53d70d082477e798100000000000000000000000000000000000000000000000000000000000022e6'
  },


  //AAVE V1 Deposit
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0x398ec7346dcd622edc5ae82352f02be94c62d119',
    data: '0xd2d0e066000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000000000009896800000000000000000000000000000000000000000000000000000000000000000'
  },

  //AAVE V1 Borrow
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0x398ec7346dcd622edc5ae82352f02be94c62d119',
    data: '0xc858f5f90000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000000000000000000000000000001c8d275228764c8f00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000'
  },

  //AAVE V1 Repay
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0x398ec7346dcd622edc5ae82352f02be94c62d119',
    data: '0x5ceae9c40000000000000000000000006b175474e89094c44da98b954eedeac495271d0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000004038b05c5ee755b72d1a37687d92c98b9395db86'
  },

  //AAVE V2 borrow
  {
    from: '0x5891f2A88311408A52289903df30175885626003',
    to: '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9',
    data: '0xa415bcad000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000001d1a94a2000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000008299be5fd742eef3a0f1f6726313ce7284ea8fbe'
  },

  //AAVE V2 repay
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9',
    data: '0x573ade81000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000e7be8f0663de85f88e64d269754903377b536dfa'
  },

  //AAVE V2 deposit
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9',
    data: '0xe8eda9df0000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c599000000000000000000000000000000000000000000000000000000015ece17de0000000000000000000000008299be5fd742eef3a0f1f6726313ce7284ea8fbe0000000000000000000000000000000000000000000000000000000000000000'
  },


  //cTokens
  //mint
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
    data: '0xa0712d6800000000000000000000000000000000000000000000024c5a8f0019d10048c9'
  },
  //redeem
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
    data: '0xdb006a7500000000000000000000000000000000000000000000000000001079f6704cd2'
  },
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
    data: '0x0e752702ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  },

  //Curve swaps
  //exchange UL
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0x52ea46506b9cc5ef470c5bf89f17dc28bb35d85c',
    data: '0xa6417ed60000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000004a817c800000000000000000000000000000000000000000000000000000000049b59c56f'
  },
  //remove liquidity
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0x52ea46506b9cc5ef470c5bf89f17dc28bb35d85c',
    data: '0x9fdaea0c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000350f88a200000000000000000000000000000000000000000000002c9e42354f973b0085'
  },
  //Add liquidity
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0x52ea46506b9cc5ef470c5bf89f17dc28bb35d85c',
    data: '0x4515cef300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000900e776000000000000000000000000000000000000000000000007225c401bf1c515c7'
  },

  //Curve Deposits
  //Add liquidity
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0xac795d2c97e60df6a99ff1c814727302fd747a80',
    data: '0x4515cef300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fdc910140000000000000000000000000000000000000000000000d0cee877e85e435c9417'
  },

  //Curve Gauge
  //deposit
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0xbc89cd85491d81c6ad2954e6d0362ee29fca8f53',
    data: '0xb6b55f25000000000000000000000000000000000000000000000f7eb2cba593312d8c04'
  },

  //withdraw
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0xbc89cd85491d81c6ad2954e6d0362ee29fca8f53',
    data: '0x2e1a7d4d000000000000000000000000000000000000000000006178abdc9c14adaa80b3'
  },

  //Synthetix
  //Claim
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0x8302fe9f0c509a996573d3cc5b0d5d51e4fdd5ec',
    data: '0x3d18b912'
  },

  //Synthetix
  //Exit
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0x8302fe9f0c509a996573d3cc5b0d5d51e4fdd5ec',
    data: '0x3d18b912'
  },

  //Synthetix
  //Withdraw
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0x8302fe9f0c509a996573d3cc5b0d5d51e4fdd5ec',
    data: '0x2e1a7d4d000000000000000000000000000000000000000000000000000005532e772fd0'
  },

  //Synthetix
  //Stake
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0x8302fe9f0c509a996573d3cc5b0d5d51e4fdd5ec',
    data: '0xa694fc3a0000000000000000000000000000000000000000000000000000097c392b0ddd'
  },

  //Identity
  //addPrivilege
  {
    from: '0xE7BE8f0663De85F88E64D269754903377B536DFA',
    to: '0x900C6A3417631F54d130b9382264C6b3c712CADD',
    data: '0x0d5828d4000000000000000000000000942f9ce5d9a33a82f88d233aeb3292e6802303480000000000000000000000000000000000000000000000000000000000000001'
  },
]

//NOTES : make summary UI in 2 parts 1 : humanize TO(contract interaction), 2 : display sentence
// some parts are not parsable : callbackFunc with bytes[] / masterchef batches?

contractsManager.init()

contractsManager.initAddressBook({
  polygon: [
    {name: 'Alice', address: '0x4c66eDBb7fD0567036482D09640ea55cB205Bc0B'},
    {name: 'Bob', address: '0x5539eC0576AF2dd0F060083742EC1A003cCA670b'},
  ]
})

console.log('Humanize some tx of Polygon')
let i = 0
i = 0
for (let tx of polygonTxs) {
  const summary = contractsManager.getSummary({chainId: 137, id: 'polygon'}, tx)
  displaySummary('polygon', i++, summary)
}

i = 0
for (let tx of ethTxs) {
  const summary = contractsManager.getSummary({chainId: 1, id: 'ethereum'}, tx)
  displaySummary('ethereum', i++, summary)
}

function displaySummary(network, i, summary) {
  console.log('================================================')

  if (summary.interaction.signature) {
    console.log(`${i} [Interacting with contract] ${summary.summaries.action ? (':' + summary.summaries.action + ':') : ''} ${summary.interaction.name} (${summary.interaction.method}:${summary.interaction.signature})`)
  } else {
    console.log(' ' + i + ' [To]   ' + summary.interaction.name)
  }
  console.log('================================================')

  let subPlain = []
  let subRich = []

  if (summary.summaries.actions.length > 1) {//MULTICALLS OR Multiple explicit actions
    console.log('Multiple actions:')
    for (let sub of summary.summaries.actions) {
      console.log('')
      console.log(' - ' + sub.plain)
      subPlain.push(sub.plain)
      console.log('')
      console.log(sub.rich)
      subRich.push(sub.rich)
    }
  } else {
    console.log('')
    console.log(summary.summaries.actions[0].plain)
    subPlain.push(summary.summaries.actions[0].plain)
    console.log('')
    console.log(summary.summaries.actions[0].rich)
    subRich.push(summary.summaries.actions[0].rich)
  }
  console.log('')

  CSV.push({
    network: network,
    id: i,
    methodName: summary.interaction.method,
    signature: summary.interaction.signature,
    to: summary.interaction.name,
    mainAction: summary.summaries.action,
    plainActions: JSON.stringify(subPlain, '\n', '\t'),
    richActions: JSON.stringify(subRich, '\n', '\t'),
  })
}

const header = ['network', 'id', 'methodName', 'signature', 'to', 'mainAction', 'plainActions', 'richActions']
const CSVStr = convertArrayToCSV(CSV, {
  header,
  separator: ';'
})

fs.writeFileSync('./report.csv', CSVStr)
