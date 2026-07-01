'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Heart, Reply, Trash2 } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { getCommunityPosts } from '@/db'
import { adminDelete } from '@/lib/adminDb'

export default function CommunityPostDetail() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      const data = await getCommunityPosts()
      const found = (data || []).find((v) => v.id === params.id)
      if (!found) throw new Error('Post not found')
      setPost(found)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    document.title = 'Post Detail - Admin - Limitless Motion'
    fetchData()
  }, [fetchData])

  async function handleDeleteComment(commentId) {
    if (!confirm('Delete this comment?')) return
    try {
      const res = await fetch('/api/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'community_posts',
          id: params.id,
          data: {
            comments: (post.comments || []).filter((c) => c.id !== commentId),
          },
        }),
      })
      if (!res.ok) throw new Error('Failed to delete comment')
      setPost((prev) => ({ ...prev, comments: (prev.comments || []).filter((c) => c.id !== commentId) }))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div>
        <AdminPageHeader title="Post Detail" />
        <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">Loading...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div>
        <AdminPageHeader title="Post Detail" />
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error || 'Post not found'}</div>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="Post Detail"
        action={
          <Link
            href="/admin/community-posts"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        }
      />

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary capitalize">
                  {post.type || 'general'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {post.date ? new Date(post.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {post.author_name || 'Anonymous'}
              </h2>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" /> {post.likes || 0}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" /> {Array.isArray(post.comments) ? post.comments.length : 0}
              </span>
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl p-6 mb-6">
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">{post.content}</p>
          </div>

          {post.image_url && (
            <div className="mb-6 rounded-xl overflow-hidden border border-border">
              <img src={post.image_url} alt="Post attachment" className="w-full max-h-96 object-cover" />
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-border">
            <Link
              href={`/admin/community-posts/${post.id}/edit`}
              className="px-4 py-2 text-sm font-medium bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              Edit Post
            </Link>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Comments ({Array.isArray(post.comments) ? post.comments.length : 0})
          </h3>

          {(!post.comments || post.comments.length === 0) ? (
            <p className="text-center py-12 text-muted-foreground text-sm">No comments yet.</p>
          ) : (
            <div className="space-y-6">
              {post.comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onDelete={() => handleDeleteComment(comment.id)}
                  depth={0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CommentCard({ comment, onDelete, depth }) {
  if (!comment) return null
  return (
    <div className={depth > 0 ? 'ml-8 pl-5 border-l-2 border-border/40' : ''}>
      <div className="group flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">{comment.author_name || 'Anonymous'}</span>
            <span className="text-xs text-muted-foreground">
              {comment.created ? new Date(comment.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
            </span>
          </div>
          <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">{comment.content}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Reply className="w-3 h-3" /> {comment.replies?.length || 0} replies
            </span>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
          title="Delete comment"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onDelete={null}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
