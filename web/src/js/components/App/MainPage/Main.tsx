import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import mapboxgl from 'mapbox-gl'
import AppBar from './AppBar'
import LeftDrawer from './LeftDrawer'
import { Route, Switch } from 'react-router';
import { useDispatch } from 'react-redux'
import { startLoading, stopLoading } from '../../../redux/actions/loadingActions'
import { Explore } from '../ExplorePage/Explore';



export const Main = () => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const dispatch = useDispatch()
    const drawerOpenHandle= (bool: boolean)=>{
        return ()=>setDrawerOpen(bool)
    }
    useEffect(() => {
        dispatch(stopLoading())
    }, [])
    return < >
        <AppBar setDrawerOpen={drawerOpenHandle}/>
        <LeftDrawer open={drawerOpen} setDrawerOpen={drawerOpenHandle} />
        <Switch>
            <Route exact path="/my-places">
                
            </Route>
            <Route exact path="/explore">
                <Explore/>
            </Route>
        </Switch>
    </>

}