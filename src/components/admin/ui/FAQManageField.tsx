'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, useTranslation } from '@payloadcms/ui';
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
  const [draggedItem, setDraggedItem] = useState<FAQ | null>(null);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const { token } = useAuth();
  const { i18n } = useTranslation();

  useEffect(() => {
    fetchFAQsAndCategories();
  }, []);

  const fetchFAQsAndCategories = async () => {
    await Promise.all([fetchFAQs(), fetchCategories()]);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/public/faq-settings`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `JWT ${token}` } : {}),
        },
      });

      if (response.ok) {
        const data = await response.json();
        const categoryMap: Record<string, string> = {};

        if (data.categories) {
          data.categories.forEach((cat: any) => {
            categoryMap[cat.slug] = cat.name;
          });
        }

        setCategories(categoryMap);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      // Using Payload's default REST API endpoint
      const response = await fetch(`/api/faq?limit=100&sort=order`, {
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
      // Payload standard response
      setFaqs(data.docs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const deleteFAQ = async (id: string) => {
    const confirmMessage =
      i18n.language === 'nl'
        ? 'Weet je zeker dat je deze FAQ wilt verwijderen?'
        : 'Are you sure you want to delete this FAQ?';
    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch(`/api/faq/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `JWT ${token}` } : {}),
        },
      });
      if (!response.ok) throw new Error('Failed to delete FAQ');
      toast.success(
        i18n.language === 'nl' ? 'FAQ succesvol verwijderd' : 'FAQ deleted successfully'
      );
      await fetchFAQs();
    } catch (err) {
      toast.error(i18n.language === 'nl' ? 'Fout bij verwijderen FAQ' : 'Failed to delete FAQ');
    }
  };

  const togglePublished = async (id: string, published: boolean) => {
    try {
      const response = await fetch(`/api/faq/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `JWT ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ published: !published }),
      });
      if (!response.ok) throw new Error('Failed to update FAQ');
      toast.success(
        i18n.language === 'nl'
          ? `FAQ succesvol ${!published ? 'gepubliceerd' : 'gedepubliceerd'}`
          : `FAQ ${!published ? 'published' : 'unpublished'} successfully`
      );
      await fetchFAQs();
    } catch (err) {
      toast.error(i18n.language === 'nl' ? 'Fout bij bijwerken FAQ' : 'Failed to update FAQ');
    }
  };

  const getCategoryName = (categorySlug: string): string => {
    return categories[categorySlug] || categorySlug;
  };

  const handleDragStart = (e: React.DragEvent, faq: FAQ) => {
    setDraggedItem(faq);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetFaq: FAQ) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetFaq.id) return;

    const updatedFAQs = [...faqs];
    const draggedIndex = updatedFAQs.findIndex((f) => f.id === draggedItem.id);
    const targetIndex = updatedFAQs.findIndex((f) => f.id === targetFaq.id);

    // Remove dragged item
    updatedFAQs.splice(draggedIndex, 1);
    // Insert at new position
    updatedFAQs.splice(targetIndex, 0, draggedItem);

    // Update order values
    const reorderedFAQs = updatedFAQs.map((faq, index) => ({
      ...faq,
      order: index * 10,
    }));

    setFaqs(reorderedFAQs);

    // Update order in the backend
    try {
      for (const faq of reorderedFAQs) {
        await fetch(`/api/faq/${faq.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `JWT ${token}` } : {}),
          },
          credentials: 'include',
          body: JSON.stringify({ order: faq.order }),
        });
      }
      toast.success(i18n.language === 'nl' ? 'Volgorde bijgewerkt' : 'Order updated');
    } catch (err) {
      toast.error(
        i18n.language === 'nl' ? 'Fout bij bijwerken volgorde' : 'Failed to update order'
      );
      await fetchFAQs(); // Reload original order
    }

    setDraggedItem(null);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        {i18n.language === 'nl' ? 'FAQs laden...' : 'Loading FAQs...'}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'var(--theme-error-500)' }}>
        {i18n.language === 'nl' ? 'Fout: ' : 'Error: '}
        {error}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <h3 style={{ margin: 0 }}>{i18n.language === 'nl' ? 'FAQ Beheer' : 'FAQ Management'}</h3>
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
            {i18n.language === 'nl' ? 'Nieuwe FAQ Toevoegen' : 'Add New FAQ'}
          </Link>
        </div>
        <p
          style={{
            margin: '0 0 10px 0',
            fontSize: '14px',
            color: 'var(--theme-text-muted)',
          }}
        >
          {i18n.language === 'nl'
            ? 'Voor meer opties zoals bulkacties en geavanceerd filteren, ga naar de '
            : 'For more options like bulk actions and advanced filtering, go to the '}
          <Link
            href="/admin/collections/faq"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--theme-primary-600)',
              textDecoration: 'underline',
            }}
          >
            {i18n.language === 'nl' ? 'volledige FAQ collectie' : 'full FAQ collection'}
          </Link>
          {i18n.language === 'nl' ? '.' : '.'}
        </p>
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
          <p style={{ marginBottom: '20px' }}>
            {i18n.language === 'nl' ? 'Geen FAQ items gevonden.' : 'No FAQ items found.'}
          </p>
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
            {i18n.language === 'nl' ? 'Maak je Eerste FAQ' : 'Create Your First FAQ'}
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
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>
                  {i18n.language === 'nl' ? 'Volgorde' : 'Order'}
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>
                  {i18n.language === 'nl' ? 'Vraag' : 'Question'}
                </th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>
                  {i18n.language === 'nl' ? 'Categorie' : 'Category'}
                </th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>
                  {i18n.language === 'nl' ? 'Gepubliceerd' : 'Published'}
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                  {i18n.language === 'nl' ? 'Acties' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq, index) => (
                <tr
                  key={faq.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, faq)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, faq)}
                  style={{
                    borderTop: index > 0 ? '1px solid var(--theme-border)' : undefined,
                    cursor: 'move',
                    opacity: draggedItem?.id === faq.id ? 0.5 : 1,
                  }}
                >
                  <td style={{ padding: '12px', width: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{ cursor: 'grab', color: 'var(--theme-text-muted)' }}
                        title={
                          i18n.language === 'nl' ? 'Sleep om te verplaatsen' : 'Drag to reorder'
                        }
                      >
                        ⋮⋮
                      </span>
                      {index + 1}
                    </div>
                  </td>
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
                      {getCategoryName(faq.category)}
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
                      title={
                        faq.published
                          ? i18n.language === 'nl'
                            ? 'Gepubliceerd'
                            : 'Published'
                          : i18n.language === 'nl'
                            ? 'Niet gepubliceerd'
                            : 'Unpublished'
                      }
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
                        {i18n.language === 'nl' ? 'Bewerken' : 'Edit'}
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
                        {i18n.language === 'nl' ? 'Verwijderen' : 'Delete'}
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
        <strong>{i18n.language === 'nl' ? 'Tip:' : 'Tip:'}</strong>{' '}
        {i18n.language === 'nl'
          ? 'Sleep en plaats FAQ items om de volgorde te wijzigen.'
          : 'Drag and drop FAQ items to change their order.'}
      </div>
    </div>
  );
};
