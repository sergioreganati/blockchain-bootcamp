

export const provider = (state = {}, action) => {
    switch (action.type) {
        case 'PROVIDER_LOADED':
            return {
                ...state,
                connection: action.connection,
            }
        case 'NETWORK_LOADED':
            return {
                ...state,
                chainId: action.chainId,
            }
        case 'ACCOUNT_LOADED':
            return {
                ...state,
                account: action.account,
    
            }
        case 'ETHER_BALANCE_LOADED':
            return {
                ...state,
                etherBalance: action.balance,
            }

            default:
                return state
    }
} 

const DEFAULT_TOKEN_STATE = {
     loaded: false, 
     contracts: [], 
     symbols: [] 
    }
       
export const tokens = (state = DEFAULT_TOKEN_STATE, action) => {
    switch (action.type) {
        case 'TOKEN_1_LOADED':
            return {
                ...state,
                loaded: true,
                contracts: [action.token],
                symbols: [action.symbol],

            }
            case 'TOKEN_1_BALANCE_LOADED':
                return {
                ...state,
                balances: [action.balance],
                
    
            }

        case 'TOKEN_2_LOADED':
            return {
                ...state,
                loaded: true,
                contracts: [...state.contracts, action.token],
                symbols: [...state.symbols, action.symbol],
            }
            case 'TOKEN_2_BALANCE_LOADED':
                return {
                ...state,
                balances: [...state.balances, action.balance],
                
    
            }




        default:
            return state
        }

    }

    const DEFAULT_EXCHANGE_STATE = { 
        loaded: false, 
        contract: {}, 
        transaction:{isSuccessful: false} ,
        events:[],
        withdraw:[],
        allOrders: {data: [], loaded: false},
        cancelledOrders: {data: [], loaded: false},
        filledOrders: {data: [], loaded: false},
    
    }
export const exchange = (state = DEFAULT_EXCHANGE_STATE, action) => {
    switch (action.type) {

        case 'EXCHANGE_LOADED':
            return {
                ...state,
                loaded: true,
                contract: action.exchange,
            }
         //-----------------LOAD_EXCHANGE_BALANCES-----------------
        case 'EXCHANGE_TOKEN_1_BALANCE_LOADED':
            return {
                ...state,
                balances: [action.balance],
            }
        case 'EXCHANGE_TOKEN_2_BALANCE_LOADED':
            return {
                    ...state,
                    balances: [...state.balances, action.balance],
                }

        //-----------------LOAD_EXCHANGE_ORDERS-----------------
        case 'ALL_ORDERS_LOADED':
            return {
                ...state,
                allOrders: {
                    loaded: true,
                    data: action.allOrders 
                }
            }
        case 'CANCELLED_ORDERS_LOADED' :
            return {
                ...state,
                cancelledOrders: {
                    loaded: true,
                    data: action.cancelledOrders
                }
            }
        
        case 'FILLED_ORDERS_LOADED' :
            return {
                ...state,
                filledOrders: {
                    loaded: true,
                    data: action.filledOrders
                }
            }
        //-----------------CANCEL ORDER-----------------

        case 'CANCEL_SUCCESS' :
            return {
                ...state,
                transaction: {
                    isSuccessful: true,
                    isPending: false
                },
                cancelledOrders: {
                    ...state.cancelledOrders,
                    data: [...state.cancelledOrders.data, action.order]
                   // data = [...state.allOrders.data, action.order]

                },
                events: [action.event, ...state.events]
            }
        

            case 'CANCEL_REQUEST' :
                return {
                    ...state,
                    transaction: {
                        isSuccessful: false,
                        isPending: true,
                        transactionType: 'Cancel'

    
                }
            }
            case 'CANCEL_FAIL' :
                return {
                    ...state,
                    transaction: {
                        isSuccessful: false,
                        isPending: false,
                        transactionType: 'Cancel',
                        isError: true
    
                }
            }
        //make order

        case 'ORDER_REQUEST':
            return {
                ...state,
                transaction: {
                    transactionType: 'Order',
                    isPending: true,
                    isSuccessful: false
                },
                orderInProgress: true,
            }

        case 'ORDER_FAIL':
            return {
                ...state,
                transaction: {
                    transactionType: 'Order',
                    isPending: false,
                    isSuccessful: false,
                    isError: true
                },
                orderInProgress: false,
            }
            
            case 'ORDER_SUCCESS':
                
                //prevent duplicate orders
                var index, data
                index = state.allOrders.data.findIndex(order => order.id.toString() === action.order.id.toString()) 
             
                if (index === (-1)) {
                data = [...state.allOrders.data, action.order]
                 //console.log('updating database')
            } else {
                data = state.allOrders.data
                //console.log('database unchanged')
            }  
                return {    
                ...state,
                allOrders: {
                    ...state.allOrders, 
                    data
                },
                transaction: {
                    transactionType: 'Order',
                    isPending: false,
                    isSuccessful: true
                },
                orderInProgress: false,
                events: [action.event, ...state.events]
            }

            //-----------------FILLED ORDERS-----------------

        case 'ORDER_FILL_SUCCESS' :
           
            index = state.filledOrders.data.findIndex(order => order.id.toString() === action.order.id.toString())
            if(index === -1) {
                data = [...state.filledOrders.data, action.order]
            } else {
                data = state.filledOrders.data
            }
            return {
                ...state,
                transaction: {
                    isSuccessful: true,
                    isPending: false
                },
                filledOrders: {
                    ...state.filledOrders,
                    data: [...state.filledOrders.data, action.order]
                },
                events: [action.event, ...state.events]
            }
            case 'ORDER_FILL_REQUEST' :
                return {
                    ...state,
                    transaction: {
                        isSuccessful: false,
                        isPending: true,
                        transactionType: 'Fill Order'
                    }
                }
            case 'ORDER_FILL_FAIL' :
                return {
                    ...state,
                    transaction: {
                        isSuccessful: false,
                        isPending: false,
                        transactionType: 'Fill Order',
                        isError: true
                    }
                }

    
        ///-----------------TRANSFER_TOKENS-----------------------
        case 'TRANSFER_REQUEST':
            return {
                ...state,
                transaction: {
                    transactionType: 'Transfer',
                    isPending: true,
                    isSuccessful: false
            },
                transferInProgress: true,
            }

        case 'TRANSFER_SUCCESS':
            return {
                ...state,
                transaction: {
                    transactionType: 'Transfer',
                    isPending: false,
                    isSuccessful: true
                },
                transferInProgress: false,
                events: [action.event, ...state.events]
            }

        case 'TRANSFER_FAIL':
            return {
                ...state,
                transaction: {
                    transactionType: 'Transfer',
                    isPending: false,
                    isSuccessful: false,
                    isError: true
                },
                transferInProgress: false,
            }



        
        default:
            return state
         
        }
}

