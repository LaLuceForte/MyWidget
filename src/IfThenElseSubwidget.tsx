import React, { useState, useEffect } from 'react'
import styles from './Styles.module.css'
import { TemplateObject } from './MessageTemplateEditor'
import { IfThenElse } from './MessageTemplateEditor'
import TemplateList from './TemplateList'
import { v4 as uuidv4 } from 'uuid'
import { IParamsToAddTextarea } from './MessageTemplateEditor'
import { ISetCursor } from './MessageTemplateEditor'
import { IVarParams } from './MessageTemplateEditor'
const idIF = uuidv4();
const idTHEN = uuidv4();
const idELSE = uuidv4();

interface IfThenElseProps {
  arrVarNames: string[] | undefined,
  handleSetIfThenElse: (IfThenElse: IfThenElse, index: number, textareaId: string,buttonName?:string,id?:string, position?:number, textareaId2?:string) => void,
  index?: number,
  ifThenElseInitialTemplates?: IfThenElse,
  globalList?: TemplateObject[],
  list?: TemplateObject[],
  setId?: (obj: TemplateObject) => void,
  setId2?: (obj2: ISetCursor) => void,
  clicked?: boolean,
  varClicked?: IVarParams
}

// подвиджет ifThenElse - добавляеь к textarea подвиджет с логикой условий
function IfThenElseSubwidget(props: IfThenElseProps) {

  const [obj, setObj] = useState<TemplateObject>()
  const [obj2, setObj2] = useState<ISetCursor>()
  const [paramsToAddTextarea, setParamsToAddTextarea] = useState<IParamsToAddTextarea>({bluredIndex:0, position:0, textareaId:''})
  // если в сохраненном шаблоне уже есть какая-то информация по условию - сохраняем, иначе все - null
  const ifThenElse : IfThenElse = props.ifThenElseInitialTemplates?.if! ?
    {
      if: props.ifThenElseInitialTemplates?.if!,
      then: props.ifThenElseInitialTemplates?.then!,
      else: props.ifThenElseInitialTemplates?.else!
    } : { if: null, then: null, else: null }


    // функция, которая срабатывает, когда происходит событие blur для textarea с логикой if (именно в момент этого события происходит сеттинг значений)
  const bluredIF = (list: TemplateObject[], textareaId?: string, buttonName?:string,id?:string, position?:number, textareaId2?:string) => {
    props.handleSetIfThenElse({ ...ifThenElse, if: list }, props.index!, textareaId!,buttonName!,id!,position!, textareaId2!)
    if (textareaId2!==undefined){
      const recurse = (list: TemplateObject[]): void => {
        for (let i = 0; i < list.length; i++) {
          if (list[i].textareaRef.current?.id === textareaId2) {
            setObj2({idLength:position!, textareaId: list[i]})
            props.setId2!({idLength:position!, textareaId: list[i]})
          }
          if (list[i].ifThenElse !== undefined) {
            if (list[i].ifThenElse?.if !== null) {
              recurse(list[i].ifThenElse!.if!)
            }
            if (list[i].ifThenElse?.then !== null) {
              recurse(list[i].ifThenElse!.then!)
            }
            if (list[i].ifThenElse?.else !== null) {
              recurse(list[i].ifThenElse!.else!)
            }
          }
        }
      }
      recurse(list)
    }
  }

  const bluredTHEN = (list: TemplateObject[], textareaId?: string, buttonName?:string,id?:string, position?:number, textareaId2?:string) => {
    props.handleSetIfThenElse({ ...ifThenElse, then: list }, props.index!, textareaId!)
    if (textareaId2!==undefined){
      const recurse = (list: TemplateObject[]): void => {
        for (let i = 0; i < list.length; i++) {
          if (list[i].textareaRef.current?.id === textareaId2) {
            setObj2({idLength:position!, textareaId: list[i]})
            props.setId2!({idLength:position!, textareaId: list[i]})
          }
          if (list[i].ifThenElse !== undefined) {
            if (list[i].ifThenElse?.if !== null) {
              recurse(list[i].ifThenElse!.if!)
            }
            if (list[i].ifThenElse?.then !== null) {
              recurse(list[i].ifThenElse!.then!)
            }
            if (list[i].ifThenElse?.else !== null) {
              recurse(list[i].ifThenElse!.else!)
            }
          }
        }
      }
      recurse(list)
    }
    
  }
  const bluredELSE = (list: TemplateObject[], textareaId?: string, buttonName?:string,id?:string, position?:number, textareaId2?:string) => {
    props.handleSetIfThenElse({ ...ifThenElse, else: list }, props.index!, textareaId!)
    if (textareaId2!==undefined){
      const recurse = (list: TemplateObject[]): void => {
        for (let i = 0; i < list.length; i++) {
          if (list[i].textareaRef.current?.id === textareaId2) {
            setObj2({idLength:position!, textareaId: list[i]})
            props.setId2!({idLength:position!, textareaId: list[i]})
          }
          if (list[i].ifThenElse !== undefined) {
            if (list[i].ifThenElse?.if !== null) {
              recurse(list[i].ifThenElse!.if!)
            }
            if (list[i].ifThenElse?.then !== null) {
              recurse(list[i].ifThenElse!.then!)
            }
            if (list[i].ifThenElse?.else !== null) {
              recurse(list[i].ifThenElse!.else!)
            }
          }
        }
      }
      recurse(list)
    }
    
  }

  const handleSetTextareaId = (buttonName: string) => {
    const recurse = (list: TemplateObject[]) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].textareaRef.current?.id === buttonName) {
          props.setId!(list[i])
          setObj(list[i])
        }
        if (list[i].ifThenElse !== undefined) {
          if (list[i].ifThenElse?.if !== null) {
            recurse(list[i].ifThenElse!.if!)
          }
          if (list[i].ifThenElse?.then !== null) {
            recurse(list[i].ifThenElse!.then!)
          }
          if (list[i].ifThenElse?.else !== null) {
            recurse(list[i].ifThenElse!.else!)
          }
        }
      }

    }

    recurse(props.list!)
  }

  const resetConditionClick = () => {

  }

  const resetVarClick= () => {
    
  }

  const handleSetParams = (params: IParamsToAddTextarea) => {

    }
 

  useEffect(() => {
    obj?.textareaRef.current?.focus()
  }, [obj])

  useEffect(()=>{
    obj2?.textareaId.textareaRef.current?.focus()
    obj2?.textareaId.textareaRef.current?.setSelectionRange(obj2.idLength,obj2.idLength)
  },[obj2])

  
  return (
    <>
      <div className={styles.conditionFlex}>
        <div className={styles.conditionWrap}><span className={styles.condition}>IF</span></div>
        <div className={styles.textareaMini}>
          <TemplateList params={paramsToAddTextarea} handleSetParams={handleSetParams} innerId={idIF} varClicked={props.varClicked} conditionClicked={props.clicked} resetVarClick = {resetVarClick} resetConditionClick={resetConditionClick} globalList={props.globalList} handleSetTextareaId={handleSetTextareaId} handleBlured={bluredIF} initialList={props.ifThenElseInitialTemplates?.if!} arrVarNames={props.arrVarNames}></TemplateList>
        </div>
      </div>
      <div className={styles.conditionFlex}>
        <div className={styles.conditionWrap}><span className={styles.condition}>THEN</span></div>
        <div className={styles.textareaMini}>
          <TemplateList params={paramsToAddTextarea} handleSetParams={handleSetParams} innerId={idTHEN} varClicked={props.varClicked} conditionClicked={props.clicked} resetVarClick = {resetVarClick} resetConditionClick={resetConditionClick} globalList={props.globalList} handleSetTextareaId={handleSetTextareaId} handleBlured={bluredTHEN} initialList={props.ifThenElseInitialTemplates?.then!} arrVarNames={props.arrVarNames}></TemplateList>
        </div>
      </div>
      <div className={styles.conditionFlex}>
        <div className={styles.conditionWrap}><span className={styles.condition}>ELSE</span></div>
        <div className={styles.textareaMini}>
          <TemplateList params={paramsToAddTextarea} handleSetParams={handleSetParams} innerId={idELSE} varClicked={props.varClicked} conditionClicked={props.clicked} resetVarClick = {resetVarClick} resetConditionClick={resetConditionClick} globalList={props.globalList} handleSetTextareaId={handleSetTextareaId} handleBlured={bluredELSE} initialList={props.ifThenElseInitialTemplates?.else!} arrVarNames={props.arrVarNames}></TemplateList>
        </div>
      </div>

    </>
  )
}

export default IfThenElseSubwidget
