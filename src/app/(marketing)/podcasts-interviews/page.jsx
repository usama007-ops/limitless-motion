'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, Music, Radio, Youtube, Instagram, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const externalLinks = [
  { id: 1, platform: 'Spotify', icon: Music, url: 'https://spotify.com', description: 'Listen to our latest episodes on the go.' },
  { id: 2, platform: 'Apple Podcasts', icon: Radio, url: 'https://podcasts.apple.com', description: 'Subscribe and never miss an update.' },
  { id: 3, platform: 'YouTube', icon: Youtube, url: 'https://youtube.com', description: 'Watch full video interviews and highlights.' },
  { id: 4, platform: 'Instagram', icon: Instagram, url: 'https://instagram.com', description: 'Follow for daily clips and behind the scenes.' },
]

export default function PodcastsInterviewsPage() {
  useEffect(() => {
    document.title = 'Podcasts & Interviews - Limitless Motion'
  }, [])

  return (
    <div className="pt-32 pb-24">
      <div className="container-luxury">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wider uppercase mb-6">
            <Mic size={16} />
            External Links
          </div>
          <h1 className="heading-display mb-6">LET'S THINK</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Podcasts & External Links. Connect with us across your favorite platforms to stay inspired and informed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {externalLinks.map((link, index) => {
            const Icon = link.icon
            return (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <Card className="h-full bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-secondary/50 text-secondary-foreground flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <Icon size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-card-foreground">{link.platform}</h3>
                      <p className="text-sm text-muted-foreground mb-6 flex-grow">{link.description}</p>
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        Visit Platform <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
