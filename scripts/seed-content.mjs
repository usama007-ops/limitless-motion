import { createClient } from '@supabase/supabase-js'

process.loadEnvFile('.env.local')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function insertIfEmpty(table, rows) {
  const { count, error: countErr } = await supabase.from(table).select('*', { count: 'exact', head: true })
  if (countErr) {
    console.error(`  SKIP ${table}: cannot check count -`, countErr.message)
    return
  }
  if (count > 0) {
    console.log(`  SKIP (${table} already has ${count} rows)`)
    return
  }
  const { error } = await supabase.from(table).insert(rows)
  if (error) {
    console.error(`  FAILED:`, error.message)
  } else {
    console.log(`  OK (${rows.length} rows)`)
  }
}

async function main() {
  console.log('Seeding content data...\n')

  // ─── Workout Challenges ───
  console.log('Inserting workout_challenges...')
  await insertIfEmpty('workout_challenges', [
    { name: '30-Day Consistency Challenge', description: 'Complete at least one workout every day for 30 days. Build the habit of showing up.', status: 'active', duration: '30 days', participant_count: 42, prize: 'Exclusive Community Badge', rules: 'Complete all scheduled workouts for the duration of the challenge.' },
    { name: 'Strength Stacker', description: 'Accumulate 500 total reps of compound lifts over two weeks.', status: 'active', duration: '14 days', participant_count: 28, prize: 'Strength Stacker Badge', rules: 'Log each workout and accumulate 500 total reps across deadlifts, squats, and presses.' },
    { name: 'Endurance Week', description: 'Log 60+ minutes of cardio or metabolic conditioning each day for 7 days.', status: 'active', duration: '7 days', participant_count: 35, prize: 'Endurance Elite Badge', rules: 'Complete at least 60 minutes of zone 2 cardio or HIIT per day.' },
  ])

  // ─── Attire Recommendations ───
  console.log('Inserting attire_recommendations...')
  await insertIfEmpty('attire_recommendations', [
    { name: 'Performance Running Shoes', category: 'workout gear', description: 'Lightweight and responsive for your daily miles.', image_url: 'https://images.unsplash.com/photo-1599447291800-2c297eccf01f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Moisture-Wicking Shirt', category: 'workout gear', description: 'Stay cool and dry during intense sessions.', image_url: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?auto=format&fit=crop&w=600&q=80' },
    { name: 'Yoga Mat', category: 'accessories', description: 'Premium grip and cushioning for your practice.', image_url: 'https://images.unsplash.com/photo-1591291621060-89264efbeaed?auto=format&fit=crop&w=600&q=80' },
    { name: 'Gym Bag', category: 'accessories', description: 'Spacious and durable for all your essentials.', image_url: 'https://images.unsplash.com/photo-1599270514441-242889f01862?auto=format&fit=crop&w=600&q=80' },
    { name: 'Recovery Foam Roller', category: 'accessories', description: 'Essential for post-workout muscle recovery.', image_url: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?auto=format&fit=crop&w=600&q=80' },
  ])

  // ─── Affirmations ───
  console.log('Inserting affirmations...')
  await insertIfEmpty('affirmations', [
    { text: 'You are stronger than your challenges' },
    { text: 'Every day is a new opportunity to grow' },
    { text: 'Your potential is limitless' },
    { text: 'I embrace the rhythm of progress' },
    { text: 'My mind is clear, my focus is sharp' },
    { text: 'I am capable of more than I know. Today, I choose to push my boundaries.' },
    { text: 'Strength does not come from the body. It comes from the will.' },
    { text: 'The only bad workout is the one that didn\'t happen.' },
  ])

  // ─── Videos ───
  console.log('Inserting videos...')
  try {
    await insertIfEmpty('videos', [
      { title: 'Full Body Workout for Beginners', description: 'A complete full body routine designed for beginners to build strength and confidence in the gym.', category: 'Workout Tutorials', upload_date: '2025-11-15', view_count: 1240 },
      { title: 'Meal Prep Sunday: High Protein Meals', description: 'Learn how to prep a full week of high-protein, low-calorie meals in under 2 hours.', category: 'Meal Prep', upload_date: '2025-11-10', view_count: 892 },
      { title: 'Coaching Tip: Perfect Your Squat Form', description: 'Coach breaks down the key components of a perfect squat to maximize results and prevent injury.', category: 'Coaching Tips', upload_date: '2025-11-05', view_count: 2156 },
      { title: 'Why Consistency Beats Intensity', description: 'A motivational deep dive into why showing up daily matters more than going all-out once a week.', category: 'Motivational', upload_date: '2025-11-01', view_count: 3421 },
    ])
  } catch (e) {
    console.error('  FAILED:', e.message)
  }

  // ─── Podcasts ───
  console.log('Inserting podcasts...')
  await insertIfEmpty('podcasts', [
    { name: 'The Mindset Advantage', description: 'Explore how elite athletes train their minds for peak performance and resilience.', platform: 'Spotify', podcast_link: 'https://open.spotify.com/show/example1' },
    { name: 'Nutrition Unlocked', description: 'Deep dive into macro counting, meal timing, and evidence-based nutrition strategies.', platform: 'Apple Podcasts', podcast_link: 'https://podcasts.apple.com/podcast/example2' },
    { name: 'The Recovery Hour', description: 'Learn about the science of recovery, sleep optimization, and mobility work.', platform: 'Spotify', podcast_link: 'https://open.spotify.com/show/example3' },
  ])

  // ─── Workout Programs ───
  console.log('Inserting workout_programs...')
  await insertIfEmpty('workout_programs', [
    { name: '30-Day Total Transformation', description: 'A comprehensive program combining strength, cardio, and mobility.', goal: 'Build consistent habits', difficulty: 'intermediate', category: 'burn', workout_type: 'functional', session_duration: 45, target_audience: 'all', social: false },
    { name: 'Strength Foundations', description: 'Build raw strength with progressive overload.', goal: 'Build strength', difficulty: 'beginner', category: 'move', workout_type: 'strength', session_duration: 40, target_audience: 'beginners', social: true },
    { name: 'Mindful Movement', description: 'Low-impact mobility and mindfulness for recovery days.', goal: 'Improve flexibility', difficulty: 'beginner', category: 'think', workout_type: 'mindfulness', session_duration: 30, target_audience: 'all', social: false },
  ])

  // ─── Workout Days + Exercises for each program ───
  console.log('Inserting workout_days & exercises...')
  const { data: progList } = await supabase.from('workout_programs').select('id')
  if (progList && progList.length > 0) {
    for (const program of progList) {
      const { count: dayCount } = await supabase.from('workout_days').select('*', { count: 'exact', head: true }).eq('program_id', program.id)
      if (dayCount > 0) {
        console.log(`  SKIP (workout_days already exist for program ${program.id})`)
        continue
      }

      // Insert 4 workout days
      const dayNames = ['Full Body Strength', 'Cardio & Conditioning', 'Mobility & Recovery', 'Power & Explosiveness']
      const insertedDays = []
      for (let d = 0; d < 4; d++) {
        const { data: dayData, error: dayErr } = await supabase.from('workout_days').insert({
          program_id: program.id,
          day_of_week: d + 1,
          day_name: `Day ${d + 1} - ${dayNames[d]}`,
          focus_area: dayNames[d],
          estimated_duration: 40,
        }).select().single()
        if (dayErr) { console.error(`  FAILED to insert day for ${program.id}:`, dayErr.message); break }
        insertedDays.push(dayData)
      }
      if (insertedDays.length === 0) continue

      // Delete previously seeded exercises without day_id for this program
      await supabase.from('exercises').delete().eq('program_id', program.id).is('day_id', null)

      const exerciseSets = [
        { exercise_name: 'Turkish Get-Ups', sets: 3, reps: '5/side', muscle_groups: 'Full Body', form_tips: 'Keep eyes on the bell, move deliberately.' },
        { exercise_name: 'Kettlebell Deadlifts', sets: 4, reps: '10', muscle_groups: 'Posterior Chain', form_tips: 'Hinge at hips, maintain neutral spine.' },
        { exercise_name: 'Farmer Carries', sets: 4, reps: '40m', muscle_groups: 'Core/Grip', form_tips: 'Tall posture, braced core.' },
        { exercise_name: 'Bear Crawls', sets: 3, reps: '20m', muscle_groups: 'Shoulders/Core', form_tips: 'Keep hips low and level.' },
        { exercise_name: '90/90 Hip Switches', sets: 2, reps: '10/side', muscle_groups: 'Mobility', form_tips: 'Move slowly, explore end ranges.' },
        { exercise_name: 'World\'s Greatest Stretch', sets: 2, reps: '5/side', muscle_groups: 'Hips/T-Spine', form_tips: 'Breathe into the rotation.' },
        { exercise_name: 'Cossack Squats', sets: 3, reps: '8/side', muscle_groups: 'Hips/Legs', form_tips: 'Keep heel down on straight leg.' },
        { exercise_name: 'Downward Dog to Cobra', sets: 3, reps: '10', muscle_groups: 'Full Body', form_tips: 'Flow smoothly with breath.' },
      ]

      // Assign 2 exercises per day
      const exWithDays = exerciseSets.map((ex, i) => ({
        ...ex,
        program_id: program.id,
        day_id: insertedDays[Math.floor(i / 2)].id,
      }))
      const { error: exErr } = await supabase.from('exercises').insert(exWithDays)
      if (exErr) console.error(`  FAILED to insert exercises for ${program.id}:`, exErr.message)
      else console.log(`  OK (${exerciseSets.length} exercises across ${insertedDays.length} days for program ${program.id})`)
    }
  }

  // ─── Workout Videos ───
  console.log('Inserting workout_videos...')
  await insertIfEmpty('workout_videos', [
    { title: 'HIIT Full Body Blast', difficulty: 'intermediate', category: 'hiit', description: 'A 20-minute high intensity interval training session.', duration: 20 },
    { title: 'Beginner Yoga Flow', difficulty: 'beginner', category: 'yoga', description: 'A gentle introduction to yoga with basic poses.', duration: 30 },
    { title: 'Upper Body Strength', difficulty: 'advanced', category: 'strength', description: 'Advanced upper body workout focusing on form.', duration: 45 },
  ])

  // ─── Recovery Flows ───
  console.log('Inserting recovery_flows...')
  await insertIfEmpty('recovery_flows', [
    { name: 'Full Body Stretch', type: 'stretch', duration: 15, instructions: 'Hold each stretch for 30 seconds.', stretches: [{ name: 'Hamstring Stretch', duration: 30, instructions: 'Sit on floor, extend one leg, reach forward.' }, { name: 'Shoulder Opener', duration: 30, instructions: 'Clasp hands behind back and lift.' }] },
    { name: 'Breathing Reset', type: 'breathing', duration: 10, instructions: 'Focus on deep diaphragmatic breathing.', stretches: [{ name: 'Box Breathing', duration: 60, instructions: 'Inhale 4s, hold 4s, exhale 4s, hold 4s.' }] },
    { name: 'Post-Workout Mobility', type: 'mobility', duration: 20, instructions: 'Improve joint range of motion.', stretches: [{ name: 'Hip Circles', duration: 45, instructions: 'Stand on one leg, circle the other hip.' }, { name: 'Spinal Twists', duration: 45, instructions: 'Seated twist holding each side.' }] },
  ])

  // ─── Meal Recipes ───
  console.log('Inserting meal_recipes...')
  await insertIfEmpty('meal_recipes', [
    { name: 'Grilled Chicken Bowl', category: 'lunch', season: 'non-fasting', ingredients: ['chicken breast', 'quinoa', 'mixed greens', 'cherry tomatoes', 'olive oil'], instructions: 'Grill chicken 6min each side. Cook quinoa. Assemble bowl.', calories_total: 450, protein_grams: 42, carbs_grams: 35, fats_grams: 14, prep_time_minutes: 15, cook_time_minutes: 20 },
    { name: 'Overnight Oats', category: 'breakfast', season: 'both', ingredients: ['rolled oats', 'almond milk', 'protein powder', 'berries', 'honey'], instructions: 'Mix all ingredients. Refrigerate overnight.', calories_total: 380, protein_grams: 30, carbs_grams: 48, fats_grams: 8, prep_time_minutes: 10, cook_time_minutes: 0 },
    { name: 'Baked Salmon with Vegetables', category: 'dinner', season: 'non-fasting', ingredients: ['salmon fillet', 'asparagus', 'sweet potato', 'lemon', 'garlic'], instructions: 'Bake salmon at 400F for 15min. Roast vegetables alongside.', calories_total: 520, protein_grams: 45, carbs_grams: 30, fats_grams: 22, prep_time_minutes: 10, cook_time_minutes: 20 },
  ])

  // ─── Ethiopian Meals ───
  console.log('Inserting ethiopian_meals...')
  await insertIfEmpty('ethiopian_meals', [
    { name: 'Misir Wot', description: 'Spicy red lentil stew with berbere spice.', category: 'dinner', ingredients: ['red lentils', 'berbere spice', 'onions', 'garlic', 'tomato paste'], meal_prep_instructions: 'Sauté onions, add berbere and tomato paste. Add lentils and water. Simmer 30min.', calories_total: 320, protein_grams: 18, carbs_grams: 45, fats_grams: 8, prep_time_minutes: 10 },
    { name: 'Tibs', description: 'Sautéed beef with onions and Ethiopian spices.', category: 'dinner', ingredients: ['beef sirloin', 'onions', 'bell peppers', 'niter kibbeh', 'mitmita'], meal_prep_instructions: 'Sear meat in niter kibbeh. Add onions and peppers. Cook until tender.', calories_total: 450, protein_grams: 38, carbs_grams: 12, fats_grams: 28, prep_time_minutes: 15 },
    { name: 'Shiro', description: 'Creamy chickpea and lentil stew.', category: 'lunch', ingredients: ['chickpea flour', 'onions', 'garlic', 'berbere', 'olive oil'], meal_prep_instructions: 'Sauté aromatics, whisk in chickpea flour and water. Simmer until thick.', calories_total: 280, protein_grams: 14, carbs_grams: 36, fats_grams: 10, prep_time_minutes: 10 },
  ])

  // ─── High Protein Meals ───
  console.log('Inserting high_protein_meals...')
  await insertIfEmpty('high_protein_meals', [
    { name: 'Greek Yogurt Protein Bowl', description: 'Quick high-protein breakfast.', category: 'breakfast', ingredients: ['greek yogurt', 'whey protein', 'almonds', 'chia seeds', 'berries'], instructions: 'Mix protein powder into yogurt. Top with nuts and berries.', protein_grams: 48, calories_total: 420, carbs_grams: 28, fats_grams: 14, prep_time_minutes: 5 },
    { name: 'Lean Beef Stir Fry', description: 'Protein-packed stir fry with vegetables.', category: 'lunch', ingredients: ['beef sirloin', 'broccoli', 'bell peppers', 'soy sauce', 'ginger'], instructions: 'Sear beef, remove. Stir fry vegetables. Combine with sauce.', protein_grams: 52, calories_total: 480, carbs_grams: 18, fats_grams: 16, prep_time_minutes: 12 },
    { name: 'Tuna Avocado Wrap', description: 'No-cook high protein lunch.', category: 'lunch', ingredients: ['canned tuna', 'avocado', 'whole wheat wrap', 'mixed greens', 'lemon juice'], instructions: 'Mix tuna with avocado. Fill wrap with greens.', protein_grams: 40, calories_total: 400, carbs_grams: 24, fats_grams: 18, prep_time_minutes: 10 },
  ])

  // ─── Fasting Breakfasts ───
  console.log('Inserting fasting_breakfasts...')
  await insertIfEmpty('fasting_breakfasts', [
    { name: 'Egg White Scramble', description: 'Light egg whites with spinach and mushrooms.', category: 'global', ingredients: ['egg whites', 'spinach', 'mushrooms', 'olive oil', 'seasoning'], instructions: 'Sauté vegetables. Add egg whites and scramble.', calories_total: 180, protein_grams: 26, fiber_grams: 3, prep_time_minutes: 5, cook_time_minutes: 10, is_featured: true },
    { name: 'Intermittent Fasting Smoothie', description: 'Nutrient-dense smoothie for breaking your fast.', category: 'global', ingredients: ['almond milk', 'whey protein', 'banana', 'spinach', 'flax seeds'], instructions: 'Blend all ingredients until smooth.', calories_total: 320, protein_grams: 35, fiber_grams: 8, prep_time_minutes: 5, is_featured: true },
    { name: 'Ethiopian Breakfast Bowl', description: 'Traditional Ethiopian breakfast with a fitness twist.', category: 'ethiopian', ingredients: ['teff grain', 'yogurt', 'honey', 'mixed berries', 'sunflower seeds'], instructions: 'Cook teff in water. Top with yogurt, honey, and berries.', calories_total: 290, protein_grams: 12, fiber_grams: 6, prep_time_minutes: 5, cook_time_minutes: 15, is_featured: false },
  ])

  // ─── Community Posts ───
  const adminId = 'd5f82821-2287-4909-b278-fe0184ed41cf'
  console.log('Inserting community_posts...')
  await insertIfEmpty('community_posts', [
    { author_id: adminId, author_name: 'Limitless_Anna', type: 'motivation', content: 'Just completed Week 4 of the 30-Day Transformation! Down 5 lbs and feeling stronger every day.', likes: 24, date: new Date().toISOString() },
    { author_id: adminId, author_name: 'FitMike', type: 'motivation', content: 'Anyone have tips for improving pull-up form? I can do 5 but want to improve.', likes: 12, date: new Date(Date.now() - 86400000).toISOString() },
    { author_id: adminId, author_name: 'SaraFitness', type: 'motivation', content: 'Progress not perfection. Small steps lead to big changes.', likes: 38, date: new Date(Date.now() - 172800000).toISOString() },
    { author_id: adminId, author_name: 'CoachJ', type: 'motivation', content: 'Always warm up for at least 5 minutes before lifting.', likes: 45, date: new Date(Date.now() - 259200000).toISOString() },
  ])

  // ─── Success Stories ───
  console.log('Inserting success_stories...')
  await insertIfEmpty('success_stories', [
    { name: 'Maria Gonzalez', goal: 'Weight Loss', results_summary: 'Lost 25 pounds and gained confidence through consistent training.', testimonial: 'This program changed my life. I never thought I could feel this good.', timeline_category: '12-16 weeks', timeline_weeks: 16, age: 34, gender: 'female', workout_consistency: 5 },
    { name: 'James Chen', goal: 'Strength Building', results_summary: 'Increased deadlift by 100lbs and achieved bodyweight bench press.', testimonial: 'The structured progression made all the difference.', timeline_category: '16+ weeks', timeline_weeks: 32, age: 29, gender: 'male', workout_consistency: 4 },
    { name: 'Priya Patel', goal: 'Overall Wellness', results_summary: 'Improved energy levels, better sleep, and reduced stress.', testimonial: 'I found a sustainable routine that fits my lifestyle.', timeline_category: '8-12 weeks', timeline_weeks: 20, age: 42, gender: 'female', workout_consistency: 3 },
  ])

  // ─── Apparel Products ───
  console.log('Inserting apparel_products...')
  await insertIfEmpty('apparel_products', [
    { name: 'Limitless Performance Tee', description: 'Moisture-wicking fabric with athletic fit.', price: 39.99, category: 'tops', image_url: '', in_stock: true },
    { name: 'Limitless Training Shorts', description: 'Lightweight shorts with zippered pockets.', price: 49.99, category: 'bottoms', image_url: '', in_stock: true },
    { name: 'Limitless Hoodie', description: 'Premium cotton-blend hoodie.', price: 69.99, category: 'outerwear', image_url: '', in_stock: true },
    { name: 'Limitless Cap', description: 'Adjustable cap with embroidered logo.', price: 24.99, category: 'accessories', image_url: '', in_stock: false },
  ])

  console.log('\nDone!')
}

main().catch(console.error)
