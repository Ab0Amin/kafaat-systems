'use client';

import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t, i18n } = useTranslation();

  console.log(i18n.language, '🧪 current language');
  console.log(i18n.options, '🧪 options');
  console.log(i18n.services.resourceStore.data, '🧪 loaded translations');

  return (
    <div>hi
      <h1>{t('title')}</h1>
    </div>
  );
}