import React from 'react'
import styles from './Styles.module.css'
import { v4 as uuidv4 } from 'uuid'

interface ArrVarNamesProps {
  arrVarNames: string[] | null,
  handleVarClick: (id: string) => void
}

// компонент для добавления фигурных скобок к arrVarName и вывод на основной компонент
function ArrVarNamesWidget (props: ArrVarNamesProps): JSX.Element {
  let changedArrVarNames: string[][] = []
  props.arrVarNames !== null ? changedArrVarNames = props.arrVarNames.map(el => ['{' + el + '}', el]) : changedArrVarNames = []

  return (
    <div className={styles.arrVarNames}>
      {changedArrVarNames?.map((name) => {
        return (
          < span key={uuidv4()}>
            <button
              className={styles.varName}
              id={name[1]} 
              onClick={()=>props.handleVarClick(name[1])}
              >{<i>{name[0]}</i>}
            </button>
            {name !== changedArrVarNames[changedArrVarNames.length - 1] && (
              <span>,</span>
            )}</span>
        )
      })}
    </div>
  )
}

export default ArrVarNamesWidget
