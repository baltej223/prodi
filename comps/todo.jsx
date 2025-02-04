'use client'

import React, { useState } from 'react'
import { Plus, Star, Trash2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"


export function TodoContent({list}) {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false, important: true },
    { id: 2, text: 'Build a todo app', completed: false, important: false },
    { id: 3, text: 'Master TypeScript', completed: true, important: true },
  ])
  const [newTodo, setNewTodo] = useState('')

    const addTodo = (e) => {
    e.preventDefault()
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false, important: false }])
      setNewTodo('')
    }
  }

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const toggleImportant = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, important: !todo.important } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="w-full max-w-4xl mx-auto pt-10">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      
      <form onSubmit={addTodo} className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-grow rounded"
        />
        <Button type="submit" className="whitespace-nowrap rounded">
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </form>

      <ul className="space-y-2">
        {todos.map(todo => (
          <li 
            key={todo.id} 
            className={cn(
              "flex items-center gap-2 p-2 rounded",
              todo.completed ? "bg-gray-100" : "bg-white",
              "border border-gray-200 hover:border-gray-300 transition-colors rounded"
            )}
          >
            <Checkbox 
              checked={todo.completed}
              onCheckedChange={() => toggleComplete(todo.id)}
            />
            <span className={cn(
              "flex-grow text-sm sm:text-base",
              todo.completed && "line-through text-gray-500"
            )}>
              {todo.text}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleImportant(todo.id)}
              className={cn(
                todo.important ? "text-yellow-500" : "text-gray-400",
                "hover:text-yellow-600"
              )}
            >
              <Star className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo(todo.id)}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
