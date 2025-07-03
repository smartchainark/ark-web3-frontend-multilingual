'use client'

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react';
import { Globe, ChevronDown } from 'lucide-react';
import { supportedLanguages, LanguageCode } from '@/i18n/config';

interface LanguageSwitcherProps {
  variant?: 'flat' | 'solid' | 'bordered' | 'light' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function LanguageSwitcher({ 
  variant = 'flat', 
  size = 'md',
  showLabel = false,
  className = ''
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation('common');
  
  const currentLanguage = supportedLanguages[i18n.language as LanguageCode] || supportedLanguages.zh;

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      // 可选：显示切换成功的提示
    } catch (error) {
      console.error('Language change failed:', error);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant={variant}
          size={size}
          startContent={<Globe size={16} />}
          endContent={<ChevronDown size={14} />}
          className={`min-w-0 ${className}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">{currentLanguage.flag}</span>
            {showLabel && (
              <span className="hidden sm:inline text-sm">
                {currentLanguage.name}
              </span>
            )}
          </div>
        </Button>
      </DropdownTrigger>
      
      <DropdownMenu 
        aria-label={t('labels.language')}
        variant="flat"
        selectionMode="single"
        selectedKeys={[i18n.language]}
        onAction={(key) => handleLanguageChange(key as string)}
      >
        {Object.entries(supportedLanguages).map(([code, language]) => (
          <DropdownItem 
            key={code}
            className="flex items-center gap-3"
            textValue={language.name}
          >
            <div className="flex items-center gap-3 w-full">
              <span className="text-lg">{language.flag}</span>
              <span className="flex-1 text-sm font-medium">{language.name}</span>
              {i18n.language === code && (
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              )}
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default LanguageSwitcher; 