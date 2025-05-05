'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t, i18n } = useTranslation();

  return (
    <div>hi
      <h1>{t('title')}</h1>
    </div>
  );
}