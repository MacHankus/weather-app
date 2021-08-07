import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'


type ResourceLoaderProps<T> = {
    resource: ()=> Promise<T>,
    runOnMount: boolean,
    history: any
}
type ResourceLoaderState<T> = {
    data: T | null,
}
class ResourceLoader<T> extends React.Component<ResourceLoaderProps<T>,ResourceLoaderState<T>> {
    state = {
        data: null
    }

    componentDidMount=()=>{
        const fetchData = async ()=>{
            try{
                const data = await this.props.resource()
                this.setState({data})
            }catch(err){
                this.props.history.push("/some/Path");
            }
        }
        fetchData()
    }

    render(){
        return <>{this.props.children}</>
    } 
}
