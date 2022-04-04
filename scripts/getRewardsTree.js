const WALLETSupplyControllerABI = require('../src/consts/WALLETSupplyControllerABI')
const { getDefaultProvider, Contract } = require('ethers')
const { BigNumber } = require('ethers')
const provider = getDefaultProvider('homestead')
//const oldSupplyController = new Contract('0x94b668337ce8299272ca3cb0c70f3d786a5b6ce5', WALLETSupplyControllerABI, provider)
const alreadyClaimedEveryone = require('./WALLETAlreadyClaimed')
const fetch = require('node-fetch')
const toBnString = x => {
  return Math.round(x * 1e18).toLocaleString('fullwide', {useGrouping: false})
}

async function main() {

  const { allRewardEntries } = await fetch('https://relayer.ambire.com/wallet-token/rewards/all').then(r => r.json())
  const rewardsADX = allRewardEntries.find(x => x._id === 'adx-rewards')
  const rewardsBalance = allRewardEntries.find(x => x._id === 'balance-rewards')
  const MIN = 100
  let everyone = Object.entries(rewardsBalance.rewards).map(([addr, fromBalance]) => ({
    addr,
    fromBalanceClaimable: fromBalance,
    fromADXClaimable: rewardsADX.rewards[addr] || 0,
    totalClaimable: BigNumber.from(toBnString(fromBalance + (rewardsADX.rewards[addr] || 0)))
      .sub((alreadyClaimedEveryone.find(y => y.addr === addr) || { alreadyClaimed: 0 }).alreadyClaimed)
      .toString()
  })).filter(x => (x.fromBalanceClaimable + (rewardsADX.rewards[x.addr] || 0)) > MIN)

  const contractAddr = '0xc53af25f831f31ad6256a742b3f0905bc214a430'

  const abi = require('/home/ivo/repos/adex-protocol-eth/node_modules/ethereumjs-abi')
  const keccak256 = require('/home/ivo/repos/adex-protocol-eth/node_modules/js-sha3').keccak256
  const MerkleTree = require('/home/ivo/repos/adex-protocol-eth/js/MerkleTree')
  const getBalanceLeaf = (addr, value) => Buffer.from(
    keccak256.arrayBuffer(abi.rawEncode(['address', 'address', 'uint256'], [contractAddr, addr, value]))
  )

  /*
  const alreadyClaimedEveryone =(await Promise.all(everyone.map(async x => {
    const alreadyClaimedRaw = await oldSupplyController.claimed(x.addr)
    const alreadyClaimed = alreadyClaimedRaw.toString() / 1e18
    if (alreadyClaimed > 0) {
      // temporary solution to not have to compare numbers
      x.hasClaimed = true 
    }
    return { alreadyClaimed: alreadyClaimedRaw.toString(), addr: x.addr }
  }))).filter(x => x.alreadyClaimed > 0)
  */

  everyone.forEach(x => {
    x.leaf = getBalanceLeaf(x.addr, x.totalClaimable)
  })

  // Prepare the balance tree and signatures that will grant the ability to withdraw
  const tree = new MerkleTree(everyone.map(x => getBalanceLeaf(x.addr, x.totalClaimable)))
  const root = tree.getRoot()

  const toHex = x => '0x' + x.toString('hex')

  everyone.forEach(async x => {
    const leaf = getBalanceLeaf(x.addr, x.totalClaimable)
    x.proof = tree.proof(leaf).map(toHex)
    x.leaf = toHex(leaf)
    return x
  })

  //console.log(everyone.find(x => x.addr === '0xf38746dC80Af641247F4cA11ECE611696806D438'))
  /*
  console.log(everyone.find(x => x.addr === '0xf38746dC80Af641247F4cA11ECE611696806D438'))
  console.log(everyone.map(x => x.totalClaimable).reduce((a, b) => a+b, 0))
  console.log(toHex(root))
  //console.log(JSON.stringify(everyone.find(x => x.addr === '0xf38746dC80Af641247F4cA11ECE611696806D438').proof))
  */

  console.log(toHex(root))

  console.log(JSON.stringify(everyone))

}

main()
  .catch(e => console.error(e))