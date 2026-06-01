import React, { useState } from 'react';
import Image from 'next/image';
import { Bell, BellRing } from 'lucide-react';
import type { Update } from '@/types/api';

interface UpdatesTabProps {
  updates: Update[];
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function renderMarkdown(text: string) {
  // A very lightweight markdown parser for basic formatting
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:underline">$1</a>');
  html = html.replace(/\n/g, '<br />');

  return { __html: html };
}

export function UpdatesTab({ updates }: UpdatesTabProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Sort updates newest first
  const sortedUpdates = [...updates].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Campaign Updates</h2>
          <p className="text-sm text-neutral-500">Stay informed about the progress of this project.</p>
        </div>
        <button
          onClick={() => setIsSubscribed(!isSubscribed)}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            isSubscribed
              ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
              : 'bg-white border border-neutral-200 text-neutral-700 hover:border-primary-200 hover:text-primary-600'
          }`}
        >
          {isSubscribed ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          {isSubscribed ? 'Subscribed' : 'Get Updates'}
        </button>
      </div>

      <div className="space-y-6">
        {sortedUpdates.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center">
            <p className="text-sm font-medium text-neutral-500">No updates have been posted yet.</p>
          </div>
        ) : (
          sortedUpdates.map((update) => (
            <article key={update.id} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                <h3 className="text-xl font-bold text-neutral-900">{update.title}</h3>
                <span className="text-sm font-medium text-neutral-500">{formatDate(update.createdAt)}</span>
              </div>
              
              <div 
                className="mt-4 text-sm leading-relaxed text-neutral-700 prose prose-neutral max-w-none"
                dangerouslySetInnerHTML={renderMarkdown(update.content)}
              />

              {update.imageUrls && update.imageUrls.length > 0 && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {update.imageUrls.map((url) => (
                    <div key={url} className="relative aspect-video overflow-hidden rounded-lg border border-neutral-200">
                      <Image
                        src={url}
                        alt="Update attachment"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
