import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LANGUAGES } from '../constants';
import i18next from 'i18next';
import { i18Next } from '../i18n';

const I18NextWrapper = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { preferredLanguage } = useSelector(state => state.auth.user || {});
  useEffect(() => {
    i18Next().then(() => {
      i18next.changeLanguage(preferredLanguage || LANGUAGES.EN);
    }).catch(() => console.log('FAILED TO INITIALIZE LOCALICATION'))
      .finally(() => setIsInitialized(true));
  }, [preferredLanguage]);
  return <>{isInitialized && children}</>;
};
export default I18NextWrapper