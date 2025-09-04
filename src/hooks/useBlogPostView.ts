import { useEffect, useRef } from 'react';

export function useBlogPostView(postId: string | undefined) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!postId || hasTracked.current) return;

    const trackView = async () => {
      try {
        const response = await fetch('/api/blog-posts/increment-views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: postId }),
        });

        if (response.ok) {
          hasTracked.current = true;
        }
      } catch (error) {
        console.error('Failed to track blog post view:', error);
      }
    };

    // Track view after a short delay to ensure it's a real view
    const timeoutId = setTimeout(trackView, 1000);

    return () => clearTimeout(timeoutId);
  }, [postId]);
}