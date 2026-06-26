import React from 'react';
import { Leaf, Info, ShieldCheck, Heart, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const TeffInjEraEducation = () => {
  return (
    <section className="mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
              <Leaf className="w-8 h-8 text-[hsl(var(--brand-fuel))]" />
              The Power of Teff & Injera
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              At the heart of Ethiopian fasting cuisine lies a nutritional powerhouse: Teff. This ancient, fine grain is fermented to create Injera, a spongy sourdough flatbread that serves as both the staple carbohydrate and the eating utensil for traditional meals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-border/60 shadow-sm rounded-2xl overflow-hidden">
              <div className="h-2 w-full bg-[hsl(var(--brand-fuel))]"></div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-muted rounded-lg"><Info className="w-5 h-5 text-primary" /></div>
                  <h3 className="text-xl font-bold">What is Teff?</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Originating in Ethiopia over 3,000 years ago, Teff is the world's smallest grain. Despite its microscopic size, it packs an extraordinarily dense nutritional profile. It is naturally gluten-free and features an excellent balance of complex carbohydrates, complete proteins, and vital micronutrients.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/60 shadow-sm rounded-2xl overflow-hidden">
              <div className="h-2 w-full bg-[hsl(var(--food-fasting))]"></div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-muted rounded-lg"><Zap className="w-5 h-5 text-primary" /></div>
                  <h3 className="text-xl font-bold">What is Injera?</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Injera is created by fermenting teff flour with water over several days. This natural fermentation process creates its signature tangy flavor and spongy texture, while simultaneously breaking down phytic acid, dramatically increasing the bioavailability of teff's abundant vitamins and minerals.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500" /> Key Health Benefits
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "High in resistant starch for sustained energy",
                "Excellent source of plant-based protein",
                "Naturally gluten-free and easy to digest",
                "Rich in iron to support oxygen transport",
                "High calcium content for bone density",
                "Fermentation supports a healthy gut microbiome"
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 bg-muted/30 p-3 rounded-xl border border-border/50">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Nutritional Facts Sidebar */}
        <div className="lg:col-span-4">
          <Card className="bg-card border-border shadow-lg rounded-2xl sticky top-24">
            <div className="bg-foreground text-background p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold tracking-tight">Nutrition Facts</h3>
              <p className="text-sm opacity-80 mt-1">Per 1 roll (approx. 100g) of Teff Injera</p>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold text-muted-foreground py-3 pl-6">Calories</TableCell>
                    <TableCell className="text-right font-black text-lg py-3 pr-6">~70</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-muted-foreground py-3 pl-6">Protein</TableCell>
                    <TableCell className="text-right font-bold py-3 pr-6">2.5g</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-muted-foreground py-3 pl-6">Carbohydrates</TableCell>
                    <TableCell className="text-right font-bold py-3 pr-6">14g</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-muted-foreground py-3 pl-6">Dietary Fiber</TableCell>
                    <TableCell className="text-right font-bold py-3 pr-6">2.7g</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-muted-foreground py-3 pl-6">Fat</TableCell>
                    <TableCell className="text-right font-bold py-3 pr-6">0.4g</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-muted-foreground py-3 pl-6">Iron</TableCell>
                    <TableCell className="text-right font-bold py-3 pr-6 text-amber-600 dark:text-amber-400">2.4mg</TableCell>
                  </TableRow>
                  <TableRow className="border-b-0">
                    <TableCell className="font-semibold text-muted-foreground py-3 pl-6">Calcium</TableCell>
                    <TableCell className="text-right font-bold py-3 pr-6 text-blue-600 dark:text-blue-400">25mg</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="bg-muted/50 p-4 border-t border-border text-xs text-muted-foreground rounded-b-2xl">
                <p className="font-medium mb-1">Sources:</p>
                <p>World Health Organization (WHO), USDA FoodData Central, and independent nutritional analyses.</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
};

export default TeffInjEraEducation;