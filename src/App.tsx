import { useEffect, useState } from 'react'
import * as C from './App.styled'
import logo from './assets/devmemory_logo.png'
import ResetIcon from './svgs/restart.svg'
import { InfoItem } from './components/InfoItem'
import { Button } from './components/Button'
import { GridItem } from './components/GridItem'
import { GridItemType } from './types/GridItemTypes'
import { items } from './data/items'
import { formatTimeElapsed } from './helpers/formatTimeElapsed'

function App() {

  const [playing, setPlaying] = useState<boolean>(false)
  const [timeElapsed, setTimeElapsed] = useState<number>(0)
  const [moveCount, setMoveCount] = useState<number>(0)
  const [shownCount, setShownCount] = useState<number>(0)
  const [gridItems, setGridItems] = useState<GridItemType[]>([])

  useEffect(() => resetGame(), [])

  useEffect(() => {
    const timer = setInterval(()=>{
      if(playing) setTimeElapsed(timeElapsed + 1)
      }, 1000)
    return () => clearInterval(timer)
  }, [playing, timeElapsed])

  // verify if opened is equal
  useEffect(()=>{
    if(shownCount === 2) {
      let opened = gridItems.filter(item=>item.shown === true)
      if(opened.length === 2) {
        
        //v1 - if both are equal, make every 'shown' permanent
        if(opened[0].item === opened[1].item){
          let tmpGrid = [...gridItems]
          for(let i in tmpGrid) {
            if(tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true
              tmpGrid[i].shown = false
            }
          }
          setGridItems(tmpGrid)
          setShownCount(0)
        } else {
          //v2 - if they aren't equal, close all 'shown'
          setTimeout(() => {
            let tmpGrid = [...gridItems]
            for(let i in tmpGrid) {
              tmpGrid[i].shown = false
            }
            setGridItems(tmpGrid)
            setShownCount(0)
          }, 1000);
        }
      }

      setMoveCount(moveCount => moveCount + 1)
    }
  }, [shownCount, gridItems])

  // verify if game is over
  useEffect(()=>{
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false)
    }
  }, [moveCount, gridItems])

  const resetGame = () => {
    //step 1 - reset game
    setTimeElapsed(0)
    setMoveCount(0)
    setShownCount(0)

    //step 2 - create grid
    //2.1 - create empty grid
    let tmpGrid: GridItemType[] = []
    for(let i = 0; i < items.length * 2; i++) {
      tmpGrid.push({
        item: null,
        shown: false,
        permanentShown: false
      })
    }

    //2.2 - fill the grid
    for(let o = 0; o < 2; o++) {
      for(let i = 0; i < items.length; i++) {
        let pos = -1
        while(pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2))
        }
        tmpGrid[pos].item = i
      }
    }

    //2.3 - throw at state
    setGridItems(tmpGrid)

    //step 3 - start game
    setPlaying(true)
  }

  const handleOnCLick = (index: number) => {
    if(playing && index !== null && shownCount < 2) {
      let tmpGrid = [...gridItems]

      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false){
        tmpGrid[index].shown = true
        setShownCount(shownCount + 1)
      }

      setGridItems(tmpGrid)
    }
  }

  return (
    <C.Container>
      <C.info>
        <C.logoLink href=''>
          <img src={logo} alt="" width='200' />
        </C.logoLink>

        <C.infoArea>
          <InfoItem label='Tempo:' value={formatTimeElapsed(timeElapsed)}/>
          <InfoItem label='Movimentos' value={moveCount.toString()}/>
        </C.infoArea>

        <Button label='Reiniciar' icon={ResetIcon} onClick={resetGame}/>
      </C.info>
      <C.gridArea>
        <C.Grid>
          {gridItems.map((item, index)=>(
            <GridItem 
              key={index}
              item={item}
              onClick={()=>handleOnCLick(index)} />
          ))}
        </C.Grid>
      </C.gridArea>
    </C.Container>
  )
}

export default App
