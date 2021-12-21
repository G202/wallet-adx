import { useCallback, useEffect, useRef, useState } from 'react';

import { ZAPPER_API_KEY } from '../config';
import { fetchGet } from '../lib/fetch';
import { ZAPPER_API_ENDPOINT } from '../config'
import supportedProtocols from '../consts/supportedProtocols';
import { useToasts } from '../hooks/toasts'
import { setKnownAddresses, setKnownTokens } from '../lib/humanReadableTransactions';
import { VELCRO_API_ENDPOINT } from '../config'
import { getTokenListBalance, tokenList, dummyExtraTokens, dummyTokensData, checkTokenList } from '../lib/balanceOracle'

const getBalances = (apiKey, network, protocol, address, provider) => fetchGet(`${provider === 'velcro' ? VELCRO_API_ENDPOINT : ZAPPER_API_ENDPOINT}/protocols/${protocol}/balances?addresses[]=${address}&network=${network}&api_key=${apiKey}&newBalances=true`)

let hidden, visibilityChange;
if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
}
let lastOtherProcolsRefresh = null

//use Balance Oracle
async function supplementTokensDataFromNetwork({ walletAddr, network, tokensData, extraTokens, updateBalance }) {
    if (!walletAddr || walletAddr==="" || !network || !network === "" ) return []
    if (!tokensData || !tokensData[0]) tokensData = checkTokenList(tokensData || dummyTokensData[network] || []) //tokensData check and populate for test if undefind
    if (!extraTokens || !extraTokens[0]) extraTokens = checkTokenList(extraTokens || dummyExtraTokens[network] || []) //extraTokens check and populate for test if undefind
  
    //concat predefind token list with extraTokens list (extraTokens must be ERC20)
    let tokens = [ ...new Set(tokenList[network] ? tokenList[network].concat(extraTokens) : [].concat(extraTokens))]

    // Pass velcro data (such as usd price) to getTokenListBalance
    tokens = tokens.map(t => {
        const tokenData = tokensData.find(({ address }) => address === t.address)
        return tokenData ? { ...tokenData, ...t } : t
    })

    let from = 0; let calls = []
      for (let i = 1; i <= Math.ceil(tokens.length / 50); i++) {
      calls.push(tokens.slice(from, (i * 50)))
          from += 50
      }
    // tokensData separated calls prevent errors from non erc20 tokens
    tokensData.filter(td => {
      return (tokens.map(t => t.address)?.indexOf(td.address) === -1)
    }).map (t => calls.push([t]))
  
    const tokenBalances = [].concat(...await Promise.all(calls.map(callTokens => {
          return getTokenListBalance({walletAddr, tokens: callTokens, network, updateBalance})
      })))
    return tokenBalances
}
  
