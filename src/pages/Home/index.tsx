import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'
import { HandPalm, Play } from 'phosphor-react'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinuteAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
  StopCountdownButton,
} from './styles'
import { toast } from 'react-toastify'

const newCycleFormSchema = zod.object({
  task: zod
    .string()
    .min(3, 'Minimo de 3 caracteres.')
    .max(20, 'Maximo de 20 caracteres.'),
  minutesAmount: zod
    .number()
    .min(5, 'Minimo de 5 minutos.')
    .max(60, 'Maximo de 60 minutos.'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
}

const Home = () => {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  useEffect(() => {
    if (activeCycle) {
      const interval = setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate),
        )
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [activeCycle])

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmountRest = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = minutesAmountRest.toString().padStart(2, '0')
  const seconds = secondsAmount.toString().padStart(2, '0')

  const handleCreateNewCycle = (data: NewCycleFormData) => {
    const newCycle: Cycle = {
      id: new Date().getTime().toString(),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)
    setAmountSecondsPassed(0)

    toast.success('Novo ciclo criado com sucesso!')

    reset()
  }

  useEffect(() => {
    if (activeCycle) {
      document.title = `Tempo do ciclo: ${minutes}:${seconds}`
    }
  }, [activeCycle, minutes, seconds])

  const handleStopCycle = () => {
    setCycles(
      cycles.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  const task = watch('task')
  const minutesAmount = watch('minutesAmount')

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em:</label>
          <TaskInput
            id="task"
            type="text"
            placeholder="Dê um nome para o seu novo projeto"
            list="task-suggestions"
            disabled={!!activeCycleId}
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinuteAmountInput
            id="minutesAmount"
            type="number"
            placeholder="00"
            disabled={!!activeCycleId}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleStopCycle}>
            <HandPalm size={24} /> Parar
          </StopCountdownButton>
        ) : (
          <StartCountdownButton
            type="submit"
            disabled={!task || !minutesAmount}
          >
            <Play size={24} /> Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}

export default Home
