'use client';

import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t, i18n } = useTranslation();


  return (
    <div>hi
      <h1>{t('common.title')}</h1>
    </div>
  );
}