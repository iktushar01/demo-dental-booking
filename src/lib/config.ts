import { ClinicConfig } from '../types';

import heroImg from '../assets/images/hero_brightsmile_clinic_1790911006598.jpg';
import suiteImg from '../assets/images/clinic_operatory_suite_1790911060142.jpg';
import drSarahImg from '../assets/images/dentist_dr_sarah_1790911023044.jpg';
import drMarcusImg from '../assets/images/dentist_dr_marcus_1790911036337.jpg';
import drElenaImg from '../assets/images/dentist_dr_elena_1790911048183.jpg';
import examImg from '../assets/images/service_exam_diagnostic_1790911975340.jpg';
import cleaningImg from '../assets/images/service_dental_cleaning_1790911944455.jpg';
import whiteningImg from '../assets/images/service_whitening_laser_1790911917597.jpg';
import alignersImg from '../assets/images/service_clear_aligners_1790911931274.jpg';
import implantImg from '../assets/images/service_dental_implant_1790911960356.jpg';

export const defaultClinicConfig: ClinicConfig = {
  name: 'BrightSmile Dental',
  tagline: 'Gentle, modern dentistry designed around your comfort',
  phone: '(555) 234-5678',
  email: 'care@brightsmiledental.com',
  emergencyPhone: '(555) 911-3368',
  address: '742 Evergreen Medical Plaza, Suite 400',
  city: 'Portland',
  state: 'OR',
  postalCode: '97201',
  openHoursText: 'Mon - Fri: 8:00 AM - 6:00 PM | Sat: 9:00 AM - 2:00 PM | Sun: Closed',
  currencySymbol: '$',
  depositPercentage: 20, // 20% deposit when paying online
  cancellationNoticeHours: 24, // 24 hours cancellation notice
};

export const CLINIC_IMAGES = {
  hero: heroImg,
  suite: suiteImg,
  drSarah: drSarahImg,
  drMarcus: drMarcusImg,
  drElena: drElenaImg,
  exam: examImg,
  cleaning: cleaningImg,
  whitening: whiteningImg,
  filling: suiteImg,
  rootCanal: suiteImg,
  extraction: heroImg,
  aligners: alignersImg,
  implant: implantImg,
};
