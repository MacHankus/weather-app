import React, { useEffect, useRef, useState } from "react"
import mapboxgl from 'mapbox-gl'
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme)=>({
    root:{
        position:'relative'
    },
    mapSidebar:{
        backgroundColor: 'rgba(35, 55, 75, 0.9)',
        color:'#ffffff',
        padding: '6px 12px',
        fonFamily: 'monospace',
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        margin: '12px',
        borderRadius: '4px'
    },
    map:{
        height: '500px',
        width:'100%',
        [theme.breakpoints.down("md")]:{
            height:'50%'
        },
        [theme.breakpoints.down("xs")]:{
            height:'calc( 100% )'
        }
    }
}))

mapboxgl.accessToken = 'pk.eyJ1IjoibWhhbmt1czIiLCJhIjoiY2tzMnZmdTN4MW95cjJxbXN0ajBqNjlsNCJ9.BiEZBhDsyiv2jtSPmF0wew';

export default function Map() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map>(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
    const classes = useStyles()
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current as HTMLElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    return (
        <div className={classes.root}>
            <div className={classes.mapSidebar}>
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className={classes.map} />
        </div>
    );
}

export const Explore = ()=>{
    return <Map/>
}