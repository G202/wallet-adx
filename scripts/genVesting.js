// Old supply controller
const WALLETSupplyControllerABI = require('../src/consts/WALLETSupplyControllerABI')
const { getDefaultProvider, Contract } = require('ethers')
const provider = getDefaultProvider('homestead')
const oldSupplyController = new Contract('0x94b668337ce8299272ca3cb0c70f3d786a5b6ce5', WALLETSupplyControllerABI, provider)
// end of old supply

const vestingsSupporters = [
	// nadav
	{ addr: '0x1640555d9937Cec3b9ccA3225EDbE9771b1185EC', rate: 0.01902587519*1e18 },
	// itai
	{ addr: '0x736c3B6378E72bae8068035a0Eb0a38eA6eDD249', rate: 0.01902587519*1e18 },
	// maven
	{ addr: '0x15c632e1dC223Fc729F1929782B36C00d97F118b', rate: 0.1268391679*1e18 },
	// Vendetta / erkan
	{ addr: '0x9462e3a3f46cce9Ee35f560820207a7eB73Cb4cB', rate: 0.03170979198*1e18 },
	// Autonomy
	{ addr: '0x7aE9B5859D86EF4aca9396113BD93879236dc2b4', rate: 0.1522070015*1e18 },
	// Momentum6
	{ addr: '0x4A5482E8cae064fD662Fbf0fD1178F3bCF7778d2', rate: 0.1141552511*1e18 },
	// Thomas
	{ addr: '0xc23594c61e1628A83D25D5b14f37A3A63677441c', rate: 0.02536783359*1e18 },
	// Nathaniel
	{ addr: '0x07cD95A61E014a64Edfd35a6863464Db812BA65D', rate: 0.02536783359*1e18 },
	// arata/cryptotimes
	{ addr: '0x30240e0969FBb4470F7175879EA496605E1a5B58', rate: 0.01268391679*1e18 },
	// maren
	{ addr: '0x6456E2cC126631D52EDAF75d3500beddABF3F2D6', rate: 0.01268391679*1e18 },
	// cryptourism 
	{ addr: '0xd940DC7dda12fDa22402AC8647c58Fe44219Ba62', rate: 0.006341958397*1e18 },
	// christoph michael (security)
	//{ addr: '', rate: 0.01585489599*1e18 },
	// virtualbacon
	{ addr: '0x688fC82e46cdC8528bCbAa2028055892936f5070', rate: 0.01268391679*1e18 },
	// jay
	{ addr: '0x4be56744370b6f2B144216ca94e78a6Ad0b5C06B', rate: 0.06341958397*1e18 },
	// vlad dramaliev
	{ addr: '0xb62bD3035Cf670478D023661B61cC7fB368e7a29', rate: 0.006341958397*1e18 },
	// kong
	{ addr: '0x4321B98b9F2316056660f002269ff435fbb58e6A', rate: 0.006341958397*1e18 },
	// trader sz
	//{ addr: '0x91dB2c1332326D5A58457021480707C8cdf45876', rate: 0.01268391679*1e18 },
	// steel
	{ addr: '0x54029dAb86fBFBa03aeF548A8C82B524854eDe70', rate: 0.01268391679*1e18 },
	// tib talks
	{ addr: '0x49041422a5A1E146E67A12b83f4a32387Ff402D8', rate: 0.01268391679*1e18 },
	// splashr
	{ addr: '0x79B0Dfd0418eA1Cf9F066d1CF179c328d905Cd0A', rate: 0.01902587519*1e18 },
	// altcoin rookie
	{ addr: '0x7dB5c088a56e7fB0a702edd63f17daC18cDF4e81', rate: 0.01268391679*1e18 },

	// skynet
	{ addr: '0xb2a76c4a18b2863c155a8e382ebd231ffed48101', rate: 0.06341958397*1e18 },
	// cmichael
	{ addr: '0x20747870A6A8C0504FdbE199fCF29d6FB4Bf8Df2', rate: 0.01585489599*1e18 },
	//

	// ascensive
	{ addr: '0xEa8aE5797E0E054a06bD2FbE45dE1e5e0e9Adb81', rate: 0.3805175038*1e18 },
	// lhv
	{ addr: '0x335dE2bF5143E67653FA1dBf39196125a98F8a2E', rate: 0.6341958397*1e18 },

	// nicolas teng
	{ addr: '0x387D077b5770E581dB50ff4eAC64A0Ae6EC44dC5', rate: 0.01268391679*1e18 },

	// daedalus
	{ addr: '0x4A43cdD49823743572c40AdD69B78445c325cCbc', rate: 0.05073566717*1e18 },

	// leo chang
	{ addr: '0xB6BB67D341E5D56063EE0D7d526A83f18B912F5B', rate: 0.06341958397*1e18 },

	// 0x5643
	{ addr: '0x019192c6Ea261614e45c0cc2D62Be15B6B8B09a4', rate: 0.1268391679*1e18 },

	// dimitar
	{ addr: '0x54f1684D65B5951903A19d13837e87b945c62f9f', rate: 0.09512937595*1e18 },

	// { addr: '', rate: *1e18 },	
].map(x => ({ ...x, start: 1643695200, end: 1675231200 }))


const vestingsTeam = [
	// 1
	{ addr: '0xf38746dC80Af641247F4cA11ECE611696806D438', rate: 0.4122272958*1e18 },
	{ addr: '0xf6f819AfC58E38e262b1D0968dece99A7Df5C2F0', rate: 0.05284965331*1e18 },
	{ addr: '0x04f9c8dF6DD27e4684442FE410fdCeccF0b82933', rate: 0.02113986132*1e18 },
	{ addr: '0x50b4B7991D2bc16f5A0879bF148918Eb4638EF51', rate: 0.03170979198*1e18 },
	{ addr: '0x6d986Ee2C463387744e6454aBe32cA0AB55fb713', rate: 0.01056993066*1e18 },
	{ addr: '0x739a96244E313Fe3Ece39d176DB997A1f63a8Ee1', rate: 0.06341958397*1e18 },
	{ addr: '0xB18854a6E94023d97666f9Af7d005c468Aff7782', rate: 0.02113986132*1e18 },
	{ addr: '0xe3958FB96D673feF06d12e49a644D5ad7F3a1500', rate: 0.05284965331*1e18 },
	// emi
	{ addr: '0xbB3B3Eb4C4B2a13b288F194685CF61981F62F347', rate: 0.03170979198*1e18 }
].map(x => ({ ...x, start: 1643695200, end: 1738303200 }))


const vestings = vestingsSupporters.concat(vestingsTeam)
vestings.forEach(x => { x.rate = x.rate.toLocaleString('fullwide', {useGrouping: false}) })

async function main() {
	await Promise.all(vestings.map(async x => {
		const actualStart = (await oldSupplyController.vestingLastMint(x.addr, x.end, x.rate)).toNumber()
		if (actualStart > 0 && actualStart !== x.start) {
			console.log(x)
			x.start = actualStart
		}
		return x
	}))

	vestings.forEach(v => {
		console.log(`// vesting starts ${new Date(v.start*1000)}, continues for ${(v.end - v.start) / (365*24*60*60)}y`)
		console.log(`supplyController.setVesting(${v.addr}, ${v.start}, ${v.end}, ${v.rate});`)
	})


	console.log(JSON.stringify(vestings))
}

main()
	.catch(e => console.error(e))