export default function usePortfolio({ currentNetwork, account }) {
    const { addToast } = useToasts()

    const currentAccount = useRef();
    const [isBalanceLoading, setBalanceLoading] = useState(true);
    const [areProtocolsLoading, setProtocolsLoading] = useState(true);

    const [tokensByNetworks, setTokensByNetworks] = useState([])
    const [otherProtocolsByNetworks, setOtherProtocolsByNetworks] = useState([])

    const [balance, setBalance] = useState({
        total: {
            full: 0,
            truncated: 0,
            decimals: '00'
        },
        tokens: []
    });
    const [otherBalances, setOtherBalances] = useState([]);
    const [tokens, setTokens] = useState([]);
    const [protocols, setProtocols] = useState([]);
    const [collectibles, setCollectibles] = useState([]);
    const [extraTokens, setExtraTokens] = useState(() => {
        const storedExtraTokens = localStorage.extraTokens
        return storedExtraTokens ? JSON.parse(storedExtraTokens) : []
    });

    const getExtraTokensFromNetwork = useCallback(network => extraTokens
        .filter(extra => extra.network === network)
        .map(extraToken => ({
            ...extraToken,
            type: 'base',
            price: 0,
            balanceUSD: 0,
            isExtraToken: true
        }))
    , [extraTokens])

    const fetchTokens = useCallback(async (account, currentNetwork = false) => {
        try {
            const networks = currentNetwork ? [supportedProtocols.find(({ network }) => network === currentNetwork)] : supportedProtocols

            let failedRequests = 0
            const requestsCount = networks.length

            const updatedTokens = (await Promise.all(networks.map(async ({ network, balancesProvider }) => {
                try {
                    const balance = await getBalances(ZAPPER_API_KEY, network, 'tokens', account, balancesProvider)
                    if (!balance) return null

                    const { meta, products } = Object.values(balance)[0]

                    const extraTokensAssets = getExtraTokensFromNetwork(network)
                    const assets = [
                        ...products.map(({ assets }) => assets.map(({ tokens }) => tokens)).flat(2),
                        ...extraTokensAssets
                    ]

                    return {
                        network,
                        meta,
                        assets
                    }
                } catch(e) {
                    console.error('Balances API error', e)
                    failedRequests++
                }
            }))).filter(data => data)
            const updatedNetworks = updatedTokens.map(({ network }) => network)

            // Prevent race conditions
            if (currentAccount.current !== account) return

            setTokensByNetworks(tokensByNetworks => ([
                ...tokensByNetworks.filter(({ network }) => !updatedNetworks.includes(network)),
                ...updatedTokens
            ]))

            if (failedRequests >= requestsCount) throw new Error('Failed to fetch Tokens from API')
            return true
        } catch (error) {
            console.error(error)
            addToast(error.message, { error: true })
            return false
        }
    }, [getExtraTokensFromNetwork, addToast])

    const fetchOtherProtocols = useCallback(async (account, currentNetwork = false) => {
        try {
            const protocols = currentNetwork ? [supportedProtocols.find(({ network }) => network === currentNetwork)] : supportedProtocols

            let failedRequests = 0
            const requestsCount = protocols.reduce((acc, curr) => curr.protocols.length + acc, 0)

            const updatedProtocols = (await Promise.all(protocols.map(async ({ network, protocols }) => {
                const all = (await Promise.all(protocols.map(async protocol => {
                    try {
                        const balance = await getBalances(ZAPPER_API_KEY, network, protocol, account)
                        return balance ? Object.values(balance)[0] : null
                    } catch(e) {
                        console.error('Balances API error', e)
                        failedRequests++
                    }
                }))).filter(data => data).flat()

                return all.length ? {
                    network,
                    protocols: all.map(({ products }) => products.map(({ label, assets }) => ({ label, assets: assets.map(({ tokens }) => tokens).flat(1) }))).flat(2)
                } : null
            }))).filter(data => data)
            const updatedNetworks = updatedProtocols.map(({ network }) => network)

            // Prevent race conditions
            if (currentAccount.current !== account) return

            setOtherProtocolsByNetworks(protocolsByNetworks => ([
                ...protocolsByNetworks.filter(({ network }) => !updatedNetworks.includes(network)),
                ...updatedProtocols
            ]))
            
            lastOtherProcolsRefresh = Date.now()

            if (failedRequests >= requestsCount) throw new Error('Failed to fetch other Protocols from API')
            return true
        } catch (error) {
            console.error(error)
            addToast(error.message, { error: true })
            return false
        }
    }, [addToast])

    const refreshTokensIfVisible = useCallback(() => {
        if (!account) return
        if (!document[hidden] && !isBalanceLoading) fetchTokens(account, currentNetwork)
    }, [isBalanceLoading, account, fetchTokens, currentNetwork])

    const requestOtherProtocolsRefresh = async () => {
        if (!account) return
        if ((Date.now() - lastOtherProcolsRefresh) > 30000 && !areProtocolsLoading) await fetchOtherProtocols(account, currentNetwork)
    }

    // Make humanizer 'learn' about new tokens and aliases
    const updateHumanizerData = tokensByNetworks => {
        const tokensList = Object.values(tokensByNetworks).map(({ assets }) => assets).flat(1)
        const knownAliases = tokensList.map(({ address, symbol }) => ({ address, name: symbol}))
        setKnownAddresses(knownAliases)
        setKnownTokens(tokensList)
    }

    const onAddExtraToken = extraToken => {
        const { address, name, symbol } = extraToken
        if (extraTokens.map(({ address }) => address).includes(address)) return addToast(`${name} (${symbol}) is already added to your wallet.`)
        if (Object.values(tokenList).flat(1).map(({ address }) => address).includes(address)) return addToast(`${name} (${symbol}) is already handled by your wallet.`)
        if (tokens.map(({ address }) => address).includes(address)) return addToast(`You already have ${name} (${symbol}) in your wallet.`)

        const updatedExtraTokens = [
            ...extraTokens,
            {
                ...extraToken,
                coingeckoId: null
            }
        ]

        localStorage.extraTokens = JSON.stringify(updatedExtraTokens)
        setExtraTokens(updatedExtraTokens)
        addToast(`${name} (${symbol}) token added to your wallet!`)
    }

    // Fetch balances and protocols on account change
    useEffect(() => {
        currentAccount.current = account

        async function loadBalance() {
            if (!account) return
            setBalanceLoading(true)
            if (await fetchTokens(account)) setBalanceLoading(false)
        }

        async function loadProtocols() {
            if (!account) return
            setProtocolsLoading(true)
            if (await fetchOtherProtocols(account)) setProtocolsLoading(false)
        }

        loadBalance()
        loadProtocols()
    }, [account, fetchTokens, fetchOtherProtocols])

    // Update states on network, tokens and ohterProtocols change
    useEffect(() => {
        try {
            const tokens = tokensByNetworks.find(({ network }) => network === currentNetwork)
            if (tokens) setTokens(tokens.assets)

            const balanceByNetworks = tokensByNetworks.map(({ network, meta, assets }) => {
                const totalUSD = assets.reduce((acc, curr) => acc + curr.balanceUSD, 0)
                const balanceUSD = totalUSD + meta.find(({ label }) => label === 'Debt')?.value
                if (!balanceUSD) return {
                    network,
                    total: {
                        full: 0,
                        truncated: 0,
                        decimals: '00'
                    }
                }

                const [truncated, decimals] = Number(balanceUSD.toString()).toFixed(2).split('.')
                return {
                    network,
                    total: {
                        full: balanceUSD,
                        truncated: Number(truncated).toLocaleString('en-US'),
                        decimals
                    }
                }
            })

            const balance = balanceByNetworks.find(({ network }) => network === currentNetwork)
            if (balance) {
                setBalance(balance)
                setOtherBalances(balanceByNetworks.filter(({ network }) => network !== currentNetwork))
            }

            updateHumanizerData(tokensByNetworks)

            const otherProtocols = otherProtocolsByNetworks.find(({ network }) => network === currentNetwork)
            if (tokens && otherProtocols) {
                setProtocols([
                    {
                        label: 'Tokens',
                        assets: tokens.assets
                    },
                    ...otherProtocols.protocols.filter(({ label }) => label !== 'NFTs')
                ])
                setCollectibles(otherProtocols.protocols.find(({ label }) => label === 'NFTs')?.assets || [])
            }
        } catch(e) {
            console.error(e);
            addToast(e.message | e, { error: true })
        }
    }, [currentNetwork, tokensByNetworks, otherProtocolsByNetworks, addToast])

    // Refresh tokens on network change
    useEffect(() => {
        refreshTokensIfVisible()
    }, [currentNetwork, refreshTokensIfVisible])

    // Refresh balance every 90s if visible
    useEffect(() => {
        const refreshInterval = setInterval(refreshTokensIfVisible, 90000)
        return () => clearInterval(refreshInterval)
    }, [refreshTokensIfVisible])

    // Refresh balance every 150s if hidden
    useEffect(() => {
        const refreshIfHidden = () => document[hidden] && !isBalanceLoading ? fetchTokens(account, currentNetwork) : null
        const refreshInterval = setInterval(refreshIfHidden, 150000)
        return () => clearInterval(refreshInterval)
    }, [account, currentNetwork, isBalanceLoading, fetchTokens])

    // Get supplement tokens data 
    useEffect(() => {
        const getSupllementTokenData = async () => {
            const currentNetworkTokens = tokensByNetworks.find(({ network }) => network === currentNetwork)
            const rcpTokenData = await supplementTokensDataFromNetwork({
                walletAddr: account,
                network: currentNetwork,
                tokensData: currentNetworkTokens.assets.filter(({ isExtraToken }) => !isExtraToken),
                extraTokens
            })

            currentNetworkTokens.assets = rcpTokenData

            setTokensByNetworks([
                ...tokensByNetworks.filter(({ network }) => network !== currentNetwork),
                currentNetworkTokens
            ])
        }
        const refreshInterval = setInterval(getSupllementTokenData, 20000)
        return () => clearInterval(refreshInterval)
    }, [account, currentNetwork, isBalanceLoading, fetchTokens, tokensByNetworks, extraTokens])

    // Refresh balance when window is focused
    useEffect(() => {
        document.addEventListener(visibilityChange, refreshTokensIfVisible, false);
        return () => document.removeEventListener(visibilityChange, refreshTokensIfVisible, false);
    }, [refreshTokensIfVisible])

    return {
        isBalanceLoading,
        areProtocolsLoading,
        balance,
        otherBalances,
        tokens,
        protocols,
        collectibles,
        requestOtherProtocolsRefresh,
        onAddExtraToken
        //updatePortfolio//TODO find a non dirty way to be able to reply to getSafeBalances from the dapps, after the first refresh
    }
}
