import { Box, Flex } from "@chakra-ui/react"
import StoreSmallCard from "../Components/StoreSmallCard"
import Map from '../Components/Map';
import Toggle from 'react-styled-toggle';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// import axios from "axios";

export default function HomePage({filteredValues, userLocation, mapCenter, setMapCenter, storesData, storesDataforList}){
    const [ifMapMode, setIfMapMode] = useState(true);
    const [filteredData, setFilteredData] = useState(storesData);
    const [filteredDoubleColData, setFilteredDoubleColData] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        if(!filteredValues.item.length && !filteredValues.store.length){
            setFilteredData(storesData);
            let doubleColData = storesData.reduce(function (rows, key, index) { 
                return (index % 2 === 0 ? rows.push([key]) 
                : rows[rows.length-1].push(key)) && rows;
            }, []);
            setFilteredDoubleColData(doubleColData);
        }
        else{
            let fData = storesData;
            if(filteredValues.store.length){
                fData = fData.filter((data) => filteredValues.store.includes(data.category))
            }
            if(filteredValues.item.length){
                fData = fData.filter((data) => {
                    for (const stock of data.stocks) {
                        if (filteredValues.item.includes(stock.category)) { return true;}
                    }
                    return false;
                })
                // console.log('stores:', fData)
            }
            setFilteredData(fData);
            let doubleColData = fData.reduce(function (rows, key, index) { 
                return (index % 2 === 0 ? rows.push([key]) 
                : rows[rows.length-1].push(key)) && rows;
            }, []);
            setFilteredDoubleColData(doubleColData);
        }
    }, [storesData, filteredValues])


    return(
        <Box ml={5}>
            <Flex>
                <Toggle labelLeft='Map' labelRight='List' style={{zIndex:10}}
                backgroundColorUnchecked='#82BFF3'backgroundColorChecked='#76CFCF'
                onChange={()=>{setIfMapMode(!ifMapMode)}}/>
            </Flex>
            <Box>
                <Flex>
                    {/* <SimpleSidebar/> */}
                    {ifMapMode?
                    <Flex w="100%">
                        <Box w='50%'>
                            <Map userLocation={userLocation} storesData={filteredData} mapCenter={mapCenter} setMapCenter={setMapCenter}/>
                        </Box>
                        <Box w='50%'>
                            {filteredData.map((storeData, i)=>{ return(
                            <Flex onClick={()=>{
                                navigate(`/store/${storeData._id}`, 
                                    { state: { storeData: storeData } });}} 
                                w={{ sm: '100%', md: '100%' }} key={i} >
                                <StoreSmallCard storeData={storeData}/>
                            </Flex>)
                            })}
                        </Box>
                    </Flex>:
                    <Box w="100%">
                        {filteredDoubleColData.map((twoStoresData, i)=>{ return(
                        <Flex key={i}>
                            {twoStoresData.map((storeData, ii)=>{return(
                            <Flex onClick={()=>{
                                navigate(`/store/${storeData._id}`, 
                                    { state: { storeData: storeData } });}} 
                                w={{ sm: '100%', md: '50%' }} key={ii}>
                                <StoreSmallCard storeData={storeData}/>
                            </Flex>
                            )})}
                        </Flex>)
                        })}
                    </Box>}
                </Flex>
            </Box>
        </Box>
    )
}