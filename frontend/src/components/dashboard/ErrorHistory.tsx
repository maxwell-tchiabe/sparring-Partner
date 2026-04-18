'use client';

import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import { formatDate } from '@/lib/utils';
import { ErrorRecord } from '@/types';

interface ErrorHistoryProps {
  errors: ErrorRecord[];
}

export function ErrorHistory({ errors }: ErrorHistoryProps) {
  // Group errors by category
  const errorsByCategory = errors.reduce(
    (acc, error) => {
      if (!acc[error.category]) {
        acc[error.category] = [];
      }
      acc[error.category].push(error);
      return acc;
    },
    {} as Record<string, ErrorRecord[]>
  );

  return (
    <Card variant="outline">
      <CardHeader>
        <CardTitle>Error History</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(errorsByCategory).length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No errors recorded yet. Keep practicing!
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(errorsByCategory).map(
              ([category, categoryErrors]) => (
                <div key={category}>
                  <h3 className="font-medium text-lg capitalize mb-2">
                    {category}
                  </h3>
                  <div className="space-y-3">
                    {categoryErrors.map((error) => (
                      <ErrorItem key={error.id} error={error} />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ErrorItem({ error }: { error: ErrorRecord }) {
  return (
    <div className="border border-gray-200 rounded-md p-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-red-500 font-medium">{error.detail}</p>
          <p className="text-green-600 mt-1">{error.correction}</p>
        </div>
        <span className="text-xs text-gray-500">
          {formatDate(error.timestamp)}
        </span>
      </div>
    </div>
  );
}
