import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(window, 'prompt').mockImplementation(() => '')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('deve adicionar tarefas e atualizar os contadores', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('Digite uma nova tarefa...')
    const addButton = screen.getByRole('button', { name: 'Adicionar' })

    await user.type(input, 'Estudar Vitest')
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('Estudar Vitest')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: 'Todas (1)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pendentes (1)' })).toBeInTheDocument()
  })

  it('deve permitir filtrar tarefas concluídas e pendentes', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('Digite uma nova tarefa...')
    const addButton = screen.getByRole('button', { name: 'Adicionar' })

    await user.type(input, 'Primeira tarefa')
    await user.click(addButton)
    await user.clear(input)
    await user.type(input, 'Segunda tarefa')
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('Segunda tarefa')).toBeInTheDocument()
    })

    const toggleButtons = screen.getAllByRole('button', { name: /Marcar feita/i })
    await user.click(toggleButtons[0])

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Concluídas \(1\)/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Concluídas \(1\)/i }))
    await waitFor(() => {
      expect(screen.getByText('Primeira tarefa')).toBeInTheDocument()
      expect(screen.queryByText('Segunda tarefa')).not.toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Pendentes \(1\)/i }))
    await waitFor(() => {
      expect(screen.getByText('Segunda tarefa')).toBeInTheDocument()
      expect(screen.queryByText('Primeira tarefa')).not.toBeInTheDocument()
    })
  })

  it('deve confirmar e deletar tarefas usando o modal', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('Digite uma nova tarefa...')
    const addButton = screen.getByRole('button', { name: 'Adicionar' })

    await user.type(input, 'Tarefa para deletar')
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('Tarefa para deletar')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Deletar' }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('Tem certeza que deseja deletar esta tarefa?')

    const confirmButton = within(dialog).getByRole('button', { name: 'OK' })
    await user.click(confirmButton)

    await waitFor(() => {
      expect(screen.getByText('Nenhuma tarefa para listar.')).toBeInTheDocument()
    })
  })
})

