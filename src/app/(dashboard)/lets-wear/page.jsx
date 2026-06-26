'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ExternalLink, Lock, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FilterSidebar from '@/components/shared/FilterSidebar.jsx'
import AttireRecommendationForm from '@/components/admin/AttireRecommendationForm.jsx'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { getAttireRecommendations } from '@/db'

const FILTER_OPTIONS = {
  category: ['workout gear', 'casual wear', 'accessories']
}

const fallbackItems = [
  { id: 'f1', name: 'Performance Running Shoes', category: 'workout gear', description: 'Lightweight and responsive for your daily miles.', imageFallback: 'https://images.unsplash.com/photo-1599447291800-2c297eccf01f?auto=format&fit=crop&w=600&q=80' },
  { id: 'f2', name: 'Moisture-Wicking Shirt', category: 'workout gear', description: 'Stay cool and dry during intense sessions.', imageFallback: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?auto=format&fit=crop&w=600&q=80' },
  { id: 'f3', name: 'Yoga Mat', category: 'accessories', description: 'Premium grip and cushioning for your practice.', imageFallback: 'https://images.unsplash.com/photo-1591291621060-89264efbeaed?auto=format&fit=crop&w=600&q=80' },
  { id: 'f4', name: 'Gym Bag', category: 'accessories', description: 'Spacious and durable for all your essentials.', imageFallback: 'https://images.unsplash.com/photo-1599270514441-242889f01862?auto=format&fit=crop&w=600&q=80' },
  { id: 'f5', name: 'Recovery Foam Roller', category: 'accessories', description: 'Essential for post-workout muscle recovery.', imageFallback: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?auto=format&fit=crop&w=600&q=80' },
]

export default function LetsWearPage() {
  const { isPremium, isAdmin } = useAuth()
  const router = useRouter()
  const hasPremiumAccess = isPremium || isAdmin

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState({ category: [] })

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getAttireRecommendations();
        if (cancelled) return;
        if (!cancelled) {
          if (data && data.length > 0) {
            setItems(data.map(item => ({
              ...item,
              imageFallback: item.image_url,
              productLink: item.product_link,
            })));
          } else {
            setItems(fallbackItems);
          }
        }
      } catch {
        if (!cancelled) setItems(fallbackItems);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filteredItems = items.filter(item => {
    return selectedFilters.category.length === 0 || selectedFilters.category.includes(item.category)
  })

  const displayItems = hasPremiumAccess ? filteredItems : filteredItems.slice(0, 3)

  return (
    <main className="flex-grow pt-32 pb-24">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wider uppercase mb-6">
            <Sparkles size={16} />
            Self-Expression
          </div>
          <h1 className="heading-display mb-6">Let's Wear</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Express your authentic self with our curated selection of workout gear, casual wear, and accessories.
          </p>
        </motion.div>

        {isAdmin && (
          <div className="mb-12 max-w-2xl mx-auto">
            <AttireRecommendationForm onSuccess={() => {}} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <FilterSidebar 
                filterOptions={FILTER_OPTIONS}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
            ) : filteredItems.length > 0 ? (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="h-full flex flex-col overflow-hidden hover:border-primary/50 transition-all duration-300 group bg-card">
                        <div className="aspect-square bg-muted relative overflow-hidden">
                          <img 
                            src={item.imageFallback}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 rounded bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold tracking-wider uppercase shadow-sm">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-5 flex flex-col flex-grow">
                          <h3 className="text-lg font-bold mb-2 line-clamp-1 text-card-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-grow">
                            {item.description}
                          </p>
                          {item.productLink && (
                            <Button asChild variant="outline" className="w-full mt-auto group/btn">
                              <a href={item.productLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                View Product <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                              </a>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {!hasPremiumAccess && filteredItems.length > 3 && (
                  <div className="text-center bg-muted/50 rounded-2xl p-10 border border-border">
                    <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Unlock Full Attire Collection</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Upgrade to Premium to access {filteredItems.length - 3} more curated recommendations and exclusive gear discounts.
                    </p>
                    <Button 
                      onClick={() => router.push('/membership-upgrade')}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl"
                    >
                      Upgrade to Premium
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed border-border">
                <Sparkles className="mx-auto text-muted-foreground/50 mb-4" size={48} />
                <h3 className="text-2xl font-semibold text-foreground mb-2">No Items Found</h3>
                <p className="text-muted-foreground">Try adjusting your filters to see more recommendations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
