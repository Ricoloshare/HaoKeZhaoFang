import styled from "@emotion/styled";
import React, { useEffect } from "react";

export default function Map(){

    useEffect(()=>{
        var map = new window.BMapGL.Map("container");
        var point = new window.BMapGL.Point(116.404, 39.915);
        map.centerAndZoom(point, 15); 
        return () => {}
    },[])

    return (
        <Container id="container">
            Map
        </Container>
    )
}

const Container = styled.div`
width: 100%;
height: 100%;
`