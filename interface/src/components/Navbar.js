import React, { useState, useEffect } from "react";
import { NavLink as Link } from 'react-router-dom';

function Navbar () {
    const [pageURL, setPageURL] = useState(0);

    useEffect(() => {
        const arrayA = window.location.href.split("/")
        if(arrayA[arrayA.length - 1] === 'blocks' || arrayA[arrayA.length - 2] === 'blocks') {
            setPageURL("BLOCKS");
        } else if (arrayA[arrayA.length - 1] === 'search' || arrayA[arrayA.length - 2] === 'search') {
            setPageURL("SEARCH");
        } else if (arrayA[arrayA.length - 1] === 'validators' || arrayA[arrayA.length - 2] === 'validators') {
            setPageURL("VALIDATORS");
        } else {
            setPageURL("HOME");
        }
    })

    return (
        <div>
            <div className='z-10 bg-[#000000] space-y-10'>
                <div className='flex-1 flex items-center justify-between space-x-1 p-4 text-sm text-[#FFFF00]'>
                    <div>
                        <Link onClick={() => {setPageURL("HOME");}} to='/'>
                            <svg width="81" height="24" viewBox="0 0 81 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="_icon_9tnzp_45"><g clip-path="url(#clip0_396_40560)"><path d="M36.8463 8.36919H40.2014V9.82058C40.5333 9.30746 40.9806 8.9043 41.5434 8.61109C42.1062 8.30322 42.77 8.14928 43.5348 8.14928C44.7614 8.14928 45.7643 8.55978 46.5435 9.38077C47.3372 10.1871 47.734 11.4186 47.734 13.0752V19.8044H44.379V13.669C44.379 12.9213 44.1986 12.3202 43.8378 11.8657C43.4771 11.4113 42.9576 11.184 42.2793 11.184C41.6155 11.184 41.1033 11.4186 40.7425 11.8877C40.3817 12.3422 40.2014 12.936 40.2014 13.669V19.8044H36.8463V8.36919Z" fill="white"></path><path d="M49.7618 8.36919H53.1169V19.8044H49.7618V8.36919ZM49.7618 4.19093H53.1169V7.15969H49.7618V4.19093Z" fill="white"></path><path d="M59.8708 19.9364C58.7741 19.9364 57.9011 19.6432 57.2517 19.0567C56.6023 18.4557 56.2777 17.532 56.2777 16.2859V11.0741H54.6109V8.36919H56.2777V5.44441H59.6327V8.36919H61.9921V11.0741H59.6327V15.7361C59.6327 16.0733 59.741 16.3592 59.9574 16.5938C60.1739 16.8137 60.513 16.9236 60.9748 16.9236C61.3211 16.9236 61.6746 16.865 62.0354 16.7477V19.3426C61.8334 19.5479 61.5303 19.7018 61.1263 19.8044C60.7367 19.8924 60.3182 19.9364 59.8708 19.9364Z" fill="white"></path><path d="M63.5863 8.36919H66.9414V19.8044H63.5863V8.36919ZM63.5863 4.19093H66.9414V7.15969H63.5863V4.19093Z" fill="white"></path><path d="M73.8035 20.0243C72.9089 20.0243 72.0502 19.7971 71.2277 19.3426C70.4052 18.8881 69.7342 18.2138 69.2147 17.3195C68.6952 16.4252 68.4354 15.3476 68.4354 14.0868C68.4354 12.826 68.6952 11.7484 69.2147 10.8542C69.7342 9.95986 70.4052 9.28547 71.2277 8.831C72.0502 8.37652 72.9089 8.14928 73.8035 8.14928C74.4096 8.14928 74.9508 8.24457 75.427 8.43516C75.9176 8.61109 76.3072 8.81634 76.5958 9.0509C76.8844 9.28547 77.0648 9.49072 77.137 9.66665H77.2019V8.36919H80.557V19.8044H77.2019V18.507H77.137C77.0648 18.6829 76.8844 18.8881 76.5958 19.1227C76.3072 19.3573 75.9176 19.5699 75.427 19.7604C74.9508 19.9364 74.4096 20.0243 73.8035 20.0243ZM71.7472 14.0868C71.7472 14.9664 72.0142 15.6701 72.5481 16.1979C73.0965 16.7257 73.7458 16.9896 74.4962 16.9896C75.2755 16.9896 75.932 16.733 76.466 16.2199C77.0143 15.6921 77.2885 14.9811 77.2885 14.0868C77.2885 13.1925 77.0143 12.4888 76.466 11.9757C75.932 11.4479 75.2755 11.184 74.4962 11.184C73.7458 11.184 73.0965 11.4479 72.5481 11.9757C72.0142 12.5035 71.7472 13.2072 71.7472 14.0868Z" fill="white"></path><path d="M31.3926 8.36918H34.7477V19.8044H31.3926V8.36918ZM31.3926 4.19092H34.7477V7.15968H31.3926V4.19092Z" fill="white"></path><circle cx="12.1096" cy="12" r="12" fill="white"></circle><path d="M13.1185 9.39957C13.1353 8.36267 13.8696 7.48831 14.8728 7.29214V5.26318C13.8472 5.36968 12.8943 5.85169 12.1937 6.62516L12.1153 6.71484L12.0368 6.62516C11.3362 5.84609 10.389 5.36968 9.35767 5.26318V7.29214C10.3609 7.48831 11.0952 8.36267 11.112 9.39396V14.6009C11.0952 15.6378 10.3609 16.5121 9.35767 16.7083V18.7373C10.3834 18.6308 11.3362 18.1487 12.0368 17.3753L12.1153 17.2856L12.1937 17.3753C12.8943 18.1544 13.8416 18.6308 14.8728 18.7373V16.7083C13.8696 16.5121 13.1353 15.6378 13.1185 14.6065V9.39957Z" fill="#141414"></path></g><defs><clipPath id="clip0_396_40560"><rect width="81" height="24" fill="white"></rect></clipPath></defs></svg>
                        </Link>
                    </div>
                    <div className="flex-1 flex items-center justify-end space-x-5 p-4 text-sm text-white font-bold text-sm">
                        <Link onClick={() => {setPageURL("HOME");}} to='/'className={`flex items-center justify-center py-2`}>
                            <div className="hover:text-[#00FFFF]">HOME</div>
                        </Link>
                        <Link onClick={() => {setPageURL("BLOCKS");}} to='/blocks' className={`flex items-center justify-center py-2`}>
                            <div className="hover:text-[#FF0000]">BLOCKS</div>
                        </Link>
                        <Link onClick={() => {setPageURL("VALIDATORS");}} to='/validators' className={`flex items-center justify-center py-2`}>
                            <div className="hover:text-[#00FF00]">VAIDATORS</div>
                        </Link>
                        <Link onClick={() => {setPageURL("SEARCH");}} to='/search' className={`flex items-center justify-center py-2`}>
                            <div className="hover:text-[#FFFF00]">SEARCH</div>
                        </Link>
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default Navbar;