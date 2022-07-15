import { useContext } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { HandPalm, Play } from 'phosphor-react'
import NewCycleForm from './components/NewCycleForm'
import CountDown from './components/CountDown'
import { CyclesContext } from '../../contexts/CyclesContext'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

const newCycleFormSchema = zod.object({
  task: zod
    .string()
    .min(3, 'Minimo de 3 caracteres.')
    .max(20, 'Maximo de 20 caracteres.'),
  minutesAmount: zod
    .number()
    .min(1, 'Minimo de 5 minutos.')
    .max(60, 'Maximo de 60 minutos.'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormSchema>

const Home = () => {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  const handleCreateNewCycle = (data: NewCycleFormData) => {
    createNewCycle(data)

    reset()
  }

  const task = watch('task')
  const minutesAmount = watch('minutesAmount')

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <CountDown />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
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
