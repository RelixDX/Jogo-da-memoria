import styled from "styled-components";

type ContainerProps = {
    shownBackground: boolean
}

export const Container = styled.div<ContainerProps>`
    background-color: ${props => props.shownBackground ? '#1550ff' : '#e2e3e3'};
    height: 100px;
    width: 100px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`

type OpacityProps = {
    opacity?: number
}

export const Icon = styled.img<OpacityProps>`
    width: 40px;
    height: 40px;
    opacity: ${props => props.opacity ?? 1};
`