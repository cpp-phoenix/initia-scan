import { useEffect, useState, useMemo, useRef } from 'react';
import { NavLink as Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const useMap = () => {
    const [map, setMap] = useState(new Map());

    const actions = useMemo(
      () => ({
        set: (key, value) =>
          setMap(prevMap => {
            const nextMap = new Map(prevMap);
            nextMap.set(key, value);
            return nextMap;
          }),
        remove: (key) =>
          setMap(prevMap => {
            const nextMap = new Map(prevMap);
            nextMap.delete(key);
            return nextMap;
          }),
        clear: () => setMap(new Map()),
      }),
      [setMap]
    );
  
    return [map, actions];
  };

function Home () {
    const [blockData, { set, remove, clear }] = useMap();
    const[latestBlock, setLatestBlock] = useState(0)
    const[validatorData, setValidatorData] = useState({})
    const[validatorCount, setValidatorCount] = useState(0)
    const blockIs = useRef(0);
    const fetchBlock = 10;
    const navigate = useNavigate();

    const getBlockData = async () => {
        if(parseInt(blockIs.current) > 0) {
            const response = await fetch(process.env.REACT_APP_INDEXER_ENDPOINT + "/status");
            const _blockData = await response.json();
            const _latestBlock = _blockData["result"]["sync_info"]["latest_block_height"]
            if(_latestBlock !== blockIs.current) {
                let index = 0
                const currBlock = parseInt(blockIs.current)
                for(let i = currBlock + 1; i <= _latestBlock; i++) {
                    console.log(currBlock - fetchBlock + 1 + index)
                    remove(currBlock - fetchBlock + 1 + index)
                    const int_response = await fetch(process.env.REACT_APP_INDEXER_ENDPOINT + "/block?height=" + i);
                    const int_blockData = await int_response.json();
                    if(int_blockData !== null) {
                        set(i, {
                            "block_time": int_blockData["result"]["block"]["header"]["time"],
                            "block_height": int_blockData["result"]["block"]["header"]["height"],
                            "block_hash": int_blockData["result"]["block_id"]["hash"],
                            // "txn_hash": int_blockData["tx_hashes"],
                            // "txn_size": int_blockData["tx_hashes"].length,
                            // "proposer": int_blockData["header"]["proposer_address"]
                        })
                        index++;
                        if(i === _latestBlock) {
                            setLatestBlock(int_blockData["result"])
                        }
                        blockIs.current = _latestBlock
                    }
                }
            }
        }
    }

    useEffect(() => {
        (async () => {
            const response = await fetch(process.env.REACT_APP_INDEXER_ENDPOINT + "/status");
            const _blockData = await response.json();
            const _latestBlock = _blockData["result"]["sync_info"]["latest_block_height"]

            const _response = await axios.get(process.env.REACT_APP_RPC_ENDPOINT + "/validators?height=" + _latestBlock + "&per_page=1")
            setValidatorCount(_response["data"]["result"]["total"])

            if(_blockData !== null && _blockData["result"] != null && _blockData["result"]["sync_info"] !== null && _blockData["result"]["sync_info"]["latest_block_height"] >= 5) {
                for(let i = _latestBlock; i > _latestBlock - fetchBlock; i--) {
                    console.log("start")
                    const int_response = await fetch(process.env.REACT_APP_INDEXER_ENDPOINT + "/block?height=" + i);
                    const int_blockData = await int_response.json();
                    set(i, {
                        "block_time": int_blockData["result"]["block"]["header"]["time"],
                        "block_height": int_blockData["result"]["block"]["header"]["height"],
                        "block_hash": int_blockData["result"]["block_id"]["hash"],
                        // "txn_hash": int_blockData["tx_hashes"],
                        // "txn_size": int_blockData["tx_hashes"].length,
                        // "proposer": int_blockData["header"]["proposer_address"]
                    })
                    if(i === _latestBlock) {
                        setLatestBlock(int_blockData["result"])
                    }
                    console.log("end")
                }
                blockIs.current = _latestBlock
            }
            
        })();

        const interval = setInterval(() => {
            getBlockData();
        }, 15000);
      
        return () => clearInterval(interval);
    },[])

    function BlockPane ({ blockId }) {
        const _blockData = blockData.get(blockId)
        const timeDiff = new Date() - new Date(_blockData["block_time"]);
        console.log(timeDiff)
        let timeAgo = ""
        if(timeDiff < 1000) {
            timeAgo = timeDiff + " millisecs ago"
        } else if((timeDiff/1000) < 60) {
            timeAgo = parseInt((timeDiff/1000)) + " second ago"
        } else if((timeDiff/60000) < 60) {
            timeAgo = parseInt((timeDiff/60000)) + " minute ago"
        } else if((timeDiff/360000) < 24){
            timeAgo = parseInt((timeDiff/3600000)) + " hours ago"
        } else {
            timeAgo = parseInt((timeDiff/86400000)) + " days ago"
        }
        return (
            <div className='flex items-center justify-between w-full border-t border-[#00FFFF] py-4 px-4 space-x-4'>
                <div className='flex space-x-2'>
                    <div className='py-1 flex flex-col justify-between'>
                        <Link to={`/search/${_blockData["block_height"]}`}><button className='text-sm font-semibold underline hover:text-[#00FFFF]'>#{_blockData["block_height"]}</button></Link>
                    </div>
                </div>
                <div className='text-[14px] truncate'>{_blockData["block_hash"]}</div>
                {/* <div>{_blockData["txn_size"]}</div> */}
                <div className='text-[14px] truncate'>{timeAgo}</div>
            </div>
        )
    }

    return (
        <div className='flex-1 w-full bg-[#000000] px-6 text-white py-2 text-[#00FFFF] font-mono'>
            <div className='flex flex-col xl:flex-row items-center justify-center w-full space-y-3 xl:space-y-0 xl:space-x-4'>
                <div className='bg-[#000000] text-[#00FFFF] text-xl flex flex-col justify-center w-full py-4 space-y-2'>
                    <div className='text-base'>Chain ID:</div>
                    <div className='text-xl font-semibold'>initiation-1</div>
                </div>
                <div className='bg-[#000000] text-[#00FFFF] text-xl flex flex-col justify-center w-full py-4 space-y-2'>
                    <div className='text-base'>Block Height:</div>
                    <div className='text-xl font-semibold'>{latestBlock !== undefined && latestBlock["block"] !== undefined ? latestBlock["block"]["header"]["height"] : ""}</div>
                </div>
                <div className='bg-[#000000] text-[#00FFFF] text-xl flex flex-col justify-center w-full py-4 space-y-2'>
                    <div className='text-base'>Active Validators:</div>
                    <div className='text-xl font-semibold'>{validatorCount}</div>
                </div>
            </div>
            <div className='flex flex-col xl:flex-row items-center justify-center w-full space-y-3 xl:space-y-0 xl:space-x-4'>
                <div className='bg-[#000000] text-[#00FFFF] text-xl flex flex-col justify-center w-full py-4 space-y-2'>
                    <div className='text-base'>Latest Block Time:</div>
                    <div className='text-xl font-semibold'>{latestBlock !== undefined && latestBlock["block"] !== undefined ? latestBlock["block"]["header"]["time"] : ""}</div>
                </div>
            </div>
            <div className='p-6'></div>
            <div className='text-xl text-[#00FFFF]'>Top 10 Blocks</div>
            <div className='flex justify-between py-4 text-sm font-semibold px-4 text-[#00FFFF]'>
                <div>HEIGHT</div>
                <div>HASH</div>
                {/* <div>TRANSACTIONS</div> */}
                <div>TIME</div>
            </div>
            <div className='bg-[#000000] w-full flex items-center justify-between space-x-6 text-[#00FFFF]'>
                <div className='w-full overflow-x-auto'>
                    <div>
                        <div>
                            {
                                [...blockData.keys()].sort((a, b) => (b - a)).map((element) => {
                                    return (
                                        <BlockPane blockId={element}/>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;