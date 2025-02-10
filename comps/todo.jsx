'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Star, Trash2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { getTodos, addTodo, deleteTodo, markImportant, isDone } from '@/hooks/apiHandlers'
import SideBar from "@/comps/sidebar";


export function TodoContent() {
  const [list, setList ] = useState("today");
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    async function fetchTodos() {
      const response = await getTodos()
      if (response && response.todos && response.todos.lists && response.todos.lists[list]) {
        setTodos(response.todos.lists[list]);
      }
    }
    fetchTodos()
  }, [list])

  const __addTodo = async (e) => {
    e.preventDefault()

    if (newTodo.trim()) {
      try {
        const response = await addTodo(newTodo, false, false, list);
        console.log(response);
        if(response && !response.error) {
          setTodos([...todos, { _id: response._id, todoTitle: newTodo, isImportant: false, isDone: false }])
          setNewTodo('')
        } else {
          console.error('Error: Invalid response from addTodo:', response);
        }
      } catch (error) {
        console.error('Error adding todo:', error)
      }
    }
  }

  const toggleComplete = async (id, currentState) => {
    console.log("state is ", currentState);
    const newState = !currentState;
    try {
      await isDone(id, list, newState);
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, isDone: newState } : todo
      ));
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };
  
  let [todoImportant, setTodoImporance] = useState(false);
  const toggleImportant = async (id, currentState) => {
    try {
      const newState = !currentState;
      await markImportant(id, list, newState);
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, isImportant: !todo.isImportant } : todo
      ))
    } catch (error) {
      console.error('Error toggling important:', error)
    }
  }

  const _deleteTodo = async (id) => {
    try {
      await deleteTodo(id, list)
      setTodos(todos.filter(todo => todo._id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  return (
    <div className='flex flex-column gap-x-5'>
    <SideBar className="" list={list} setListState={setList}/>

    <div className="w-full max-w-4xl mx-auto pt-10 pr-[2%] content w-[100%]">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      
      <form onSubmit={__addTodo} className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Complete Office work till 9"
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
            key={todo._id} 
            className={cn(
              "flex items-center gap-2 p-2 rounded",
              todo.isDone ? "bg-gray-100" : "bg-white",
              "border border-gray-200 hover:border-gray-300 transition-colors rounded"
            )}
          >
            <Checkbox 
              checked={todo.isDone}
              onCheckedChange={() => toggleComplete(todo._id, todo.isDone)}
            />
            <span className={cn(
              "flex-grow text-sm sm:text-base",
              todo.isDone && "line-through text-gray-500"
            )}>
              {todo.todoTitle}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleImportant(todo._id, todo.isDone)}
              className={cn(
                todo.isImportant ? "text-yellow-500" : "text-gray-400",
                "hover:text-yellow-600"
              )}
            >
              <Star className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => _deleteTodo(todo._id)}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
    </div>
  )
}