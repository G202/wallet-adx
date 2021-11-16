const SummaryFormatter = require('../../summaryFormatter')
module.exports = {
  name: 'curveSwap',
  interface: {
    methods: [
      {
        name: 'exchange_underlying',
        signature: '0xa6417ed6',
        summary: ({network, txn, inputs, contract}) => {
          //index out of bounds check
          const inAddress = (contract.data.underlying && contract.data.underlying[inputs.i] && contract.data.underlying[inputs.i].address) ? contract.data.underlying[inputs.i].address : ''
          const outAddress = (contract.data.underlying && contract.data.underlying[inputs.j] && contract.data.underlying[inputs.j].address) ? contract.data.underlying[inputs.j].address : ''
          const SF = new SummaryFormatter(network, contract.manager).mainAction('swap')
          return SF.actions([
            SF.text('Swap')
              .tokenAmount(inAddress, inputs.dx)
              .text('for at least')
              .tokenAmount(outAddress, inputs.min_dy)
              .action()
          ])
        }
      },
      {
        name: 'remove_liquidity_imbalance',
        signature: '0x9fdaea0c',
        summary: ({network, txn, inputs, contract}) => {
          const liquidityAddresses = {
            0: (contract.data.underlying && contract.data.underlying[0] && contract.data.underlying[0].address) ? contract.data.underlying[0].address : '',
            1: (contract.data.underlying && contract.data.underlying[1] && contract.data.underlying[1].address) ? contract.data.underlying[1].address : '',
            2: (contract.data.underlying && contract.data.underlying[2] && contract.data.underlying[2].address) ? contract.data.underlying[2].address : ''
          }

          const SF = new SummaryFormatter(network, contract.manager).mainAction('remove_liquidity')
          return SF.actions([
            SF.text('Remove liquidity for').action(),
            inputs.amounts[0] > 0 && SF.tokenAmount(liquidityAddresses[0], inputs.amounts[0]).action(),
            inputs.amounts[1] > 0 && SF.tokenAmount(liquidityAddresses[1], inputs.amounts[1]).action(),
            inputs.amounts[2] > 0 && SF.tokenAmount(liquidityAddresses[2], inputs.amounts[2]).action()
          ])
        }
      },
      {
        name: 'add_liquidity',
        signature: '0x4515cef3',
        summary: ({network, txn, inputs, contract}) => {
          const liquidityAddresses = {
            0: (contract.data.underlying && contract.data.underlying[0] && contract.data.underlying[0].address) ? contract.data.underlying[0].address : '',
            1: (contract.data.underlying && contract.data.underlying[1] && contract.data.underlying[1].address) ? contract.data.underlying[1].address : '',
            2: (contract.data.underlying && contract.data.underlying[2] && contract.data.underlying[2].address) ? contract.data.underlying[2].address : ''
          }

          const SF = new SummaryFormatter(network, contract.manager).mainAction('add_liquidity')
          return SF.actions([
            SF.text('Add liquidity for at least')
              .tokenAmount(contract.data.lpToken.address, inputs.min_mint_amount)
              .action(),
            inputs.amounts[0] > 0 && SF.tokenAmount(liquidityAddresses[0], inputs.amounts[0]).action(),
            inputs.amounts[1] > 0 && SF.tokenAmount(liquidityAddresses[1], inputs.amounts[1]).action(),
            inputs.amounts[2] > 0 && SF.tokenAmount(liquidityAddresses[2], inputs.amounts[2]).action()
          ])
        }
      },
    ],
    abi: [{
      'name': 'TokenExchange',
      'inputs': [{'type': 'address', 'name': 'buyer', 'indexed': true}, {
        'type': 'int128',
        'name': 'sold_id',
        'indexed': false
      }, {'type': 'uint256', 'name': 'tokens_sold', 'indexed': false}, {
        'type': 'int128',
        'name': 'bought_id',
        'indexed': false
      }, {'type': 'uint256', 'name': 'tokens_bought', 'indexed': false}],
      'anonymous': false,
      'type': 'event'
    }, {
      'name': 'TokenExchangeUnderlying',
      'inputs': [{'type': 'address', 'name': 'buyer', 'indexed': true}, {
        'type': 'int128',
        'name': 'sold_id',
        'indexed': false
      }, {'type': 'uint256', 'name': 'tokens_sold', 'indexed': false}, {
        'type': 'int128',
        'name': 'bought_id',
        'indexed': false
      }, {'type': 'uint256', 'name': 'tokens_bought', 'indexed': false}],
      'anonymous': false,
      'type': 'event'
    }, {
      'name': 'AddLiquidity',
      'inputs': [{'type': 'address', 'name': 'provider', 'indexed': true}, {
        'type': 'uint256[3]',
        'name': 'token_amounts',
        'indexed': false
      }, {'type': 'uint256[3]', 'name': 'fees', 'indexed': false}, {
        'type': 'uint256',
        'name': 'invariant',
        'indexed': false
      }, {'type': 'uint256', 'name': 'token_supply', 'indexed': false}],
      'anonymous': false,
      'type': 'event'
    }, {
      'name': 'RemoveLiquidity',
      'inputs': [{'type': 'address', 'name': 'provider', 'indexed': true}, {
        'type': 'uint256[3]',
        'name': 'token_amounts',
        'indexed': false
      }, {'type': 'uint256[3]', 'name': 'fees', 'indexed': false}, {
        'type': 'uint256',
        'name': 'token_supply',
        'indexed': false
      }],
      'anonymous': false,
      'type': 'event'
    }, {
      'name': 'RemoveLiquidityImbalance',
      'inputs': [{'type': 'address', 'name': 'provider', 'indexed': true}, {
        'type': 'uint256[3]',
        'name': 'token_amounts',
        'indexed': false
      }, {'type': 'uint256[3]', 'name': 'fees', 'indexed': false}, {
        'type': 'uint256',
        'name': 'invariant',
        'indexed': false
      }, {'type': 'uint256', 'name': 'token_supply', 'indexed': false}],
      'anonymous': false,
      'type': 'event'
    }, {
      'name': 'CommitNewAdmin',
      'inputs': [{'type': 'uint256', 'name': 'deadline', 'indexed': true, 'unit': 'sec'}, {
        'type': 'address',
        'name': 'admin',
        'indexed': true
      }],
      'anonymous': false,
      'type': 'event'
    }, {
      'name': 'NewAdmin',
      'inputs': [{'type': 'address', 'name': 'admin', 'indexed': true}],
      'anonymous': false,
      'type': 'event'
    }, {
      'name': 'CommitNewParameters',
      'inputs': [{'type': 'uint256', 'name': 'deadline', 'indexed': true, 'unit': 'sec'}, {
        'type': 'uint256',
        'name': 'A',
        'indexed': false
      }, {'type': 'uint256', 'name': 'fee', 'indexed': false}, {
        'type': 'uint256',
        'name': 'admin_fee',
        'indexed': false
      }],
      'anonymous': false,
      'type': 'event'
    }, {
      'name': 'NewParameters',
      'inputs': [{'type': 'uint256', 'name': 'A', 'indexed': false}, {
        'type': 'uint256',
        'name': 'fee',
        'indexed': false
      }, {'type': 'uint256', 'name': 'admin_fee', 'indexed': false}],
      'anonymous': false,
      'type': 'event'
    }, {
      'outputs': [],
      'inputs': [{'type': 'address[3]', 'name': '_coins'}, {
        'type': 'address[3]',
        'name': '_underlying_coins'
      }, {'type': 'address', 'name': '_pool_token'}, {'type': 'uint256', 'name': '_A'}, {
        'type': 'uint256',
        'name': '_fee'
      }],
      'constant': false,
      'payable': false,
      'type': 'constructor'
    }, {
      'name': 'get_virtual_price',
      'outputs': [{'type': 'uint256', 'name': 'out'}],
      'inputs': [],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 1327351
    }, {
      'name': 'calc_token_amount',
      'outputs': [{'type': 'uint256', 'name': 'out'}],
      'inputs': [{'type': 'uint256[3]', 'name': 'amounts'}, {'type': 'bool', 'name': 'deposit'}],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 5171741
    }, {
      'name': 'add_liquidity',
      'outputs': [],
      'inputs': [{'type': 'uint256[3]', 'name': 'amounts'}, {'type': 'uint256', 'name': 'min_mint_amount'}],
      'constant': false,
      'payable': false,
      'type': 'function',
      'gas': 7905846
    }, {
      'name': 'get_dy',
      'outputs': [{'type': 'uint256', 'name': 'out'}],
      'inputs': [{'type': 'int128', 'name': 'i'}, {'type': 'int128', 'name': 'j'}, {'type': 'uint256', 'name': 'dx'}],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 3016651
    }, {
      'name': 'get_dx',
      'outputs': [{'type': 'uint256', 'name': 'out'}],
      'inputs': [{'type': 'int128', 'name': 'i'}, {'type': 'int128', 'name': 'j'}, {'type': 'uint256', 'name': 'dy'}],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 3016657
    }, {
      'name': 'get_dy_underlying',
      'outputs': [{'type': 'uint256', 'name': 'out'}],
      'inputs': [{'type': 'int128', 'name': 'i'}, {'type': 'int128', 'name': 'j'}, {'type': 'uint256', 'name': 'dx'}],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 3016494
    }, {
      'name': 'get_dx_underlying',
      'outputs': [{'type': 'uint256', 'name': 'out'}],
      'inputs': [{'type': 'int128', 'name': 'i'}, {'type': 'int128', 'name': 'j'}, {'type': 'uint256', 'name': 'dy'}],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 3016500
    }, {
      'name': 'exchange',
      'outputs': [],
      'inputs': [{'type': 'int128', 'name': 'i'}, {'type': 'int128', 'name': 'j'}, {
        'type': 'uint256',
        'name': 'dx'
      }, {'type': 'uint256', 'name': 'min_dy'}],
      'constant': false,
      'payable': false,
      'type': 'function',
      'gas': 6109460
    }, {
      'name': 'exchange_underlying',
      'outputs': [],
      'inputs': [{'type': 'int128', 'name': 'i'}, {'type': 'int128', 'name': 'j'}, {
        'type': 'uint256',
        'name': 'dx'
      }, {'type': 'uint256', 'name': 'min_dy'}],
      'constant': false,
      'payable': false,
      'type': 'function',
      'gas': 6125699
    }, {
      'name': 'remove_liquidity',
      'outputs': [],
      'inputs': [{'type': 'uint256', 'name': '_amount'}, {'type': 'uint256[3]', 'name': 'min_amounts'}],
      'constant': false,
      'payable': false,
      'type': 'function',
      'gas': 197574
    }, {
      'name': 'remove_liquidity_imbalance',
      'outputs': [],
      'inputs': [{'type': 'uint256[3]', 'name': 'amounts'}, {'type': 'uint256', 'name': 'max_burn_amount'}],
      'constant': false,
      'payable': false,
      'type': 'function',
      'gas': 7905313
    }, {
      'name': 'commit_new_parameters',
      'outputs': [],
      'inputs': [{'type': 'uint256', 'name': 'amplification'}, {
        'type': 'uint256',
        'name': 'new_fee'
      }, {'type': 'uint256', 'name': 'new_admin_fee'}],
      'constant': false,
      'payable': false,
      'type': 'function',
      'gas': 145897
    }, {
      'name': 'apply_new_parameters',
      'outputs': [],
      'inputs': [],
      'constant': false,
      'payable': false,
      'type': 'function',
      'gas': 133512
    }, {
      'name': 'revert_new_parameters',
      'outputs': [],
      'inputs': [],
      'constant': false,
      'payable': false,
      'type': 'function',
      'gas': 21835
    }, {
      'name': 'commit_transfer_ownership',
      'outputs': [],
      'inputs': [{'type': 'address', 'name': '_owner'}],
      'constant': false,
      'payable': false,
      'type': 'function',
      'gas': 74512
    }, {
      'name': 'apply_transfer_ownership',
      'outputs': [],
      'inputs': [],
      'constant': false,
      'payable': false,
      'type': 'function',
      'gas': 60568
    }, {
      'name': 'revert_transfer_ownership',
      'outputs': [],
      'inputs': [],
      'constant': false,
      'payable': false,
      'type': 'function',
      'gas': 21925
    }, {
      'name': 'withdraw_admin_fees',
      'outputs': [],
      'inputs': [],
      'constant': false,
      'payable': false,
      'type': 'function',
      'gas': 18169
    }, {
      'name': 'kill_me',
      'outputs': [],
      'inputs': [],
      'constant': false,
      'payable': false,
      'type': 'function',
      'gas': 37878
    }, {
      'name': 'unkill_me',
      'outputs': [],
      'inputs': [],
      'constant': false,
      'payable': false,
      'type': 'function',
      'gas': 22015
    }, {
      'name': 'coins',
      'outputs': [{'type': 'address', 'name': 'out'}],
      'inputs': [{'type': 'int128', 'name': 'arg0'}],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 2190
    }, {
      'name': 'underlying_coins',
      'outputs': [{'type': 'address', 'name': 'out'}],
      'inputs': [{'type': 'int128', 'name': 'arg0'}],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 2220
    }, {
      'name': 'balances',
      'outputs': [{'type': 'uint256', 'name': 'out'}],
      'inputs': [{'type': 'int128', 'name': 'arg0'}],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 2250
    }, {
      'name': 'A',
      'outputs': [{'type': 'uint256', 'name': 'out'}],
      'inputs': [],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 2081
    }, {
      'name': 'fee',
      'outputs': [{'type': 'uint256', 'name': 'out'}],
      'inputs': [],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 2111
    }, {
      'name': 'admin_fee',
      'outputs': [{'type': 'uint256', 'name': 'out'}],
      'inputs': [],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 2141
    }, {
      'name': 'owner',
      'outputs': [{'type': 'address', 'name': 'out'}],
      'inputs': [],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 2171
    }, {
      'name': 'admin_actions_deadline',
      'outputs': [{'type': 'uint256', 'unit': 'sec', 'name': 'out'}],
      'inputs': [],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 2201
    }, {
      'name': 'transfer_ownership_deadline',
      'outputs': [{'type': 'uint256', 'unit': 'sec', 'name': 'out'}],
      'inputs': [],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 2231
    }, {
      'name': 'future_A',
      'outputs': [{'type': 'uint256', 'name': 'out'}],
      'inputs': [],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 2261
    }, {
      'name': 'future_fee',
      'outputs': [{'type': 'uint256', 'name': 'out'}],
      'inputs': [],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 2291
    }, {
      'name': 'future_admin_fee',
      'outputs': [{'type': 'uint256', 'name': 'out'}],
      'inputs': [],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 2321
    }, {
      'name': 'future_owner',
      'outputs': [{'type': 'address', 'name': 'out'}],
      'inputs': [],
      'constant': true,
      'payable': false,
      'type': 'function',
      'gas': 2351
    }]
  }
}
