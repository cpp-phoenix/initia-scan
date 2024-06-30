import { useEffect, useState, useMemo, useRef } from 'react';
import { NavLink as Link, useParams, useNavigate } from 'react-router-dom';

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

function Blocks () {
    const navigate = useNavigate();

    let { page } = useParams();
    const [blockData, { set, remove, clear }] = useMap();
    const[latestBlock, setLatestBlock] = useState(0)
    const [pageId, setPageId] = useState()
    const blockIs = useRef(0);
    const [loading, setLoading] = useState(true)
    const pageSize = 15;
    if(page === undefined) {
        page = 1
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const getBlockData = async () => {
        if(parseInt(blockIs.current) > 0) {
            const response = await fetch(process.env.REACT_APP_INDEXER_ENDPOINT + "/status");
            const _blockData = await response.json();
            const _latestBlock = _blockData["result"]["sync_info"]["latest_block_height"]
            if(_latestBlock !== blockIs.current) {
                let index = 0
                const currBlock = parseInt(blockIs.current)
                for(let i = currBlock + 1; i <= _latestBlock; i++) {
                    remove((currBlock - pageSize + 1 + index).toString())
                    let int_response;
                    while(true) {
                        int_response = await fetch(process.env.REACT_APP_API_DATA + "/blocks/" + i + "/info");
                        if(int_response.status === 200) {
                            break;
                        }
                        await sleep(3000);
                    }
                    const int_blockData = await int_response.json();
                    if(int_blockData !== null) {
                        set(i, {
                            "block_time": int_blockData["timestamp"],
                            "block_height": int_blockData["height"],
                            "block_hash": int_blockData["hash"].slice(3),
                            "gas_limit": int_blockData["gas_limit"],
                            "gas_used": parseInt(int_blockData["gas_used"])/1000000,
                            "moniker": int_blockData["validator"]["moniker"]
                        })
                        index++;
                        if(i === _latestBlock) {
                            setLatestBlock(int_blockData["height"])
                        }
                        blockIs.current = _latestBlock
                    }
                }
            }
        }
    }

    useEffect(() => {
        if(page === undefined) {
            page = 1
        }
        if(!isNaN(page)) {
            (async () => {
                clear()
                setLoading(true)
                const response = await fetch(process.env.REACT_APP_INDEXER_ENDPOINT + "/status");
                const _blockData = await response.json();
                const _latestBlock = _blockData["result"]["sync_info"]["latest_block_height"]
                if(_blockData !== null && _blockData["result"] != null && _blockData["result"]["sync_info"] !== null && _blockData["result"]["sync_info"]["latest_block_height"] >= 5) {
                    for(let i = _latestBlock - (pageSize * (page - 1)); i > _latestBlock - (pageSize * (page - 1)) - pageSize; i--) {
                        let int_response;
                        while(true) {
                            int_response = await fetch(process.env.REACT_APP_API_DATA + "/blocks/" + i + "/info");
                            if(int_response.status === 200) {
                                break;
                            }
                            await sleep(3000);
                        }
                        const int_blockData = await int_response.json();
                        set(i, {
                            "block_time": int_blockData["timestamp"],
                            "block_height": int_blockData["height"],
                            "block_hash": int_blockData["hash"].slice(3),
                            "gas_limit": int_blockData["gas_limit"],
                            "gas_used": parseInt(int_blockData["gas_used"])/1000000,
                            "moniker": int_blockData["validator"]["moniker"]
                        })
                        if(i === _latestBlock) {
                            setLatestBlock(int_blockData["height"])
                        }
                    }
                    blockIs.current = _latestBlock
                }
                setLoading(false)
            })();
            if (parseInt(page) === 1) {
                const interval = setInterval(() => {
                    getBlockData();
                }, 20000);
            
                return () => clearInterval(interval);
            }
        }

    },[pageId])
    
    function BlockPane ({ blockId }) {
        const _blockData = blockData.get(blockId)
        let timeDiff = (new Date() - new Date(_blockData["block_time"]));
        let timeAgo = ""
        timeDiff = timeDiff/1000
        if(timeDiff < 1000) {
            timeAgo = timeDiff + " millisecs ago"
        } else if((timeDiff/1000) < 60) {
            timeAgo = parseInt((timeDiff/1000)) + " secs ago"
        } else if((timeDiff/60000) < 60) {
            timeAgo = parseInt((timeDiff/60000)) + " mins ago"
        } else if((timeDiff/360000) < 24){
            timeAgo = parseInt((timeDiff/3600000)) + " hours ago"
        } else {
            timeAgo = parseInt((timeDiff/86400000)) + " days ago"
        }
        return (
            <div className='flex items-center justify-between w-full border-t border-[#FF0000] py-4 px-4 space-x-4'>
                <div className='flex space-x-2'>
                    <div className='py-1 flex flex-col justify-between'>
                        <Link to={`/search/${_blockData["block_height"]}`}><button className='hover:text-[#FFFFFF] text-sm font-semibold underline truncate '>#{_blockData["block_height"]}</button></Link>
                    </div>
                </div>
                <div className='text-[14px] truncate'>{_blockData["block_hash"]}</div>
                <div className='truncate w-40'>{_blockData["moniker"]}</div>
                <div className='truncate w-28'>{_blockData["gas_used"]}</div>
                <div className='text-[14px] truncate'>{_blockData["block_time"]}</div>
            </div>
        )
    }

    return (
        <div className='flex-1 w-full bg-[#000000] px-6 text-white font-mono'>
            <div className='flex justify-between py-4 text-sm font-semibold px-4 text-[#FF0000]'>
                <div>HEIGHT</div>
                <div className='w-96'>HASH</div>
                <div>Validator</div>
                <div>Gas Used</div>
                <div>TIME</div> 
            </div>
            <div className='w-full flex items-center justify-between space-x-6 text-[#FF0000]'>
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
            <div className='flex text-[#FF0000] py-4'>
                <div className='flex-1 flex items-center justify-center text-sm text-[#FF0000]'>
                    PAGE {page}
                </div>
                <div className='flex text-sm items-center space-x-2'>
                    <button onClick={() => {navigate('/blocks/' + (parseInt(page) - 1)); setPageId(parseInt(page) + 1)}} className={`${parseInt(page) === 1 ? 'hidden ' : ' '} border hover:border-[#FF0000] border-[#FF0000] hover:text-[#FFFFFF] p-2`}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"><path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    </button>
                    <button onClick={() => {navigate('/blocks/' + (parseInt(page) + 1)); setPageId(parseInt(page) + 1)}} className='border border-[#FF0000] hover:border-[#FF0000] hover:text-[#FFFFFF] p-2'>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"><path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Blocks;