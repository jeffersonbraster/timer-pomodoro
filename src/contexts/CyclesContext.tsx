import { differenceInSeconds } from 'date-fns'
import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { toast } from 'react-toastify'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'

interface NewCycle {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
  amountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: NewCycle) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CycleContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedStateAsJSON = localStorage.getItem('@jeje-timer:cycles-state')

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }
    },
  )
  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@jeje-timer:cycles-state', stateJSON)
  }, [cyclesState])

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  const createNewCycle = (data: NewCycle) => {
    const newCycle: Cycle = {
      id: new Date().getTime().toString(),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    // dispatch({ type: ActionTypes.CREATE_NEW_CYCLE, payload: newCycle })
    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)

    toast.info('Novo ciclo criado com sucesso!')
  }

  const markCurrentCycleAsFinished = () => {
    dispatch(markCurrentCycleAsFinishedAction())
    toast.success('Ciclo finalizado!')
  }

  const interruptCurrentCycle = () => {
    dispatch(interruptCurrentCycleAction())

    toast.error('Ciclo interrompido!')
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
