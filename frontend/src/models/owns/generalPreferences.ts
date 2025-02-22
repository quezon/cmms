import Currency from './currency';
import { FlagComponent } from 'country-flag-icons/react/1x1';
import { ES, FR, TR, US, BR } from 'country-flag-icons/react/3x2';

export type SupportedLanguage = 'EN' | 'FR' | 'TR' | 'ES' | 'PT_BR';

export const supportedLanguages: {
  code: string;
  label: string;
  Icon: FlagComponent;
}[] = [
  { code: 'en', label: 'English', Icon: US },
  { code: 'fr', label: 'French', Icon: FR },
  { code: 'es', label: 'Spanish', Icon: ES },
  { code: 'tr', label: 'Turkish', Icon: TR },
  { code: 'pt_br', label: 'Portuguese (Brazil)', Icon: BR } // Adicionando PT_BR
];

export interface GeneralPreferences {
  id: number;
  language: SupportedLanguage;
  dateFormat: 'MMDDYY' | 'DDMMYY';
  currency: Currency;
  businessType: string;
  timeZone: string;
  daysBeforePrevMaintNotification: number;

  autoAssignWorkOrders: boolean;

  autoAssignRequests: boolean;

  disableClosedWorkOrdersNotif: boolean;

  askFeedBackOnWOClosed: boolean;

  laborCostInTotalCost: boolean;

  woUpdateForRequesters: boolean;

  simplifiedWorkOrder: boolean;
}
