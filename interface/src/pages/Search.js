import { useEffect, useRef, useState } from 'react';
import { NavLink as Link, useParams, useNavigate } from 'react-router-dom';

function Search () {
    const navigate = useNavigate();
    let { id } = useParams();
    const searchInput = useRef()

    function copyText({input}) {
        input.select()
        input.setSelectionRange(0, 99999)
        navigator.clipboard.writeText(input.value);
    }

    function Validator({address}) {
        const[validatorData, setValidatorData] = useState({})
        useEffect(() => {
            (async () => {
                let response = await fetch(process.env.REACT_APP_API_DATA + "/validators/" + address + "/info");
                const _validatorData = await response.json();
                if(_validatorData !== null) {
                    setValidatorData(_validatorData)
                }
                
            })();
        },[])
        return (
            <div className='h-content space-y-2 flex flex-col px-4'>
                <div className='text-3xl pt-12 text-[#FFFF00]'>Validator Details</div>
                {/* <div>
                    <div className='text-[#FFFF00] overflow-x-auto'>
                        <div className='flex justify-between py-4'>
                            <div>
                                <div className='font-semibold'>Transaction Hash</div>
                                <div className='truncate'>{txnData["txn_hash"]}</div>
                            </div>
                            <div>
                                <div className=''>Block Height</div>
                                <button onClick={() => {navigate('/search/' + txnData['block_height'])}} className='hover:text-[#FFFFFF] underline'>#{txnData["block_height"]}</button>
                            </div>
                        </div>
                        <div className='flex justify-between py-4'>
                            <div>
                                <div className=''>Network</div>
                                <div>{txnData["chain_id"]}</div>
                            </div>
                            <div>
                                <div className=''>Transaction Fee</div>
                                <div>{parseInt(txnData["fee_amount_per_gas_unit"])/1000000}</div>
                            </div>
                        </div>
                        <div className='flex justify-between py-4'>
                            <div>
                                <div className=''>Gas Used/Wanted</div>
                                <div>{txnData["gas_used"]}/{txnData["gas_wanted"]}</div>
                            </div>
                            <div>
                                <div className=''>Txn Time</div>
                                <div>{txnData["timestamp"]}</div>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className=''>
                    <div className='rounded-md bg-black py-4 text-[#FFFF00]'>
                        {
                            validatorData !== undefined && validatorData["info"] !== undefined ?
                                <div className='rounded-md space-y-4 bg-gray-900 p-3 my-4'>
                                    <div className='flex space-x-2'>
                                        <div>Validator Address:</div>
                                        <div className='text-[#FFAA00]'>{validatorData["info"]["validator_address"]}</div>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <div>Commission Rate:</div>
                                        <div className='text-[#FFAA00]'>{validatorData["info"]["commission_rate"]}</div>
                                    </div>
                                    <div className='flex space-x-2 rounded-lg bg-black p-2 px-4'>
                                        <div>Details:</div>
                                        <div className='text-[#FFAA00]'>{validatorData["info"]["details"]}</div>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <div>Identity:</div>
                                        <div className='text-[#FFAA00]'>{validatorData["info"]["identity"]}</div>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <div>Active:</div>
                                        <div className='text-[#FFAA00]'>{validatorData["info"]["is_active"].toString()}</div>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <div>Jailed:</div>
                                        <div className='text-[#FFAA00]'>{validatorData["info"]["is_jailed"].toString()}</div>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <div>Moniker:</div>
                                        <div className='text-[#FFAA00]'>{validatorData["info"]["moniker"]}</div>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <div>Rank:</div>
                                        <div className='text-[#FFAA00]'>{validatorData["info"]["rank"]}</div>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <div>Account Address:</div>
                                        <div className='text-[#FFAA00]'>{validatorData["info"]["account_address"]}</div>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <div>Voting Power:</div>
                                        <div className='text-[#FFAA00]'>{validatorData["info"]["voting_power"]}</div>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <div>Website:</div>
                                        <div className='text-[#FFAA00]'>{validatorData["info"]["website"]}</div>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <div>Self Voting Power:</div>
                                        <div className='text-[#FFAA00]'>{validatorData["self_voting_power"]}</div>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <div>Total Voting Power:</div>
                                        <div className='text-[#FFAA00]'>{validatorData["total_voting_power"]}</div>
                                    </div>
                                </div> 
                            : ''
                        }
                    </div>
                </div>
            </div>
        )
    }

    function Hash({hash}) {
        const[txnData, setTxnData] = useState({})
        useEffect(() => {
            (async () => {
                let response = await fetch(process.env.REACT_APP_API_DATA + "/txs/" + hash);
                const _txnData = await response.json();
                if(_txnData !== null) {
                    setTxnData({
                        'chain_id': "initiation-1",
                        'timestamp': _txnData['tx_response']['timestamp'],
                        'block_height': _txnData['tx_response']['height'],
                        'txn_hash': _txnData['tx_response']['txhash'],
                        "fee_amount_per_gas_unit": _txnData["tx"]["auth_info"]["fee"]["amount"][0]["amount"],
                        "gas_used": _txnData["tx_response"]["gas_used"],
                        "gas_wanted": _txnData["tx_response"]["gas_wanted"],
                        "messages": _txnData["tx"]["body"]["messages"]
                    })
                }
                
            })();
        },[])
        return (
            <div className='h-content space-y-4 flex flex-col px-4'>
                <div className='text-3xl pt-12 text-[#FFFF00]'>Transaction Details</div>
                <div>
                    <div className='text-[#FFFF00] overflow-x-auto'>
                        <div className='flex justify-between py-4'>
                            <div>
                                <div className='font-semibold'>Transaction Hash</div>
                                <div className='truncate'>{txnData["txn_hash"]}</div>
                            </div>
                            <div>
                                <div className=''>Block Height</div>
                                <button onClick={() => {navigate('/search/' + txnData['block_height'])}} className='hover:text-[#FFFFFF] underline'>#{txnData["block_height"]}</button>
                            </div>
                        </div>
                        <div className='flex justify-between py-4'>
                            <div>
                                <div className=''>Network</div>
                                <div>{txnData["chain_id"]}</div>
                            </div>
                            <div>
                                <div className=''>Transaction Fee</div>
                                <div>{parseInt(txnData["fee_amount_per_gas_unit"])/1000000}</div>
                            </div>
                        </div>
                        <div className='flex justify-between py-4'>
                            <div>
                                <div className=''>Gas Used/Wanted</div>
                                <div>{txnData["gas_used"]}/{txnData["gas_wanted"]}</div>
                            </div>
                            <div>
                                <div className=''>Txn Time</div>
                                <div>{txnData["timestamp"]}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <div className='rounded-md bg-black py-4 text-[#FFFF00]'>
                        <div className='text-2xl mb-4'>Messages</div>
                        {
                            txnData["messages"] !== undefined ? txnData["messages"].map((msg, index) => {
                                return (
                                    <div className='rounded-md space-y-2 bg-gray-900 p-3 my-4'>
                                        <div className='flex space-x-2'>
                                            <div>Msg Type:</div>
                                            <div className='text-[#FFAA00]'>{msg["@type"].split(".")[msg["@type"].split(".").length - 1]}</div>
                                        </div>
                                        {
                                            msg["source_port"] !== undefined ? 
                                            <div className='flex space-x-2'>
                                                <div>Source Port:</div>
                                                <div className='text-[#FFAA00]'>{msg["source_port"]}</div>
                                            </div> : ''
                                        }
                                        {
                                            msg["source_channel"] !== undefined ?
                                            <div className='flex space-x-2'>
                                                <div>Source Channel:</div>
                                                <div className='text-[#FFAA00]'>{msg["source_channel"]}</div>
                                            </div> : ''
                                        }
                                        {
                                            msg["token"] !== undefined ?
                                            <div className='flex space-x-2 rounded-lg bg-black p-2 px-4'>
                                                <div>Token:</div>
                                                <div className=''>
                                                    <div className='text-[#FFAA00]'>{msg["token"]["denom"]}</div>
                                                    <div className='text-[#FFAA00]'>{msg["token"]["amount"]}</div>
                                                </div>
                                            </div> : ''
                                        }
                                        {
                                            msg["sender"] !== undefined ?
                                            <div className='flex space-x-2'>
                                                <div>Sender:</div>
                                                <div className='text-[#FFAA00]'>{msg["sender"]}</div>
                                            </div> : ''
                                        }
                                        {
                                            msg["receiver"] !== undefined ?
                                            <div className='flex space-x-2'>
                                                <div>Receiver:</div>
                                                <div className='text-[#FFAA00]'>{msg["receiver"]}</div>
                                            </div> : ''
                                        }
                                        {/* <div className='flex space-x-2'>
                                            <div>Timeout Height:</div>
                                            <div>
                                                <article>{msg["timeout_height"].toString()}</article>
                                            </div>
                                        </div> */}
                                        {
                                            msg["timeout_timestamp"] !== undefined ?
                                            <div className='flex space-x-2'>
                                                <div>Timeout Timestamp:</div>
                                                <div className='text-[#FFAA00]'>{msg["timeout_timestamp"]}</div>
                                            </div> : ''
                                        }
                                        {
                                            msg["memo"] !== undefined ? 
                                            <div className='flex space-x-2 rounded-lg bg-black p-2 px-4'>
                                                <div>Memo:</div>
                                                <div className='text-[#FFAA00]'>{msg["memo"]}</div>
                                            </div> : ''
                                        }
                                        {
                                            msg["validator_address"] !== undefined ?
                                            <div className='flex space-x-2'>
                                                <div>Validator:</div>
                                                <div className='text-[#FFAA00]'>{msg["validator_address"]}</div>
                                            </div> : ''
                                        }
                                        {
                                            msg["delegator_address"] !== undefined ?
                                            <div className='flex space-x-2'>
                                                <div>Delegator:</div>
                                                <div className='text-[#FFAA00]'>{msg["delegator_address"]}</div>
                                            </div> : ''
                                        }
                                    </div>
                                )
                            }) : ''
                        }
                    </div>
                </div>
            </div>
        )
    }

    function Height({height}) {
        const [blockData, setBlockData] = useState({})
        const [page, setPage] = useState(1)

        const changePage = async (_page) => {
            setPage(_page)
            const txn_response = await fetch(process.env.REACT_APP_API_DATA + "/blocks/" + height + "/txs?limit=10&offset="+ ((_page - 1) * 10) +"&is_wasm=false&is_move=true&is_initia=true")
            const _txn_response = await txn_response.json();

            setBlockData(
                {
                    ...blockData,
                    "txn_hash": _txn_response['items']
                }
            )
        }   

        useEffect(() => {
            (async () => {
                const response = await fetch(process.env.REACT_APP_API_DATA + "/blocks/" + height + "/info");
                const _blockData = await response.json();

                const txn_response = await fetch(process.env.REACT_APP_API_DATA + "/blocks/" + height + "/txs?limit=10&offset=0&is_wasm=false&is_move=true&is_initia=true")
                const _txn_response = await txn_response.json();
                if(_blockData !== null) {
                    setBlockData({
                        'block_height': _blockData['height'],
                        "block_hash": _blockData['hash'],
                        'block_time': _blockData['timestamp'],
                        'chain_id': "initiation_1",
                        'proposer': _blockData['validator']['validator_address'],
                        "txn_hash": _txn_response['items'],
                        "txn_size": _txn_response['total'],
                    })
                }
            })();
        },[])
        return (
            <div className='h-content space-y-6 flex flex-col text-[#FFFF00]'>
                <div className='p-4'>
                    <div className='text-2xl py-4'>Block Overview</div>
                    <div className='overflow-x-auto text-[#FFFF00]'>
                        <div className='flex justify-between space-x-4 py-6'>
                            <div>
                                <div>Hash</div>
                                <div className='font-semibold'>{blockData["block_hash"] !==undefined ? blockData["block_hash"].slice(2) : ''}</div>
                            </div>
                            <div>
                                <div>Txns</div>
                                <div className='font-semibold'>{blockData["txn_size"]}</div>
                            </div>
                        </div>
                        <div className='flex justify-between space-x-4 py-6'>
                            <div>
                                <div>Block Height</div>
                                <div className='font-semibold'>#{blockData["block_height"]}</div>
                            </div>
                            <div>
                                <div>Block Time</div>
                                <div className='font-semibold'>{blockData["block_time"]}</div>
                            </div>
                        </div>
                        <div className='flex justify-between py-6 space-x-4 py-6'>
                            <div>
                                <div>Proposer</div>
                                <div className='font-semibold'>{blockData["proposer"]}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='px-4'>
                    <div className='text-xl py-4 text-[#FFFF00]'>Block Transactions</div>
                    <div className='text-[#FFFF00]'>
                        <div className='flex justify-between py-4 text-base space-x-4'>
                            <div className='w-96 truncate'>Transaction Hash</div>
                            <div>Sender</div>
                            <div className='truncate'>Timestamp</div>
                            <div>Status</div>
                            <div>IBC</div>
                        </div>
                    </div>
                    <div className='text-white overflow-x-auto'>
                        <div>
                            {
                                blockData["txn_hash"] !== undefined ? blockData["txn_hash"].map((element, index) => {
                                    return (
                                        <div key={index} className='flex items-center justify-between w-full border-t border-[#FFFF00] py-4 space-x-4 text-[#FFFF00]'>
                                            <button onClick={() => {navigate('/search/' + element["hash"].slice(2))}} className='hover:text-[#FFFFFF] underline text-[14px] w-80 truncate'>
                                                {element["hash"] !==undefined ? element["hash"].slice(2) : ''}
                                            </button>
                                            <div className='w-80 truncate'>{element["sender"]}</div>
                                            <div className='w-80 truncate text-[14px]'>{element["created"]}</div>
                                            <div className={`${element["success"] ? 'text-[#00FF00]' : 'text-[#FF0000]'}`}>{element["success"].toString()}</div>
                                            <div className={`${element["is_ibc"] ? 'text-[#00FF00]' : 'text-[#FF0000]'}`}>{element["is_ibc"].toString()}</div>
                                         </div>
                                    )
                                }) : ''
                            }
                        </div>
                    </div>
                </div>
                <div className='flex text-[#FFFF00] py-4 px-4'>
                    <div className='flex-1 flex items-center justify-center text-sm text-[#FFFF00]'>
                        PAGE {page}
                    </div>
                    <div className='flex text-sm items-center space-x-2'>
                        <button onClick={() => {changePage(parseInt(page) - 1)}} className={`${parseInt(page) === 1 ? 'hidden ' : ' '} border hover:border-[#FFFF00] border-[#FFFF00] hover:text-[#FFFFFF] p-2`}>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"><path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                        </button>
                        <button onClick={() => {changePage(parseInt(page) + 1)}} className={`${parseInt(page) * 10 > parseInt(blockData["txn_size"]) ? ' hidden ' : ' '} ' border border-[#FFFF00] hover:border-[#FFFF00] hover:text-[#FFFFFF] p-2 '`}>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"><path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#000000] h-screen w-full overflow-auto font-mono">
            <div className='w-full'>
                <div className='flex justify-center z-0 w-full'>
                    <div>
                        <form class="flex items-center border border-[#FFFF00] bg-[#303030]">   
                            <label for="voice-search" class="sr-only">Search</label>
                            <div class="relative w-[270px] sm:w-[500px] md:w-[650px] lg:w-[890px] xl:w-[1180px]">
                                <input ref={searchInput} onChange={e => {searchInput.current = e.target.value}} type="text" id="voice-search" class="bg-[#303030] w-[260px] text-[#FFFF00] text-sm block w-full p-2.5  dark:bg-[#000000] dark:placeholder-[#FFFF00] dark:text-[#FFFF00]" placeholder="Search by txn hash, block height or validator address " required />
                            </div>
                            <button onClick={() => {if(typeof(searchInput.current) !== 'object'){navigate('/search/' + searchInput.current)} }} type="submit" class="">
                                <div className='px-4 py-2 bg-[#FFFF00] font-semibold'>
                                    Search
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className='w-full'>
                {
                    id !== undefined ? 
                        isNaN(id) ? id.includes("initvaloper" ) ? <Validator address={id} />
                        : <Hash hash={id}/> 
                            : <div><Height height={id}/></div> : ''
                }
            </div>
        </div>
    )
}

export default Search;