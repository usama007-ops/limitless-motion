'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Plus, Minus, X } from 'lucide-react'
import { createClient } from '@/lib/supabaseClient'
import CheckoutFlow from '@/components/pricing/CheckoutFlow.jsx'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const ApparelPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])

  useEffect(() => {
    document.title = 'Apparel | Limitless Motion'
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('apparel_products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        console.error('Error fetching products:', err)
        toast.error('Failed to load apparel products.')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    toast.success(`${product.name} added to cart`)
  }

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="bg-background flex flex-col">
      <main className="flex-grow pt-32 pb-24">
        <div className="container-luxury">
          <div className="mb-12">
            <h1 className="heading-display mb-4">Motion Apparel</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Premium activewear designed for limitless movement.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Products Grid */}
            <div className="lg:col-span-8">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="w-full aspect-[3/4] rounded-xl bg-card" />
                      <Skeleton className="h-6 w-3/4 bg-card" />
                      <Skeleton className="h-4 w-1/4 bg-card" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="bg-card rounded-2xl p-12 text-center border border-border">
                  <p className="text-muted-foreground">No products available at the moment. Check back soon.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {products.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-card rounded-2xl overflow-hidden border border-border flex flex-col group shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 font-serif italic">
                            No Image
                          </div>
                        )}
                        {!product.in_stock && (
                          <div className="absolute top-4 left-4 bg-background/90 text-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                            Out of Stock
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-foreground">{product.name}</h3>
                          <span className="font-medium text-primary">${(product.price ?? 0).toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                          {product.description || 'Premium apparel for your fitness journey.'}
                        </p>
                        <Button
                          onClick={() => addToCart(product)}
                          disabled={!product.in_stock}
                          className="mt-auto w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold uppercase tracking-widest text-xs h-12"
                        >
                          {product.in_stock ? 'Add to Cart' : 'Sold Out'}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Shopping Cart Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32">
                <div className="bg-card rounded-2xl p-6 border border-border mb-6">
                  <h2 className="text-xl font-serif font-medium mb-6 flex items-center gap-2 text-foreground">
                    <ShoppingCart className="w-5 h-5 text-primary" /> Your Cart
                  </h2>

                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6">
                    {cart.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic text-center py-4">Your cart is empty</p>
                    ) : (
                      cart.map(item => (
                        <div key={item.id} className="flex gap-4 bg-background p-3 rounded-xl border border-border">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-[10px]">Img</div>
                          )}
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between">
                              <span className="font-semibold text-sm line-clamp-1">{item.name}</span>
                              <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-primary font-medium text-sm">${(item.price ?? 0).toFixed(2)}</span>
                              <div className="flex items-center gap-2 bg-muted rounded-md px-2 py-1">
                                <button onClick={() => updateQuantity(item.id, -1)} className="text-muted-foreground hover:text-foreground">
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="text-muted-foreground hover:text-foreground">
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <CheckoutFlow items={cart} totalAmount={totalAmount} />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default ApparelPage
