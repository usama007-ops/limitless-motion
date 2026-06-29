'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, ChevronDown, ChevronUp, Dumbbell, GripVertical, Loader2 } from 'lucide-react'
import { getWorkoutDays, getExercisesByProgram } from '@/db'
import { adminCreate, adminUpdate, adminDelete } from '@/lib/adminDb'

export default function MovementBuilder({ open, onClose, programId }) {
  const [days, setDays] = useState([])
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedWeeks, setExpandedWeeks] = useState({})
  const [expandedDays, setExpandedDays] = useState({})

  useEffect(() => {
    if (!open || !programId) { setLoading(false); return }
    loadData(programId)
  }, [open, programId])

  async function loadData(programId) {
    setLoading(true)
    try {
      const [dayRecords, exRecords] = await Promise.all([
        getWorkoutDays(programId),
        getExercisesByProgram(programId),
      ])
      setDays(dayRecords || [])
      setExercises(exRecords || [])

      const weekNums = [...new Set((dayRecords || []).map(d => d.week_number))]
      const we = {}
      weekNums.forEach(w => { we[w] = true })
      setExpandedWeeks(we)

      const de = {}
      ;(dayRecords || []).forEach(d => { de[d.id] = true })
      setExpandedDays(de)
    } catch (e) {
      console.error('Failed to load data:', e)
    }
    setLoading(false)
  }

  const weekNumbers = [...new Set(days.map(d => d.week_number))].sort((a, b) => a - b)

  function getDaysForWeek(weekNum) {
    return days.filter(d => d.week_number === weekNum).sort((a, b) => a.day_of_week - b.day_of_week)
  }

  function getExercisesForDay(dayId) {
    return exercises.filter(ex => ex.day_id === dayId)
  }

  async function handleAddWeek() {
    const nextWeek = weekNumbers.length > 0 ? Math.max(...weekNumbers) + 1 : 1
    const names = ['Full Body Strength', 'Cardio & Conditioning', 'Mobility & Recovery', 'Power & Explosiveness', 'Core & Stability', 'Active Recovery', 'Full Body Endurance']
    try {
      for (let d = 0; d < 7; d++) {
        const { data } = await adminCreate('workout_days', {
          program_id: programId, week_number: nextWeek, day_of_week: d + 1,
          day_name: `Week ${nextWeek} - Day ${d + 1}: ${names[d]}`, focus_area: names[d], estimated_duration: 40,
        })
        for (let e = 0; e < 2; e++) {
          await adminCreate('exercises', { program_id: programId, day_id: data[0].id, exercise_name: '', sets: 3, reps: '', muscle_groups: '', form_tips: '' })
        }
      }
      await loadData(programId)
    } catch (e) { alert('Failed: ' + e.message) }
  }

  async function handleRemoveWeek(weekNum) {
    if (!confirm(`Remove Week ${weekNum}?`)) return
    const weekDays = getDaysForWeek(weekNum)
    try {
      for (const day of weekDays) {
        for (const ex of getExercisesForDay(day.id)) await adminDelete('exercises', ex.id)
        await adminDelete('workout_days', day.id)
      }
      await loadData(programId)
    } catch (e) { alert('Failed: ' + e.message) }
  }

  async function handleAddExercise(dayId) {
    try {
      await adminCreate('exercises', { program_id: programId, day_id: dayId, exercise_name: '', sets: 3, reps: '', muscle_groups: '', form_tips: '' })
      await loadData(programId)
    } catch (e) { alert('Failed: ' + e.message) }
  }

  async function handleRemoveExercise(exId) {
    if (!confirm('Remove this exercise?')) return
    try { await adminDelete('exercises', exId); await loadData(programId) }
    catch (e) { alert('Failed: ' + e.message) }
  }

  async function handleUpdateExercise(exId, field, value) {
    try { await adminUpdate('exercises', exId, { [field]: value }) }
    catch (e) { console.error(e) }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-card border-l border-border shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Movement Builder</h2>
            <p className="text-sm text-muted-foreground">Edit weeks, days, and exercises.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : weekNumbers.length > 0 ? (
            <div className="space-y-4">
              <button onClick={handleAddWeek} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors">
                <Plus className="w-4 h-4" /> Add Week
              </button>

              {weekNumbers.map(weekNum => {
                const weekDays = getDaysForWeek(weekNum)
                const isWeekExpanded = expandedWeeks[weekNum]

                return (
                  <div key={weekNum} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-5 py-4 bg-muted/30 border-b border-border">
                      <button type="button" onClick={() => setExpandedWeeks(prev => ({ ...prev, [weekNum]: !prev[weekNum] }))} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[hsl(var(--brand-move))/10] flex items-center justify-center">
                          <span className="text-sm font-black text-[hsl(var(--brand-move))]">W{weekNum}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">Week {weekNum}</h3>
                          <p className="text-xs text-muted-foreground">{weekDays.length} days</p>
                        </div>
                        {isWeekExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </button>
                      <button onClick={() => handleRemoveWeek(weekNum)} className="text-destructive hover:text-destructive/80 p-1.5 rounded hover:bg-destructive/10" title="Remove week">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {isWeekExpanded && (
                      <div className="p-4 space-y-3">
                        {weekDays.map(day => {
                          const dayExs = getExercisesForDay(day.id)
                          const isDayExpanded = expandedDays[day.id]

                          return (
                            <div key={day.id} className="border border-border rounded-lg overflow-hidden">
                              <div className="flex items-center justify-between px-4 py-3 bg-muted/10">
                                <button type="button" onClick={() => setExpandedDays(prev => ({ ...prev, [day.id]: !prev[day.id] }))} className="flex items-center gap-2">
                                  <Dumbbell className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm font-semibold text-foreground">{day.day_name}</span>
                                  <span className="text-xs text-muted-foreground">({dayExs.length})</span>
                                  {isDayExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                                </button>
                              </div>

                              {isDayExpanded && (
                                <div className="p-4 space-y-2.5 border-t border-border">
                                  {dayExs.map(ex => (
                                    <div key={ex.id} className="flex items-start gap-3 bg-background border border-border rounded-lg p-3">
                                      <GripVertical className="w-4 h-4 text-muted-foreground/40 mt-2 shrink-0" />
                                      <div className="flex-1 grid grid-cols-5 gap-2">
                                        <div className="col-span-2">
                                          <label className="block text-[10px] font-medium text-muted-foreground uppercase mb-0.5">Movement</label>
                                          <input defaultValue={ex.exercise_name} onBlur={e => handleUpdateExercise(ex.id, 'exercise_name', e.target.value)} className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/30" placeholder="Name" />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-medium text-muted-foreground uppercase mb-0.5">Sets</label>
                                          <input type="number" defaultValue={ex.sets} onBlur={e => handleUpdateExercise(ex.id, 'sets', Number(e.target.value) || 3)} className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/30" />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-medium text-muted-foreground uppercase mb-0.5">Reps</label>
                                          <input defaultValue={ex.reps || ''} onBlur={e => handleUpdateExercise(ex.id, 'reps', e.target.value)} className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/30" placeholder="e.g. 10" />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-medium text-muted-foreground uppercase mb-0.5">Focus</label>
                                          <input defaultValue={ex.muscle_groups || ''} onBlur={e => handleUpdateExercise(ex.id, 'muscle_groups', e.target.value)} className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/30" placeholder="Muscle" />
                                        </div>
                                        <div className="col-span-5">
                                          <label className="block text-[10px] font-medium text-muted-foreground uppercase mb-0.5">Form Tips</label>
                                          <input defaultValue={ex.form_tips || ''} onBlur={e => handleUpdateExercise(ex.id, 'form_tips', e.target.value)} className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/30" placeholder="Tips" />
                                        </div>
                                      </div>
                                      <button onClick={() => handleRemoveExercise(ex.id)} className="text-destructive hover:text-destructive/80 p-1 rounded hover:bg-destructive/10 shrink-0 mt-1">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                  <button onClick={() => handleAddExercise(day.id)} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium px-2 py-1.5">
                                    <Plus className="w-3.5 h-3.5" /> Add Movement
                                  </button>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-10 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground mb-4">No weeks for this program.</p>
              <button onClick={handleAddWeek} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md">
                <Plus className="w-4 h-4" /> Create Week 1
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
