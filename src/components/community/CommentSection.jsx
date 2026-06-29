'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Reply, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { addComment, addReply } from '@/db';
import { toast } from 'sonner';

function formatTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString();
}

function CommentItem({ comment, postId, depth = 0, onRefresh }) {
  const { currentUser } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    if (!currentUser) {
      toast.error('Please sign in to reply');
      return;
    }
    setSubmitting(true);
    try {
      await addReply(postId, comment.id, {
        authorName: currentUser.name || currentUser.email?.split('@')[0] || 'Anonymous',
        content: replyText.trim(),
      });
      setReplyText('');
      setShowReplyInput(false);
      onRefresh();
    } catch {
      toast.error('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-border/40' : ''}`}>
      <div className="flex gap-3 py-3">
        <Avatar className="w-7 h-7 shrink-0">
          <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
            {comment.author_name?.substring(0, 2).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground truncate">{comment.author_name || 'Anonymous'}</span>
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">{formatTimeAgo(comment.created)}</span>
          </div>
          <p className="text-sm text-foreground/90 mt-0.5 whitespace-pre-wrap break-words">{comment.content}</p>
          <div className="flex items-center gap-4 mt-1.5">
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <Reply size={12} />
              Reply
            </button>
          </div>

          <AnimatePresence>
            {showReplyInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2"
              >
                <div className="flex gap-2">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-[36px] text-sm bg-background resize-none py-2"
                    rows={1}
                  />
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={submitting || !replyText.trim()}
                    className="shrink-0 px-3"
                  >
                    {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send size={14} />}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {comment.replies?.length > 0 && (
            <div className="mt-1">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  depth={depth + 1}
                  onRefresh={onRefresh}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({ postId, comments: initialComments, expanded, onToggle, onRefresh }) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const commentCount = comments?.length || 0;

  const handleRefresh = async () => {
    if (onRefresh) {
      const fresh = await onRefresh();
      if (fresh?.comments) setComments(fresh.comments);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    if (!currentUser) {
      toast.error('Please sign in to comment');
      return;
    }
    setSubmitting(true);
    try {
      const newComment = await addComment(postId, {
        authorName: currentUser.name || currentUser.email?.split('@')[0] || 'Anonymous',
        content: commentText.trim(),
      });
      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-1">
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3">No comments yet. Be the first to comment!</p>
            ) : (
              <div className="divide-y divide-border/20">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    postId={postId}
                    onRefresh={handleRefresh}
                  />
                ))}
              </div>
            )}

            <div className="flex gap-2 mt-3 pt-3 border-t border-border/20">
              <Avatar className="w-7 h-7 shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                  {currentUser?.name?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="min-h-[36px] text-sm bg-background resize-none py-2"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={submitting || !commentText.trim()}
                  className="shrink-0 px-3"
                >
                  {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send size={14} />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
