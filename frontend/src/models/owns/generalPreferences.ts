import Currency from './currency';
import { FlagComponent } from 'country-flag-icons/react/1x1';
import { ES, FR, TR, US } from 'country-flag-icons/react/3x2';

export type SupportedLanguage = 'EN' | 'FR' | 'TR' | 'ES';

export const supportedLanguages: {
  code: string;
  label: string;
  Icon: FlagComponent;
}[] = [
  { code: 'en', label: 'English', Icon: US },
  { code: 'fr', label: 'French', Icon: FR },
  { code: 'es', label: 'Spanish', Icon: ES },
  { code: 'tr', label: 'Turkish', Icon: TR }
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
