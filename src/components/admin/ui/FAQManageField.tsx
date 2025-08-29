'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@payloadcms/ui';
import { toast } from 'sonner';

interface FAQ {
  id: string;
  question: string;
  answer: any;
  category: string;
  order: number;
  published: boolean;
}

export const FAQManageField: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const config = useConfig(); // Currently unused
  const { token } = useAuth();

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      // Using Payload's built-in admin API
      const response = await fetch(`/admin/api/faq?limit=100&sort=order&depth=0`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `JWT ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('FAQ fetch error:', errorText);
        throw new Error('Failed to fetch FAQs');
      }

      const data = await response.json();
      // Handle both the custom API response and Payload's standard response
      if (data.items) {
        // Custom API response
        setFaqs(data.items || []);
      } else {
        // Payload standard response
        setFaqs(data.docs || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const deleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await fetch(`/admin/api/faq/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `JWT ${token}` } : {}),
        },
      });
      if (!response.ok) throw new Error('Failed to delete FAQ');
      toast.success('FAQ deleted successfully');
      await fetchFAQs();
    } catch (err) {
      toast.error('Failed to delete FAQ');
    }
  };

  const togglePublished = async (id: string, published: boolean) => {
    try {
      const response = await fetch(`/admin/api/faq/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `JWT ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ published: !published }),
      });
      if (!response.ok) throw new Error('Failed to update FAQ');
      toast.success(`FAQ ${!published ? 'published' : 'unpublished'} successfully`);
      await fetchFAQs();
    } catch (err) {
      toast.error('Failed to update FAQ');
    }
  };

  const categoryLabels: Record<string, string> = {
    general: 'Algemeen',
    pricing: 'Prijzen',
    delivery: 'Levering',
    technical: 'Technisch',
    rights: 'Rechten',
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading FAQs...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'var(--theme-error-500)' }}>Error: {error}</div>;
  }

  return (
    <div>
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ margin: 0 }}>FAQ Management</h3>
        <Link
          href="/admin/collections/faq/create"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: 'var(--theme-primary-600)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Add New FAQ
        </Link>
      </div>

      {faqs.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--theme-bg-subtle)',
            padding: '40px',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          <p style={{ marginBottom: '20px' }}>No FAQ items found.</p>
          <Link
            href="/admin/collections/faq/create"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: 'var(--theme-primary-600)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Create Your First FAQ
          </Link>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--theme-bg-subtle)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: 'var(--theme-bg)' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Order</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Question</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Category</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>
                  Published
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq, index) => (
                <tr
                  key={faq.id}
                  style={{
                    borderTop: index > 0 ? '1px solid var(--theme-border)' : undefined,
                  }}
                >
                  <td style={{ padding: '12px', width: '60px' }}>{faq.order}</td>
                  <td style={{ padding: '12px', maxWidth: '400px' }}>
                    <div
                      style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {faq.question}
                    </div>
                  </td>
                  <td style={{ padding: '12px', width: '120px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        backgroundColor: 'var(--theme-bg)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    >
                      {categoryLabels[faq.category] || faq.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px', width: '100px', textAlign: 'center' }}>
                    <button
                      onClick={() => togglePublished(faq.id, faq.published)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: faq.published
                          ? 'var(--theme-success-600)'
                          : 'var(--theme-text-muted)',
                      }}
                      title={faq.published ? 'Published' : 'Unpublished'}
                    >
                      {faq.published ? '✓' : '○'}
                    </button>
                  </td>
                  <td style={{ padding: '12px', width: '150px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Link
                        href={`/admin/collections/faq/${faq.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '4px 12px',
                          backgroundColor: 'var(--theme-bg)',
                          color: 'var(--theme-text)',
                          textDecoration: 'none',
                          borderRadius: '4px',
                          fontSize: '13px',
                          border: '1px solid var(--theme-border)',
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteFAQ(faq.id)}
                        style={{
                          padding: '4px 12px',
                          backgroundColor: 'var(--theme-error-50)',
                          color: 'var(--theme-error-600)',
                          border: '1px solid var(--theme-error-200)',
                          borderRadius: '4px',
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: 'var(--theme-info-50)',
          borderRadius: '4px',
          fontSize: '13px',
          color: 'var(--theme-info-700)',
        }}
      >
        <strong>Tip:</strong> FAQs are sorted by their order number. Lower numbers appear first.
      </div>
    </div>
  );
};
