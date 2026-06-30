-- Make all meal content publicly readable (not just premium users)
-- Meal data is content, not private user data.
-- Premium gating should be on interactive features (PDF export, save plan), not on viewing.

drop policy if exists "Premium users and admins can view meal recipes" on public.meal_recipes;
create policy "Anyone can view meal recipes" on public.meal_recipes for select using (true);

drop policy if exists "Premium users and admins can view ethiopian meals" on public.ethiopian_meals;
create policy "Anyone can view ethiopian meals" on public.ethiopian_meals for select using (true);

drop policy if exists "Premium users and admins can view high protein meals" on public.high_protein_meals;
create policy "Anyone can view high protein meals" on public.high_protein_meals for select using (true);

drop policy if exists "Premium users and admins can view fasting breakfasts" on public.fasting_breakfasts;
create policy "Anyone can view fasting breakfasts" on public.fasting_breakfasts for select using (true);
