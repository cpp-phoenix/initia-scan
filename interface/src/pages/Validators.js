import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Home () {
    const navigate = useNavigate();
    const[validatorData, setValidatorData] = useState([])

    useEffect(() => {
        (async () => {
            const _response = await fetch(process.env.REACT_APP_API_DATA + "/validators?limit=100&offset=0&is_active=true&sort_by=voting_power&is_desc=true&search=")
            const _data = await _response.json()
            setValidatorData(_data["items"])
            console.log(validatorData)
        })();
    },[])

    function ValidatorPane ({ _validatorData, index }) {
        return (
            <div className='flex items-center justify-between w-full border-t border-[#00FF00] py-4 px-4 space-x-4'>
                <div>{index}</div>
                <button onClick={() => {navigate('/search/' + _validatorData["validator_address"])}} className='w-60 truncate hover:text-[#FFFFFF]'>{_validatorData["validator_address"]}</button>
                <div className='truncate '>{_validatorData["voting_power"]}</div>
                <div className='truncate'>{_validatorData["rank"]}</div>
                <div className='truncate'>{_validatorData["uptime"]}</div>
                <div className={`${_validatorData["is_active"] ? 'text-[#00FF00]' : 'text-[#FF0000] '} truncate`}>{_validatorData["is_active"].toString()}</div>
                <div className={`${_validatorData["is_jailed"] ? 'text-[#00FF00]' : 'text-[#FF0000] '} truncate`}>{_validatorData["is_jailed"].toString()}</div>
                <div className='w-16 truncate'>{_validatorData["commission_rate"]}</div>
                <div className='truncate w-28'>{_validatorData["moniker"]}</div>
            </div>
        )
    }

    return (
        <div className='flex-1 w-full bg-[#000000] px-6 text-white font-mono'>
            <div className='flex justify-between py-4 text-sm font-semibold px-4 text-[#00FF00]'>
                <div>Index</div>
                <div className='w-64'>Validator Address</div>
                <div>Voting Power</div>
                <div>Rank</div>
                <div>Uptime</div>
                <div>Active</div>
                <div>Jailed</div>
                <div>Commission Rate</div>
                <div>Moniker</div>
            </div>
            <div className='w-full flex items-center justify-between space-x-6 text-[#00FF00]'>
                <div className='w-full overflow-x-scroll'>
                    <div>
                        <div>
                            {
                                validatorData !== undefined ? validatorData.map((element, index) => {
                                    return (
                                        <ValidatorPane _validatorData={element} index={index}/>
                                    )
                                }) : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;