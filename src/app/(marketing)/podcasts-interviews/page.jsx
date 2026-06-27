'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, Music, Radio, Youtube, Instagram, ExternalLink, Loader2, Headphones } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getPodcasts } from '@/db'

const externalLinks = [
  { id: 1, platform: 'Spotify', icon: Music, url: 'https://spotify.com', description: 'Listen to our latest episodes on the go.' },
  { id: 2, platform: 'Apple Podcasts', icon: Radio, url: 'https://podcasts.apple.com', description: 'Subscribe and never miss an update.' },
  { id: 3, platform: 'YouTube', icon: Youtube, url: 'https://youtube.com', description: 'Watch full video interviews and highlights.' },
  { id: 4, platform: 'Instagram', icon: Instagram, url: 'https://instagram.com', description: 'Follow for daily clips and behind the scenes.' },
]

const fallbackPodcasts = [
  { name: 'The Mindset Advantage', description: 'Explore how elite athletes train their minds for peak performance and resilience.', platform: 'Spotify', podcast_link: 'https://open.spotify.com/show/example1' },
  { name: 'Nutrition Unlocked', description: 'Deep dive into macro counting, meal timing, and evidence-based nutrition strategies.', platform: 'Apple Podcasts', podcast_link: 'https://podcasts.apple.com/podcast/example2' },
  { name: 'The Recovery Hour', description: 'Learn about the science of recovery, sleep optimization, and mobility work.', platform: 'Spotify', podcast_link: 'https://open.spotify.com/show/example3' },
]

const platformColors = {
  'Spotify': 'bg-[#1DB954]/10 text-[#1DB954]',
  'Apple Podcasts': 'bg-[#872EC4]/10 text-[#872EC4]',
  'YouTube': 'bg-[#FF0000]/10 text-[#FF0000]',
  'Instagram': 'bg-[#E4405F]/10 text-[#E4405F]',
}

const platformIcons = {
  'Spotify': Music,
  'Apple Podcasts': Radio,
  'YouTube': Youtube,
  'Instagram': Instagram,
}

export default function PodcastsInterviewsPage() {
  const [podcasts, setPodcasts] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Podcasts & Interviews - Limitless Motion'
    loadPodcasts()
  }, [])

  async function loadPodcasts() {
    try {
      const data = await getPodcasts()
      if (data?.length) setPodcasts(data)
    } catch (err) {
      console.error('Failed to load podcasts from DB, using fallback:', err)
    } finally {
      setLoading(false)
    }
  }

  const displayPodcasts = podcasts || fallbackPodcasts

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-bold tracking-wider uppercase mb-6">
              <Headphones size={16} />
              Latest Episodes
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Featured Podcasts</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dive into our curated collection of conversations on fitness, nutrition, mindset, and recovery.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPodcasts.map((podcast, index) => {
                const Icon = platformIcons[podcast.platform] || Headphones
                const colorClass = platformColors[podcast.platform] || 'bg-muted text-foreground'
                return (
                  <motion.div
                    key={podcast.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.3) }}
                  >
                    <a href={podcast.podcast_link} target="_blank" rel="noopener noreferrer" className="block h-full">
                      <Card className="h-full bg-card border-border/60 hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                        <CardContent className="p-8 flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-5">
                            <div className={`p-2.5 rounded-xl ${colorClass}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              {podcast.platform}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-accent transition-colors">
                            {podcast.name}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed flex-grow mb-6">
                            {podcast.description || 'No description available.'}
                          </p>
                          <div className="flex items-center gap-2 text-sm font-medium text-accent">
                            Listen Now <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
