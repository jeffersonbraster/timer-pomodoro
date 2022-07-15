import { useContext } from 'react'
import { FormContainer, TaskInput, MinuteAmountInput } from './styles'

import { CyclesContext } from '../..'
import { useFormContext } from 'react-hook-form'

const NewCycleForm = () => {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em:</label>
      <TaskInput
        id="task"
        type="text"
        placeholder="Dê um nome para o seu novo projeto"
        list="task-suggestions"
        disabled={!!activeCycle}
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
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}

export default NewCycleForm
